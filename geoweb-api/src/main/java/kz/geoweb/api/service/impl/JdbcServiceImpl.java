package kz.geoweb.api.service.impl;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.service.JdbcService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import static kz.geoweb.api.utils.CommonConstants.*;
import static kz.geoweb.api.utils.GisConstants.*;

@Service
@RequiredArgsConstructor
public class JdbcServiceImpl implements JdbcService {
    private final JdbcClient jdbcClient;

    @Override
    public Long getSeqNumber() {
        return jdbcClient.sql("SELECT nextval('generate_seq_number')")
                .query(Long.class).single();
    }

    @Override
    public void createSequence(Long seqNumber) {
        jdbcClient.sql("CREATE SEQUENCE layers." + LAYERNAME_PREFIX + seqNumber + LAYER_SEQUENCE_POSTFIX).update();
    }

    @Override
    public void createSequenceImportedLayer(String tableName) {
        Long maxGid = jdbcClient.sql("select coalesce(max(gid), 0) from layers." + tableName)
                        .query(Long.class).single();
        jdbcClient.sql("CREATE SEQUENCE IF NOT EXISTS layers." + tableName + LAYER_SEQUENCE_POSTFIX + " start " + (maxGid + 1)).update();
    }

    @Override
    public void createTable(Long seqNumber, GeometryType geometryType) {
        jdbcClient.sql("CREATE TABLE layers." + LAYERNAME_PREFIX + seqNumber
                + "(gid BIGINT PRIMARY KEY DEFAULT nextval('layers." + LAYERNAME_PREFIX + seqNumber + LAYER_SEQUENCE_POSTFIX + "'), " +
                "geom public.geometry(" + geometryType.name() + "," + SRS_3857 + "))").update();
    }

    @Override
    public void createAttribute(String layername, String attrname, AttrType type) {
        if (type.equals(AttrType.DICTIONARY)) type = AttrType.TEXT;
        jdbcClient.sql("ALTER TABLE layers." + layername + " ADD COLUMN "
                + attrname + " " + type.name()).update();
    }
}
