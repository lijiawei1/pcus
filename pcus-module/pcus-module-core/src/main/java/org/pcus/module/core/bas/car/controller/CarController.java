package org.pcus.module.core.bas.car.controller;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.pcus.module.core.bas.car.entity.Car;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/bas/car")
public class CarController {
    @ResponseBody
    @RequestMapping("/a")
    public Car a(HttpServletRequest request, HttpServletResponse response) {

        //Enumeration<String> headerNames = request.getHeaderNames();
        //while (headerNames.hasMoreElements()) {
        //    String s = headerNames.nextElement();
        //    System.out.println(s + " : " + request.getHeader(s));
        //
        //}

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println(cookie.getName() + " : " + cookie.getValue());
            }
        }
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        System.out.println(authentication.getPrincipal());

        HttpSession session = request.getSession(false);

        return new Car("a", "b") ;
    }
}
