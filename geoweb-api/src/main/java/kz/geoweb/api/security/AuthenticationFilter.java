package kz.geoweb.api.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kz.geoweb.api.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.IOException;
import java.util.List;

public class AuthenticationFilter implements Filter {
    private AuthService authService;

    private final List<String> allowedUrls = List.of(
            "api-docs",
            "swagger-ui",
            "auth/token",
            "open-api"
    );

    @Override
    public void init(FilterConfig filterConfig) {
        WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(filterConfig.getServletContext());
        authService = ctx.getBean(AuthService.class);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        if (allowedUrls.stream().anyMatch(path::contains)) {
            chain.doFilter(request, response);
            return;
        }
        String authHeader = httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = authService.validateAccessToken(token);
            if (claims != null) {
                UserContext context = new UserContext();
                context.setUsername(claims.getSubject());
                UserContextHolder.setCurrentUser(context);
                try {
                    chain.doFilter(request, response);
                    return;
                } finally {
                    UserContextHolder.clear();
                }
            }
        }
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.getWriter().write("Unauthorized");
    }

    @Override
    public void destroy() {
    }
}
