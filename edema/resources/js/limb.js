edemaApp.controller('limbController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading("正在加载..", "div");

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //是否有数据
        $scope.none = false;
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

    //初始化样式
    $scope.initCss = function () {
        $scope.muiContent = $('.mui-content');
        $scope.anconDiv = $('.anconDiv');
        $scope.finesseDiv = $('.finesseDiv');
        $scope.kneeDiv = $('.kneeDiv');
        $scope.ankleDiv = $('.ankleDiv');

        $scope.muiContentWidth = ($scope.muiContent.innerWidth())/2;
        $scope.anconDivHeight = ($scope.muiContentWidth)*1.12 + 'px';
        $scope.finesseDivHeight = ($scope.muiContentWidth)*0.53 + 'px';
        $scope.kneeDivHeight = ($scope.muiContentWidth)*0.47 + 'px';
        $scope.ankleDivHeight = ($scope.muiContentWidth)*0.51 + 'px';

        $scope.anconDiv.css('height', $scope.anconDivHeight);
        $scope.finesseDiv.css('height', $scope.finesseDivHeight);
        $scope.kneeDiv.css('height', $scope.kneeDivHeight);
        $scope.ankleDiv.css('height', $scope.ankleDivHeight);

    };

    //初始化确认框
    $scope.confirm = function () {
        document.getElementById('leftAncon').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-ancon';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加左侧肘部数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-ancon';

                }

            });
        });

        document.getElementById('rightAncon').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-ancon';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加右侧肘部数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-ancon';

                }

            });
        });

        document.getElementById('leftFinesse').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-finesse';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加左侧手腕数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-finesse';

                }

            });
        });

        document.getElementById('rightFinesse').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-finesse';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加右侧手腕数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-finesse';

                }

            });
        });

        document.getElementById('leftKnee').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-knee';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加左侧膝盖数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-knee';

                }

            });
        });

        document.getElementById('rightKnee').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-knee';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加右侧膝盖数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-knee';

                }

            });
        });

        document.getElementById('leftAnkle').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-ankle';

            return false;

            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加左侧脚踝数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=left-ankle';

                }

            });
        });

        document.getElementById('rightAnkle').addEventListener('tap', function() {
            window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-ankle';

            return false;
            
            var btnArray = ['换个部位', '是的'];
            mui.confirm('您将要添加右侧脚踝数据?', '温馨提示', btnArray, function(e) {
                if (e.index === 1) {
                    window.location.href = 'addLimb.html?account=' + $scope.account + '&openId=' + $scope.openId + '&limb=right-ankle';

                }

            });
        });

    };

    //初始化选中数据样式
    $scope.initRecord = function () {

        var optionArr = {
            '左侧-肘部':'leftAncon',
            '右侧-肘部':'rightAncon',
            '左侧-手腕':'leftFinesse',
            '右侧-手腕':'rightFinesse',
            '左侧-膝盖':'leftKnee',
            '右侧-膝盖':'rightKnee',
            '左侧-脚踝':'leftAnkle',
            '右侧-脚踝':'rightAnkle'
        };

        var date = new Date();
        var nowY = date.getFullYear();
        var nowM = date.getMonth()+1;
        var nowD = date.getDate();

        var nowDate = nowY + '-' + nowM + '-' + nowD;

        $.ajax({
            async: false,
            method: 'get',
            url:'../edema/resources/json/GetLimbPosition.json',
            data:{
                Date:nowDate
            },
            success:function (data) {
                $scope.res = data.data;

                var length = ($scope.res).length;

                if(length === 0){

                }else{
                    for(var i=0;i<length;i++){
                        var position = ($scope.res)[i];

                        ($scope.res)[i] = optionArr[position];

                    }

                    for(var j=0;j<length;j++){
                        var name = ($scope.res)[j];

                        $('#' + name).css('background', 'url(resources/img/body/' + name + '.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');

                    }

                }

            },
            error:function (err) {
                console.log(err);
                mui.toast('接口异常');
                mui.hideLoading();
            }
        });

        // $('#leftAncon').css('background', 'url(resources/img/body/left-ancon-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // //$('#rightAncon').css('background', 'url(resources/img/body/right-ancon-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // $('#leftFinesse').css('background', 'url(resources/img/body/left-finesse-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // //$('#rightFinesse').css('background', 'url(resources/img/body/right-finesse-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // $('#leftKnee').css('background', 'url(resources/img/body/left-knee-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // $('#rightKnee').css('background', 'url(resources/img/body/right-knee-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // //$('#leftAnkle').css('background', 'url(resources/img/body/left-ankle-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');
        // $('#rightAnkle').css('background', 'url(resources/img/body/right-ankle-data.png)').css('background-repeat', 'no-repeat').css('background-size', '101% 101%');

    };

    /*******************************************************方法-end***********************************************************/

    /*******************************************************逻辑-start***********************************************************/
    //初始化数据
    $scope.INIT();

    //初始化样式
    $scope.initCss();

    //初始化确认框
    $scope.confirm();

    //初始化选中数据样式
    $scope.initRecord();

    /*******************************************************逻辑-end***********************************************************/

});