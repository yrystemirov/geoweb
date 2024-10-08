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
    private Integer rank;
}
