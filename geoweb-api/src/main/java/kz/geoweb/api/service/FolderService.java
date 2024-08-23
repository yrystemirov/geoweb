package kz.geoweb.api.service;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.dto.FolderTreeDto;

import java.util.Set;
import java.util.UUID;

public interface FolderService {
    FolderDto getFolder(UUID id);
    Set<FolderDto> getFolderChildren(UUID parentId);
    FolderTreeDto getFolderTree(UUID id);
    FolderDto createFolder(FolderDto folderDto);
    FolderDto updateFolder(UUID id, FolderDto folderDto);
    void deleteFolder(UUID id);
}
