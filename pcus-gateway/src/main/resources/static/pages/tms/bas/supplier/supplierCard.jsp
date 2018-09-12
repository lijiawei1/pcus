<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/20
  Time: 9:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <title>供应商资料</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
  <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
  <span>当前位置：</span>
  <li>${pp.module}</li>
  <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div class="tabWrapper">
  <div class="tabWrapper-inner">
    <div id="mainTab">
      <div tabid="editTab" title="资料编辑" lselected="true" data-url="${path}/tms/bas/clientlinkman/loadPage">
        <div class="toolbar-wrapper form-toolbar">
          <div class="l-toolbar" id="toptoolbar">
          </div>
        </div>
        <div class="form-wrapper">
          <div class="form-wrapper-inner">
            <form id="mainForm"></form>
          </div>
        </div>
      </div>
      <div tabid="linkmanGridTab" title="联系人信息" data-url="${path}/tms/bas/supplierlinkman/loadPage?pk_id=${pk_id}">
        <iframe frameborder="0" name="linkmanGrid"></iframe>
      </div>
      <div tabid="DriverGridTab" title="司机信息" data-url="${path}/tms/bas/driver/loadPage?pk_id=${pk_id}">
        <iframe frameborder="0" name="driverGrid"></iframe>
      </div>
      <div tabid="CarGridTab" title="车辆信息" data-url="${path}/tms/bas/car/loadPage?pk_id=${pk_id}">
        <iframe frameborder="0" name="carGrid"></iframe>
      </div>
      <div tabid="contractGridTab" title="车队合同" data-url="${path}/tms/bas/contract_s/loadPage?pk_id=${pk_id}">
        <iframe frameborder="0" name="contractGridTab"></iframe>
      </div>
      <div tabid="logGridTab" title="操作日志" data-url="${path}/tms/bas/log/loadLogCommonPage?bill_id=${pk_id}">
        <iframe frameborder="0" name="logGrid"></iframe>
      </div>
    </div>
  </div>
</div>
</body>
<script>

  //页面元素
  var $mainTab = $("#mainTab"); //页签

  var mainTab;

  //配置
  var detailTabOption = {
    height: '100%',
    width: '100%',
    heightDiff: -6,
    onAfterSelectTabItem: afterSelectTabItem
  }

  $(function () {
    //创建页签
    mainTab = $mainTab.ligerTab(detailTabOption);
    //初始化激活的标签项
    afterSelectTabItem(mainTab.getSelectedTabItemID());
  });

  //标签切换事件
  function afterSelectTabItem(tabid) {
    //初始化页签
    var $tg = $(".l-tab-content [tabid='" + tabid + "']");
    if ($tg.attr("data-init") !== "init") {
      $tg.children(".l-tab-loading").show();
      $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
    }
  }

