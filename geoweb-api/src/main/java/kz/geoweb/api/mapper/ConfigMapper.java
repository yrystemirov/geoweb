package kz.geoweb.api.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.geoweb.api.dto.ConfigDto;
import kz.geoweb.api.dto.ConfigFullDto;
import kz.geoweb.api.dto.ConfigRequestDto;
import kz.geoweb.api.entity.Config;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConfigMapper {
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    public ConfigDto toDto(Config config) {
        return modelMapper.map(config, ConfigDto.class);
    }

    public Set<ConfigDto> toDto(Set<Config> configs) {
        return configs.stream().map(this::toDto).collect(Collectors.toSet());
    }

    public ConfigFullDto toConfigFullDto(Config config) {
        ConfigFullDto configFullDto = modelMapper.map(config, ConfigFullDto.class);
        try {
            configFullDto.setConfigData(objectMapper.readTree(config.getConfigData()));
        } catch (JsonProcessingException e) {
            log.error("Error while parsing config data", e);
        }
        return configFullDto;
    }

    public Config toEntity(ConfigRequestDto configRequestDto) {
        Config config = modelMapper.map(configRequestDto, Config.class);
        try {
            config.setConfigData(objectMapper.writeValueAsString(configRequestDto.getConfigData()));
        } catch (JsonProcessingException e) {
            log.error("Error while parsing config data", e);
        }
        return config;
    }
}
