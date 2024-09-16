package kz.geoweb.api.controller;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.service.FeatureService;
import kz.geoweb.api.service.FolderService;
import kz.geoweb.api.service.LayerAttrService;
import kz.geoweb.api.utils.HttpUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/open-api")
@RequiredArgsConstructor
public class OpenApiController {
    private final FolderService folderService;
    private final FeatureService featureService;
    private final LayerAttrService layerAttrService;

    @GetMapping("/folders/root")
    public Set<FolderDto> getPublicRootFolders() {
        return folderService.getPublicRootFolders();
    }

    @GetMapping("/folders/{id}/tree")
    public FolderTreeDto getPublicFolderTree(@PathVariable UUID id) {
        return folderService.getPublicFolderTree(id);
    }

    @PostMapping("/features/identify")
    public List<IdentifyResponseDto> identifyPublic(@RequestBody WmsRequestDto wmsRequestDto) {
        return featureService.identifyPublic(wmsRequestDto);
    }

    @GetMapping("/features/files")
    public List<FeatureFileDto> getFeatureFilesPublic(@RequestParam String layername,
                                                      @RequestParam Integer gid) {
        return featureService.getFeatureFilesPublic(layername, gid);
    }

    @GetMapping("/features/files/download")
    public ResponseEntity<byte[]> downloadFeatureFilePublic(@RequestParam UUID id) {
        FeatureFileResponseDto featureFileResponseDto = featureService.downloadFeatureFilePublic(id);

        HttpHeaders headers = HttpUtils.getDownloadHeaders(featureFileResponseDto.getFilename(),
                featureFileResponseDto.getContentType(), featureFileResponseDto.getSize());
        return new ResponseEntity<>(featureFileResponseDto.getFile(), headers, HttpStatus.OK);
    }

    @GetMapping("/features")
    public Page<Map<String, Object>> getFeaturesPublic(@RequestParam String layername, Pageable pageable) {
        return featureService.getFeaturesPublic(layername, pageable);
    }

    @GetMapping("/layers/{id}/attrs")
    public Set<LayerAttrDto> getLayerAttrsPublic(@PathVariable UUID id) {
        return layerAttrService.getLayerAttrsPublic(id);
    }
}
