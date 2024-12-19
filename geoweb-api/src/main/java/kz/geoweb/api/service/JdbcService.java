package kz.geoweb.api.service;

import kz.geoweb.api.dto.TableColumnDto;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;

import java.util.List;

public interface JdbcService {
    Long generateOrdinalNumber();

    void createTable(String layername, GeometryType geometryType);

    void deleteTable(String layername);

    void createAttribute(String layername, String attrname, AttrType type);

    void deleteAttribute(String layername, String attrname);

    Boolean tableExists(String tableName);

    Integer getSRID(String layername);

    String getTableExtent(String layername);

    List<TableColumnDto> getTableColumns(String tableName);

    void renameColumn(String tableName, String from, String to);

    void transformGeometry(String tableName);
}
