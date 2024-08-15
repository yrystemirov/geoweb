package kz.geoweb.api.service.impl;

import kz.geoweb.api.entity.Role;
import kz.geoweb.api.entity.User;
import kz.geoweb.api.enums.RoleEnum;
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
                    .orElseThrow(() -> new RuntimeException("user.not_found"));
            List<RoleEnum> currentUserRoles = user.getRoles().stream().map(Role::getName).toList();
            boolean hasPermission = false;
            for (RoleEnum requestedRole : roles) {
                if (currentUserRoles.contains(requestedRole)) {
                    hasPermission = true;
                    break;
                }
            }
            if (!hasPermission) {
                throw new RuntimeException("forbidden");
            }
        } else {
            throw new RuntimeException("unauthorized");
        }
    }
}
