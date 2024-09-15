package kz.geoweb.api.service;

import kz.geoweb.api.dto.ConfigDto;
import kz.geoweb.api.dto.ConfigFullDto;
import kz.geoweb.api.dto.ConfigRequestDto;

import java.util.Set;
import java.util.UUID;

public interface ConfigService {
    ConfigFullDto getConfig(UUID id);
    Set<ConfigDto> getConfigs();
    ConfigDto createConfig(ConfigRequestDto configRequestDto);
    ConfigDto updateConfig(UUID id, ConfigRequestDto configRequestDto);
    void deleteConfig(UUID id);
}
