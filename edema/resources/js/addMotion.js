edemaApp.controller('addMotionController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading("正在加载..", "div");

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //是否有数据
        $scope.none = false;
        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.platformUrl = common.getPlatformUrl();
        $scope.SportsTime = '';
        $scope.SportsMode = '';

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
                    mui.toast('接口异常');
                    mui.hideLoading();
                    return false;
                }

                //微信openID
                $scope.openId = $scope.data.openId;

                //病人id
                $scope.patientId = $scope.data.patientId;

                mui.hideLoading();

            },
            error:function (err) {
                console.log(err);
                mui.toast('接口异常');
                mui.hideLoading();
            }
        });

    };

    //初始化选择数据
    $scope.initValue = function () {
        var picker = new mui.PopPicker({
            layer: 1
        });

        //1~1000分钟
        var children = [];

        //5~55分钟
        for(var k=1;k<12;k++){
            children.push({value:5*k,text:5*k + ' 分钟'});
        }

        //1~12小时
        for(var i=1;i<13;i++){
            children.push({value:i,text:i + ' 小时'});
        }

        picker.setData(
            children
        );

        document.getElementById('input-value-div').addEventListener("tap", function(){
            //默认选中
            picker.pickers[0].setSelectedIndex(0);

            picker.show(function(items){
                var text = items[0].text;
                var value = items[0].value;
                var result = 0;

                if(text.indexOf('分钟') !== -1){
                    result = value;
                }else{
                    result = value*60;
                }

                document.getElementById('value').innerHTML = result;

                $scope.SportsTime = result;

            });
        });

    };

    //初始化称重时间
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

    //初始化称重日期
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

    //初始化确认框
    $scope.confirm = function () {
        document.getElementById('submit').addEventListener('tap', function() {

            if($scope.SportsTime === ''){
                mui.toast('请选择运动时长');
                return false;
            }

            if($scope.SportsMode === ''){
                mui.toast('请填写运动方式');
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
                mui.toast('运动时间不得大于当前时间');
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

    //提交功能
    $scope.submit = function () {

        mui('.subBtn').button('loading');
        $('#sButton').attr('disabled', true);

        window.location.href = 'index.html?account=' + $scope.account;

        $.ajax({
            async: true,
            method: 'post',
            url: $scope.platformUrl + '/rest/LymphedemaRecord/AddSports',
            data:{
                PatientID:$scope.patientId,
                SportsTime:$scope.SportsTime,
                SportsMode:$scope.SportsMode,
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

    //初始化选择数据
    $scope.initValue();

    //初始化称重时间
    $scope.initTime();

    //初始化称重日期
    $scope.initDate();

    //初始化确认框
    $scope.confirm();

    /*******************************************************逻辑-end***********************************************************/

});