package kz.geoweb.api.service.impl;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.service.JdbcService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import static kz.geoweb.api.utils.GisConstants.*;

@Service
@RequiredArgsConstructor
public class JdbcServiceImpl implements JdbcService {
    private final JdbcClient jdbcClient;

    @Override
    public void createTable(String layername, GeometryType geometryType) {
        jdbcClient.sql("CREATE SEQUENCE " + LAYERS_SCHEMA + "." + layername + LAYER_SEQUENCE_POSTFIX).update();
        jdbcClient.sql("CREATE TABLE " + LAYERS_SCHEMA + "." + layername
                + "(gid BIGINT PRIMARY KEY DEFAULT nextval('" + LAYERS_SCHEMA + "." + layername + LAYER_SEQUENCE_POSTFIX + "'), " +
                "geom public.geometry(" + geometryType.name() + "," + SRS_3857 + "))").update();
    }

    @Override
    public void deleteTable(String layername) {
        jdbcClient.sql("DROP TABLE " + LAYERS_SCHEMA + "." + layername).update();
        jdbcClient.sql("DROP SEQUENCE " + LAYERS_SCHEMA + "." + layername + LAYER_SEQUENCE_POSTFIX).update();
    }

    @Override
    public void createAttribute(String layername, String attrname, AttrType type) {
        if (type.equals(AttrType.DICTIONARY)) type = AttrType.TEXT;
        jdbcClient.sql("ALTER TABLE " + LAYERS_SCHEMA + "." + layername + " ADD COLUMN "
                + attrname + " " + type.name()).update();
    }

    @Override
    public void deleteAttribute(String layername, String attrname) {
        jdbcClient.sql("ALTER TABLE " + LAYERS_SCHEMA + "." + layername + " DROP COLUMN "
                + attrname).update();
    }
}
