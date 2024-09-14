package kz.geoweb.api.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import kz.geoweb.api.config.properties.MinioProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MinioConfig {
    private final MinioProperties minioProperties;

    @Bean
    public MinioClient minioClient() {
        MinioClient minioClient = MinioClient.builder()
                .endpoint(minioProperties.getHost() + ":" + minioProperties.getPort())
                .credentials(minioProperties.getUser(), minioProperties.getPassword())
                .build();
        try {
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioProperties.getBucket()).build());
            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs
                        .builder()
                        .bucket(minioProperties.getBucket())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error while creating bucket", e);
        }
        return minioClient;
    }
}
