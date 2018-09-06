package org.pcus.movie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@EnableDiscoveryClient
@SpringBootApplication
public class PcusMovieApplication {
    public static void main(String[] args) {
        SpringApplication.run(PcusMovieApplication.class);
    }

    @ResponseBody
    @RequestMapping("/ma")
    public String a() {
        return "movie";
    }
}
