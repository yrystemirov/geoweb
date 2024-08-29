package kz.geoweb.api.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class UserCreateDto {
    private String username;
    private String password;
    private String name;
    private String email;
    private String phoneNumber;
    Set<RoleDto> roles = new HashSet<>();
}
