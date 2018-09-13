package org.pcus.gateway.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.beetl.core.GroupTemplate;
import org.beetl.core.Template;
import org.beetl.ext.web.WebRenderExt;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 模板公共配置
 */
public class GlobalExt implements WebRenderExt {
    static long version = System.currentTimeMillis();
    @Override
    public void modify(Template template, GroupTemplate groupTemplate, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        template.binding("sysVersion", version);
        //应用上下文，适配之前JSP模板的${path}
        template.binding("path", "/pcus");
        //资源文件版本号，适配之前JSP模板的${applicationScope.sys_version}
        template.binding("applicationScope", new Scope(version));
    }

    @Data
    @AllArgsConstructor
    public static class Scope {
        long sys_version;
    }
}
