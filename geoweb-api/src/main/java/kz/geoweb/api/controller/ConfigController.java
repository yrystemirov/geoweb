package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.ConfigDto;
import kz.geoweb.api.dto.ConfigFullDto;
import kz.geoweb.api.dto.ConfigRequestDto;
import kz.geoweb.api.service.ConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/configs")
@RequiredArgsConstructor
public class ConfigController {
    private final ConfigService configService;

    @GetMapping("/{id}")
    public ConfigFullDto getConfig(@PathVariable("id") UUID id) {
        return configService.getConfig(id);
    }

    @GetMapping
    public Set<ConfigDto> getConfigs() {
        return configService.getConfigs();
    }

    @PostMapping
    public ConfigDto createConfig(@RequestBody @Valid ConfigRequestDto configRequestDto) {
        return configService.createConfig(configRequestDto);
    }

    @PutMapping("/{id}")
    public ConfigDto updateConfig(@PathVariable("id") UUID id,
                                  @RequestBody @Valid ConfigRequestDto configRequestDto) {
        return configService.updateConfig(id, configRequestDto);
    }

    @DeleteMapping("/{id}")
    public void deleteConfig(@PathVariable("id") UUID id) {
        configService.deleteConfig(id);
    }
}
