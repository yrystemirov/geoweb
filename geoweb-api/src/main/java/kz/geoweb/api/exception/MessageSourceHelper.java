package kz.geoweb.api.exception;

import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.Locale;

public class MessageSourceHelper {

    private MessageSourceHelper() {
    }

    private static MessageSource messageSource;
    private static MessageSource messageSourceCommon;

    public static String getMessage(String messageKey,
                                    Locale locale,
                                    String... arguments) {
        return getMessageSource().getMessage(messageKey, arguments, messageKey, locale);
    }

    public static MessageSource getMessageSource() {
        if (messageSource == null) {
            ResourceBundleMessageSource RSBMessageSource = new ResourceBundleMessageSource();
            RSBMessageSource.setBasename("messages");
            RSBMessageSource.setDefaultEncoding("UTF-8");
            messageSource = RSBMessageSource;
        }
        return messageSource;
    }
}
