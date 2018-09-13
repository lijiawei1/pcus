package org.zap.framework.common.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.zap.framework.module.common.constants.BasState;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.base.BaseEntity;

import java.time.LocalDateTime;

/**
 * 业务
 * @author Shin
 *
 */
public class BusiEntity extends BaseEntity {
	
	public static String DR = "dr";
	public static String RS = "rs";

	public final static String CORP_ID = "corp_id";
	public final static String CREATE_PSN = "create_psn";
	public final static String CREATE_TIME = "create_time";
	public final static String MODIFY_PSN = "modify_psn";
	public final static String MODIFY_TIME = "modify_time";
	public final static String STATE = "state";

	//行状态增删改查
	public static int RS_INIT = 0;
	public static int RS_ADD = 1;
	public static int RS_UPDATE = 2;
	public static int RS_DELETE = 3;
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -312472901668519320L;

	/***************************
	 * 数据库字段
	 ***************************/
	@JdbcColumn
	private String corp_id;
	
	@JdbcColumn
	private String dept_id;
	
	@JdbcColumn
	private String remark;
	
	@JdbcColumn
	private String creator_id;
	
	@JdbcColumn
	private LocalDateTime create_time;

	@JdbcColumn
	private String create_psn;
	
	@JdbcColumn
	private String modifier_id;
	
	@JdbcColumn
	private LocalDateTime modify_time;

	@JdbcColumn
	private String modify_psn;
	
	@JdbcColumn
	private int dr;

	@JdbcColumn
	private String state;

	/**
	 * 行状态，
	 */
	private int rs;
	
	
	/***************************
	 * 辅助字段
	 ***************************/
	private LocalDateTime create_time_begin;
	private LocalDateTime create_time_end;
	private LocalDateTime modify_time_begin;
	private LocalDateTime modify_time_end;
	
	public int getRs() {
		return rs;
	}
	public void setRs(int rs) {
		this.rs = rs;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getCorp_id() {
		return corp_id;
	}
	public void setCorp_id(String corp_id) {
		this.corp_id = corp_id;
	}
	public String getDept_id() {
		return dept_id;
	}
	public void setDept_id(String dept_id) {
		this.dept_id = dept_id;
	}
	public String getCreator_id() {
		return creator_id;
	}
	public void setCreator_id(String creator_id) {
		this.creator_id = creator_id;
	}
	public String getModifier_id() {
		return modifier_id;
	}
	public void setModifier_id(String modifier_id) {
		this.modifier_id = modifier_id;
	}
	public LocalDateTime getCreate_time() {
		return create_time;
	}
	public void setCreate_time(LocalDateTime create_time) {
		this.create_time = create_time;
	}
	public LocalDateTime getModify_time() {
		return modify_time;
	}
	public void setModify_time(LocalDateTime modify_time) {
		this.modify_time = modify_time;
	}
	public int getDr() {
		return dr;
	}
	public void setDr(int dr) {
		this.dr = dr;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCreate_psn() {
		return create_psn;
	}

	public void setCreate_psn(String create_psn) {
		this.create_psn = create_psn;
	}

	public String getModify_psn() {
		return modify_psn;
	}

	public void setModify_psn(String modify_psn) {
		this.modify_psn = modify_psn;
	}

	@JsonIgnore
	public LocalDateTime getCreate_time_begin() {
		return create_time_begin;
	}
	public void setCreate_time_begin(LocalDateTime create_time_begin) {
		this.create_time_begin = create_time_begin;
	}
	@JsonIgnore
	public LocalDateTime getCreate_time_end() {
		return create_time_end;
	}
	public void setCreate_time_end(LocalDateTime create_time_end) {
		this.create_time_end = create_time_end;
	}
	@JsonIgnore
	public LocalDateTime getModify_time_begin() {
		return modify_time_begin;
	}
	public void setModify_time_begin(LocalDateTime modify_time_begin) {
		this.modify_time_begin = modify_time_begin;
	}
	@JsonIgnore
	public LocalDateTime getModify_time_end() {
		return modify_time_end;
	}
	public void setModify_time_end(LocalDateTime modify_time_end) {
		this.modify_time_end = modify_time_end;
	}

	/**
	 * 获取状态转换
	 *
	 * @return
	 */
	public String getState_name() {
		BasState tmsOrderState = BasState.STATE_MAP.get(state);

		if (tmsOrderState != null) {
			return tmsOrderState.getName();
		}

		return "";
	}
	
}
