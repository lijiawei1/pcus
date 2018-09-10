/**
 * 上下文路径
 */
var basePath = rootPath + '/task/taskDetail/';

var emptydata = { 'id': '', 'version': '0', 'creator_name':'', 'modifier_name': '', 'creator_id':'', 'modifier_id': '', 'create_time':'', 'modify_time': '', 'remark': ''
	, 'name': '', 'type_id': '', 'status': '', 'job_name': '', 'job_group': '', 'trigger_name': '', 'trigger_group': '', 
	'next_fire_time': '', 'prev_fire_time': '', 'priority': 0, 'start_time': '', 'end_time': '', 'misfire_instr': 0, 'job_data': ''
};

var filterRecord = function(record) {
	delete record.__id;
	delete record.__previd;
	delete record.__index;
	delete record.__status;
	delete record._editing;
	delete record.creator_name;
	delete record.modifier_name;
	return record;
}

var trueOrFalse = [{ visible: 'true', text: '显示' }, { visible: 'false', text: '隐藏' }];

//设置遮罩层，不可乱点
var setTopStatus = function(form, enable) {
//	$('#filterform').).css('z-index', enable ? 0 : -1)
	$('#filterform').css('opacity', enable ? 1 : 0.4)
	form.setEnabled(['filtercorp', 'filterfield','filtertype','filtername'], enable);
}

function out(value) {
	alert(JSON2.stringify(value))
}

var timeSelector

