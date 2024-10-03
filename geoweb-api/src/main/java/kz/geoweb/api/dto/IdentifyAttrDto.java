package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class IdentifyAttrDto {
    private LayerAttrDto attr;
    private Object value;
}
