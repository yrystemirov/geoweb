package kz.geoweb.api.service;

public interface OgrService {
    Integer importFile(String filePath, String layername, String geometryType);
    void runOgr2OgrCommand(String folder, String geometryType, String layername);
    String getOgr2ogrVersion();
}
