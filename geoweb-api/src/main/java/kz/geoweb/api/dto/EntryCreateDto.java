package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class EntryCreateDto {
    @NotBlank
    private String code;
    private String kk;
    private String ru;
    private String en;
    @NotNull
    private UUID dictionaryId;
    private Integer rank = 0;
}
