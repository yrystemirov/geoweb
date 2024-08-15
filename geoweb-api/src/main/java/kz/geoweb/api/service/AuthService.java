package kz.geoweb.api.service;

import io.jsonwebtoken.Claims;
import kz.geoweb.api.dto.LoginDto;
import kz.geoweb.api.dto.RefreshTokenDto;
import kz.geoweb.api.dto.TokenResponseDto;

public interface AuthService {
    TokenResponseDto login(LoginDto loginDto);
    TokenResponseDto refreshToken(RefreshTokenDto refreshTokenDto);
    Claims validateAccessToken(String accessToken);
}
