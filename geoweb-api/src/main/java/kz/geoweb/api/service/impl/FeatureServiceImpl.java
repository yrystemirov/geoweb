package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FeatureSaveDto;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.service.FeatureService;
import kz.geoweb.api.service.LayerAttrService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static kz.geoweb.api.utils.GisConstants.LAYERS_SCHEMA;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {
    private final JdbcClient jdbcClient;
    private final LayerAttrService layerAttrService;

    @Override
    public void save(String layername, List<FeatureSaveDto> featureSaveDtoList) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        Set<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);

        for (FeatureSaveDto feature : featureSaveDtoList) {
            convertStringDatesToLocalDateTime(feature.getAttributes(), layerAttrs);
            switch (feature.getAction()) {
                case CREATE:
                    insertFeature(tableName, feature, layerAttrs);
                    break;
                case UPDATE:
                    updateFeature(tableName, feature, layerAttrs);
                    break;
                case DELETE:
                    deleteFeature(tableName, feature.getGid());
                    break;
            }
        }
    }

    private void insertFeature(String tableName, FeatureSaveDto feature, Set<LayerAttrDto> layerAttrs) {
        StringBuilder columns = new StringBuilder("(geom");
        StringBuilder values = new StringBuilder("(ST_GeomFromText(:geom)");

        for (String key : feature.getAttributes().keySet()) {
            columns.append(", ").append(key);
            values.append(", :").append(key);
        }
        columns.append(")");
        values.append(")");

        String sql = "INSERT INTO " + tableName + " " + columns + " VALUES " + values;
        jdbcClient.sql(sql)
                .param("geom", feature.getWkt())
                .params(feature.getAttributes())
                .update();
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
}
