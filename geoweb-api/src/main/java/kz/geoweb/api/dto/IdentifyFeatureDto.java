package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class IdentifyFeatureDto {
    private LayerAttrDto attr;
    private Object value;
}
