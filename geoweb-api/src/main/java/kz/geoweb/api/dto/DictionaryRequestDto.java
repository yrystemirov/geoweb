package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import kz.geoweb.api.enums.AttrType;
import lombok.Data;

@Data
public class DictionaryRequestDto {
    @NotBlank
    private String code;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private AttrType type = AttrType.TEXT;
}
