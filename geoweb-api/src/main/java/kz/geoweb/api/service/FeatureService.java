package kz.geoweb.api.service;

import kz.geoweb.api.dto.FeatureSaveDto;

import java.util.List;

public interface FeatureService {
    void save(String layername, List<FeatureSaveDto> featureSaveDtoList);
}
