package kz.geoweb.api.controller;

import kz.geoweb.api.dto.LoginDto;
import kz.geoweb.api.dto.RefreshTokenDto;
import kz.geoweb.api.dto.TokenResponseDto;
import kz.geoweb.api.enums.RoleEnum;
import kz.geoweb.api.service.AuthService;
import kz.geoweb.api.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final PermissionService permissionService;
    private final AuthService authService;

    @PostMapping("/token")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        TokenResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenDto refreshTokenDto) {
        TokenResponseDto response = authService.refreshToken(refreshTokenDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        permissionService.hasAnyRole(RoleEnum.ADMIN);
        return ResponseEntity.ok("good");
    }
}
