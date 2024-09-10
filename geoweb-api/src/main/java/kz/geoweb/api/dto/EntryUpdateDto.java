package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EntryUpdateDto {
    @NotBlank
    private String code;
    private String kk;
    private String ru;
    private String en;
    private Integer rank = 0;
}
