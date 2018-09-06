package org.pcus.gateway.auth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {
    @RequestMapping("/a")
    @ResponseBody
    public String put() {
        return "a";
    }
}
