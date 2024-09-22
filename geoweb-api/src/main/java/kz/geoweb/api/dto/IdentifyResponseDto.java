package kz.geoweb.api.dto;

import lombok.Data;

import java.util.Set;

@Data
public class IdentifyResponseDto {
    private LayerInfoDto layer;
    private Integer gid;
    private String geom;
    private Set<IdentifyFeatureDto> features;
}
