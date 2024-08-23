package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.dto.FolderTreeDto;
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

    public FolderDto toDto(Folder folder) {
        return modelMapper.map(folder, FolderDto.class);
    }

    public FolderTreeDto toFolderTreeDto(Folder folder) {
        return modelMapper.map(folder, FolderTreeDto.class);
    }

    public Set<FolderDto> toDto(Set<Folder> folders) {
        return folders.stream().map(this::toDto).collect(Collectors.toSet());
    }

    public Folder toEntity(FolderDto dto) {
        return modelMapper.map(dto, Folder.class);
    }
}
