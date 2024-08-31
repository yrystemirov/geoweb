package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class DictionaryDto {
    private UUID id;
    private String code;
    private String nameKk;
    private String nameRu;
    private String nameEn;
}
