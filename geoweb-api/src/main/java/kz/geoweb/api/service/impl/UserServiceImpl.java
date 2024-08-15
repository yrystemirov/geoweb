package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.entity.User;
import kz.geoweb.api.mapper.UserMapper;
import kz.geoweb.api.repository.UserRepository;
import kz.geoweb.api.security.UserContext;
import kz.geoweb.api.security.UserContextHolder;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDto getCurrentUser() {
        UserContext userContext = UserContextHolder.getCurrentUser();
        if (userContext != null) {
            String username = userContext.getUsername();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("user.not_found"));
            return userMapper.toDto(user);
        }
        throw new RuntimeException("user.not_found");
    }
}
