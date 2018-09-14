package org.zap.framework.module.sms.tool;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

/**
 * JAVA接口信息（短信，彩信）调用API
 */
public class SmsClientAccessTool {

	// 发送短信调用的后缀地址
	public static String SEND_EXT = "sms.aspx";
	// 取回执的后缀地址
	public static String STATUS_EXT = "statusApi.aspx";
	// 取回复的后缀地址
	public static String REPLY_EXT = "callApi.aspx";

	private static SmsClientAccessTool smsClientToolInstance;

	/**
	 * 采用单列方式来访问操作
	 */
	public static synchronized SmsClientAccessTool getInstance() {

		if (smsClientToolInstance == null) {
			smsClientToolInstance = new SmsClientAccessTool();
		}
		return smsClientToolInstance;
	}


	/**
	 * @param url      ：必填--发送连接地址URL
	 * @param userid   ：必填--用户ID，为数字
	 * @param account  ：必填--用户帐号
	 * @param password ：必填--用户密码
	 * @param mobile   ：必填--发送的手机号码，多个可以用逗号隔比如:  13512345678,13612345678
	 * @param content  ：必填--实际发送内容，
	 * @param send_id  ：必填--发送人ID，
	 * @return 返回发送之后收到的信息
	 */
	public static String sendSms(String url, String userid, String account, String password, String mobile, String content,
                                 String send_id, String send_corp_id, String send_corp_name) {

		String action = null;
		String sendTime = "";
		String checkContent = null;
		String taskName = null;
		String countNumber = null;
		String mobileNumber = null;
		String telephoneNumber = null;
		String sendType = "POST";
		String codingType = "UTF-8";
		String backEncodType = "UTF-8";

		try {
			if (codingType == null || codingType.equals("")) {
				codingType = "UTF-8";
			}
			if (backEncodType == null || backEncodType.equals("")) {
				backEncodType = "UTF-8";
			}
			StringBuffer send = new StringBuffer();
			if (action != null && !action.equals("")) {
				send.append("action=").append(action);
			} else {
				send.append("action=send");
			}

			send.append("&userid=").append(userid);
			send.append("&account=").append(URLEncoder.encode(account, codingType));
			send.append("&password=").append(URLEncoder.encode(password, codingType));
			send.append("&mobile=").append(mobile);
			send.append("&content=").append(URLEncoder.encode(content, codingType));

			//新增三个业务字段
			if (send_id != null && !send_id.equals("")) {
				send.append("&send_id=").append(URLEncoder.encode(send_id, codingType));
			}
			if (send_corp_id != null && !send_corp_id.equals("")) {
				send.append("&send_corp_id=").append(URLEncoder.encode(send_corp_id, codingType));
			}
			if (send_corp_name != null && !send_corp_name.equals("")) {
				send.append("&send_corp_name=").append(URLEncoder.encode(send_corp_name, codingType));
			}

			if (sendTime != null && !sendTime.equals("")) {
				send.append("&sendTime=").append(URLEncoder.encode(sendTime, codingType));
			}
			if (checkContent != null && !checkContent.equals("")) {
				send.append("&checkContent=").append(checkContent);
			}
			if (taskName != null && !taskName.equals("")) {
				send.append("&taskName=").append(URLEncoder.encode(taskName, codingType));
			}
			if (countNumber != null && !countNumber.equals("")) {
				send.append("&countNumber=").append(countNumber);
			}
			if (mobileNumber != null && !mobileNumber.equals("")) {
				send.append("&mobileNumber=").append(mobileNumber);
			}
			if (telephoneNumber != null && !telephoneNumber.equals("")) {
				send.append("&telephoneNumber=").append(telephoneNumber);
			}

			if (sendType != null && (sendType.toLowerCase()).equals("get")) {
				return SmsClientAccessTool.getInstance().doAccessHTTPGet(url + "?" + send.toString(), backEncodType);
			} else {
				return SmsClientAccessTool.getInstance().doAccessHTTPPost(url, send.toString(), backEncodType);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "未发送，编码异常";
		}
	}

	/**
	 * @param url      ：必填--发送连接地址URL
	 * @param userid   ：必填--用户ID，为数字
	 * @param account  ：必填--用户帐号
	 * @param password ：必填--用户密码
	 * @return 返回状态报告
	 */
	public static String queryStatusReport(String url, String userid, String account, String password) {

		try {

			StringBuffer sendParam = new StringBuffer();
			sendParam.append("action=query");
			sendParam.append("&userid=").append(userid);
			sendParam.append("&account=").append(URLEncoder.encode(account, "UTF-8"));
			sendParam.append("&password=").append(URLEncoder.encode(password, "UTF-8"));

			return SmsClientAccessTool.getInstance().doAccessHTTPPost(url, sendParam.toString(), "UTF-8");

		} catch (Exception e) {
			e.printStackTrace();
			return "未发送，异常-->" + e.getMessage();
		}
	}

	/**
	 * <p>
	 * POST方法
	 * </p>
	 *
	 * @param sendUrl       ：访问URL
	 * @param sendParam     ：参数串
	 * @param backEncodType ：返回的编码
	 * @return
	 */
	public String doAccessHTTPPost(String sendUrl, String sendParam,
                                   String backEncodType) {

		StringBuffer receive = new StringBuffer();
		BufferedWriter wr = null;
		try {
			if (backEncodType == null || backEncodType.equals("")) {
				backEncodType = "UTF-8";
			}

			URL url = new URL(sendUrl);
			HttpURLConnection URLConn = (HttpURLConnection) url
					.openConnection();

			URLConn.setDoOutput(true);
			URLConn.setDoInput(true);
			((HttpURLConnection) URLConn).setRequestMethod("POST");
			URLConn.setUseCaches(false);
			URLConn.setAllowUserInteraction(true);
			HttpURLConnection.setFollowRedirects(true);
			URLConn.setInstanceFollowRedirects(true);

			URLConn.setRequestProperty("Content-Type",
					"application/x-www-form-urlencoded;charset=UTF-8");
			URLConn.setRequestProperty("Content-Length", String
					.valueOf(sendParam.getBytes().length));

			DataOutputStream dos = new DataOutputStream(URLConn
					.getOutputStream());
			dos.writeBytes(sendParam);

			BufferedReader rd = new BufferedReader(new InputStreamReader(
					URLConn.getInputStream(), backEncodType));
			String line;
			while ((line = rd.readLine()) != null) {
				receive.append(line).append("\r\n");
			}
			rd.close();
		} catch (java.io.IOException e) {
			receive.append("访问产生了异常-->").append(e.getMessage());
			e.printStackTrace();
		} finally {
			if (wr != null) {
				try {
					wr.close();
				} catch (IOException ex) {
					ex.printStackTrace();
				}
				wr = null;
			}
		}

		return receive.toString();
	}

	public String doAccessHTTPGet(String sendUrl, String backEncodType) {

		StringBuffer receive = new StringBuffer();
		BufferedReader in = null;
		try {
			if (backEncodType == null || backEncodType.equals("")) {
				backEncodType = "UTF-8";
			}

			URL url = new URL(sendUrl);
			HttpURLConnection URLConn = (HttpURLConnection) url
					.openConnection();

			URLConn.setDoInput(true);
			URLConn.setDoOutput(true);
			URLConn.connect();
			URLConn.getOutputStream().flush();
			in = new BufferedReader(new InputStreamReader(URLConn
					.getInputStream(), backEncodType));

			String line;
			while ((line = in.readLine()) != null) {
				receive.append(line).append("\r\n");
			}

		} catch (IOException e) {
			receive.append("访问产生了异常-->").append(e.getMessage());
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (java.io.IOException ex) {
					ex.printStackTrace();
				}
				in = null;

			}
		}

		return receive.toString();
	}

