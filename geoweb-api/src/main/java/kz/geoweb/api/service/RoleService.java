package kz.geoweb.api.service;

import kz.geoweb.api.dto.RoleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleService {
    Page<RoleDto> getRoles(Pageable pageable);
    RoleDto createRole(RoleDto roleDto);

}
