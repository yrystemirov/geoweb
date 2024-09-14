package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class WmsRequestDto {
    private String layers;
    private String updatedTime;
    private String i;
    private String j;
    private String bbox;
}
