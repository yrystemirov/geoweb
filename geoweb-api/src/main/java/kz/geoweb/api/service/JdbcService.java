package kz.geoweb.api.service;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;

public interface JdbcService {
    Long getSeqNumber();
    void createSequence(String layername);
    void createSequenceImportedLayer(String tableName);
    void createTable(String layername, GeometryType geometryType);
    void createAttribute(String layername, String attrname, AttrType type);
}
