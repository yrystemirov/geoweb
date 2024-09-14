package kz.geoweb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class MinioFileDto {
    private String bucket;
    private String object;
    private String name;
}
