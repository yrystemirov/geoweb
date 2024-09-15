package kz.geoweb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import kz.geoweb.api.enums.AttrType;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StyleFilterColumnDto {
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String nameQz;
    private String attrname;
    private AttrType attrtype;
    private String dictionaryCode;
}
