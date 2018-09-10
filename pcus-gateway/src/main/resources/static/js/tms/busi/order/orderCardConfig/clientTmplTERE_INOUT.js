var FORM_CONFIG = {
    field: [
        {
            display: '进港日期', group: "基础信息", name: 'inport_date', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "yyyy-MM-dd"}
        },
        {
            display: '到达时间', group: "基础信息", name: 'arrival_time', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "hh:mm:ss"}
        },
        {
            display: '离开时间', group: "基础信息", name: 'leave_time', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "hh:mm:ss"}
        },
        {
            display: '还柜时间', group: "基础信息", name: 'cntr_ret_time', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "hh:mm:ss"}
        }
    ],
    formGroup: {
        group_base: {
            inport_date: '委托客户2',
            arrival_time: '到达时间',
            leave_time: '离开时间',
            cntr_ret_time: '还柜时间'
        }
    }
};