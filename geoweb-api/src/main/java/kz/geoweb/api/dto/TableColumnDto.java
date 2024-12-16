package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class TableColumnDto {
    private String dataType;
    private String columnName;
    private String transliteratedColumnName;
}
