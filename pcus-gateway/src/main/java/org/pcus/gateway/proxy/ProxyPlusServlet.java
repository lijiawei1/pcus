package org.pcus.gateway.proxy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.message.BasicHttpEntityEnclosingRequest;
import org.apache.http.message.BasicNameValuePair;
import org.mitre.dsmiley.httpproxy.ProxyServlet;

@SuppressWarnings("serial")
public class ProxyPlusServlet extends ProxyServlet {

	protected HttpRequest newProxyRequestWithEntity(String method, String proxyRequestUri,
			HttpServletRequest servletRequest) throws IOException {
		HttpEntityEnclosingRequest eProxyRequest = new BasicHttpEntityEnclosingRequest(method, proxyRequestUri);
// Add the input entity (streamed)
//  note: we don't bother ensuring we close the servletInputStream since the container handles it
		
		eProxyRequest
				.setEntity(new InputStreamEntity(servletRequest.getInputStream()));
		
		List<NameValuePair> formparams = new ArrayList<>();
		Enumeration<String> parameterKeys = servletRequest.getParameterNames();
		while (parameterKeys.hasMoreElements()) {
			String key = parameterKeys.nextElement();
			formparams.add(new BasicNameValuePair(key, servletRequest.getParameter(key)));
		}
		if (formparams.size() > 0) {
			UrlEncodedFormEntity uefEntity = new UrlEncodedFormEntity(formparams, "UTF-8");
			eProxyRequest.setEntity(uefEntity);
		}
		
		return eProxyRequest;
	}
}
