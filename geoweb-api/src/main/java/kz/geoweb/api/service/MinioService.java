package kz.geoweb.api.service;

import kz.geoweb.api.dto.MinioFileDto;

public interface MinioService {
    MinioFileDto upload(byte[] bytes, String filename, String bucket);

    MinioFileDto upload(byte[] bytes, String filename, String bucket, String object);

    byte[] download(String object, String bucket);
}
