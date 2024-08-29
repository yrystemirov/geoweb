package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String email;
    private String name;
    private String phoneNumber;
    private Boolean blocked = false;
}
