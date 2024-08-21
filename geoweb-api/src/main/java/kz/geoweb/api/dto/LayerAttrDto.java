package kz.geoweb.api.dto;

import kz.geoweb.api.enums.AttrType;
import lombok.Data;

import java.util.UUID;

@Data
public class LayerAttrDto {
    private UUID id;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String attrname;
    private AttrType attrType;
    private Boolean shortInfo;
    private Boolean fullInfo;
    private LayerDto layer;
    private String dictionaryCode;
    private Integer orderNumber;
}
