package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import kz.geoweb.api.enums.AttrType;
import lombok.Data;

import java.util.UUID;

@Data
public class LayerAttrDto {
    private UUID id;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    @NotBlank(message = "{layer_attr.attrname.empty}")
    private String attrname;
    private AttrType attrType;
    private Boolean shortInfo;
    private Boolean fullInfo;
    private LayerDto layer;
    private String dictionaryCode;
    private Integer rank = 0;
}
