package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class ExtentDto {
    private String extent;

    public ExtentDto(String extent) {
        this.extent = extent;
    }
}
