package kz.geoweb.api.dto;

import kz.geoweb.api.enums.GeometryType;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class StyleResponseFullDto {
    private UUID id;
    private String name;
    private GeometryType geomType;
    private List<StyleRuleDto> rules;
}
