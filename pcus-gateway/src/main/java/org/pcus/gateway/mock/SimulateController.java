package org.pcus.gateway.mock;

import org.beetl.ext.simulate.WebSimulate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/simulate")
public class SimulateController {

    @Autowired
    WebSimulate webSimulate;


    @RequestMapping("/**/*.html")
    public void simluateView(HttpServletRequest request, HttpServletResponse response) {
        webSimulate.execute(request, response);
    }

    @RequestMapping("/api/**")
    public void simluateJson(HttpServletRequest request, HttpServletResponse response) {
        webSimulate.execute(request, response);
    }
}