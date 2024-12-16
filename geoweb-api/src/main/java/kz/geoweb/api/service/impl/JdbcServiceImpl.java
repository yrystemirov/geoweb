package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.TableColumnDto;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.JdbcService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static kz.geoweb.api.utils.GisConstants.*;

@Service
@RequiredArgsConstructor
public class JdbcServiceImpl implements JdbcService {
    private final JdbcClient jdbcClient;

    @Override
    public Long generateOrdinalNumber() {
        return jdbcClient.sql("SELECT nextval('ordinal_number_seq')")
                .query(Long.class)
                .single();
    }

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

    @Override
    public Boolean tableExists(String tableName) {
        tableName = tableName.toLowerCase();
        String sql = "SELECT count(*) FROM information_schema.tables " +
                "WHERE table_schema='" + LAYERS_SCHEMA + "' AND lower(table_name) = ?";
        Integer count = jdbcClient.sql(sql)
                .param(tableName)
                .query(Integer.class)
                .single();
        return count > 0;
    }

    public Integer getSRID(String layername) {
        return jdbcClient.sql("SELECT srid from public.geometry_columns where f_table_name = '" + layername + "'")
                .query(Integer.class)
                .optional()
                .orElseThrow(() -> new CustomException("layer.by_layername.not_found", layername));
    }

    @Override
    public String getTableExtent(String layername) {
        Integer srid = getSRID(layername);
        return jdbcClient.sql("SELECT ST_AsText(ST_SetSRID(ST_Extent(geom), " + srid + ")) as extent FROM " + LAYERS_SCHEMA + "." + layername)
                .query(String.class)
                .optional()
                .orElseThrow(() -> new CustomException("layer.no_data", layername));
    }

    @Override
    public List<TableColumnDto> getTableColumns(String tableName) {
        return jdbcClient.sql("SELECT * FROM information_schema.columns WHERE table_schema = '" + LAYERS_SCHEMA + "' AND table_name = '" + tableName + "'")
                .query(TableColumnDto.class)
                .list();
    }

    @Override
    public void renameColumn(String tableName, String from, String to) {
        jdbcClient.sql("ALTER TABLE " + LAYERS_SCHEMA + "." + tableName + " RENAME " + from + " to " + to)
                .update();
    }
}
