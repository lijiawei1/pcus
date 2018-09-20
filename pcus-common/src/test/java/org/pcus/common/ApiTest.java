package org.pcus.common;

import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;

@Slf4j
public class ApiTest {
    @Test
    public void test() {
        String regx = "(/pcus/|/)";
        String expected = "bas/client/list/html";
        Assert.assertEquals(expected, "/pcus/bas/client/list/html".replaceFirst(regx, ""));
        Assert.assertEquals(expected, "/bas/client/list/html".replaceFirst(regx, ""));
    }
}
