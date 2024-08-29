package kz.geoweb.api.controller;

import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.dto.UserCreateDto;
import kz.geoweb.api.dto.UserUpdateDto;
import kz.geoweb.api.enums.RoleEnum;
import kz.geoweb.api.service.PermissionService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PermissionService permissionService;

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable UUID id) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return userService.getUser(id);
    }

    @GetMapping
    public Page<UserDto> getAllUsers(Pageable pageable) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return userService.getUsers(pageable);
    }

    @PostMapping
    public UserDto createUser(@RequestBody UserCreateDto userCreateDto) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return userService.createUser(userCreateDto);
    }

    @PutMapping("/{id}")
    public UserDto updateUser(@PathVariable UUID id,
                              @RequestBody UserUpdateDto userUpdateDto) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return userService.updateUser(id, userUpdateDto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable UUID id) {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        userService.deleteUser(id);
    }
}
