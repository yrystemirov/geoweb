package kz.geoweb.api.dto;

import kz.geoweb.api.enums.GeometryType;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class StyleRequestDto {
    private String name;
    private GeometryType geomType;
    private List<StyleRuleDto> rules = new ArrayList<>();
    private Boolean isSld = false;
    private String sld;
}
