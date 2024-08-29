package kz.geoweb.api.mapper;

import kz.geoweb.api.dto.UserDto;
import kz.geoweb.api.dto.UserCreateDto;
import kz.geoweb.api.dto.UserUpdateDto;
import kz.geoweb.api.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper modelMapper;

    public UserDto toDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }

    public User toEntity(UserCreateDto userCreateDto) {
        return modelMapper.map(userCreateDto, User.class);
    }
}
