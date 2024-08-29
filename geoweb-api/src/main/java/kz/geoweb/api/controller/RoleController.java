package kz.geoweb.api.controller;

import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.enums.RoleEnum;
import kz.geoweb.api.service.PermissionService;
import kz.geoweb.api.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    private final PermissionService permissionService;

    @GetMapping("/{id}")
    public RoleDto getRoleById(@PathVariable UUID id) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return roleService.getRole(id);
    }

    @GetMapping
    public Page<RoleDto> getAllRoles(Pageable pageable) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return roleService.getRoles(pageable);
    }

    @PostMapping
    public RoleDto createRole(@RequestBody RoleDto roleDto) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return roleService.createRole(roleDto);
    }

    @PutMapping("/{id}")
    public RoleDto updateRole(@PathVariable UUID id,
                              @RequestBody RoleDto roleDto) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return roleService.updateRole(id, roleDto);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable UUID id) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        roleService.deleteRole(id);
    }
}
