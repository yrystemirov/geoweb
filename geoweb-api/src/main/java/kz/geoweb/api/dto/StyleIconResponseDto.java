package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class StyleIconResponseDto {
    private String iconPath;

    public StyleIconResponseDto(String iconPath) {
        this.iconPath = iconPath;
    }
}
