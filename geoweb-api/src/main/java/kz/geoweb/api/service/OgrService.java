package kz.geoweb.api.service;

import kz.geoweb.api.enums.LayerFormat;
import org.springframework.web.multipart.MultipartFile;

public interface OgrService {
    void importLayersFile(MultipartFile file, LayerFormat layerFormat);
}
