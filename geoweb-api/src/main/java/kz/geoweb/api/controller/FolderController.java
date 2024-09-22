package kz.geoweb.api.controller;

import kz.geoweb.api.dto.FolderRequestDto;
import kz.geoweb.api.dto.FolderInfoDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @GetMapping("/{id}")
    public FolderDto getFolder(@PathVariable UUID id) {
        return folderService.getFolder(id);
    }

    @GetMapping("/root")
    public Set<FolderInfoDto> getRootFolders() {
        return folderService.getRootFolders();
    }

    @GetMapping("/{id}/tree")
    public FolderTreeDto getFolderTree(@PathVariable UUID id) {
        return folderService.getFolderTree(id);
    }

    @PostMapping
    public FolderDto createFolder(@RequestBody FolderRequestDto folderRequestDto) {
        return folderService.createFolder(folderRequestDto);
    }

    @PutMapping("/{id}")
    public FolderDto updateFolder(@PathVariable UUID id,
                                  @RequestBody FolderRequestDto folderRequestDto) {
        return folderService.updateFolder(id, folderRequestDto);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable UUID id) {
        folderService.deleteFolder(id);
    }
}
