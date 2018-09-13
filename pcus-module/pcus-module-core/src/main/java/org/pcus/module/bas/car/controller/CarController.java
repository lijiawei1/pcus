package org.pcus.module.bas.car.controller;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.pcus.module.bas.car.entity.Car;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;

@Controller
@RequestMapping("/bas/car")
public class CarController {
    @ResponseBody
    @RequestMapping("/a")
    public Car a(HttpServletRequest request, HttpServletResponse response) {

        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String s = headerNames.nextElement();
            System.out.println(s + " : " + request.getHeader(s));

        }
        return new Car("a", "b") ;
    }
}
