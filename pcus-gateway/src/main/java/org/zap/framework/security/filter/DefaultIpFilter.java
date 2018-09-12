package org.zap.framework.security.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * TODO 扩展用
 * IP过滤
 * Created by Shin on 2016/1/19.
 */
public class DefaultIpFilter extends OncePerRequestFilter {

    protected Logger logger = LoggerFactory.getLogger(DefaultIpFilter.class);

    //@Autowired
    //LogService logService;

    /**
     * 允许访问的IP列表
     */
    private Set<String> ipList = new HashSet<>();

    /**
     * IP的正则
     */
    private Pattern pattern = Pattern
            .compile("(1\\d{1,2}|2[0-4]\\d|25[0-5]|\\d{1,2})\\."
            + "(1\\d{1,2}|2[0-4]\\d|25[0-5]|\\d{1,2})\\."
            + "(1\\d{1,2}|2[0-4]\\d|25[0-5]|\\d{1,2})\\."
            + "(1\\d{1,2}|2[0-4]\\d|25[0-5]|\\d{1,2})");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //获取请求IP
        InetAddress inet = null;
        String ip = request.getRemoteAddr();
        try {
            inet = InetAddress.getLocalHost();
            if (ip.equals("127.0.0.1"))
                ip = inet.getHostAddress();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        //不在IP白名单里，
        if (!checkLoginIP(ip)) {
            response.getOutputStream().write((ip + " ip forbidden.").getBytes());
            response.getOutputStream().flush();
            return;
        }

        //其它继续
        filterChain.doFilter(request, response);

    }

    /**
     * 检查IP地址
     * @param ip
     * @return
     */
    private boolean checkLoginIP(String ip) {
        logger.debug("Allow access [{}]", ip);

        //if (logService == null) {
        //    logger.debug("LogService is null");
        //}
        return true;
    }

}
