package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.RoleDto;
import kz.geoweb.api.dto.UserCreateDto;
import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.dto.UserUpdateDto;
import kz.geoweb.api.entity.User;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.RoleMapper;
import kz.geoweb.api.mapper.UserMapper;
import kz.geoweb.api.repository.UserRepository;
import kz.geoweb.api.security.UserContext;
import kz.geoweb.api.security.UserContextHolder;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto getCurrentUser() {
        UserContext userContext = UserContextHolder.getCurrentUser();
        if (userContext != null) {
            String username = userContext.getUsername();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException("user.not_found"));
            return userMapper.toDto(user);
        }
        throw new CustomException("user.not_found");
    }

    @Override
    public Set<RoleDto> getCurrentUserRoles() {
        UserDto getCurrentUser = getCurrentUser();
        return getCurrentUser.getRoles();
    }

    private User getEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new CustomException("user.not_found"));
    }

    @Override
    public UserDto getUser(UUID id) {
        User user = getEntityById(id);
        return userMapper.toDto(user);
    }

    @Override
    public Page<UserDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Override
    public UserDto createUser(UserCreateDto userCreateDto) {
        userRepository.findByUsername(userCreateDto.getUsername())
                .ifPresent(user -> {
                    throw new CustomException("user.username.exists", userCreateDto.getUsername());
                });
        userRepository.findByPhoneNumber(userCreateDto.getPhoneNumber())
                .ifPresent(user -> {
                    throw new CustomException("user.phone_number.exists", userCreateDto.getPhoneNumber());
                });
        User user = userMapper.toEntity(userCreateDto);
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        user.setCreatedDate(LocalDateTime.now());
        user.setBlocked(false);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public UserDto updateUser(UUID id, UserUpdateDto userUpdateDto) {
        User user = getEntityById(id);
        user.setName(userUpdateDto.getName());
        user.setEmail(userUpdateDto.getEmail());
        user.setPhoneNumber(userUpdateDto.getPhoneNumber());
        user.setBlocked(userUpdateDto.getBlocked());
        user.setRoles(roleMapper.toEntity(userUpdateDto.getRoles()));
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(UUID id) {
        getEntityById(id);
        userRepository.deleteById(id);
    }
}
