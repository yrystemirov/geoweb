package kz.geoweb.api.utils;

import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.exception.CustomException;

import java.util.Map;

import static kz.geoweb.api.enums.AttrType.*;

public class PostgresUtils {
    private static final Map<String, String> TYPE_MAPPING = Map.ofEntries(
            // Числовые типы
            Map.entry("smallint", BIGINT.name()),
            Map.entry("int2", BIGINT.name()),
            Map.entry("integer", BIGINT.name()),
            Map.entry("int", BIGINT.name()),
            Map.entry("int4", BIGINT.name()),
            Map.entry("bigint", BIGINT.name()),
            Map.entry("int8", BIGINT.name()),
            Map.entry("serial", BIGINT.name()),
            Map.entry("bigserial", BIGINT.name()),

            // Числа с плавающей точкой
            Map.entry("decimal", NUMERIC.name()),
            Map.entry("numeric", NUMERIC.name()),
            Map.entry("real", NUMERIC.name()),
            Map.entry("float4", NUMERIC.name()),
            Map.entry("double precision", NUMERIC.name()),
            Map.entry("float8", NUMERIC.name()),

            // Текстовые типы
            Map.entry("char", TEXT.name()),
            Map.entry("character", TEXT.name()),
            Map.entry("varchar", TEXT.name()),
            Map.entry("character varying", TEXT.name()),
            Map.entry("text", TEXT.name()),

            // Логические типы
            Map.entry("bool", BOOLEAN.name()),
            Map.entry("boolean", BOOLEAN.name()),

            // Даты и время
            Map.entry("date", TIMESTAMP.name()),
            Map.entry("timestamp", TIMESTAMP.name()),
            Map.entry("timestamp without time zone", TIMESTAMP.name()),
            Map.entry("timestamp with time zone", TIMESTAMP.name()),
            Map.entry("timestamptz", TIMESTAMP.name())
    );

    public static AttrType getAttrTypeFromPostgresType(String postgresType) {
        if (postgresType == null || postgresType.isEmpty()) {
            throw new CustomException("Postgres type cannot be null or empty");
        }
        String postgresTypeLower = postgresType.toLowerCase().trim();
        String attrTypeString = TYPE_MAPPING.get(postgresTypeLower);
        if (attrTypeString == null) return TEXT;
        return AttrType.valueOf(attrTypeString);
    }
}
