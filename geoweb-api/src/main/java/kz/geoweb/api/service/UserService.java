package kz.geoweb.api.service;

import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.dto.UserCreateDto;
import kz.geoweb.api.dto.UserUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;
import java.util.UUID;

public interface UserService {
    UserDto getCurrentUser();
    Set<UUID> getCurrentUserRoleIds();
    UserDto getUser(UUID id);
    Page<UserDto> getUsers(Pageable pageable);
    UserDto createUser(UserCreateDto userCreateDto);
    UserDto updateUser(UUID id, UserUpdateDto userUpdateDto);
    void deleteUser(UUID id);
}
