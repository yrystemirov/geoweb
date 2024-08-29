package kz.geoweb.api.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String username;
    private String email;
    private String name;
    private String phoneNumber;
    private Boolean blocked;
    Set<RoleDto> roles = new HashSet<>();
}
