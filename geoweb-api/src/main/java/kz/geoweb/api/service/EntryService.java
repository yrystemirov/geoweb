package kz.geoweb.api.service;

import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface EntryService {
    List<EntryDto> getEntries(UUID dictionaryId);

    Page<EntryDto> getEntries(UUID dictionaryId, Pageable pageable);

    EntryDto getEntry(UUID id);

    EntryDto createEntry(EntryRequestDto entryRequestDto);

    EntryDto updateEntry(UUID id, EntryRequestDto entryRequestDto);

    void deleteEntry(UUID id);
}
