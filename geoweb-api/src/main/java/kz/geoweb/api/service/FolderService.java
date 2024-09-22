package kz.geoweb.api.service;

import kz.geoweb.api.dto.FolderRequestDto;
import kz.geoweb.api.dto.FolderInfoDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.dto.FolderDto;

import java.util.Set;
import java.util.UUID;

public interface FolderService {
    FolderDto getFolder(UUID id);
    Set<FolderInfoDto> getRootFolders();
    Set<FolderInfoDto> getPublicRootFolders();
    FolderTreeDto getFolderTree(UUID id);
    FolderTreeDto getPublicFolderTree(UUID id);
    FolderDto createFolder(FolderRequestDto folderRequestDto);
    FolderDto updateFolder(UUID id, FolderRequestDto folderRequestDto);
    void deleteFolder(UUID id);
}
