edemaApp.controller('addFeelController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading("正在加载..", "div");

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //是否有数据
        $scope.none = false;
        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.platformUrl = common.getPlatformUrl();
        $scope.EdemaCondition = '';
        $scope.NRS = '';

        $.ajax({
            async: false,
            method: 'get',
            url:'../edema/resources/json/edemaIndex.json',
            data:{
                account:$scope.account,
                openId:$scope.openId
            },
            success:function (data) {
                $scope.data = data.data;

                if($scope.data === null || $scope.data === undefined || $scope.data === ''){
                    mui.toast('获取基本信息异常');
                    mui.hideLoading();
                    return false;
                }

                //微信openID
                $scope.openId = $scope.data.openId;

                //病人id
                $scope.patientId = $scope.data.patientId;

                //接口平台
                $scope.addaUrl = $scope.data.addaUrl;

                mui.hideLoading();
            },
            error:function (err) {
                console.log(err);
                mui.toast('获取基本信息异常');
                mui.hideLoading();
            }
        });

    };

    //初始化水肿情况
    $scope.initPicker = function () {
        var xmmcPicker = new mui.PopPicker({
            layer: 1
        });

        xmmcPicker.setData([
            {value:'加重',text:'加重'},
            {value:'减轻',text:'减轻'},
            {value:'无变化',text:'无变化'}
        ]);

        document.getElementById('edema').addEventListener('tap', function(){
            xmmcPicker.show(function(items){
                $("#edema").html(items[0].text);

                $scope.EdemaCondition = items[0].text;

            });
        });
    };

    //初始化时间
    $scope.initTime = function () {
        var date = new Date();
        var nowH = date.getHours();
        var nowI = date.getMinutes();
        var nowIs = date.getMinutes();

        if(nowI < 10){
            nowIs = '0' + nowI;
        }

        var nowTime = nowH + ':' + nowI;

        $("#time").html(nowH + ':' + nowIs);

        $scope.time = nowTime;

        document.getElementById("time").addEventListener('tap', function() {
            var dtpicker = new mui.DtPicker(
                {
                    type:'time'
                }
            );

            dtpicker.show(function(e) {
                var h = common.removeTens(e.h.value);
                var i = common.removeTens(e.i.value);

                $("#time").html(h + ':' + e.i.value);

                $scope.time = h + ':' + i;

            });

        });
    };

    //初始化日期
    $scope.initDate = function () {
        var date = new Date();
        var nowY = date.getFullYear();
        var nowM = date.getMonth()+1;
        var nowD = date.getDate();

        var nowDate = nowY + '-' + nowM + '-' + nowD;

        $("#date").html(nowDate);

        $scope.date = nowDate;

        document.getElementById("date").addEventListener('tap', function() {
            var dtpicker = new mui.DtPicker(
                {
                    type:'date',
                    beginDate: new Date(2018, 0, 1),
                    endDate: new Date(nowY, nowM-1, nowD),
                    labels: ['年', '月', '日']
                }
            );

            dtpicker.show(function(e) {
                var y = e.y.value;
                var m = common.removeTens(e.m.value);
                var d = common.removeTens(e.d.value);

                $("#date").html(y + '-' + m + '-' + d);

                $scope.date = y + '-' + m + '-' + d;

            });

        });

    };

    //获取疼痛程度
    $scope.getPain = function () {
        mui('#painDiv').popover('show', document.getElementById('popover'));

        $('#painDiv').removeAttr('style');

        $scope.getRuler();

    };

    //获取尺子
    $scope.getRuler = function () {
        $scope.ruler = new MeasureRuler({
            wrapperId:"rulerWrapper",
            max:10,                         //刻度尺最大的刻度    (非必须，默认为1000)
            minUnit:0.1,                    //刻度尺最小刻度      (非必须，默认为1)
            unitSet:10,                     //刻度尺单元长度      (非必须，默认是10)
            value:0.0,                      //初始化数值          (非必须，默认为1)
            mult:2,                         //刻度值倍数，默认是最小刻度值为10px，如果定mult为3则最小刻度为30px (非必须，默认为1)
            callback:rulerSetValue,         //滑动尺子过程中的回调函数     (非必须)
            min:0
        });

    };

    //滑动尺子过程中的回调函数
    function rulerSetValue (val) {

        if(val === 0){
            $('#painRes').html('0.0');
        }else{
            $('#painRes').html(val);
        }

        $scope.painVal = val;

        $('.painImg div').css('background-size', '50%');

        if(val === 0){
            $('.pain1').css('background-size', 'contain');
        }

        if(val >0 && val <=2){
            $('.pain2').css('background-size', 'contain');
        }

        if(val >2 && val <=4){
            $('.pain3').css('background-size', 'contain');
        }

        if(val >4 && val <=6){
            $('.pain4').css('background-size', 'contain');
        }

        if(val >6 && val <=8){
            $('.pain5').css('background-size', 'contain');
        }

        if(val >8 && val <=10){
            $('.pain6').css('background-size', 'contain');
        }

        if(val >10 || val<0){
            $('.pain6').css('background-size', 'contain');

            $scope.ruler.setValue(10);

            $('#painRes').html(10);

            $scope.painVal = 10;
        }

    }

    $scope.choicePain = function (val) {
        $('.painImg div').css('background-size', '50%');

        var level = 0;

        switch (val) {
            case 1:
                level = 0.0;
                break;
            case 2:
                level = 2.0;
                break;
            case 3:
                level = 4.0;
                break;
            case 4:
                level = 6.0;
                break;
            case 5:
                level = 8.0;
                break;
            case 6:
                level = 10.0;
                break;
        }

        $('.pain' + val).css('background-size', 'contain');

        $scope.ruler.setValue(level);

        $('#painRes').html(level + '.0');

        $scope.painVal = level;

    };

    //疼痛程度取消
    $scope.painCancel = function () {
        mui('#painDiv').popover('hide');

    };

    //疼痛程度提交
    $scope.painSub = function () {

        $('#pain').html($scope.painVal);

        $scope.NRS = $scope.painVal;

        mui('#painDiv').popover('hide');

    };

    //初始化确认框
    $scope.confirm = function () {

        document.getElementById('submit').addEventListener('tap', function() {

            if($scope.EdemaCondition === ''){
                mui.toast('请选择水肿情况');
                return false;
            }

            if($scope.NRS === ''){
                mui.toast('请选择疼痛程度');
                return false;
            }

            //对选中时间的判断
            var date = new Date();
            var nowY = date.getFullYear();
            var nowM = date.getMonth()+1;
            var nowD = date.getDate();
            var nowH = date.getHours();
            var nowI = date.getMinutes();
            var nowIs = date.getMinutes();

            if(nowI < 10){
                nowIs = '0' + nowI;
            }

            //当前时间
            var now = (nowY + '-' + nowM + '-' + nowD + ' ' + nowH + ':' + nowI).replace(/-/g , '/');
            var nowDate = (new Date(now)).getTime();

            //称重时间
            var CreateDate = ($scope.date + ' ' + $scope.time).replace(/-/g , '/');
            CreateDate = (new Date(CreateDate)).getTime();

            if(CreateDate > nowDate){
                mui.toast('记录时间不得大于当前时间');
                $scope.date = nowY + '-' + nowM + '-' + nowD;
                $scope.time = nowH + ':' + nowI;

                $('#date').html(nowY + '-' + nowM + '-' + nowD);
                $('#time').html(nowH + ':' + nowIs);
                return false;
            }

            mui.showLoading("正在加载..", "div");

            //提交功能
            $scope.submit();

            /*var btnArray = ['我再想想', '是的'];
            mui.confirm('确认提交数据?', '', btnArray, function(e) {
                if (e.index === 1) {
                    mui.showLoading("正在加载..", "div");

                    //提交功能
                    $scope.submit();

                }

            });*/

        });

    };

    //提交数据
    $scope.submit = function () {

        mui('.subBtn').button('loading');
        $('#sButton').attr('disabled', true);

        window.location.href = 'index.html?account=' + $scope.account;

        $.ajax({
            async: true,
            method: 'post',
            url: $scope.platformUrl + '/rest/LymphedemaRecord/AddFeel',
            data:{
                PatientID:$scope.patientId,
                EdemaCondition:$scope.EdemaCondition,
                NRS:$scope.NRS,
                CreateDate:$scope.date + ' ' + $scope.time
            },
            success:function (data) {
                mui.hideLoading();

                $scope.result = data.result;

                if($scope.result === '200'){
                    //mui.toast('添加成功');
                    setTimeout(function () {
                        window.location.href = 'index.html?account=' + $scope.account;
                    }, 0);

                }else{
                    mui.toast('添加失败');
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);

                }

            },
            error:function (err) {
                mui.toast('接口异常');
                mui.hideLoading();
            }
        });

    };

    /*******************************************************方法-end***********************************************************/

    /*******************************************************逻辑-start***********************************************************/
    //初始化数据
    $scope.INIT();

    //初始化水肿情况
    $scope.initPicker();

    //初始化时间
    $scope.initTime();

    //初始化日期
    $scope.initDate();

    //初始化确认框
    $scope.confirm();

    /*******************************************************逻辑-end***********************************************************/

});