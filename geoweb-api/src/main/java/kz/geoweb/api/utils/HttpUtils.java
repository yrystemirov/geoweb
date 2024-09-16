package kz.geoweb.api.utils;

import org.springframework.http.MediaType;

import java.net.URLEncoder;
import org.springframework.http.HttpHeaders;
import java.nio.charset.StandardCharsets;

public class HttpUtils {
    public static HttpHeaders getDownloadHeaders(String filename, String contentType, Integer size) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setContentLength(size);
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8);
        headers.set(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + encoded + "\"");
        return headers;
    }
}
