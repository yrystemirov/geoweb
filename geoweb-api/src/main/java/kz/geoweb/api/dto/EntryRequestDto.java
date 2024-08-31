package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class EntryRequestDto {
    private UUID id;
    private String code;
    private String kk;
    private String ru;
    private String en;
    private DictionaryDto dictionary;
    private Integer rank = 0;
}
