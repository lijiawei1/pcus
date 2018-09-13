package org.zap.framework.util.builder;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Shin on 2015/10/21.
 */
public class MapBuilder<K, V> {

    private HashMap<K, V> kvHashMap = new HashMap<>();

    public MapBuilder() {}

    public MapBuilder(K key, V value) {
        kvHashMap.put(key, value);
    }

    public MapBuilder<K, V> put(K key, V value) {
        kvHashMap.put(key, value);
        return this;

    }

    public HashMap<K, V> toMap() {
        return kvHashMap;
    }

}
