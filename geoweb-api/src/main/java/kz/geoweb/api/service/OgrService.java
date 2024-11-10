package kz.geoweb.api.service;

import org.springframework.web.multipart.MultipartFile;

public interface OgrService {
    Integer importFile(String filePath, String layername, String geometryType);
    void runOgr2OgrCommand(String folder, String geometryType, String layername);
    void runOgr2OgrCommandUpload(MultipartFile file, String geometryType, String layername);
    String getOgr2ogrVersion();
    String getOgr2ogrVersion(String filePath);
}
