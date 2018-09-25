package org.pcus.module.app.proxy;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("a")
public class XController {
	
	@RequestMapping("hello")
	@ResponseBody
	public ResponseEntity<Object> hello(HttpServletRequest req) {
		
		String file = "";
		try {
			file = IOUtils.toString(req.getInputStream(), "UTF-8");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		file = req.getParameter("file");
		System.out.println(file);
		return new ResponseEntity<Object>("hello", HttpStatus.ACCEPTED);
	}

}
