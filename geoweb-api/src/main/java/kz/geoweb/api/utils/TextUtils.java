package kz.geoweb.api.utils;

import java.util.Map;
import java.util.regex.Pattern;

public class TextUtils {
    private static final String REGEX_IS_CYRILLIC = ".*\\p{InCyrillic}.*";

    private static final Map<Character, String> TRANSLIT_MAP = Map.ofEntries(
            Map.entry('а', "a"),
            Map.entry('б', "b"),
            Map.entry('в', "v"),
            Map.entry('г', "g"),
            Map.entry('д', "d"),
            Map.entry('е', "e"),
            Map.entry('ё', "e"),
            Map.entry('ж', "zh"),
            Map.entry('з', "z"),
            Map.entry('и', "i"),
            Map.entry('й', "i"),
            Map.entry('к', "k"),
            Map.entry('л', "l"),
            Map.entry('м', "m"),
            Map.entry('н', "n"),
            Map.entry('о', "o"),
            Map.entry('п', "p"),
            Map.entry('р', "r"),
            Map.entry('с', "s"),
            Map.entry('т', "t"),
            Map.entry('у', "u"),
            Map.entry('ф', "f"),
            Map.entry('х', "h"),
            Map.entry('ц', "c"),
            Map.entry('ч', "ch"),
            Map.entry('ш', "sh"),
            Map.entry('щ', "sh"),
            Map.entry('ъ', ""),
            Map.entry('ы', "y"),
            Map.entry('ь', ""),
            Map.entry('э', "e"),
            Map.entry('ю', "yu"),
            Map.entry('я', "ya")
    );

    public static String transliterate(String text) {
        StringBuilder result = new StringBuilder();
        text = text.trim();
        for (char c : text.toCharArray()) {
            if (TRANSLIT_MAP.containsKey(c)) {
                result.append(TRANSLIT_MAP.get(c));
            } else if (Character.isWhitespace(c)) {
                result.append("_");
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }

    public static boolean isCyrillic(String text) {
        if (text == null || text.isBlank()) return false;
        return Pattern.matches(REGEX_IS_CYRILLIC, text);
    }
}
