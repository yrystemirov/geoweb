package kz.geoweb.api.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class WmsResponseDto {
    private String type;
    private List<GeoserverFeatureDto> features = new ArrayList<>();
}
