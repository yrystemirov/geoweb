package kz.geoweb.api.service;

import kz.geoweb.api.dto.LayerAttrCreateDto;
import kz.geoweb.api.dto.LayerAttrDto;

import java.util.Set;
import java.util.UUID;

public interface LayerAttrService {
    LayerAttrDto getLayerAttr(UUID id);
    Set<LayerAttrDto> getLayerAttrs(UUID layerId);
    LayerAttrDto createLayerAttr(LayerAttrCreateDto layerAttrCreateDto);
    LayerAttrDto updateLayerAttr(UUID id, LayerAttrDto layerAttrDto);
    void deleteLayerAttr(UUID id);
}
