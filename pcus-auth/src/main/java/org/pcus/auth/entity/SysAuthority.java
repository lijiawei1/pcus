package org.pcus.auth.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Created by wangyunfei on 2017/6/9.
 */

@Data
@EqualsAndHashCode(callSuper = false)
public  class SysAuthority extends AbstractAuditingEntity{
    private Long id;
    private String name;
    private String value;
}
