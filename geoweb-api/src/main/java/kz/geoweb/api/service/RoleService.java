package kz.geoweb.api.service;

import kz.geoweb.api.dto.RoleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface RoleService {
    RoleDto getRole(UUID id);
    Page<RoleDto> getRoles(Pageable pageable);
    RoleDto createRole(RoleDto roleDto);
    RoleDto updateRole(UUID id, RoleDto roleDto);
    void deleteRole(UUID id);
}
