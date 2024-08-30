package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class EntryDto {
    private UUID id;
    private String code;
    private String kk;
    private String ru;
    private String en;
    private DictionaryDto dictionary;
    private EntryDto parent;
    private Boolean hasChild;
    private Integer rank;
}
