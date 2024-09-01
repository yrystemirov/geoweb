package kz.geoweb.api.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "geoserver")
public class GeoserverProperties {
    private String url;
    private String username;
    private String password;
    private String workspace;
    private String datastore;
}
