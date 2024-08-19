package kz.geoweb.api.exception;

public class ErrorResponse {

    private String message;
    private String error;
    private String path;

    public static class Builder {

        private String message;
        private String error;
        private String path;

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

        public ErrorResponse build() {
            return new ErrorResponse(message, error, path);
        }
    }

    public ErrorResponse(String message,
                         String error,
                         String path) {
        this.message = message;
        this.error = error;
        this.path = path;
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
}
