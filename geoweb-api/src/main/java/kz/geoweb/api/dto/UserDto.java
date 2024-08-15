package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String email;
    private String name;
    private String phoneNumber;
}
