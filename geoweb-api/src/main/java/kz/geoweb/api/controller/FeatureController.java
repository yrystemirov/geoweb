package kz.geoweb.api.controller;

import kz.geoweb.api.dto.FeatureSaveDto;
import kz.geoweb.api.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class FeatureController {
    private final FeatureService featureService;

    @PostMapping
    public void save(@RequestParam String layername,
                     @RequestBody List<FeatureSaveDto> featureSaveDtoList) {
        featureService.save(layername, featureSaveDtoList);
    }

    @GetMapping
    public Page<Map<String, Object>> getFeatures(@RequestParam String layername, Pageable pageable) {
        return featureService.getFeatures(layername, pageable);
    }
}
