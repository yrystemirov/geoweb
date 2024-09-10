package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class DictionaryRequestDto {
    @NotBlank
    private String code;
    private String nameKk;
    private String nameRu;
    private String nameEn;
}
