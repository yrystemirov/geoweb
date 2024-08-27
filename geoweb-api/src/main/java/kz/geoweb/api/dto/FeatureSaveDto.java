package kz.geoweb.api.dto;

import kz.geoweb.api.enums.Action;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class FeatureSaveDto {
    private Action action;
    private Integer gid;
    private String wkt;
    private Map<String, Object> attributes = new HashMap<>();
}
