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
    @NotBlank
    private String attrname;
    private AttrType attrType;
    private Boolean shortInfo;
    private Boolean fullInfo;
    private LayerInfoDto layer;
    private String dictionaryCode;
    private Integer rank = 0;
}
