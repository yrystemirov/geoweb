package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FeatureSaveDto;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.entity.FeatureUpdateHistory;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.repository.FeatureUpdateHistoryRepository;
import kz.geoweb.api.service.FeatureService;
import kz.geoweb.api.service.LayerAttrService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

    @Override
    public Page<Map<String, Object>> getFeatures(String layername, Pageable pageable) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        Set<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);
        String fields = layerAttrs.stream()
                .map(LayerAttrDto::getAttrname)
                .collect(Collectors.joining(", "));

        String sql = "SELECT gid,ST_AsText(geom) AS geom," + fields + " FROM " + tableName +
                " ORDER BY gid LIMIT :limit OFFSET :offset";

        int limit = pageable.getPageSize();
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        List<Map<String, Object>> results = jdbcClient.sql(sql)
                .param("limit", limit)
                .param("offset", offset)
                .query(mapRowMapper())
                .list();

        String countSql = "SELECT COUNT(*) FROM " + tableName;
        int total = jdbcClient.sql(countSql).query(Integer.class).single();

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

    @Override
    public void save(String layername, List<FeatureSaveDto> featureSaveDtoList) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        Set<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);

        for (FeatureSaveDto feature : featureSaveDtoList) {
            convertStringDatesToLocalDateTime(feature.getAttributes(), layerAttrs);
            switch (feature.getAction()) {
                case CREATE:
                    Integer gid = insertFeature(tableName, feature, layerAttrs);
                    saveHistory(layername, gid, Action.CREATE);
                    break;
                case UPDATE:
                    updateFeature(tableName, feature, layerAttrs);
                    saveHistory(layername, feature.getGid(), Action.UPDATE);
                    break;
                case DELETE:
                    deleteFeature(tableName, feature.getGid());
                    saveHistory(layername, feature.getGid(), Action.DELETE);
                    break;
            }
        }
    }

    private Integer insertFeature(String tableName, FeatureSaveDto feature, Set<LayerAttrDto> layerAttrs) {
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

    private void updateFeature(String tableName, FeatureSaveDto feature, Set<LayerAttrDto> layerAttrs) {
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
