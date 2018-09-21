package org.pcus.gateway.auth.itf;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.auth.entity.UserDTO;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(value = "pcus-auth")
public interface IAuthService {

    @GetMapping(value = "/auth/privilege/loadResource")
    Map<String, Set<String>> loadResource();

    @GetMapping(value = "/auth/user/loadUserByUsername")
    PageResult<UserDTO> loadUserByUsername(@RequestParam(value = "username") String username);

    @GetMapping(value = "/admin/loadButtons")
    List<String> loadButtons(@RequestParam(value = "parentPageNo") String parentPageNo);

    @GetMapping(value = "/admin/loadButtonsByType")
    List<String> loadButtonsByType(@RequestParam(value = "menuCode") String menuCode,
                                       @RequestParam(value = "userid") String userid,
                                       @RequestParam(value = "admin") boolean admin,
                                       @RequestParam(value = "type") String type
    );
}
