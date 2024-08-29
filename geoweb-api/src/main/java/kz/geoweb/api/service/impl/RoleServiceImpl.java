package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.entity.Role;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.RoleMapper;
import kz.geoweb.api.repository.RoleRepository;
import kz.geoweb.api.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    private Role getEntityById(UUID id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new CustomException("role.by_id.not_found", id.toString()));
    }

    @Override
    public RoleDto getRole(UUID id) {
        Role role = getEntityById(id);
        return roleMapper.toDto(role);
    }

    @Override
    public Page<RoleDto> getRoles(Pageable pageable) {
        return roleRepository.findAll(pageable)
                .map(roleMapper::toDto);
    }

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        Role role = roleMapper.toEntity(roleDto);
        role.setId(null);
        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public RoleDto updateRole(UUID id, RoleDto roleDto) {
        Role role = getEntityById(id);
        role.setCode(roleDto.getCode());
        role.setName(roleDto.getName());
        role.setDescription(roleDto.getDescription());
        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public void deleteRole(UUID id) {
        getEntityById(id);
        roleRepository.deleteById(id);
    }
}
