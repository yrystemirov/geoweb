package kz.geoweb.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.enums.LayerType;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class LayerRequestDto {
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String descriptionKk;
    private String descriptionRu;
    private String descriptionEn;
    @NotBlank
    private String layername;
    @NotNull
    private GeometryType geometryType;
    private LayerType layerType = LayerType.SIMPLE;
    private UUID styleId;
    private String url;
    private Boolean baseLayer = false;
    private Boolean checkIntersection = true;
    private Boolean isBlockLayer = false;
    private Boolean isDynamic = false;
    private Boolean isPublic = false;
    private String dynamicIdentityColumn;
    private Set<FolderRequestDto> folders = new HashSet<>();
}
