package kz.geoweb.api.service;

import kz.geoweb.api.dto.LayerAttrDto;

import java.util.List;
import java.util.UUID;

public interface LayerAttrService {
    LayerAttrDto getLayerAttr(UUID id);

    List<LayerAttrDto> getLayerAttrs(UUID layerId);

    List<LayerAttrDto> getLayerAttrsPublic(UUID layerId);

    LayerAttrDto createLayerAttr(LayerAttrDto layerAttrDto);

    LayerAttrDto updateLayerAttr(UUID id, LayerAttrDto layerAttrDto);

    void deleteLayerAttr(UUID id);

    List<LayerAttrDto> getLayerAttrsByLayername(String layername);
}
