package org.pcus.gateway.mock;

import org.beetl.core.GroupTemplate;
import org.beetl.core.exception.ScriptEvalError;
import org.beetl.ext.simulate.JsonUtil;
import org.beetl.ext.simulate.SimulateException;
import org.beetl.ext.simulate.WebSimulate;
import org.beetl.ext.web.WebRender;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class EnhanceWebSimulate extends WebSimulate {
    public EnhanceWebSimulate(GroupTemplate gt) {
        super(gt);
    }

    public EnhanceWebSimulate(GroupTemplate gt, JsonUtil jsonUtil) {
        super(gt, jsonUtil);
    }

    public EnhanceWebSimulate(GroupTemplate gt, JsonUtil jsonUtil, String base) {
        super(gt, jsonUtil, base);
    }

    public void execute(HttpServletRequest req, HttpServletResponse rsp) {
        String path = this.getValuePath(req);
        RestPath restPath = this.getRealPath(path, req.getMethod().toLowerCase());
        if (restPath == null) {
            //在没有逻辑处理的时候，直接渲染模板，
            rsp.setContentType("text/html;charset=utf-8");
            this.handleNullPath(req, rsp);
            return;
        }
        String valueFile = restPath.path;
        WebRender render = new WebRender(gt);
        Map paras = this.getScriptParas(req, rsp);
        String commonFile = getCommonValueFile(req, rsp);
        Map commonData = new HashMap(), data = new HashMap();
        try {
            if (commonFile != null && gt.getResourceLoader().exist(commonFile)) {
                commonData = gt.runScript(commonFile, paras);

            }
            paras.put("pathVars", restPath.values);
            if (valueFile != null) {
                data = gt.runScript(valueFile, paras);
            }

        } catch (ScriptEvalError e) {
            throw new SimulateException("伪模型脚本有错！", e);
        }

        commonData.putAll(data);
        if (commonData.containsKey("json")) {
            //认为是需要json请求
            rsp.setContentType("text/json; charset=utf-8");
            Object jsonData = commonData.get("json");
            if (jsonData instanceof String) {
                this.output((String) jsonData, rsp);

            } else {
                if (jsonUtil == null) {
                    throw new SimulateException("模拟属性采用了json，但没有设置JsonUtil");
                }
                String str = null;
                try {
                    str = jsonUtil.toJson(jsonData);
                } catch (Exception e) {
                    throw new SimulateException("序列化JSON出错", e);
                }
                this.output(str, rsp);

            }
            return;

        } else {
            //如果是beetl ajax请求
            String ajaxFlag = null;
            if (data.containsKey("ajax")) {
                ajaxFlag = (String) data.get("ajax");
            }

            Iterator it = commonData.keySet().iterator();
            while (it.hasNext()) {
                String key = (String) it.next();
                Object value = commonData.get(key);
                setValue(key, value, req);
            }
            String renderPath = null;
            if (commonData.containsKey("view")) {
                renderPath = (String) commonData.get("view");
            } else {
                renderPath = getRenderPath(req);
            }

            if (ajaxFlag != null) {
                renderPath = renderPath + "#" + ajaxFlag;
            }
            //模板输出中文乱码
            rsp.setContentType("text/html;charset=utf-8");
            render.render(renderPath, req, rsp);
        }


    }
}
