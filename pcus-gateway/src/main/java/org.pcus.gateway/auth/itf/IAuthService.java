package org.pcus.gateway.auth.itf;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.auth.entity.UserDTO;

import java.util.Map;
import java.util.Set;

@FeignClient(value = "pcus-auth")
public interface IAuthService {

    @GetMapping(value = "/auth/privilege/loadResource")
    Map<String, Set<String>> loadResource();

    @GetMapping(value = "/auth/user/loadUserByUsername")
    PageResult<UserDTO> loadUserByUsername(@RequestParam(value = "username") String username);
}
