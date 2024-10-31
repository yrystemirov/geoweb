package kz.geoweb.api.controller;

import kz.geoweb.api.config.properties.GeoserverProperties;
import kz.geoweb.api.dto.StyleIconResponseDto;
import kz.geoweb.api.dto.StyleRequestDto;
import kz.geoweb.api.dto.StyleResponseDto;
import kz.geoweb.api.dto.StyleResponseFullDto;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.StyleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/styles")
@RequiredArgsConstructor
@Slf4j
public class StyleController {
    private final StyleService styleService;
    private final GeoserverProperties geoserverProperties;

    @Value("${app.geoserver.icons.path}")
    private String geoserverIconsPath;

    @GetMapping
    public ResponseEntity<Page<StyleResponseDto>> getStyles(Pageable pageable) {
        Page<StyleResponseDto> styleResponseDtoPage = styleService.getStyles(pageable);
        return ResponseEntity.ok(styleResponseDtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StyleResponseFullDto> getStyleById(@PathVariable UUID id) {
        StyleResponseFullDto styleResponseFullDto = styleService.getStyleById(id);
        return ResponseEntity.ok(styleResponseFullDto);
    }

    @PostMapping
    public ResponseEntity<StyleResponseDto> createStyle(@RequestBody StyleRequestDto styleRequestDto,
                                                        @RequestParam UUID layerId) {
        StyleResponseDto created = styleService.createStyle(styleRequestDto, layerId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StyleResponseDto> updateStyle(@PathVariable UUID id,
                                                        @RequestBody StyleRequestDto styleRequestDto) {
        StyleResponseDto updated = styleService.updateStyle(id, styleRequestDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStyle(@PathVariable UUID id) {
        styleService.deleteStyle(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/icons/upload")
    public ResponseEntity<StyleIconResponseDto> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            boolean exists = new File(geoserverIconsPath, Objects.requireNonNull(filename)).exists();
            if (exists) {
                throw new CustomException("file.with_name.already_exists", filename);
            }
            File destinationFile = new File(geoserverIconsPath + "/" + filename);
            file.transferTo(destinationFile);
            String iconPath = geoserverProperties.getIconsPath() + "/" + filename;
            StyleIconResponseDto styleIconResponseDto = new StyleIconResponseDto(iconPath);
            return ResponseEntity.ok(styleIconResponseDto);
        } catch (IOException e) {
            log.error("Error while uploading file", e);
            throw new CustomException("file.upload.error");
        }
    }
}
