package kz.geoweb.api.service;

import kz.geoweb.api.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface FeatureService {
    Page<Map<String, Object>> getFeatures(String layername, Pageable pageable);

    Page<Map<String, Object>> getFeaturesPublic(String layername, Pageable pageable);

    void save(String layername, List<FeatureSaveDto> featureSaveDtoList);

    List<IdentifyResponseDto> identify(WmsRequestDto wmsRequestDto);

    List<IdentifyResponseDto> identifyPublic(WmsRequestDto wmsRequestDto);

    List<FeatureFileDto> getFeatureFiles(String layername, Integer gid);

    List<FeatureFileDto> getFeatureFilesPublic(String layername, Integer gid);

    FeatureFileDto uploadFeatureFile(byte[] file, String filename, String layername, Integer gid);

    FeatureFileResponseDto downloadFeatureFile(UUID id);

    FeatureFileResponseDto downloadFeatureFilePublic(UUID id);
}
