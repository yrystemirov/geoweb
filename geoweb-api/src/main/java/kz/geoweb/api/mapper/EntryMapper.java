package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryRequestDto;
import kz.geoweb.api.entity.Entry;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EntryMapper {
    private final ModelMapper modelMapper;

    public EntryDto toDto(Entry entry) {
        return modelMapper.map(entry, EntryDto.class);
    }

    public List<EntryDto> toDto(List<Entry> entries) {
        return entries.stream().map(this::toDto).toList();
    }

    public Entry toEntity(EntryRequestDto entryRequestDto) {
        return modelMapper.map(entryRequestDto, Entry.class);
    }
}
