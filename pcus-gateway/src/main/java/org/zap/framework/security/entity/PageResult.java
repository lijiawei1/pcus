package org.zap.framework.security.entity;

/**
 * 杩斿洖缁撴灉
 * @author Shin
 *
 */
public class PageResult<T> {

	public PageResult(){}

	public static PageResult error() {
		return new PageResult(true, "", null);
	}
	
	public static PageResult error(String msg) {
		return new PageResult(true, msg, null);
	}
	
	public static PageResult success(String code, String msg, Object data) {
		return new PageResult(false, msg, data);
	}

	public static PageResult success(String msg, Object data) {
		return new PageResult(false, msg, data);
	}


	public static PageResult success() {
		return new PageResult(false, 200, "", null);
	}

	public PageResult(boolean err, String msg, T data) {
		this.error = err;
		this.message = msg;
		this.data = data;
		this.code = 200;
	}

	public PageResult(boolean err, int code, String msg, T data) {
		this.error = err;
		this.message = msg;
		this.data = data;
		this.code = code;
	}

	/**
	 * 返回HttpSevletResponse编码
	 */
	private int code;
	/**
	 * 是否错误
	 */
	private boolean error;
	/**
	 * 描述
	 */
	private String message;
	/**
	 * 数据
	 */
	private T data;

	public boolean isError() {
		return error;
	}

	public void setError(boolean error) {
		this.error = error;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}
}
