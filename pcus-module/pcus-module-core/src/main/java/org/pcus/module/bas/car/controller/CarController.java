package org.pcus.module.bas.car.controller;

import org.pcus.module.bas.car.entity.Car;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/bas/car")
public class CarController {
    @ResponseBody
    @RequestMapping("/a")
    public Car a() {
        return new Car("a", "b") ;
    }
}
