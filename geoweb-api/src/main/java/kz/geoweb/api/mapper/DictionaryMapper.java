package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.DictionaryDto;
import kz.geoweb.api.dto.DictionaryRequestDto;
import kz.geoweb.api.entity.Dictionary;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DictionaryMapper {
    private final ModelMapper modelMapper;

    public DictionaryDto toDto(Dictionary dictionary) {
        return modelMapper.map(dictionary, DictionaryDto.class);
    }

    public Dictionary toEntity(DictionaryRequestDto dictionaryRequestDto) {
        return modelMapper.map(dictionaryRequestDto, Dictionary.class);
    }
}
