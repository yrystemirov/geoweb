package kz.geoweb.api.service;

import kz.geoweb.api.dto.DictionaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DictionaryService {
    Page<DictionaryDto> getDictionaries(Pageable pageable);

    DictionaryDto getDictionary(UUID id);

    DictionaryDto createDictionary(DictionaryDto dictionaryDto);

    DictionaryDto updateDictionary(UUID id, DictionaryDto dictionaryDto);

    void deleteDictionary(UUID id);
}
