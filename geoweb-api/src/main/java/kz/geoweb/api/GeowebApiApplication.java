package kz.geoweb.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan("kz.geoweb.api.config.properties")
public class GeowebApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeowebApiApplication.class, args);
    }

}
