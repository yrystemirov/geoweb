package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.entity.Role;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoleMapper {
    private final ModelMapper modelMapper;

    public RoleDto toDto(Role role) {
        return modelMapper.map(role, RoleDto.class);
    }

    public Role toEntity(RoleDto roleDto) {
        return modelMapper.map(roleDto, Role.class);
    }

    public Set<Role> toEntity(Set<RoleDto> roleDtoSet) {
        return roleDtoSet.stream().map(this::toEntity).collect(Collectors.toSet());
    }
}
