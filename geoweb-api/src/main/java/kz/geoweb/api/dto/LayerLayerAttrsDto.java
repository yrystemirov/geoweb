package kz.geoweb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class LayerLayerAttrsDto {
    private String layername;
    private LayerDto layer;
    private Set<LayerAttrDto> layerAttrs;
}
