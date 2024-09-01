package kz.geoweb.api.service;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;

public interface JdbcService {
    void createTable(String layername, GeometryType geometryType);
    void deleteTable(String layername);
    void createAttribute(String layername, String attrname, AttrType type);
    void deleteAttribute(String layername, String attrname);
}
