package kz.geoweb.api.controller;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.service.FeatureService;
import kz.geoweb.api.utils.HttpUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

    @PostMapping("/identify")
    public List<IdentifyResponseDto> identify(@RequestBody WmsRequestDto wmsRequestDto) {
        return featureService.identify(wmsRequestDto);
    }

    @GetMapping("/files")
    public List<FeatureFileDto> getFeatureFiles(@RequestParam String layername,
                                                @RequestParam Integer gid) {
        return featureService.getFeatureFiles(layername, gid);
    }

    @PostMapping("/files/upload")
    public FeatureFileDto createFeatureFile(@RequestParam MultipartFile file,
                                            @RequestParam String layername,
                                            @RequestParam Integer gid) throws IOException {
        return featureService.uploadFeatureFile(file.getBytes(), file.getOriginalFilename(), layername, gid);
    }

    @GetMapping("/files/download")
    public ResponseEntity<byte[]> downloadFeatureFile(@RequestParam UUID id) {
        FeatureFileResponseDto featureFileResponseDto = featureService.downloadFeatureFile(id);

        HttpHeaders headers = HttpUtils.getDownloadHeaders(featureFileResponseDto.getFilename(),
                featureFileResponseDto.getContentType(), featureFileResponseDto.getSize());
        return new ResponseEntity<>(featureFileResponseDto.getFile(), headers, HttpStatus.OK);
    }
}
