package kz.geoweb.api.service;

import kz.geoweb.api.enums.RoleEnum;

public interface PermissionService {
    void hasAnyRole(RoleEnum... roles);
}
