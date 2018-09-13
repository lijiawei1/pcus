package org.zap.framework.util;

import org.zap.framework.util.builder.ListBuilder;
import org.zap.framework.util.builder.MapBuilder;

/**
 * 集合快速构造工具类
 * Created by Shin on 2015/10/21.
 */
public class BuildUtils {

    public static <K, V> MapBuilder<K, V> mapBuilder(K key, V value) {
        return new MapBuilder<>(key, value);
    }

    public static MapBuilder<String, Object> MAP_BUILDER() {
        return new MapBuilder<>();
    }

    public static MapBuilder<String, Object> MAP_BUILDER(String key, Object value) {
        return new MapBuilder<>(key, value);
    }

    public static ListBuilder<Object> LIST_BUILDER() {
        return new ListBuilder<>();
    }

    public static ListBuilder<Object> LIST_BUILDER(Object... elements) {
        return new ListBuilder<>(elements);
    }
}
