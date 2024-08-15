package kz.geoweb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TokenResponseDto {
    private String accessToken;
    private LocalDateTime accessTokenExpiry;
    private String refreshToken;
    private LocalDateTime refreshTokenExpiry;
}
