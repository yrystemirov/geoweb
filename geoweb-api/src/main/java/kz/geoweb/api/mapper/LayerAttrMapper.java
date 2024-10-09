package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.entity.LayerAttr;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class LayerAttrMapper {
    private final ModelMapper modelMapper;

    public LayerAttrDto toDto(LayerAttr layerAttr) {
        return modelMapper.map(layerAttr, LayerAttrDto.class);
    }

    public List<LayerAttrDto> toDto(List<LayerAttr> layerAttrs) {
        return layerAttrs.stream().map(this::toDto).toList();
    }

    public LayerAttr toEntity(LayerAttrDto layerAttrDto) {
        return modelMapper.map(layerAttrDto, LayerAttr.class);
    }
}
