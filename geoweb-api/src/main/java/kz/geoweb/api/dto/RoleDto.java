package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RoleDto {
    private UUID id;
    private String code;
    private String name;
    private String description;
}
