package kz.geoweb.api.service;

import kz.geoweb.api.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface FeatureService {
    Page<Map<String, Object>> getFeatures(String layername, Pageable pageable);

    void save(String layername, List<FeatureSaveDto> featureSaveDtoList);

    List<IdentifyResponseDto> identify(WmsRequestDto wmsRequestDto);

    List<FeatureFileDto> getFeatureFiles(String layername, Integer gid);

    FeatureFileDto uploadFeatureFile(byte[] file, String filename, String bucket, String layername, Integer gid);

    FeatureFileResponseDto downloadFeatureFile(UUID id);
}
