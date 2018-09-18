package org.pcus.gateway.auth.itf;

import org.pcus.gateway.auth.entity.User;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.zap.framework.security.entity.PageResult;

import java.util.Map;
import java.util.Set;

@FeignClient(value = "pcus-auth")
public interface IAuthService {

    @GetMapping(value = "/auth/privilege/loadResource")
    Map<String, Set<String>> loadResource();

    @GetMapping(value = "/auth/user/loadUserByUsername")
    PageResult<User> loadUserByUsername(@RequestParam(value = "username") String username);
}
