package org.zap.framework.module.sys.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;
import org.zap.framework.orm.itf.ITree;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据字典子表
 * @author haojc
 *
 */
@JdbcTable(value="ZAP_SYS_DICTMX", alias="SDM")
public class DictionaryMx extends BusiEntity implements ITree<DictionaryMx> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	//主表ID
	@JdbcColumn
	private String mst_id;
	//名字
	@JdbcColumn
	private String dictmx_name;
	//编码
	@JdbcColumn
	private String dictmx_code;
	//排序号
	@JdbcColumn
	private int morder;
	
	//父ID
	@JdbcColumn
	private String pid;
	
	//父名称
	@JdbcColumn
	private String pname;
	
	
	public String getPname() {
		return pname;
	}
	public void setPname(String pname) {
		this.pname = pname;
	}
	
	/**
	 * 
	 */
	private List<DictionaryMx> children = new ArrayList<DictionaryMx>();
	public int getMorder() {
		return morder;
	}
	public void setMorder(int morder) {
		this.morder = morder;
	}

	
	public String getMst_id() {
		return mst_id;
	}
	public void setMst_id(String mst_id) {
		this.mst_id = mst_id;
	}
	public String getDictmx_name() {
		return dictmx_name;
	}
	public void setDictmx_name(String dictmx_name) {
		this.dictmx_name = dictmx_name;
	}
	public String getDictmx_code() {
		return dictmx_code;
	}
	public void setDictmx_code(String dictmx_code) {
		this.dictmx_code = dictmx_code;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	@Override
	public List<DictionaryMx> getChildren() {
		return children;
	}
}
