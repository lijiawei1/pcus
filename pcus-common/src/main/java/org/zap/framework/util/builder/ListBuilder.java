package org.zap.framework.util.builder;

import org.apache.commons.lang.ArrayUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Shin on 2015/10/22.
 */
public class ListBuilder<T> {

    private List<T> arrayList = new ArrayList<>();

    public ListBuilder() {}

    public ListBuilder(T... elements) {
        Collections.addAll(arrayList, elements);
    }

    public ListBuilder<T> add(T ... elements) {
        Collections.addAll(arrayList, elements);
        return this;
    }

    public List<T> toList() {
        return arrayList;
    }

    public Object[] toObjectArray() {
        return arrayList.toArray(new Object[arrayList.size()]);
    }

}
