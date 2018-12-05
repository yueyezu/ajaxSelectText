/***
 * 扩展文本框，实现的百度检索框的功能
 * 2018-11-24 初步版本创建，待完善点(自动创建结果面板；完善各种参数配置；扩展外部操作调用方法；去掉样式表文件，改为js实现) by yueye
***/
(function ($, win) {
    $.fn.ajaxSelectText = function (option) {
        var defalut = {
            type: "static", //筛选的模式，static：固定数据；ajax：根据请求
            key: 'name', //主键的名称，指数据中用于在下拉列表中展示的字段
            callback: null, //选择完成后的回调方法，包括两个参数：name-选择项的显示值;data-选择的数据实体

            data: [],   //用于筛选的静态数据，static模式使用

            //以下参数用于ajax模式下的请求
            url: '',    //ajax请求的路径
            paramKey: 'keyword', //进行筛选时，传递的筛选的参数名称，需要和control层对应起来
            param: {}   //附带的参数
        };
        option = $.extend(defalut, option);
        var $queryInput = $(this);
        var inputId = $queryInput.attr("id");
        var $queryResult = $('.ajaxTextResult[for=' + inputId + ']');
        var $queyrResultUl = $queryResult.children("ul");

        //调整queryResult的位置
        var oheight = $queryInput[0].offsetHeight;
        var oleft = $queryInput.position().left;
        $queryResult.css({ left: oleft + 10 });


        var lastVal = "";
        var onSelectResult = false;

        $queryResult.mouseover(function () {
            onSelectResult = true;
        }).mouseout(function () {
            onSelectResult = false;
        });

        //录入文本框加入事件
        $queryInput.keyup(function () {
            var nowVal = $queryInput.val().trim();
            if (nowVal == "") {
                $queyrResultUl.empty();
                return;
            }
            if (nowVal === lastVal) {
                return;
            } else {
                lastVal = nowVal;
            }

            //在添加数据之前，情况现有数据
            $queyrResultUl.empty();
            if (option.type == "static") {
                //本地数据检索，加入列表
                $.each(option.data, function (i, res) {
                    if (res[option.key].indexOf(nowVal) != -1) {
                        var str = '<li>' + res[option.key] + '</li>';
                        $queyrResultUl.append(str);
                        $queyrResultUl.children("li:last").data("data", res);
                    }
                });
            } else {
                //通过Ajax方式进行获取
                option.param[option.paramKey] = nowVal;
                $.get(option.url, option.param, function (data) {
                    if (data && data.length > 0) {
                        $.each(data, function (i, res) {
                            var str = '<li>' + res[option.key] + '</li>';
                            $queyrResultUl.append(str);
                            $queyrResultUl.children("li:last").data("data", res);
                        });
                    }
                }, "json");
            }
        });

        //控制文本框的状态
        $queryInput.focus(function () {
            $queryResult.show();
        }).blur(function () {
            if (!onSelectResult) {  //如果失去焦点是因为选择元素时，则不进行隐藏操作
                $queryResult.hide();
            }
        });

        //选择元素的操作
        $queyrResultUl.click(function (e) {
            var $selectLi = $(e.target);
            var name = $selectLi.text();
            var data = $selectLi.data('data');

            if (option.callback) {
                $queryInput.val("");
                option.callback(name, data);
                $queyrResultUl.empty();
                $queryResult.hide();
            } else {
                $queryInput.val(name);
                $queyrResultUl.empty();
                $queryResult.hide();
            }
        });
    }
})(jQuery, window);
