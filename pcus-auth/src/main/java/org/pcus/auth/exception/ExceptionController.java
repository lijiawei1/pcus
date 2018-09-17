package org.pcus.auth.exception;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.exception.BusinessException;

@ControllerAdvice
public class ExceptionController {

    Logger logger = LoggerFactory.getLogger(ExceptionController.class);

    /**
     * 异常页面控制
     *
     * @param runtimeException
     */
    @ResponseBody
    @ExceptionHandler(RuntimeException.class)
    public Object runtimeExceptionHandler(RuntimeException runtimeException) {

        String localizedMessage = runtimeException.getLocalizedMessage();
        logger.error("系统异常" + localizedMessage, runtimeException);

        if (runtimeException instanceof BusinessException) {
            BusinessException be = (BusinessException) runtimeException;
            return new PageResult(true, be.getCode(), be.getMessage(), null);
        }

        return new PageResult(true, runtimeException.getMessage(), null);
    }

}
