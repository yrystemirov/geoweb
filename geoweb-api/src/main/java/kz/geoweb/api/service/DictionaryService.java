package kz.geoweb.api.service;

import kz.geoweb.api.dto.DictionaryDto;
import kz.geoweb.api.dto.DictionaryRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DictionaryService {
    Page<DictionaryDto> getDictionaries(Pageable pageable);

    DictionaryDto getDictionary(UUID id);

    DictionaryDto createDictionary(DictionaryRequestDto dictionaryRequestDto);

    DictionaryDto updateDictionary(UUID id, DictionaryRequestDto dictionaryRequestDto);

    void deleteDictionary(UUID id);
}
