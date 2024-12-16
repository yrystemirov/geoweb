package kz.geoweb.api.service;

import kz.geoweb.api.enums.LayerFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ImportService {
    void importLayersFile(MultipartFile file, LayerFormat layerFormat, UUID folderId);
}
