package kz.geoweb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StyleFilterDto {
    private StyleFilterColumnDto column;
    private String operator;
    private Object value;
}
