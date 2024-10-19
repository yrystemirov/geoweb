package kz.geoweb.api.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.geoweb.api.dto.StyleDto;
import kz.geoweb.api.dto.StyleRequestDto;
import kz.geoweb.api.dto.StyleResponseDto;
import kz.geoweb.api.dto.StyleResponseFullDto;
import kz.geoweb.api.entity.Style;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class StyleMapper {
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    public StyleDto mapToDto(Map<String, String> map) {
        StyleDto styleDto = new StyleDto();
        styleDto.setName(map.get("name"));
        styleDto.setHref(map.get("href"));
        return styleDto;
    }

    public List<StyleDto> mapToDto(List<Map<String, String>> list) {
        return list.stream().map(this::mapToDto).toList();
    }

    public StyleResponseDto entityToResponse(Style styleEntity) {
        return modelMapper.map(styleEntity, StyleResponseDto.class);
    }

    public Page<StyleResponseDto> entityToResponse(Page<Style> styleEntityPage) {
        return styleEntityPage.map(this::entityToResponse);
    }

    public StyleResponseFullDto entityToResponseFull(Style styleEntity) {
        StyleResponseFullDto styleResponseFullDto = new StyleResponseFullDto();
        styleResponseFullDto.setId(styleEntity.getId());
        styleResponseFullDto.setName(styleEntity.getStyleName());
        styleResponseFullDto.setIsSld(styleEntity.getIsSld());
        styleResponseFullDto.setSld(styleEntity.getSld());
        try {
            StyleRequestDto styleRequestDtoFromDb = objectMapper.readValue(styleEntity.getStyleJson(), StyleRequestDto.class);
            styleResponseFullDto.setGeomType(styleRequestDtoFromDb.getGeomType());
            styleResponseFullDto.setRules(styleRequestDtoFromDb.getRules());
            return styleResponseFullDto;
        } catch (JsonProcessingException e) {
            log.info("Error while parsing styleJson to StyleRequestDto: {}", e.getMessage());
        }
        return styleResponseFullDto;
    }

    public Style requestToEntity(StyleRequestDto styleRequestDto) {
        Style styleEntity = new Style();
        styleEntity.setStyleName(styleRequestDto.getName());
        styleEntity.setIsSld(styleRequestDto.getIsSld());
        styleEntity.setSld(styleRequestDto.getSld());
        try {
            String styleJson = objectMapper.writeValueAsString(styleRequestDto);
            styleEntity.setStyleJson(styleJson);
        } catch (JsonProcessingException e) {
            log.info("Error while parsing StyleRequestDto to styleJson: {}", e.getMessage());
        }
        return styleEntity;
    }

//    public StyleRequestDto entityToRequestDto(Style styleEntity) {
//        StyleRequestDto styleRequestDto = new StyleRequestDto();
//        try {
//            styleRequestDto = objectMapper.readValue(styleEntity.getStyleJson(), StyleRequestDto.class);
//        } catch (JsonProcessingException e) {
//            log.info("Error while parsing styleJson to StyleRequestDto: {}", e.getMessage());
//        }
//        return styleRequestDto;
//    }
}
