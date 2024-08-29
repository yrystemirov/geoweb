package kz.geoweb.api.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class UserUpdateDto {
    private String email;
    private String name;
    private String phoneNumber;
    private Boolean blocked = false;
    Set<RoleDto> roles = new HashSet<>();
}
