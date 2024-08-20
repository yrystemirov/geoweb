package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.LayerCreateDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.entity.Layer;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LayerMapper {
    private final ModelMapper modelMapper;

    public LayerDto toDto(Layer layer) {
        return modelMapper.map(layer, LayerDto.class);
    }

    public Layer toEntity(LayerCreateDto layerCreateDto) {
        return modelMapper.map(layerCreateDto, Layer.class);
    }
}
