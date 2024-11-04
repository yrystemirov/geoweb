package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class StyleIconResponseDto {
    private String iconPath;
    private String format;

    public StyleIconResponseDto(String iconPath, String format) {
        this.iconPath = iconPath;
        this.format = format;
    }
}
