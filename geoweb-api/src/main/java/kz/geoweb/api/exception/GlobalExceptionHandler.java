package kz.geoweb.api.exception;

import kz.geoweb.api.utils.LanguageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashSet;
import java.util.Set;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

//    @ExceptionHandler(RequestNotFoundException.class)
//    public ResponseEntity<String> handleRequestNotFoundException(HttpServletRequest req,
//                                                                 RequestNotFoundException e){
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorCode.RESOURCE_NOT_FOUND.getMessage());
//    }
//
//    @ExceptionHandler(IllegalActionException.class)
//    public ResponseEntity<String> handleRequestNotFoundException(HttpServletRequest req,
//                                                                 IllegalActionException e){
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorCode.ILLEGAL_ACTION.getMessage());
//    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception,
                                                         HttpServletRequest request) {
        log.error("Exception:", exception);
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;


        return ResponseEntity.status(httpStatus).body(
                new ErrorResponse.Builder()
                        .setMessage(exception.getMessage())
                        .setError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .setPath(request.getRequestURI())
                        .build()
        );
    }

    @ExceptionHandler({CustomException.class, NotFoundException.class})
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException exception,
                                                               HttpServletRequest request) {
        log.warn("CustomException", exception);
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;


        return ResponseEntity.status(httpStatus).body(
                new ErrorResponse.Builder()
                        .setMessage(exception.getMessage())
                        .setError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .setPath(request.getRequestURI())
                        .build()
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(ForbiddenException exception,
                                                               HttpServletRequest request) {
        log.warn("ForbiddenException", exception);
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;


        return ResponseEntity.status(httpStatus).body(
                new ErrorResponse.Builder()
                        .setMessage(exception.getMessage())
                        .setError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                        .setPath(request.getRequestURI())
                        .build()
        );
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ValidationErrorResponse> handleBindException
            (BindException exception, HttpServletRequest request) {
        Set<String> invalidFields = new HashSet<>();
        ValidationErrorResponse validationErrorResponse = new ValidationErrorResponse.Builder()
                .setMessage(MessageSourceHelper.getMessage("validation.error", LanguageUtils.getLocale()))
                .setError(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .setPath(request.getRequestURI())
                .setInvalidFields(invalidFields)
                .build();

        exception.getBindingResult().getFieldErrors()
                .forEach(fieldError -> validationErrorResponse.getInvalidFields()
                        .add(fieldError.getField() + ":" + fieldError.getDefaultMessage()));

        log.warn("BindException", exception);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(validationErrorResponse);
    }
}
