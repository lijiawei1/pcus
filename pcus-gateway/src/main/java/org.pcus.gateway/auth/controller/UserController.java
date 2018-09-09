package org.pcus.gateway.auth.controller;

import org.pcus.gateway.auth.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController {
    @RequestMapping("/a")
    @ResponseBody
    public String put() {
        return "a";
    }

    @RequestMapping("/list")
    public String listUser(Model model) {
        List<User> userList = new ArrayList<User>();
        for (int i = 0; i < 10; i++) {
            userList.add(new User(i, "张三" + i, 20 + i, "中国广州"));
        }

        model.addAttribute("users", userList);
        return "/user/list";
    }
}
