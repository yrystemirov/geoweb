package kz.geoweb.api.service.impl;

import io.jsonwebtoken.*;
import kz.geoweb.api.config.properties.JwtProperties;
import kz.geoweb.api.dto.LoginDto;
import kz.geoweb.api.dto.RefreshTokenDto;
import kz.geoweb.api.dto.TokenResponseDto;
import kz.geoweb.api.entity.RefreshToken;
import kz.geoweb.api.entity.User;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.repository.RefreshTokenRepository;
import kz.geoweb.api.repository.UserRepository;
import kz.geoweb.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProperties jwtProperties;

    private static final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256;

    @Override
    @Transactional
    public TokenResponseDto login(LoginDto loginDto) {
        User user = userRepository.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new CustomException("user.not_found"));
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new CustomException("password.invalid");
        }
        return generateTokens(user);
    }

    @Override
    @Transactional
    public TokenResponseDto refreshToken(RefreshTokenDto refreshTokenDto) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository
                .findByTokenAndExpiryGreaterThan(refreshTokenDto.getRefreshToken(), LocalDateTime.now());
        if (refreshTokenOptional.isPresent()) {
            RefreshToken refreshToken = refreshTokenOptional.get();
            User user = userRepository.findByUsername(refreshToken.getUsername())
                    .orElseThrow(() -> new CustomException("user.not_found"));
            return generateTokens(user);
        } else {
            throw new CustomException("refresh_token.not_found_or_expired");
        }
    }

    private String generateJwtToken(User user, Instant expiry) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setExpiration(Date.from(expiry))
                .signWith(SIGNATURE_ALGORITHM, jwtProperties.getAccessSecret())
                .compact();
    }

    private TokenResponseDto generateTokens(User user) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime accessTokenExpiry = currentDate.plusMinutes(jwtProperties.getAccessExpiryMinutes());
        Instant accessTokenExpiryInstant = Instant.from(accessTokenExpiry.atZone(ZoneId.systemDefault()));
        LocalDateTime refreshTokenExpiry = currentDate.plusDays(jwtProperties.getRefreshExpiryDays());
        Instant refreshTokenExpiryInstant = Instant.from(refreshTokenExpiry.atZone(ZoneId.systemDefault()));
        String accessToken = generateJwtToken(user, accessTokenExpiryInstant);
        String refreshToken = generateJwtToken(user, refreshTokenExpiryInstant);
        refreshTokenRepository.removeByUsername(user.getUsername());
        RefreshToken refreshTokenEntity = new RefreshToken(user.getUsername(), refreshToken, refreshTokenExpiry);
        refreshTokenRepository.save(refreshTokenEntity);
        return new TokenResponseDto(accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry);
    }

    @Override
    public Claims validateAccessToken(String accessToken) {
        return validateToken(accessToken, jwtProperties.getAccessSecret());
    }

    private Claims validateToken(String token, String secret) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException expEx) {
            log.error("Token expired", expEx);
        } catch (UnsupportedJwtException unsEx) {
            log.error("Unsupported jwt", unsEx);
        } catch (MalformedJwtException mjEx) {
            log.error("Malformed jwt", mjEx);
        } catch (SignatureException sEx) {
            log.error("Invalid signature", sEx);
        } catch (Exception e) {
            log.error("invalid token", e);
        }
        return null;
    }
}
