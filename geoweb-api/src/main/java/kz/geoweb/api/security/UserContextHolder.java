package kz.geoweb.api.security;

public class UserContextHolder {
    private static final ThreadLocal<UserContext> userContext = new ThreadLocal<>();

    public static void setCurrentUser(UserContext context) {
        userContext.set(context);
    }

    public static UserContext getCurrentUser() {
        return userContext.get();
    }

    public static void clear() {
        userContext.remove();
    }
}
