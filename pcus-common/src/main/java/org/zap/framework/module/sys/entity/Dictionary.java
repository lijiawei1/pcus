package org.zap.framework.module.sys.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 数据字典
 * @author haojc
 *
 */
@JdbcTable(value="ZAP_SYS_DICT", alias="SD")
public class Dictionary extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3507886135507756160L;



	@JdbcColumn
	private String dict_name;
	@JdbcColumn
	private String dict_code;
	
	public String getDict_name() {
		return dict_name;
	}
	public void setDict_name(String dict_name) {
		this.dict_name = dict_name;
	}
	public String getDict_code() {
		return dict_code;
	}
	public void setDict_code(String dict_code) {
		this.dict_code = dict_code;
	}
}
