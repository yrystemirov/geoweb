package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class StyleIconResponseDto {
    private String imgSrc;
    private String imgFormat;

    public StyleIconResponseDto(String imgSrc, String imgFormat) {
        this.imgSrc = imgSrc;
        this.imgFormat = imgFormat;
    }
}
