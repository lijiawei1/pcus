package org.pcus.report.provider;

import com.bstek.ureport.exception.ReportException;
import com.bstek.ureport.provider.report.ReportFile;
import com.bstek.ureport.provider.report.ReportProvider;
import lombok.Setter;
import org.pcus.report.entity.UReportFileTbl;
import org.pcus.report.mapper.UreportFileMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * oracle报表储存
 * Created by GANGKOU on 2018-09-17.
 */
@Setter
@Component
@ConfigurationProperties(prefix = "ureport.oracle.provider")
public class OracleProvider implements ReportProvider {
    private static final String NAME = "MyReport";

    private String prefix;

    private String fileStoreDir;

    private boolean disabled;

    @Autowired
    private UreportFileMapper mapper;

    @Override
    public InputStream loadReport(String file) {
        UReportFileTbl tbl = mapper.queryUreportFileEntityByName(getCorrectName(file));
        byte[] content = tbl.getContent();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(content);
        return inputStream;
//        if(file.startsWith(prefix)){
//            file=file.substring(prefix.length(),file.length());
//        }
//        String fullPath=fileStoreDir+"/"+file;
//        try {
//            return new FileInputStream(fullPath);
//        } catch (FileNotFoundException e) {
//            throw new ReportException(e);
//        }
    }

    @Override
    public void deleteReport(String file) {
        mapper.deleteReportFileByName(getCorrectName(file));
    }

    public List<ReportFile> getReportFiles() {
        List<UReportFileTbl> list = mapper.queryReportFileList();
        List<ReportFile> reportList = new ArrayList<>();
        for (UReportFileTbl tbl : list) {
            reportList.add(new ReportFile(tbl.getTbl_name(), tbl.getModify_time()));
        }
        return reportList;
    }

    @Override
    public void saveReport(String file, String content) {
        file = getCorrectName(file);
        UReportFileTbl tbl = mapper.queryUreportFileEntityByName(file);
        Date currentDate = new Date();
        if(tbl == null){
            //生成主键
            UUID uuid = UUID.randomUUID();
            String pk_id = UUID.randomUUID().toString();

            tbl = new UReportFileTbl();
            tbl.setPk_id(pk_id);
            tbl.setTbl_name(file);
            tbl.setContent(content.getBytes());
            tbl.setCreate_time(currentDate);
            tbl.setModify_time(currentDate);
            mapper.insertReportFile(tbl);
        }else{
            tbl.setContent(content.getBytes());
            tbl.setModify_time(currentDate);
            mapper.updateReportFile(tbl);
        }
    }

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public boolean disabled() {
        return disabled;
    }

    @Override
    public String getPrefix() {
        return prefix;
    }

    /**
     * 获取没有前缀的文件名
     * @param name
     * @return
     */
    private String getCorrectName(String name){
        if(name.startsWith(prefix)){
            name = name.substring(prefix.length(), name.length());
        }
        return name;
    }
}
