package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.DictionaryDto;
import kz.geoweb.api.dto.DictionaryRequestDto;
import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.service.DictionaryService;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dictionaries")
@RequiredArgsConstructor
public class DictionaryController {
    private final DictionaryService dictionaryService;
    private final EntryService entryService;

    @GetMapping
    public Page<DictionaryDto> getDictionaries(@RequestParam(required = false) String search,
                                               Pageable pageable) {
        return dictionaryService.getDictionaries(search, pageable);
    }

    @GetMapping("/{id}")
    public DictionaryDto getDictionary(@PathVariable UUID id) {
        return dictionaryService.getDictionary(id);
    }

    @PostMapping
    public DictionaryDto createDictionary(@RequestBody @Valid DictionaryRequestDto dictionaryRequestDto) {
        return dictionaryService.createDictionary(dictionaryRequestDto);
    }

    @PutMapping("/{id}")
    public DictionaryDto updateDictionary(@PathVariable UUID id,
                                          @RequestBody @Valid DictionaryRequestDto dictionaryRequestDto) {
        return dictionaryService.updateDictionary(id, dictionaryRequestDto);
    }

    @DeleteMapping("/{id}")
    public void deleteDictionary(@PathVariable UUID id) {
        dictionaryService.deleteDictionary(id);
    }

    @GetMapping("/{id}/entries")
    public List<EntryDto> getEntries(@PathVariable UUID id,
                                     @RequestParam(required = false) String search) {
        return entryService.getEntries(id, search);
    }

    @GetMapping("/{id}/entries/page")
    public Page<EntryDto> getEntries(@PathVariable UUID id,
                                     @RequestParam(required = false) String search,
                                     Pageable pageable) {
        return entryService.getEntries(id, search, pageable);
    }
}
