package kz.geoweb.api.service;

import kz.geoweb.api.dto.FeatureSaveDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface FeatureService {
    Page<Map<String, Object>> getFeatures(String layername, Pageable pageable);

    void save(String layername, List<FeatureSaveDto> featureSaveDtoList);
}
