package kz.geoweb.api.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String accessSecret;
    private Integer accessExpiryMinutes;
    private String refreshSecret;
    private Integer refreshExpiryDays;
}
