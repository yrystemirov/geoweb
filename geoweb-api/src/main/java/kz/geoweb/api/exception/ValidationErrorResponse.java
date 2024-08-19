package kz.geoweb.api.exception;

import java.util.HashSet;
import java.util.Set;

public class ValidationErrorResponse {

    private String message;
    private String error;
    private String path;
    private Set<String> invalidFields = new HashSet<>();

    public static class Builder {

        private String message;
        private String error;
        private String path;
        private Set<String> invalidFields = new HashSet<>();

        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setError(String error) {
            this.error = error;
            return this;
        }

        public Builder setPath(String path) {
            this.path = path;
            return this;
        }

        public Builder setInvalidFields(Set<String> invalidFields) {
            this.invalidFields = invalidFields;
            return this;
        }

        public ValidationErrorResponse build() {
            return new ValidationErrorResponse(message, error, path, invalidFields);
        }
    }

    public ValidationErrorResponse(String message,
                                   String error,
                                   String path,
                                   Set<String> invalidFields) {
        this.message = message;
        this.error = error;
        this.path = path;
        this.invalidFields = invalidFields;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Set<String> getInvalidFields() {
        return invalidFields;
    }

    public void setInvalidFields(Set<String> invalidFields) {
        this.invalidFields = invalidFields;
    }
}
