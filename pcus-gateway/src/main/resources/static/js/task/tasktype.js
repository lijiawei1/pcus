/**
 * 上下文路径
 */
var basePath = rootPath + '/type/taskType/'

var emptydata = { 'id': '', 'version': '0', 'creator_name':'', 'modifier_name': '', 'creator_id':'', 'modifier_id': '', 'create_time':'', 'modify_time': '', 'remark': ''
	, 'type': '', 'job_name': '', 'job_group': '', 'job_class_name': '', 'durable': false, 'nonconcurrent': false, 'update_data': false, 'requests_recovery': false
}

var filterRecord = function(record) {
	delete record.__id 
	delete record.__previd
	delete record.__index
	delete record.__status
	delete record._editing
//	delete record.children
	delete record.creator_name
	delete record.modifier_name
//	delete record.ischecked
	return record
}

var trueOrFalse = [{ visible: 'true', text: '显示' }, { visible: 'false', text: '隐藏' }];

//设置表单状态
//var setFormStatus = function(form, enable) {
////	form._setReadonly(enable)
//	form.setEnabled(["code", "name", "shortname", "foreignname", "pid", "remark"], enable);
//}

var setLeftStatus = function(enable) {
	$('.l-layout-left').css('z-index', enable ? 0 : -1)
	$('.l-layout-left').css('opacity', enable ? 1 : 0.5)
}

function out(value) {
	alert(JSON2.stringify(value))
}

