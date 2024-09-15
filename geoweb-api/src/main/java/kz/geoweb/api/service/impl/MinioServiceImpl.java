package kz.geoweb.api.service.impl;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import kz.geoweb.api.config.properties.MinioProperties;
import kz.geoweb.api.dto.MinioFileDto;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.MinioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioServiceImpl implements MinioService {
    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @Override
    public MinioFileDto upload(byte[] bytes, String filename, String bucket) {
        return upload(bytes, filename, bucket, UUID.randomUUID().toString());
    }

    @Override
    public MinioFileDto upload(byte[] bytes, String filename, String bucket, String object) {
        try {
            ByteArrayInputStream is = new ByteArrayInputStream(bytes);
            ObjectWriteResponse response = minioClient.putObject(PutObjectArgs
                    .builder()
                    .object(object)
                    .bucket(bucket)
                    .stream(is, -1, 10485760)
                    .build());
            return new MinioFileDto(response.bucket(), response.object(), filename);
        } catch (Exception e) {
            log.error("Error while uploading file", e);
            throw new CustomException("minio.upload.error", e.getLocalizedMessage());
        }
    }

    @Override
    public byte[] download(String object, String bucket) {
        try (InputStream inputStream = minioClient.getObject(GetObjectArgs
                .builder()
                .bucket(bucket)
                .object(object)
                .build());
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            return outputStream.toByteArray();
        } catch (Exception e) {
            log.error("Error while downloading file", e);
            throw new CustomException("minio.download.error", e.getLocalizedMessage());
        }
    }
}
