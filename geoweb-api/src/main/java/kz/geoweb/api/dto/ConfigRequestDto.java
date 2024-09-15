package kz.geoweb.api.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;
import kz.geoweb.api.enums.ConfigType;
import lombok.Data;

@Data
public class ConfigRequestDto {
    @NotNull
    private ConfigType configType;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    @NotNull
    private JsonNode configData;
}