</script>
<script type="text/javascript">
  var basePath = rootPath + '/tms/bas/supplier/';
  var formPanel = $("#mainForm");

  //页面-父容器(考虑滚动条),labelWidth,space
  var defaultFieldWidth = (function getInputWidth(diff, lw, sw) {
    var clientWidth = document.documentElement.clientWidth,
            w,
            n;
    if(clientWidth > 1366){
      n = 4;
    }
    else{
      n = 3;
    }
    w =  Math.floor((clientWidth - ((lw + sw)  * n + diff)) * (Math.floor(100/n ))/100);//截取小数点后两位（向下取整）

    var o = {
      lw: lw,
      sw: sw,
      w1: w,
      w2: (w << 1) + lw + sw, //2倍
      w3: (w + lw + sw) * 2 + w,//3倍
      wA: (w + lw + sw) * (n - 1) + w//整行
    };

    if(o.w3 > o.wA) o.w3 = o.wA;

    return o;
  })(89,120,30);
  var mainForm = formPanel.ligerForm({
    inputWidth: defaultFieldWidth.w1,
    labelWidth: defaultFieldWidth.lw,
    space: defaultFieldWidth.sw,
    fields: [
      {
        group: "车队基本资料",
        display: '车队简称',
        name: 'name',

        newline: false,
        type: 'text',
        attr: {
          maxlength: 10
        },
        validate: {required: true, messages: {required: '供应商简称不能为空。'}}
      },
      {
        display: '车队代码',
        name: 'code',

        newline: false,
        type: 'text',
        attr: {
          maxlength: 10
        },
        validate: {required: true, messages: {required: '供应商代码不能为空。'}}
      },
      {
        display: '车队全称', name: 'fname',  newline: false, type: 'text', attr: {
        maxlength: 20
      }, validate: {required: true}
      },
      {
        display: '地址', name: 'address',  newline: false, type: 'text',
        attr: {
          maxlength: 80
        },
      },
      {
        display: '联系人', name: 'link_man',  newline: false, type: 'text', attr: {
        maxlength: 20
      },
      },
      {display: '联系电话', name: 'mobile',  newline: false, type: 'text', validate: {isMobile: true}},
      {display: '外协', name: 'outsourcing',  newline: false, type: 'checkbox'},
      {
        display: '企业性质', name: 'corp_nature',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=org_type'
      }
      },
      {
        display: '单位属性', name: 'unit_prop',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=unit_porp'
      }
      },
      {
        display: '纳税规模', name: 'tax_scale',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=tax_scale'
      }
      },
      {
        display: '主营业务', name: 'main_business',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=main_business'
      }
      },
      {
        display: '税务登记号', name: 'tax_regist_no',  newline: false, type: 'text', attr: {
        maxlength: 30
      },
      },
      {
        display: '营业执照号', name: 'busi_regist_no',  newline: false, type: 'text', attr: {
        maxlength: 30
      },
      },
      {
        display: '组织机构代码', name: 'org_regist_no',  newline: false, type: 'text', attr: {
        maxlength: 30
      },
      },
      {
        display: '备注', name: 'remark', width: defaultFieldWidth.w2, newline: true, type: 'text', attr: {
        maxlength: 200
      },
      },
      //结算信息
      {
        group: "结算信息", display: '业务范畴', name: 'settle_service_type',  newline: false, type: 'select',
        options: {
          url: basePath + "getServiceType",
                    split: ',',
          isMultiSelect: true,
        }
      },
      {
        display: '币种', name: 'settle_currency',  newline: false, type: 'select',
        options: {
          url: rootPath + '/tms/bas/dict/getData?query=currency'
        }
      },
      {
        display: '汇率',
        name: 'settle_exchange',

        newline: false,
        type: 'number',
        validate: {range: [0, 999999]}
      },
      {display: '账单日', name: 'settle_billday',  newline: false, type: 'int', validate: {range: [0, 31]}},
      {
        display: '信用天数',
        name: 'settle_credit_days',

        newline: false,
        type: 'int',
        validate: {range: [0, 9999]}
      },
      {
        display: '信用额度',
        name: 'settle_credit_amount',

        newline: false,
        type: 'number',
        validate: {range: [0, 999999999]}
      },
      {
        display: '结算方式', name: 'settle_type',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=settle_type'
      }
      },
      {
        display: '付款方式', name: 'settle_pay_type',  newline: false, type: 'select', options: {
        url: rootPath + '/tms/bas/dict/getData?query=pay_type'
      }
      },
      {
        display: '银行', name: 'settle_bank',  newline: false, type: 'select',
        cssClass: "field",
        options: {
          url: rootPath + '/tms/bas/dict/getData?query=bank',
          cancelable: true,
          autocomplete: true,
          keySupport: true,
          highLight: true,
          isTextBoxMode: true
        }
      },
      {
        display: '银行账号', name: 'settle_bank_account',  newline: false, type: 'text', attr: {
        maxlength: 25
      },
      },
      {
        display: '银行户名', name: 'settle_bank_name',  newline: false, type: 'text', attr: {
        maxlength: 25
      },
      },
      {display: '生效日期', name: 'settle_begin_date',  newline: false, type: 'date'},
      {display: '失效日期', name: 'settle_end_date',  newline: false, type: 'date'},
      {
        display: '姓名', name: 'sellte_name',  newline: false, type: 'text', attr: {
        maxlength: 10
      },
      },
      {
        display: '电话',
        name: 'sellte_mobile',

        newline: false,
        type: 'text',
        validate: {isMobile: true}
      },
      {
        display: '邮箱', name: 'sellte_email',  newline: false, type: 'text', attr: {
        maxlength: 50
      },
      },
      {
        display: '银行详细', name: 'sellte_bank_detail', width: defaultFieldWidth.w2, newline: true, type: 'text', attr: {
        maxlength: 200
      },
      },
      {
        display: '开票信息', name: 'sellte_bill_info', width: defaultFieldWidth.w2, newline: true, type: 'text', attr: {
        maxlength: 200
      },
      },
      //法人信息
      {
        group: "法人信息", display: '姓名', name: 'legal_name',  newline: false, type: 'text', attr: {
        maxlength: 10
      },
      },

      {
        display: '身份证号', name: 'legal_id_no',  newline: false, type: 'text', attr: {
        maxlength: 20
      },
      },
      {display: '电话', name: 'legal_mobile',  newline: false, type: 'text', validate: {isMobile: true}},
      {
        display: '邮箱', name: 'legal_email',  newline: false, type: 'text', attr: {
        maxlength: 50
      },
      },
      {
        display: '性别', name: 'legal_sex',  newline: false, type: "radiolist", options: {
        data: [{id: 1, text: '男'}, {id: 2, text: '女'}]
      }
      },
      //备案信息
      {
        group: "备案信息", display: '备案人', name: 'record_name',  newline: true, type: 'text', attr: {
        maxlength: 10
      },
      },
      {
        display: '备案时间',
        name: 'record_time',

        newline: false,
        type: 'date'
      },
      {name: "pk_id", type: "hidden"},
      {name: "state", type: "hidden"}
    ],
    validate: true,
    toJSON: JSON2.stringify
  });


  //加载数据
  var client = ${supplier};
  mainForm.setData(client);


  var toptoolbar = LG.powerToolBar($('#toptoolbar'), {
    items: [
      {
        id: 'update', text: '保存', icon: 'save', click: saveClient
      },
      {
        id: 'unUse', text: client.state == "STATE_11_USE" ? '失效': '使用', icon: client.state == "STATE_11_USE" ? 'stop': 'use', click: setState
      },
      {
        id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrackFun
      }
    ]
  });

  function saveClient() {
    //提交数据
    if (mainForm.valid()) {
      var formData = $.extend({}, mainForm.getData());

      LG.ajax({
        url: basePath + "update.do",
        data: JSON2.stringify(formData, DateUtil.datetimeReplacer),
        contentType: 'application/json',
        dataType: "json",
        success: function () {
          LG.tip('保存成功!');
          //刷新列表页面grid
          var iframe = parent.window.frames['005004'];
          iframe.mainGrid.reload();
        },
        error: function (message) {
          LG.showError(message);
        }
      });
    }
  }

  function setState() {
    var nowState = client.state;
    var type = "1";
    if (nowState == "STATE_11_USE") {
      type = "0";
    }
    LG.ajax({
      url: basePath + "unUse?id=" + client.pk_id + "&type=" + type,
      contentType: 'application/json',
      dataType: "json",
      success: function () {
        LG.showSuccess('操作成功!', function () {
          location.reload();
        });
        //  if (type == "1") {
        //      $("#stateName").text("失效");
        //      $("#stateIcon").removeClass("l-icon-use").addClass("l-icon-stop");
        //  }
        //  else {
        //      $("#stateName").text("使用");
        //      $("#stateIcon").removeClass("l-icon-stop").addClass("l-icon-use");
        //  }
      },
      error: function (message) {
        LG.showError(message);
      }
    });

  }

  // 手机号码验证
  jQuery.validator.addMethod("isMobile", function (value, element) {
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    var length = value.length;
    if (length == 0) {
      return true
    }
    ;
    return this.optional(element) || ( /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|170)+\d{8})$/.test(value) || tel.test(value));
  }, "请正确填写联系方式。");

</script>
</html>
