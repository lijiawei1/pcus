var FORM_CONFIG = {
    field: [
        {
            display: '委托客户2', group: "基础信息",
            name: 'client_name2', newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "client_name_c2",
            options: {
                data: data_clients,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                onSelected: function (newvalue, newText, rowData) {
                    var dataLinkmans = $.grep(data_clientLinkmans, function (n, i) {
                        return data_clientLinkmans[i].pname === newText;
                    });
                    liger.get("linkman_c").setData(dataLinkmans, true);
                },
                render: function (value, text) {
                    !data_order.client_id && LG.specialField($(liger.get('client_name_c').element).parent(), 'alert');
                    return text;
                }
            }
        }
    ],
    formGroup: {
        group_base: {
            client_name2: '委托客户2'
        }
    }
};