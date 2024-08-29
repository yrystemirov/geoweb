package kz.geoweb.api.service.impl;

import kz.geoweb.api.entity.Role;
import kz.geoweb.api.entity.User;
import kz.geoweb.api.enums.RoleEnum;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.repository.UserRepository;
import kz.geoweb.api.security.UserContext;
import kz.geoweb.api.security.UserContextHolder;
import kz.geoweb.api.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {
    private final UserRepository userRepository;

    @Override
    public void hasAnyRole(RoleEnum... roles) {
        UserContext userContext = UserContextHolder.getCurrentUser();
        if (userContext != null) {
            String username = userContext.getUsername();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException("user.not_found"));
            List<String> currentUserRoles = user.getRoles().stream().map(Role::getCode).toList();
            boolean hasPermission = false;
            for (RoleEnum requestedRole : roles) {
                if (currentUserRoles.contains(requestedRole.name())) {
                    hasPermission = true;
                    break;
                }
            }
            if (!hasPermission) {
                throw new ForbiddenException("forbidden");
            }
        } else {
            throw new RuntimeException("unauthorized");
        }
    }
}
