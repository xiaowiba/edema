edemaApp.controller('addWeightController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading("正在加载..", "div");

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //是否有数据
        $scope.none = false;
        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.platformUrl = common.getPlatformUrl();
        $scope.Weight = '';

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
            layer: 2
        });

        var children = [{value: "0", text: "0.0"}];

        for(var i=1;i<10;i++){
            var p = '0.' + i;

            children.push({value:i,text:p});

        }

        //2~200kg
        var parent = [];

        for(var j=2;j<201;j++){
            parent.push({value:j,text:j,children:children});
        }

        picker.setData(
            parent
        );

        document.getElementById('input-value-div').addEventListener("tap", function(){
            //默认选中70kg
            picker.pickers[0].setSelectedIndex(68);

            picker.show(function(items){
                var integer = items[0].text;
                var decimal = items[1].text;

                var num = +integer + +decimal;

                if(num > 200){
                    mui.toast('最大值限定200');
                    num = 200;
                }

                document.getElementById('value').innerHTML = num;

                $scope.Weight = num;

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

    //初始化图表
    $scope.initChart = function () {
        // $.getJSON('../edema/resources/json/linear-pan.json', function(data) {
        //     var chart = new F2.Chart({
        //         id: 'myChart',
        //         //指定分辨率
        //         pixelRatio: window.devicePixelRatio
        //     });
        //
        //     //坐标线配置
        //     chart.axis('count', false);
        //
        //     //载入数据源
        //     chart.source(data, {
        //         // release: {
        //         //     min: 1101,
        //         //     max: 1107
        //         // }
        //     });
        //
        //     //提示
        //     chart.tooltip({
        //         showCrosshairs: true,
        //         showItemMarker: false,
        //         background: {
        //             radius: 2,
        //             fill: '#1890FF',
        //             padding: [3, 5]
        //         },
        //         nameStyle: {
        //             fill: '#fff'
        //         },
        //         onShow: function onShow(ev) {
        //             var items = ev.items;
        //             items[0].name = items[0].title;
        //             items[0].value = items[0].value + 'kg';
        //         }
        //     });
        //
        //     //绘制连接的线
        //     chart.line().position('release*count');
        //
        //     //绘制连接的点
        //     chart.point().position('release*count').style({
        //         lineWidth: 1,
        //         stroke: '#fff'
        //     });
        //
        //     //平移
        //     chart.interaction('pan', {
        //         limitRange: {
        //             x: {
        //                 min: -100,
        //                 max: 100
        //             }
        //         }
        //     });
        //
        //     //缩放
        //     chart.interaction('pinch', {
        //         maxScale: 5,
        //         minScale: 1
        //     });
        //
        //     //定义X轴进度条位置
        //     chart.scrollBar({
        //         mode: 'x',
        //         xStyle: {
        //             offsetY: -5
        //         }
        //     });
        //
        //     //添加一条虚线
        //     /*chart.guide().line({
        //         start: [ 'min', 1000 ],
        //         end: [ 'max', 1000]
        //     });*/
        //
        //     //绘制tag
        //     /*chart.guide().tag({
        //         position: [1969, 1344],
        //         withPoint: false,
        //         content: '1,344',
        //         limitInPlot: true,
        //         offsetX: 5,
        //         direct: 'cr'
        //     });*/
        //
        //     //渲染
        //     chart.render();
        // });

        $http.get('../edema/resources/json/GetWeightChart.json').success(function (data) {
            var arr = data.data;

            for(var i=0;i<arr.length;i++){
                var brr = arr[i];

                var CreateDate = (brr.CreateDate).replace(/-/g , '/');
                CreateDate = (new Date(CreateDate)).getTime();

                //数值转为数字型
                arr[i].DataValue = parseFloat(brr.DataValue);
                arr[i].CreateDate = CreateDate;

            }

            var chart = new F2.Chart({
                id: 'myChart',
                //指定分辨率
                pixelRatio: window.devicePixelRatio
            });

            //坐标线配置
            chart.axis('DataValue', false);

            //载入数据源
            chart.source(arr, {
                DataValue: {
                    min: 2,
                    max: 200.99
                },
                // DataValue: {
                //     tickCount: 5
                //     //min: 0
                // },
                CreateDate: {
                    type: 'timeCat',
                    //range: [0, 1],
                    tickCount: 7,
                    formatter: function (e) {
                        return timestampToTime(e);
                    }
                }
            });

            //提示
            chart.tooltip({
                showCrosshairs: true,
                showItemMarker: false,
                background: {
                    radius: 2,
                    fill: '#1890FF',
                    padding: [3, 5]
                },
                nameStyle: {
                    fill: '#fff'
                },
                onShow: function onShow(ev) {
                    var items = ev.items;
                    //items[0].name = items[0].title;
                    //items[0].value = items[0].value + 'kg';
                    //items[0].name = items[0].value + 'kg';
                    items[0].name = null;
                    items[0].value = items[0].value + 'kg';
                }
            });

            //绘制连接的线
            chart.line().position('CreateDate*DataValue');

            //绘制连接的点
            chart.point().position('CreateDate*DataValue').style({
                lineWidth: 1,
                stroke: '#fff'
            });

            //平移
            chart.interaction('pan', {
                limitRange: {
                    x: {
                        min: -100,
                        max: 100
                    }
                }
            });

            //缩放
            /*chart.interaction('pinch', {
                maxScale: 5,
                minScale: 1
            });*/

            //定义X轴进度条位置
            /*chart.scrollBar({
                mode: 'x',
                xStyle: {
                    offsetY: -5
                }
            });*/

            //添加一条虚线
            /*chart.guide().line({
                start: [ 'min', 1000 ],
                end: [ 'max', 1000]
            });*/

            //绘制tag
            /*chart.guide().tag({
                position: [1969, 1344],
                withPoint: false,
                content: '1,344',
                limitInPlot: true,
                offsetX: 5,
                direct: 'cr'
            });*/

            //渲染
            chart.render();

        }).error(function (err) {
            console.log(err);
            mui.toast('接口异常');
        });

    };

    //提交前的提示与提交逻辑
    $scope.popover = function () {

        mui('.subBtn').button('loading');
        $('#sButton').attr('disabled', true);

        window.location.href = 'index.html?account=' + $scope.account;

        $.ajax({
            async: true,
            method: 'post',
            url: $scope.platformUrl + '/rest/LymphedemaRecord/AddWeight',
            data:{
                PatientID:$scope.patientId,
                Weight:$scope.Weight,
                CreateDate:$scope.date + ' ' + $scope.time
            },
            success:function (data) {
                mui.hideLoading();

                $scope.res = data.data;

                $scope.IsFirst = $scope.res.IsFirst;
                $scope.IsLoss = $scope.res.IsLoss;
                $scope.Value = $scope.res.Value;

                if($scope.IsFirst === 0){
                    switch ($scope.IsLoss) {
                        //持平
                        case 2:
                            mui('#equally').popover('show', document.getElementById('popover'));

                            setTimeout(function () {
                                mui('#equally').popover('hide');
                                window.location.href = 'index.html?account=' + $scope.account;
                            }, 1000);

                            break;
                        //轻了
                        case 1:
                            $('#popoverLight').html($scope.Value);
                            mui('#light').popover('show', document.getElementById('popover'));

                            setTimeout(function () {
                                mui('#light').popover('hide');
                                window.location.href = 'index.html?account=' + $scope.account;
                            }, 1000);

                            break;
                        //重了
                        case 0:
                            $('#popoverHeavy').html($scope.Value);
                            mui('#heavy').popover('show', document.getElementById('popover'));

                            setTimeout(function () {
                                mui('#heavy').popover('hide');
                                window.location.href = 'index.html?account=' + $scope.account;
                            }, 1000);

                            break;
                    }
                }else{
                    window.location.href = 'index.html?account=' + $scope.account;
                }
            },
            error:function (err) {
                mui.toast('接口异常');
                mui.hideLoading();
            }
        });

    };

    //初始化确认框
    $scope.confirm = function () {
        document.getElementById('submit').addEventListener('tap', function() {

            //对体重的判断
            if($scope.Weight === ''){
                mui.toast('请选择体重值');
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
                mui.toast('称重时间不得大于当前时间');
                $scope.date = nowY + '-' + nowM + '-' + nowD;
                $scope.time = nowH + ':' + nowI;

                $('#date').html(nowY + '-' + nowM + '-' + nowD);
                $('#time').html(nowH + ':' + nowIs);
                return false;
            }

            mui.showLoading("正在加载..", "div");

            //提交前的提示
            $scope.popover();

            //弹出确认框
            /*var btnArray = ['我再想想', '是的'];
            mui.confirm('确认提交数据?', '', btnArray, function(e) {
                if (angular.equals(e.index, 1)) {
                    mui.showLoading("正在加载..", "div");

                    //提交前的提示
                    $scope.popover();

                }

            });*/

        });

    };

    //前往体重趋势
    $scope.goWeightTrend = function () {
        window.location.href = '../edema/weightTrend.html?account=' + $scope.account;
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

    //初始化图表
    $scope.initChart();

    //初始化确认框
    $scope.confirm();

    /*******************************************************逻辑-end***********************************************************/

    //时间戳转日期
    function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? (date.getMonth()+1) : date.getMonth()+1);
        var D = date.getDate() + ' ';
        return M + '/' + D;
    }

});