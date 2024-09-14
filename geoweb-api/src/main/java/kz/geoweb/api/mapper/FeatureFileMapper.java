package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.FeatureFileDto;
import kz.geoweb.api.dto.FeatureFileResponseDto;
import kz.geoweb.api.entity.FeatureFile;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FeatureFileMapper {
    private final ModelMapper modelMapper;

    public FeatureFileDto toDto(FeatureFile featureFile) {
        return modelMapper.map(featureFile, FeatureFileDto.class);
    }

    public List<FeatureFileDto> toDto(List<FeatureFile> featureFiles) {
        return featureFiles.stream().map(this::toDto).toList();
    }

    public FeatureFileResponseDto toFeatureFileResponseDto(FeatureFile featureFile) {
        return modelMapper.map(featureFile, FeatureFileResponseDto.class);
    }
}