$(function() {
	
	//上下文信息
	var ctx = new PageContext()
	
	//初始化界面
	$("#layout").ligerLayout({
		leftWidth : 200,
		height : '100%',
		space : 0,
	});
	
	/**************************************************************主表**************************************************/
	//是否选择框
	var tfdata= [{value: true, text: '是' }, {value: false, text: '否' }]
	
	var instr = [{
		//MISFIRE_INSTRUCTION_FIRE_ONCE_NOW
		value: 1,
		text: '立即执行'
	}, {
		//MISFIRE_INSTRUCTION_DO_NOTHING
		value: 2,
		text: '等待下次'
	}, {
		value: 3,
		text: ''
	}]
	
	var mainform = $("#mainform");
	$.metadata.setType("attr", "validate");
	LG.validate(mainform, { debug: true });
	
	//主表
	var mainGrid = $("#mainGrid").ligerGrid({
//		headerImg: rootPath + '/icons/silkicons/table.png',title: '菜单模块',
		columns: [{ display: '任务名称', name: 'name', width: '10%', minWidth: 60, validate: { required: true }, editor: { type: 'text' }},
		      { display: '类型', name: 'type_id', width: '10%', minWidth: 60, validate: { required: true },
				 editor: {
					 type: 'popup',
					 valueField: 'id', textField: 'job_name',
					 grid: {
						 url: '/taskType/loadPageTypes.do',
//						 parms: {fuckyou: 'dfudf'},
						 columns: [
							{ display: '插件名称', name: 'job_name', width: '30%', minWidth: 100},
							{ display: '插件类名', name: 'job_class_name', width: '60%', minWidth: 150},
						 ],
						 usePager: true, isScroll: false, checkbox: false,
					 }
					
				 }
		      },
	          { display: '状态', name: 'status', width: '5%', minWidth: 60,
		    	  render: function(item) {
		    		  switch (item.status) {
		    		  case 0:
		    			  return '<div style="width:100%;height:100%;"><img src="/icons/32X32/member.gif" /><span style="position:absolute;">待机</span></div>'
		    		  case 1:
		    			  return "无效"
		    		  case 2:
		    			  return '<div style="width:100%;height:100%;"><img src="/icons/32X32/member.gif" /><span style="position:absolute;">正常</span></div>'
		    		  case 3:
		    			  return "暂停"
		    		  case 4:
		    			  return "完成"
		    		  case 5:
		    			  return "阻塞"
		    		  case 6:
		    			  return "错误"
		    		  }
		    	  }},
//	          { display: '上次触发', name: 'prev_fire_time', width: '10%', minWidth: 60},
//	          { display: '下次触发', name: 'next_fire_time', width: '10%', minWidth: 60},
	          
	          { display: '开始时间', name: 'start_time', width: '10%', minWidth: 130, validate: { required: true }, 
	        	  editor: { type: 'date',
	        		  ext: { showTime: true, format: "yyyy-MM-dd hh:mm:ss" }
	        	  }},
	          { display: '结束时间', name: 'end_time', width: '10%', minWidth: 130, validate: { required: true }, 
	        	  editor: { type: 'date', 
	        		  ext: { showTime: true, format: "yyyy-MM-dd hh:mm:ss" }
	        	  }},
	          { display: '错过指令', name: 'misfire_instr', width: '5%', minWidth: 60},
	          { display: '优先级', name: 'priority', align: 'center', isSort: false, width: '5%', minWidth: 40, validate: { required: true }
	        	  , editor: { type: 'select', data: tfdata, valueColumnName: 'value' }
	          , render: function (item) { return item.durable ? "是" : "否" }},
		      { display: '定时设置', name: 'job_data', textField: 'job_data', align: 'center', isSort: false, width: '15%', minWidth: 50, validate: { required: true }
	          	, editor: { type: 'popup', ext: function (rowdata) {
	        		  return { onButtonClick: function () {
		        			  $.ligerDialog.open({
		        				  title: '定时器', 
		        				  name: 'timeSelector',
		        				  url: '/corp/loadPage.do?module=sys&function=cron&page=cron',
		        				  width: 800, height: 400,
		        				  modal: true,
		        				  buttons: [
		        				      { text: '确定', onclick: selectTimeOk },
		        				      { text: '取消', onclick: selectTimeCancel }
		        				  ],
		        				  selectComboBox: this,
		        			  })
		        			  return false;
		        		  },
	        		  }
	        	  }}
//	          , render: function (item) { return "<div style='width:100%;height:100%;'><img src='" + item.icon + "' /></div>" }
	          },
			  { display: '定时参数', name: 'param', width: '8%', minWidth: 50, editor: {type: 'text'}},
	          { display: '备注', name: 'remark', width: '10%', minWidth: 50 },
	          { display: '部署公司', name: 'corpname', width: '8%', minWidth: 50,  validate: { required: true } },
	          { display: '部署人', name: 'creator_name', width: '8%', minWidth: 50,  validate: { required: true } },
	          
		  ], 
		  toJSON: JSON2.stringify,
    	  dataAction: 'server', pageSize: 20, 
    	  //toolbar: {}, 
    	  sortName: 'TD.job_name',
    	  width: '100%', height: '100%',  autoStretch: true, heightDiff: -20,
    	  checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
    	  fixedCellHeight: true, rowHeight: 30,

    	  url: basePath + 'loadPageDetails.do',
//    	  delayLoad: true,		//初始化不加载数据
    	  
    	  //双击跳转到按钮管理界面
          onDblClickRow : function (data, rowindex, rowobj) {
//			if (data && !data._editing) {
//		         if(data.mlevel != 2)return;
//		         else {
//		        	 top.f_addTab(data.no + data.morder, '管理菜单 ['+data.name+ '] 的按钮', rootPath + 'menu/manage.do?module=auth&function=menu&page=button&pid='
//		        			 + data.id + '&no=' + data.no + '&mlevel=' + data.mlevel);
//			        }
//			}
          },
          //单选显示所有按钮
          onSelectRow : function(data, rowid, rowobj) {
        	  cm.updateExtStatus(data.status)
          }
	})

	    //搜索表单应用ligerui样式
    $("#filterform").ligerForm({
        fields: [
            { display: "任务名称", id:"name",name: "name", newline: false, labelWidth: 100, width: 220, space: 30, type: "text", cssClass: "field" },
            { display: "状态", id:"status" ,name: "status", newline: false, labelWidth: 100, width: 220, space: 30, type: "select",
            	 comboboxName: "status_c",options:{
            		valueFieldID:"status",initText:"待机",initValue:0,
            		data:[
            		      {id:0 ,text: '待机' },
            		      {id:1 ,text: '无效' },
            		      {id:2 ,text: '正常' },
            		      {id:3 ,text: '暂停' },
            		      {id:4 ,text: '完成' },
            		      {id:5 ,text: '阻塞' },
            		      {id:6 ,text: '错误' }
            		      ]
                    }
            }
        ],
        toJSON: JSON2.stringify
    });
	
	$("#status").addClass("field");
	
	//增加搜索按钮,并创建事件
    LG.appendSearchAndRestBtn("#filterform", mainGrid);
	
	//确认
	function selectTimeOk(item, dialog) {
		var editingrow = mainGrid.getEditingRow()
		var selectComboBox = dialog.get('selectComboBox')
		if (editingrow && selectComboBox) {
			
			//对话框
			var dlg = document.getElementById("timeSelector").contentWindow;
			var v = $("input[name='cron']", dlg.document).val()
			selectComboBox.inputText.val(v)
			selectComboBox.valueField.val(v)
			dialog.close()
		} else {
			
		}

	}
	
	//取消
	function selectTimeCancel(item, dialog) {
		dialog.close()
	}
	
	/**************************************************************按钮工具栏**************************************************/
	//工具栏,
    var topitems = {
	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0,1,2,3,4,5,6] },
	      update: { id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'], },
	      start: {id: 'start', text: '启动', click: btnClick, icon: 'start', status: ['OP_INIT'], extstatus: [0]},
	      pause: {id: 'pause', text: '暂停', click: btnClick, icon: 'pause', status: ['OP_INIT'], extstatus: [2]},
	      stop: {id: 'stop', text: '停止', click: btnClick, icon: 'stop', status: ['OP_INIT'], extstatus: [1, 2, 3]},
	      startonce: {id: 'startonce', text: '执行一次', click: btnClick, icon: 'executeonce', status: ['OP_INIT'], extstatus: [1, 2, 3, 4, 5, 6]},
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
	      
	      //自定义根据列表或者界面VO改变按钮的可用状态
//	      updateExtStatus: function(status) {
//	    	  return status
//	      }
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
//						LG.ajax({
//							loading: '检查数据中...',
//							url: basePath + "removeBefore.do",
//							data: {
//								id: selected.id,
//								version: selected.version
//							},
//							success: function (data, message) {
								remove(selected)
//							},
//							error: function (message) {
//								LG.showError(message);
//							}
//						})
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
	        case "start":
	        	start()
	        	break;
	        case "pause":
	        	pause()
	        	break;
	        case "stop":
	        	stop()
	        	break;
	        case "startonce":
	        	startonce()
	        	break;
	    }
	}
    
	//编辑后事件,保存
	mainGrid.bind('afterSubmitEdit', function (e) {

		var isAddNew = e.record['__status'] == "add";
		
		var newdata = e.newdata

		console.log(e.record.start_time);
		//console.log(mainGrid.editors[e.record['__id']]);
		var g = mainGrid, rowdata = e.record

		for (var columnid in g.editors[rowdata['__id']])
		{
			var o = g.editors[rowdata['__id']][columnid], val;
			var column = o.editParm.column;
			if (column.name) {
				val = o.editor.getValue(o.input, o.editParm);
			}
			if (column.textField && o.editor.getText) {
				val = o.editor.getText(o.input, o.editParm);
			}
			//console.log('======' + columnid + ':' + val);
			console.log('======' + columnid + ':' + o.editParm.value);
		}
		console.log('==========================');

		if (newdata.start_time) {
			newdata.start_time = newdata.start_time.format();
		}
		if (newdata.end_time) {
			newdata.end_time = newdata.end_time.format();
		}
		
		var data = {}
		if (isAddNew){
			//新增
			data = $.extend({ creator_id: ctx.user_id, corp_id: ctx.corp_id, 
			}, newdata)
		} else {
			//编辑
			data = $.extend(filterRecord(e.record), newdata)
		}

		console.log(JSON.stringify(newdata));
		
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
	
	//启动任务
	var start = function() {
		
		var row = mainGrid.getSelectedRow();
		if (!row) { LG.showError('请选择行'); return; }
		var data = $.extend(filterRecord(row), {})
		LG.ajax({
			url: basePath + 'start',
			loading: '正在启动中...',
			data: data,
			success: function () {
				LG.showSuccess('启动成功')
				mainGrid.loadData()
			},
			error: function (message) {
				LG.showError("启动失败:" + message);
				mainGrid.loadData()
			}
		});
	}
	
	//暂停任务
	var pause = function() {
		
		var row = mainGrid.getSelectedRow();
		if (!row) { LG.showError('请选择行'); return; }
		var data = $.extend(filterRecord(row), {})
		LG.ajax({
			url: basePath + 'pause',
			loading: '正在暂停中...',
			data: data,
			success: function () {
				LG.showSuccess('暂停成功')
				mainGrid.loadData()
			},
			error: function (message) {
				LG.showError("暂停失败:" + message);
				mainGrid.loadData()
			}
		});
	}
	
	//停止任务
	var stop = function() {
		
		var row = mainGrid.getSelectedRow();
		if (!row) { LG.showError('请选择行'); return; }
		var data = $.extend(filterRecord(row), {})
		LG.ajax({
			url: basePath + 'stop',
			loading: '正在停止中...',
			data: data,
			success: function () {
				LG.showSuccess('停止成功')
				mainGrid.loadData()
			},
			error: function (message) {
				LG.showError("停止失败:" + message);
				mainGrid.loadData()
			}
		});
	}
	
	//执行一遍
	var startonce = function() {
		
		var row = mainGrid.getSelectedRow();
		if (!row) { LG.showError('请选择行'); return; }
		var data = $.extend(filterRecord(row), {})
		LG.ajax({
			url: basePath + 'startOnce',
			loading: '正在执行一次中...',
			data: data,
			success: function () {
				LG.showSuccess('执行一次成功')
				mainGrid.loadData()
			},
			error: function (message) {
				LG.showError("执行失败:" + message);
				mainGrid.loadData()
			}
		});
	}
    
    //按钮状态控制
	var cm = new CardManager(toptoolbar, {}, topitems)
	cm.setCardStatus('OP_INIT');

	//重设高度
	mainGrid._onResize();
})