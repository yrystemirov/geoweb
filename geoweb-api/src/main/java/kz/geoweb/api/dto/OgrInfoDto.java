package kz.geoweb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OgrInfoDto {
    private String name;
    private String geomType;
}
