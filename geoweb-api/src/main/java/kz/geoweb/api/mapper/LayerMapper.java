package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.LayerInfoDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.dto.LayerRequestDto;
import kz.geoweb.api.entity.Layer;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LayerMapper {
    private final ModelMapper modelMapper;

    public LayerInfoDto toLayerInfoDto(Layer layer) {
        return modelMapper.map(layer, LayerInfoDto.class);
    }

    public LayerDto toDto(Layer layer) {
        return modelMapper.map(layer, LayerDto.class);
    }

    public Layer toEntity(LayerRequestDto layerRequestDto) {
        return modelMapper.map(layerRequestDto, Layer.class);
    }

    public Layer toEntity(LayerInfoDto layerInfoDto) {
        return modelMapper.map(layerInfoDto, Layer.class);
    }

    public Set<Layer> toEntity(Set<LayerInfoDto> layerInfoDtoList) {
        return layerInfoDtoList.stream().map(this::toEntity).collect(Collectors.toSet());
    }
}
