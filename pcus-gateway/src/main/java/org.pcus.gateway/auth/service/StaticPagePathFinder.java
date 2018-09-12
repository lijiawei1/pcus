package org.pcus.gateway.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StaticPagePathFinder {
    private ResourcePatternResolver resourcePatternResolver;

    @Autowired
    public StaticPagePathFinder(ResourcePatternResolver resourcePatternResolver) {
        this.resourcePatternResolver = resourcePatternResolver;
    }

    public static class PagePaths {
        private String filePath;
        private String urlPath;

        public PagePaths(String urlPath, String filePath) {
            this.filePath = filePath;  //实际的资源路径
            this.urlPath = urlPath;   //请求的资源路径
        }

        public String getFilePath() {
            return this.filePath;
        }

        public String getUrlPath() {
            return this.urlPath;
        }

        @Override
        public String toString() {
            return this.getUrlPath() + ";" + this.getFilePath();
        }
    }

    public List<PagePaths> findPath() throws IOException {
        Resource baseResource = resourcePatternResolver.getResource("classpath:/templates");
        String baseUrl = baseResource.getURL().getPath();
        Resource[] resources = resourcePatternResolver.getResources("classpath:/templates/**/*.html");
        List<PagePaths> list = new ArrayList<>();
        for (Resource resource : resources) {
            list.add(new PagePaths(buildRequestMapping(resource.getURL().getPath()), relativeFliePath(baseUrl, resource)));
        }
        return list;
    }

    private String relativeFliePath(String basePath, Resource resource) throws IOException {
        return resource.getURL().getPath().substring(basePath.length()).replace(".html", "");
    }

    private String buildRequestMapping(String filePath) {
        return filePath.substring(filePath.lastIndexOf("/")).replace(".html", "");
    }

}
