package kz.geoweb.api.exception;

import kz.geoweb.api.utils.LanguageUtils;

public class NotFoundException extends RuntimeException {
    private String messageKey;
    final transient String[] args;

    public NotFoundException(String messageKey,
                           String... args) {
        super(MessageSourceHelper.getMessage(messageKey, LanguageUtils.getLocale(), args));
        this.messageKey = messageKey;
        this.args = args;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public void setMessageKey(String messageKey) {
        this.messageKey = messageKey;
    }

    public String[] getArgs() {
        return args;
    }
}