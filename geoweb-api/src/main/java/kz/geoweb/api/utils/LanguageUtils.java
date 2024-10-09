package kz.geoweb.api.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Locale;

public class LanguageUtils {
    public static final String LOCALE_EN = "en";
    public static final String LOCALE_KK = "kk";
    private static final String DEFAULT_LOCALE_CODE = "ru";

    public static Locale getLocale() {
        Locale locale = null;
        if (RequestContextHolder.getRequestAttributes() != null) {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            Locale requestLocale = request.getLocale();
            if (requestLocale != null) {
                locale = requestLocale;
            }
        }
        if (locale == null) {
            locale = new Locale(DEFAULT_LOCALE_CODE);
        }
        return locale;
    }
}