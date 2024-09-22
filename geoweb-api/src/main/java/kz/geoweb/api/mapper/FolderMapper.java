package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.FolderRequestDto;
import kz.geoweb.api.dto.FolderInfoDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.entity.Folder;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FolderMapper {
    private final ModelMapper modelMapper;

    public FolderRequestDto toDto(Folder folder) {
        return modelMapper.map(folder, FolderRequestDto.class);
    }

    public FolderInfoDto toFolderInfoDto(Folder folder) {
        return modelMapper.map(folder, FolderInfoDto.class);
    }

    public FolderDto toFolderWithLayersDto(Folder folder) {
        return modelMapper.map(folder, FolderDto.class);
    }

    public FolderTreeDto toFolderTreeDto(Folder folder) {
        return modelMapper.map(folder, FolderTreeDto.class);
    }

    public Set<FolderRequestDto> toDto(Set<Folder> folders) {
        return folders.stream().map(this::toDto).collect(Collectors.toSet());
    }

    public Set<FolderInfoDto> toFolderInfoDto(Set<Folder> folders) {
        return folders.stream().map(this::toFolderInfoDto).collect(Collectors.toSet());
    }

    public Folder toEntity(FolderRequestDto dto) {
        return modelMapper.map(dto, Folder.class);
    }

    public Set<Folder> toEntity(Set<FolderRequestDto> dtoList) {
        return dtoList.stream().map(this::toEntity).collect(Collectors.toSet());
    }
}
