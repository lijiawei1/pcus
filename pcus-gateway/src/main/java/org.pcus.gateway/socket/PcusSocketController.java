package org.pcus.gateway.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.zap.framework.common.entity.PageResult;

import java.security.Principal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class PcusSocketController {

    @Autowired
    SimpMessageSendingOperations template;

    @MessageMapping("/helloGreetings")
    @SendTo("/topic/greetings")
    public PageResult greeting(PageResult message, Principal principal) {
        System.out.println("receiving " + message.getMessage());
        System.out.println("connecting successfully.");
        return PageResult.success("Hello, " + message.getMessage() + "! (" + principal.getName() + " is online)", null);
    }

    @MessageMapping("/helloTom")
    @SendToUser("/queue/notifications")
    public PageResult handleSpittle(Principal principal, PageResult req) {
        req.setData(principal.getName());
        return req;
    }

    @SubscribeMapping({"/marco"})
    public PageResult handleSubscription() {
        return PageResult.success("Polo!", null);
    }

    // 实现用户提及功能的正则表达式
    private Pattern pattern = Pattern.compile("\\@(\\S+)");

    /**
     * 广播消息到指定用户名
     *
     * @param spittle
     */
    @RequestMapping(path = "/broadcast", method = RequestMethod.POST)
    @ResponseBody
    public PageResult broadcastByUsername(PageResult spittle) {
        template.convertAndSend("/topic/feed", spittle);
        Matcher matcher = pattern.matcher(spittle.getMessage());
        if (matcher.find()) {
            String username = matcher.group(1);
            // 发送提醒给用户.
            template.convertAndSendToUser(
                    username, "/queue/notifications",
                    PageResult.success("有人给你发消息了", "有人给你发消息了"));
        }

        return PageResult.success();
    }
}
