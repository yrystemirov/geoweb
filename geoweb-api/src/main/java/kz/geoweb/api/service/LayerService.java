package kz.geoweb.api.service;

import kz.geoweb.api.dto.LayerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LayerService {
    LayerDto getLayer(UUID id);

    Page<LayerDto> getLayers(Pageable pageable);

    LayerDto createLayer(LayerDto layerDto);

    LayerDto updateLayer(UUID id, LayerDto layerDto);

    void deleteLayer(UUID id);
}
