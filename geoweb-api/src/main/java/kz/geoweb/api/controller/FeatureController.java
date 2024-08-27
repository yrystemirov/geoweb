package kz.geoweb.api.controller;

import kz.geoweb.api.dto.FeatureSaveDto;
import kz.geoweb.api.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
