package kz.geoweb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LayerLayerAttrsDto {
    private String layername;
    private LayerInfoDto layer;
    private List<LayerAttrDto> layerAttrs;
}
