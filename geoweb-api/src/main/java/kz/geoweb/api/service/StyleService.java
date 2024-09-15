package kz.geoweb.api.service;

import kz.geoweb.api.dto.StyleRequestDto;
import kz.geoweb.api.dto.StyleResponseDto;
import kz.geoweb.api.dto.StyleResponseFullDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface StyleService {
    Page<StyleResponseDto> getStyles(Pageable pageable);
    StyleResponseFullDto getStyleById(UUID id);
    StyleResponseDto createStyle(StyleRequestDto styleRequestDto, UUID layerId);
    StyleResponseDto updateStyle(UUID styleId, StyleRequestDto styleRequestDto);
    void deleteStyle(UUID id);
    String generateStyleXml(StyleRequestDto styleRequestDto);
}
