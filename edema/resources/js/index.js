edemaApp.controller('indexController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading('正在加载..', 'div');

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        $scope.none = false;
        $scope.container = false;
        $scope.res = [];

        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.platformUrl = common.getPlatformUrl();

        $.ajax({
            async: false,
            method: 'get',
            url:'../edema/resources/json/edemaIndex.json',
            data:{
                account:$scope.account,
                openId:$scope.openId
            },
            success:function (data) {
                //$scope.data = (JSON.parse(data)).data;
                $scope.data = data.data;

                if($scope.data === null || $scope.data === undefined || $scope.data === ''){
                    window.location.reload();
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
                mui.toast('获取基本信息接口异常');
                mui.hideLoading();
            }
        });

    };

    //初始化时间插件
    $scope.initTime = function () {
        var date = new Date();
        var nowY = date.getFullYear();
        var nowM = date.getMonth()+1;
        var nowD = date.getDate();

        var nowDate = nowY + '-' + nowM + '-' + nowD;

        $("#indexTime").html(nowY + '年' + nowM + '月' + nowD + '日');

        $scope.indexTime = nowDate;

        //使明天时间按钮置灰
        $scope.getGray();

        document.getElementById("indexTime").addEventListener('tap', function() {
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

                $("#indexTime").html(y + '年' + m + '月' + d + '日');

                $scope.indexTime = y + '-' + m + '-' + d;

                if(common.dateToTimestamp(nowDate.replace(/-/g , '/')) <= common.dateToTimestamp(($scope.indexTime).replace(/-/g , '/'))){
                    //使明天时间按钮置灰
                    $scope.getGray();

                }else{
                    //使明天时间按钮置蓝
                    $scope.getBlue();

                }

                mui.showLoading('正在加载..', 'div');

                $scope.res = [];

                $scope.initData();

            });

        });
    };

    //初始化数据
    $scope.initData = function () {

        $.ajax({
            async: false,
            method: 'get',
            url: '../edema/resources/json/LymphedemaRecord.json',
            data:{
                Date:$scope.indexTime
            },
            success:function (data) {
                mui.hideLoading();

                $scope.res = data.data;

                if(data.data === undefined){
                    $scope.none = true;
                    $scope.container = false;
                    return false;
                }

                if(($scope.res).length === 0){
                    $scope.none = true;
                    $scope.container = false;
                }else{
                    $scope.none = false;
                    $scope.container = true;
                }

                $scope.$applyAsync();

            },
            error:function (err) {
                console.log(err);
                mui.toast('获取列表异常');
                mui.hideLoading();
            }
        });
    };

    //初始化图片插件
    $scope.initImg = function () {
        mui.previewImage();
    };

    //获取今天的时间
    $scope.getToday = function () {
        var date = new Date();
        var nowY = date.getFullYear();
        var nowM = date.getMonth()+1;
        var nowD = date.getDate();

        var nowDate = nowY + '-' + nowM + '-' + nowD;

        $("#indexTime").html(nowY + '年' + nowM + '月' + nowD + '日');

        $scope.indexTime = nowDate;

        //使明天时间按钮置灰
        $scope.getGray();

        mui.showLoading('正在加载..', 'div');

        //查询
        $scope.initData();

    };

    //获取昨天的时间
    $scope.getYesterdayTime = function () {
        $scope.indexTime = $scope.indexTime.replace(/-/g , '/');
        var date = new Date($scope.indexTime);
        var timestamp = date.getTime();
        var yesterday = new Date(timestamp-24*60*60*1000);
        $("#indexTime").html(yesterday.getFullYear() + '年' + (yesterday.getMonth()+1) + '月' + yesterday.getDate() + '日');
        yesterday = yesterday.getFullYear() + '-' + (yesterday.getMonth()+1) + '-' + yesterday.getDate();
        $scope.indexTime = yesterday;

        //使明天时间按钮置蓝
        $scope.getBlue();

        mui.showLoading('正在加载..', 'div');

        //查询
        $scope.initData();

    };

    //获取明天的时间
    $scope.getTomorrowTime = function () {
        var now = new Date();
        var nowY = now.getFullYear();
        var nowM = now.getMonth()+1;
        var nowD = now.getDate();

        var nowDate = nowY + '-' + nowM + '-' + nowD;

        $scope.indexTime = $scope.indexTime.replace(/-/g , '/');
        var date = new Date($scope.indexTime);
        var timestamp = date.getTime();
        var tomorrow = new Date(timestamp+24*60*60*1000);
        $("#indexTime").html(tomorrow.getFullYear() + '年' + (tomorrow.getMonth()+1) + '月' + tomorrow.getDate() + '日');
        tomorrow = tomorrow.getFullYear() + '-' + (tomorrow.getMonth()+1) + '-' + tomorrow.getDate();
        $scope.indexTime = tomorrow;

        if(common.dateToTimestamp(nowDate.replace(/-/g , '/')) <= common.dateToTimestamp(($scope.indexTime).replace(/-/g , '/'))){
            $scope.indexTime = nowDate;
            $("#indexTime").html(nowY + '年' + nowM + '月' + nowD + '日');

            //使明天时间按钮置灰
            $scope.getGray();

        }else{
            //使明天时间按钮置蓝
            $scope.getBlue();

        }

        mui.showLoading('正在加载..', 'div');

        //查询
        $scope.initData();

    };

    //使明天时间按钮置灰
    $scope.getGray = function () {
        $('.tomorrowTime').css('background', 'url(../edema/resources/img/tomorrowTimeGray.png)')
            .css('background-position', 'center center')
            .css('background-size', '24px 24px')
            .css('background-repeat', 'no-repeat');
    };

    //使明天时间按钮置蓝
    $scope.getBlue = function () {
        $('.tomorrowTime').css('background', 'url(../edema/resources/img/tomorrowTimeBlue.png)')
            .css('background-position', 'center center')
            .css('background-size', '24px 24px')
            .css('background-repeat', 'no-repeat');
    };

    //跳转
    $scope.goAdd = function (type) {
        window.location.href = type + '.html?account=' + $scope.account + '&openId=' + $scope.openId;
    };

    /*******************************************************方法-end***********************************************************/

    /*******************************************************逻辑-start***********************************************************/
    //初始化数据
    $scope.INIT();

    //初始化时间插件
    $scope.initTime();

    //初始化数据
    $scope.initData();

    //初始化图片插件
    $scope.initImg();

    /*******************************************************逻辑-end***********************************************************/

});