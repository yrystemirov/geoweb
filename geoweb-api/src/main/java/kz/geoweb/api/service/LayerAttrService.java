package kz.geoweb.api.service;

import kz.geoweb.api.dto.LayerAttrDto;

import java.util.Set;
import java.util.UUID;

public interface LayerAttrService {
    LayerAttrDto getLayerAttr(UUID id);

    Set<LayerAttrDto> getLayerAttrs(UUID layerId);

    Set<LayerAttrDto> getLayerAttrsPublic(UUID layerId);

    LayerAttrDto createLayerAttr(LayerAttrDto layerAttrDto);

    LayerAttrDto updateLayerAttr(UUID id, LayerAttrDto layerAttrDto);

    void deleteLayerAttr(UUID id);

    Set<LayerAttrDto> getLayerAttrsByLayername(String layername);
}
