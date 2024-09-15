package kz.geoweb.api.dto;

import kz.geoweb.api.enums.ConfigType;
import lombok.Data;

import java.util.UUID;

@Data
public class ConfigDto {
    private UUID id;
    private ConfigType configType;
    private String nameKk;
    private String nameRu;
    private String nameEn;
}
