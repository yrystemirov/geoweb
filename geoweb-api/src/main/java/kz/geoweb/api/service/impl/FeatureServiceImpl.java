package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.entity.FeatureUpdateHistory;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.repository.FeatureUpdateHistoryRepository;
import kz.geoweb.api.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static kz.geoweb.api.utils.GisConstants.LAYERS_SCHEMA;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeatureServiceImpl implements FeatureService {
    private final JdbcClient jdbcClient;
    private final LayerAttrService layerAttrService;
    private final FeatureUpdateHistoryRepository featureUpdateHistoryRepository;
    private final UserService userService;
    private final DictionaryService dictionaryService;
    private final EntryService entryService;

    @Override
    public Page<Map<String, Object>> getFeatures(String layername, Pageable pageable) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        Set<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);
        String fields = layerAttrs.stream()
                .map(LayerAttrDto::getAttrname)
                .collect(Collectors.joining(", "));
        String sortClause = getSortClause(pageable.getSort());

        String sql = "SELECT gid,ST_AsText(geom) AS geom," + fields + " FROM " + tableName +
                sortClause + " LIMIT :limit OFFSET :offset";

        int limit = pageable.getPageSize();
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        List<Map<String, Object>> results = jdbcClient.sql(sql)
                .param("limit", limit)
                .param("offset", offset)
                .query(mapRowMapper())
                .list();

        String countSql = "SELECT COUNT(*) FROM " + tableName;
        int total = jdbcClient.sql(countSql).query(Integer.class).single();
        fillDictionaryValues(results, layerAttrs);
        return new PageImpl<>(results, pageable, total);
    }

    private RowMapper<Map<String, Object>> mapRowMapper() {
        return (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                row.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
            }
            return row;
        };
    }

    private String getSortClause(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }
        String orderBy = sort.stream()
                .map(order -> order.getProperty() + " " + order.getDirection().name())
                .collect(Collectors.joining(", "));
        return " ORDER BY " + orderBy;
    }

    private void fillDictionaryValues(List<Map<String, Object>> features, Set<LayerAttrDto> layerAttrs) {
        if (features.isEmpty()) return;
        List<LayerAttrDto> dictionaryLayerAttrs = layerAttrs.stream().filter(attr -> attr.getAttrType() == AttrType.DICTIONARY).toList();
        if (dictionaryLayerAttrs.isEmpty()) return;
        for (Map<String, Object> feature : features) {
            for (LayerAttrDto attr : dictionaryLayerAttrs) {
                try {
                    String attrname = attr.getAttrname();
                    Object value = feature.get(attrname);
                    if (value != null) {
                        String valueString = value.toString();
                        String[] idValues = valueString.split(",");
                        DictionaryDto dictionaryDto = dictionaryService.getDictionaryByCode(attr.getDictionaryCode());
                        List<EntryDto> entries = entryService.getEntries(dictionaryDto.getId(), null);
                        List<String> values = new ArrayList<>();
                        for (String idValue : idValues) {
                            Optional<EntryDto> entry = entries.stream().filter(e -> e.getId().equals(UUID.fromString(idValue))).findFirst();
                            entry.ifPresent(e -> values.add(e.getRu()));
                        }
                        if (!values.isEmpty()) {
                            feature.put(attrname, String.join(", ", values));
                        }
                    }
                } catch (Exception e) {
                    log.error("Error filling dictionary values: {}", e.getMessage());
                }
            }
        }
    }

    @Override
    public void save(String layername, List<FeatureSaveDto> featureSaveDtoList) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        Set<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);

        for (FeatureSaveDto feature : featureSaveDtoList) {
            convertStringDatesToLocalDateTime(feature.getAttributes(), layerAttrs);
            switch (feature.getAction()) {
                case CREATE:
                    Integer gid = insertFeature(tableName, feature);
                    saveHistory(layername, gid, Action.CREATE);
                    break;
                case UPDATE:
                    updateFeature(tableName, feature);
                    saveHistory(layername, feature.getGid(), Action.UPDATE);
                    break;
                case DELETE:
                    deleteFeature(tableName, feature.getGid());
                    saveHistory(layername, feature.getGid(), Action.DELETE);
                    break;
            }
        }
    }

    private Integer insertFeature(String tableName, FeatureSaveDto feature) {
        StringBuilder columns = new StringBuilder("(geom");
        StringBuilder values = new StringBuilder("(ST_GeomFromText(:geom)");

        for (String key : feature.getAttributes().keySet()) {
            columns.append(", ").append(key);
            values.append(", :").append(key);
        }
        columns.append(")");
        values.append(")");

        String sql = "INSERT INTO " + tableName + " " + columns + " VALUES " + values + " RETURNING gid";
        return jdbcClient.sql(sql)
                .param("geom", feature.getWkt())
                .params(feature.getAttributes())
                .query(Integer.class).single();
    }

    private void updateFeature(String tableName, FeatureSaveDto feature) {
        StringBuilder setClause = new StringBuilder("geom = ST_GeomFromText(:geom)");

        for (String key : feature.getAttributes().keySet()) {
            setClause.append(", ").append(key).append(" = :").append(key);
        }

        String sql = "UPDATE " + tableName + " SET " + setClause + " WHERE gid = :gid";
        jdbcClient.sql(sql)
                .param("geom", feature.getWkt())
                .params(feature.getAttributes())
                .param("gid", feature.getGid())
                .update();
    }

    private void deleteFeature(String tableName, Integer gid) {
        String sql = "DELETE FROM " + tableName + " WHERE gid = :gid";
        jdbcClient.sql(sql)
                .param("gid", gid)
                .update();
    }

    private void convertStringDatesToLocalDateTime(Map<String, Object> attributes, Set<LayerAttrDto> layerAttrs) {
        for (Map.Entry<String, Object> entry : attributes.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            layerAttrs.stream()
                    .filter(attr -> attr.getAttrname().equals(key) && attr.getAttrType() == AttrType.TIMESTAMP)
                    .findFirst()
                    .ifPresent(attr -> {
                        if (value instanceof String) {
                            LocalDateTime dateTime = LocalDateTime.parse((String) value);
                            attributes.put(key, dateTime);
                        }
                    });
        }
    }

    private void saveHistory(String layername, Integer gid, Action action) {
        try {
            UserDto currentUser = userService.getCurrentUser();
            FeatureUpdateHistory featureUpdateHistory = new FeatureUpdateHistory();
            featureUpdateHistory.setLayername(layername);
            featureUpdateHistory.setGid(gid);
            featureUpdateHistory.setAction(action);
            featureUpdateHistory.setDate(LocalDateTime.now());
            featureUpdateHistory.setUserId(currentUser.getId());
            featureUpdateHistoryRepository.save(featureUpdateHistory);
        } catch (Exception e) {
            log.error("Error saving FeatureUpdateHistory: {}", e.getMessage());
        }
    }
}
