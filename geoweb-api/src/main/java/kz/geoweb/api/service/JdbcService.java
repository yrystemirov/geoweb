package kz.geoweb.api.service;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.enums.GeometryType;

public interface JdbcService {
    Long getSeqNumber();
    void createSequence(Long seqNumber);
    void createSequenceImportedLayer(String tableName);
    void createTable(Long seqNumber, GeometryType geometryType);
    void createAttribute(String layername, String attrname, AttrType type);
}
