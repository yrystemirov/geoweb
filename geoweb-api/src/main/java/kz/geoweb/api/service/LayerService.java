package kz.geoweb.api.service;

import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.dto.LayerRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LayerService {
    LayerDto getLayer(UUID id);

    LayerDto getLayerByLayername(String layername);

    Page<LayerDto> getLayers(String search, Pageable pageable);

    LayerDto createLayer(LayerRequestDto layerRequestDto);

    LayerDto updateLayer(UUID id, LayerRequestDto layerRequestDto);

    void deleteLayer(UUID id);
}
