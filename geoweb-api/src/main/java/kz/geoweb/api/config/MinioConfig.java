package kz.geoweb.api.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import kz.geoweb.api.config.properties.MinioProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

import static kz.geoweb.api.utils.CommonConstants.MINIO_BUCKET_COMMON;
import static kz.geoweb.api.utils.CommonConstants.MINIO_BUCKET_FEATURE_FILES;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class MinioConfig {
    private final MinioProperties minioProperties;

    private final List<String> buckets = List.of(
            MINIO_BUCKET_COMMON,
            MINIO_BUCKET_FEATURE_FILES
    );

    @Bean
    public MinioClient minioClient() {
        MinioClient minioClient = MinioClient.builder()
                .endpoint(minioProperties.getHost() + ":" + minioProperties.getPort())
                .credentials(minioProperties.getUser(), minioProperties.getPassword())
                .build();
        buckets.forEach(bucket -> {
            try {
                boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
                if (!bucketExists) {
                    minioClient.makeBucket(MakeBucketArgs
                            .builder()
                            .bucket(bucket)
                            .build());
                }
            } catch (Exception e) {
                log.error("Error while creating bucket", e);
            }
        });
        return minioClient;
    }
}