	/**
	 * @param url             ：必填--发送连接地址URL--比如:  http://118.145.30.35/sms.aspx
	 * @param userid          ：必填--用户ID，为数字
	 * @param account         ：必填--用户帐号
	 * @param password        ：必填--用户密码
	 * @param mobile          ：必填--发送的手机号码，多个可以用逗号隔比如:  13512345678,13612345678
	 * @param content         ：必填--实际发送内容，
	 * @param action          ：选填--访问的事件，默认为send
	 * @param sendTime        ：选填--定时发送时间，不填则为立即发送，时间格式如: 2011-11-11 11:11:11
	 * @param checkContent    ：选填--检查是否包含非法关键字，1--表示需要检查，0--表示不检查
	 * @param taskName        ：选填--任务名称，本次任务描述，100字内
	 * @param countNumber     ：选填--提交号码总数
	 * @param mobileNumber    ：选填--手机号码总数
	 * @param telephoneNumber ：选填--小灵通（和）或座机总数
	 * @param sendType        ：选填--发送方式，默认为POST
	 * @param codingType      ：选填--发送内容编码方式，默认为UTF-8
	 * @param backEncodType   ：选填--返回内容编码方式，默认为UTF-8
	 * @return 返回发送之后收到的信息
	 */
	public static String sendSms(String url, String userid, String account, String password, String mobile, String content, String action, String sendTime, String checkContent, String taskName, String countNumber, String mobileNumber,
                                 String telephoneNumber, String sendType, String codingType, String backEncodType) {

		try {
			if (codingType == null || codingType.equals("")) {
				codingType = "UTF-8";
			}
			if (backEncodType == null || backEncodType.equals("")) {
				backEncodType = "UTF-8";
			}
			StringBuffer send = new StringBuffer();
			if (action != null && !action.equals("")) {
				send.append("action=").append(action);
			} else {
				send.append("action=send");
			}

			send.append("&userid=").append(userid);
			send.append("&account=").append(URLEncoder.encode(account, codingType));
			send.append("&password=").append(URLEncoder.encode(password, codingType));
			send.append("&mobile=").append(mobile);
			send.append("&content=").append(URLEncoder.encode(content, codingType));
			if (sendTime != null && !sendTime.equals("")) {
				send.append("&sendTime=").append(URLEncoder.encode(sendTime, codingType));
			}
			if (checkContent != null && !checkContent.equals("")) {
				send.append("&checkContent=").append(checkContent);
			}
			if (taskName != null && !taskName.equals("")) {
				send.append("&taskName=").append(URLEncoder.encode(taskName, codingType));
			}
			if (countNumber != null && !countNumber.equals("")) {
				send.append("&countNumber=").append(countNumber);
			}
			if (mobileNumber != null && !mobileNumber.equals("")) {
				send.append("&mobileNumber=").append(mobileNumber);
			}
			if (telephoneNumber != null && !telephoneNumber.equals("")) {
				send.append("&telephoneNumber=").append(telephoneNumber);
			}

			if (sendType != null && (sendType.toLowerCase()).equals("get")) {
				return SmsClientAccessTool.getInstance().doAccessHTTPGet(url + "?" + send.toString(), backEncodType);
			} else {
				return SmsClientAccessTool.getInstance().doAccessHTTPPost(url, send.toString(), backEncodType);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "未发送，编码异常";
		}
	}

	/**
	 * 是否包含关键字获取方法1--必须传入必填内容
	 * 其一：发送方式，默认为POST
	 * 其二：发送内容编码方式，默认为UTF-8
	 *
	 * @param url       ：必填--发送连接地址URL--比如: http://118.145.30.35/sms.aspx
	 * @param userid    ：必填--用户ID，为数字
	 * @param account   ：必填--用户帐号
	 * @param password  ：必填--用户密码
	 * @param checkWord ：必填--需要检查的字符串--比如：这个字符串中是否包含了屏蔽字
	 * @return 返回需要查询的字符串中是否包含关键字
	 */
	public static String queryKeyWord(String url, String userid, String account, String password, String checkWord) {
		try {
			StringBuffer sendParam = new StringBuffer();
			sendParam.append("action=checkkeyword");
			sendParam.append("&userid=").append(userid);
			sendParam.append("&account=").append(
					URLEncoder.encode(account, "UTF-8"));
			sendParam.append("&password=").append(
					URLEncoder.encode(password, "UTF-8"));
			if (checkWord != null && !checkWord.equals("")) {
				sendParam.append("&content=").append(
						URLEncoder.encode(checkWord, "UTF-8"));
			} else {
				return "需要检查的字符串不能为空";
			}

			return SmsClientAccessTool.getInstance().doAccessHTTPPost(url,
					sendParam.toString(), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
			return "未发送，异常-->" + e.getMessage();
		}
	}
}

