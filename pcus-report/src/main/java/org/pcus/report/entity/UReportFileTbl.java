package org.pcus.report.entity;

import lombok.Data;
import org.apache.ibatis.type.Alias;

import java.util.Date;

/**
 * 报表储存
 */
@Data
@Alias("UReportFileTbl")
public class UReportFileTbl {

  private String pk_id;
  private String tbl_name;
  private byte[] content;
  private Date create_time;
  private Date modify_time;

//  public String getPk_id() {
//    return pk_id;
//  }
//
//  public void setPk_id(String pk_id) {
//    this.pk_id = pk_id;
//  }
//
//  public String getTbl_name() {
//    return tbl_name;
//  }
//
//  public void setTbl_name(String tbl_name) {
//    this.tbl_name = tbl_name;
//  }
//
//  public byte[] getContent() {
//    return content;
//  }
//
//  public void setContent(byte[] content) {
//    this.content = content;
//  }
//
//  public Date getCreate_time() {
//    return create_time;
//  }
//
//  public void setCreate_time(Date create_time) {
//    this.create_time = create_time;
//  }
//
//  public Date getModify_time() {
//    return modify_time;
//  }
//
//  public void setModify_time(Date modify_time) {
//    this.modify_time = modify_time;
//  }
}
