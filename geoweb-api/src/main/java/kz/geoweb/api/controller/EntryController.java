package kz.geoweb.api.controller;

import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryRequestDto;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/entries")
@RequiredArgsConstructor
public class EntryController {
    private final EntryService entryService;

    @GetMapping("/{id}")
    public EntryDto getEntry(@PathVariable UUID id) {
        return entryService.getEntry(id);
    }

    @PostMapping
    public EntryDto createEntry(@RequestBody EntryRequestDto entryRequestDto) {
        return entryService.createEntry(entryRequestDto);
    }

    @PutMapping("/{id}")
    public EntryDto updateEntry(@PathVariable UUID id,
                                @RequestBody EntryRequestDto entryRequestDto) {
        return entryService.updateEntry(id, entryRequestDto);
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable UUID id) {
        entryService.deleteEntry(id);
    }
}
