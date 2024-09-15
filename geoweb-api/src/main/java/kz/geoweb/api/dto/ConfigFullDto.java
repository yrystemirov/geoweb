package kz.geoweb.api.dto;

import com.fasterxml.jackson.databind.JsonNode;
import kz.geoweb.api.enums.ConfigType;
import lombok.Data;

import java.util.UUID;

@Data
public class ConfigFullDto {
    private UUID id;
    private ConfigType configType;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private JsonNode configData;
}
