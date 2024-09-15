package kz.geoweb.api.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.geoweb.api.dto.ConfigDto;
import kz.geoweb.api.dto.ConfigFullDto;
import kz.geoweb.api.dto.ConfigRequestDto;
import kz.geoweb.api.entity.Config;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.ConfigMapper;
import kz.geoweb.api.repository.ConfigRepository;
import kz.geoweb.api.service.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfigServiceImpl implements ConfigService {
    private final ConfigRepository configRepository;
    private final ConfigMapper configMapper;
    private final ObjectMapper objectMapper;

    private Config getEntityById(UUID id) {
        return configRepository.findById(id)
                .orElseThrow(() -> new CustomException("config.by_id.not_found", id.toString()));
    }

    @Override
    public ConfigFullDto getConfig(UUID id) {
        Config config = getEntityById(id);
        return configMapper.toConfigFullDto(config);
    }

    @Override
    public Set<ConfigDto> getConfigs() {
        Set<Config> configs = configRepository.findAllByOrderByConfigType();
        return configMapper.toDto(configs);
    }

    @Override
    public ConfigDto createConfig(ConfigRequestDto configRequestDto) {
        Config config = configMapper.toEntity(configRequestDto);
        Config created = configRepository.save(config);
        return configMapper.toDto(created);
    }

    @Override
    public ConfigDto updateConfig(UUID id, ConfigRequestDto configRequestDto) {
        Config config = getEntityById(id);
        config.setNameKk(configRequestDto.getNameKk());
        config.setNameRu(configRequestDto.getNameRu());
        config.setNameEn(configRequestDto.getNameEn());
        try {
            config.setConfigData(objectMapper.writeValueAsString(configRequestDto.getConfigData()));
        } catch (JsonProcessingException e) {
            log.error("Error while parsing config data", e);
        }
        Config updated = configRepository.save(config);
        return configMapper.toDto(updated);
    }

    @Override
    public void deleteConfig(UUID id) {
        getEntityById(id);
        configRepository.deleteById(id);
    }
}
