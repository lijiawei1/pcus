package org.zap.framework.module.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.LigerGridPager;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.sys.entity.Message;
import org.zap.framework.module.sys.service.MessageService;

@RestController("/sys/message")
public class MessageController extends BaseController {

    @Autowired
    MessageService messageService;

    /**
     * 列表
     * @param req
     * @param where
     * @return
     */
    @RequestMapping("/loadGrid")
    public LigerGridPager<Message> loadGrid(LigerGridPager req, String where) {
        return new LigerGridPager<>(messageService.page(Message.class, req, where));
    }

    @RequestMapping("/loadSendeeGrid")
    public LigerGridPager<Message> loadSendeeGrid(LigerGridPager req, String where) {
        return null;
    }

    @RequestMapping("add")
    public PageResult add(Message message) {
        return null;
    }

    @RequestMapping("update")
    public PageResult update(Message message) {
        messageService.update(message);
        return PageResult.success();
    }

    @RequestMapping("del")
    public PageResult del(Message message) {
        messageService.delete(message);
        return PageResult.success();
    }

    @RequestMapping("addBatch")
    public PageResult addBatch(Message[] messages){
        messageService.insertArray(messages, false);
        return PageResult.success();
    }

    @RequestMapping("delBatch")
    public PageResult delBatch(Message[] messages) {
        messageService.deleteArray(messages);
        return PageResult.success();
    }


}
