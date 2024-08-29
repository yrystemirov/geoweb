package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class UserCreateDto {
    private String username;
    private String password;
    private String name;
    private String email;
    private String phoneNumber;
}
