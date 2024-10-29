package kz.geoweb.api.service;

public interface OgrService {
    Integer importFile(String filePath, String layername, String geometryType);
}
