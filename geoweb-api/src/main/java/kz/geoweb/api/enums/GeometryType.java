package kz.geoweb.api.enums;

public enum GeometryType {
    POINT,
    LINESTRING,
    POLYGON,
    MULTIPOINT,
    MULTILINESTRING,
    MULTIPOLYGON,
    RASTER;

    public static GeometryType fromIndex(int x) {
        return switch (x) {
            case 1 -> POINT;
            case 2 -> LINESTRING;
            case 3 -> POLYGON;
            case 4 -> MULTIPOINT;
            case 5 -> MULTILINESTRING;
            case 6 -> MULTIPOLYGON;
            case 7 -> RASTER;
            default -> null;
        };
    }
}
