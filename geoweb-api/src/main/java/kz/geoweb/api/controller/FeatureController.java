package kz.geoweb.api.controller;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
    public List<FeatureFileDto> getFeatureFile(@RequestParam String layername,
                                               @RequestParam Integer gid) {
        return featureService.getFeatureFiles(layername, gid);
    }

    @PostMapping("/files/upload")
    public FeatureFileDto createFeatureFile(@RequestParam MultipartFile file,
                                            @RequestParam(required = false) String bucket,
                                            @RequestParam String layername,
                                            @RequestParam Integer gid) throws IOException {
        return featureService.uploadFeatureFile(file.getBytes(), file.getOriginalFilename(), bucket, layername, gid);
    }

    @GetMapping("/files/download")
    public ResponseEntity<byte[]> downloadFeatureFile(@RequestParam UUID id) {
        FeatureFileResponseDto featureFileResponseDto = featureService.downloadFeatureFile(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(featureFileResponseDto.getContentType()));
        headers.setContentLength(featureFileResponseDto.getSize());
        String filename = featureFileResponseDto.getFilename();
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + encoded + "\"");

        return new ResponseEntity<>(featureFileResponseDto.getFile(), headers, HttpStatus.OK);
    }
}
