package org.zap.framework.module.sys.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 系统日志
 * @author Shin
 * 
 */
@JdbcTable(value = "ZAP_SYS_LOG", alias = "SL")
public class SystemLog extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5287932768105038827L;

	@JdbcColumn
	private String url;
	
	@JdbcColumn
	private String content;
	
	@JdbcColumn
	private String method;
	
	@JdbcColumn
	private String params;
	
	@JdbcColumn
	private String agent;
	
	@JdbcColumn
	private String exceptions;
	
	@JdbcColumn
	private String type;
	
	@JdbcColumn
	private String remote;

	/**
	 * 用户账号
	 */
	@JdbcOne(joinObject=User.class, alias="AU1", foreignKey="CREATOR_ID", column="ACCOUNT")
	private String op_username;
	
	/**
	 * 用户名
	 */
	@JdbcOne(joinObject=User.class, alias="AU1", foreignKey="CREATOR_ID", column="NAME")
	private String op_name;
	
	/**
	 * 公司名
	 */
	@JdbcOne(joinObject=Corp.class, alias="OC1", foreignKey="CORP_ID", column="NAME")
	private String corpname;
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getOp_username() {
		return op_username;
	}

	public void setOp_username(String op_username) {
		this.op_username = op_username;
	}

	public String getOp_name() {
		return op_name;
	}

	public void setOp_name(String op_name) {
		this.op_name = op_name;
	}

	public String getCorpname() {
		return corpname;
	}

	public void setCorpname(String corpname) {
		this.corpname = corpname;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getParams() {
		return params;
	}

	public void setParams(String params) {
		this.params = params;
	}

	public String getAgent() {
		return agent;
	}

	public void setAgent(String agent) {
		this.agent = agent;
	}

	public String getExceptions() {
		return exceptions;
	}

	public void setExceptions(String exceptions) {
		this.exceptions = exceptions;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getRemote() {
		return remote;
	}

	public void setRemote(String remote) {
		this.remote = remote;
	}
	
}