$(function() {
	
	//上下文信息
	var ctx = new PageContext()
	
	//初始化界面
	$("#layout").ligerLayout({
		leftWidth : 200,
		height : '100%',
		space : 0,
		/*bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false */
	});
	
	/**************************************************************主表**************************************************/
	//是否选择框
	var tfdata= [{value: true, text: '是' }, {value: false, text: '否' }]
	
	//主表
	var mainGrid = $("#mainGrid").ligerGrid({
		columns: [{ display: '名称', name: 'job_name', width: '10%', minWidth: 60, validate: { required: true }, editor: { type: 'text' }},
	          { display: '组', name: 'job_group', width: '10%', minWidth: 60,  validate: { required: true }, editor: { type: 'text' } },
	          { display: '插件', name: 'job_class_name', width: '30%', minWidth: 200, validate: { required: true }, editor: { type: 'text' }},
	          { display: '持久', name: 'durable', align: 'center', isSort: false, width: '5%', minWidth: 40
	        	  , editor: { type: 'select', data: tfdata, valueColumnName: 'value' }
	          , render: function (item) { return item.durable ? "是" : "否" }},
	          
	          { display: '并发', name: 'nonconcurrent', align: 'center', isSort: false, width: '5%', minWidth: 40
	        	  , editor: { type: 'select', data: tfdata, valueColumnName: 'value' }
	          , render: function (item) { return item.durable ? "是" : "否" }},
	          
	          { display: '更新', name: 'update_data', align: 'center', isSort: false, width: '5%', minWidth: 40
	        	  , editor: { type: 'select', data: tfdata, valueColumnName: 'value' }
	          , render: function (item) { return item.durable ? "是" : "否" }},
	          
	          { display: '请求恢复', name: 'requests_recovery', align: 'center', isSort: false, width: '5%', minWidth: 40
	        	  , editor: { type: 'select', data: tfdata, valueColumnName: 'value' }
	          , render: function (item) { return item.durable ? "是" : "否" }},
	          { display: '备注', name: 'remark', width: '10%', minWidth: 50,  editor: { type: 'text' } },
	          { display: '部署公司', id: 'corpname', name: 'corpname', sortname: 'oc1.name', width: '8%', minWidth: 50,  validate: { required: true } },
	          { display: '部署人', id: 'creator_name', name: 'creator_name', width: '8%', minWidth: 50,  validate: { required: true } },
	          
		  ], 
		  parms: [],
    	  dataAction: 'server', pageSize: 5, 
    	  //toolbar: {}, 
    	  sortName: 'job_name',
    	  width: '100%', height: '100%', autoStretch: true, heightDiff: -20,
    	  checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
    	  fixedCellHeight: true, rowHeight: 30,

    	  url: basePath + 'loadPageTypes',
//    	  delayLoad: true,		//初始化不加载数据
    	  
    	  //双击跳转到按钮管理界面
          // onDblClickRow : function (data, rowindex, rowobj) {
			// if (data && !data._editing) {
		   //       if(data.mlevel != 2)return;
		   //       else {
		   //      	 top.f_addTab(data.no + data.morder, '管理菜单 ['+data.name+ '] 的按钮', rootPath + 'menu/manage.do?module=auth&function=menu&page=button&pid='
		   //      			 + data.id + '&no=' + data.no + '&mlevel=' + data.mlevel);
			//         }
			// }
          // },
          //单选显示所有按钮
          onSelectRow : function(data, rowid, rowobj) {
        	  if (data.mlevel == 2) {
            	  btnGrid.setParm('pid', data.id)
            	  btnGrid.reload()
        	  }
          }
	})
	
	/**************************************************************按钮工具栏**************************************************/
	//工具栏,
    var topitems = {
	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'] },
	      update: { id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'] },
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
    }
	
	//工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar()
	
    function btnClick(item) {
		
		var editingrow = mainGrid.getEditingRow();
		
	    switch (item.id) {
	        case "add":
	        	if (editingrow == null) {
					mainGrid.addEditRow($.extend(emptydata, {
						corpname: ctx.corpname,
						creator_name: ctx.name,
						corp_id: ctx.corp_id,
						creator_id: ctx.user_id,
					}));
					cm.setCardStatus('OP_ADD')
				}
	        	break;
	        case "update":
				if (editingrow == null) {
					var row = mainGrid.getSelectedRow();
					if (!row) { LG.showError('请选择行'); return; }
					mainGrid.beginEdit(row);
					cm.setCardStatus('OP_EDIT')
				}
	            break;
	        case "remove":
				var selected = mainGrid.getSelected();
				if (selected) {
						//查看是否有子节点
						LG.ajax({
							loading: '检查数据中...',
							url: basePath + "removeBefore.do",
							data: {
								pid: selected.id
							},
							success: function (data, message) {
								remove(selected)
							},
							error: function (message) {
								LG.showError(message);
							}
						})
				}
				else {
					LG.showError('请选择行!');
				}
	        	break;
	        case "save":
				if (editingrow != null) {
					mainGrid.endEdit(editingrow);
				}
				break;
	        case "refresh":
	        	refresh()
	        	break;
	        case "cancel":
	        	if (editingrow != null) {
					mainGrid.cancelEdit(editingrow);
					if (editingrow.__status == "add") {
						mainGrid.remove(editingrow)
					}
				}
				cm.setCardStatus('OP_INIT')
	        	break;
	        case "retrieve1":
	        	alert(JSON2.stringify(mainform.getData()))
	        	break;
	    }
	}
	
	//编辑后事件,保存
	mainGrid.bind('afterSubmitEdit', function (e) {

		var isAddNew = e.record['__status'] == "add";
		var data = {}
		if (isAddNew){
			//新增
			data = $.extend({ creator_id: ctx.user_id, corp_id: ctx.corp_id }, e.newdata)
		} else {
			//编辑
			data = $.extend(filterRecord(e.record), e.newdata)
		}
		
		LG.ajax({
			loading: '正在保存数据中...',
			url: basePath+(isAddNew ? "add" : "update") + ".do",
			data: data,
			success: function () {
//				LG.tip('保存成功!');
				LG.showSuccess("保存成功")
				cm.setCardStatus("OP_INIT")
				refresh()
			},
			error: function (message) {
				LG.showError(message);
			}
		});
	});
	
	//刷新
	var refresh = function() {
		mainGrid.reload()
	}
    
	//删除
	var remove = function(selected) {
		$.ligerDialog.confirm('确定删除吗?', function (confirm) {
			if (!confirm) return
			LG.ajax({
				url: basePath + 'remove',
				loading: '正在删除中...',
				data:{ id : selected.id, version: selected.version },
				success: function () {
					LG.showSuccess('删除成功')
					mainGrid.loadData()
				},
				error: function (message) {
					LG.showError(message);
				}
			});
		});
	}
	
    //搜索表单应用ligerui样式
    $("#formsearch").ligerForm({
        fields: [
            { display: "名称", name: "job_name", newline: true, labelWidth: 100, width: 220, space: 30, type: "text", cssClass: "field" }
        ],
        toJSON: JSON2.stringify
    });
    
    //增加搜索按钮,并创建事件
    LG.appendSearchAndRestBtn("#formsearch", mainGrid);
    
    //按钮状态控制
	var cm = new CardManager(toptoolbar, {}, topitems)
	cm.setCardStatus('OP_INIT');

	//重设高度
	mainGrid._onResize();
	
});