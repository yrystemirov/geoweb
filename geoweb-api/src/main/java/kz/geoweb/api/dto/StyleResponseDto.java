package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class StyleResponseDto {
    private UUID id;
    private String name;
}
