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
}
