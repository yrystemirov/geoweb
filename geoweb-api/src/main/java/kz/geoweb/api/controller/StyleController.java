package kz.geoweb.api.controller;

import kz.geoweb.api.dto.StyleRequestDto;
import kz.geoweb.api.dto.StyleResponseDto;
import kz.geoweb.api.dto.StyleResponseFullDto;
import kz.geoweb.api.service.StyleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/styles")
@RequiredArgsConstructor
public class StyleController {
    private final StyleService styleService;

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

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam String folder) {
        try {
            String IMAGES_DIRECTORY = "/var/lib/docker/volumes/qmap_docker_geoserver-data/_data/styles/" + folder;
            // Проверяем, существует ли директория images, и создаем, если нет
            File imagesDir = new File(IMAGES_DIRECTORY);
            if (!imagesDir.exists()) {
                imagesDir.mkdirs();
            }

            // Создаем файл в директории images
            File destinationFile = new File(IMAGES_DIRECTORY + file.getOriginalFilename());

            // Сохраняем файл
            file.transferTo(destinationFile);

            return ResponseEntity.ok("File uploaded successfully: " + destinationFile.getAbsolutePath());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
}
