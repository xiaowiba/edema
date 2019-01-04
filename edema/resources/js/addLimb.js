edemaApp.controller('addLimbController', function ($scope, $state, $http, $filter, $timeout, $sce) {
    mui.showLoading("正在加载..", "div");

    /*******************************************************方法-start***********************************************************/
    //初始化数据
    $scope.INIT = function () {
        //是否有数据
        $scope.none = false;
        $scope.account = common.getUrlParam('account');
        $scope.openId = common.getUrlParam('openId');
        $scope.platformUrl = common.getPlatformUrl();
        $scope.Value = '';
        $scope.upImgArr = [];

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
        $scope.limbImgContent = $('.limbImgContent');
        $scope.limbImgContentWidth = ((($scope.limbImgContent).innerWidth())-20)/4 + 'px';

        $('.upimg-div .up-section').css('width', $scope.limbImgContentWidth).css('height', $scope.limbImgContentWidth);
        $('.img-box .upimg-div .z_file').css('width', $scope.limbImgContentWidth).css('height', $scope.limbImgContentWidth);
        $('.z_file .add-img').css('width', $scope.limbImgContentWidth).css('height', $scope.limbImgContentWidth);
        $('.up-img').css('width', $scope.limbImgContentWidth).css('height', $scope.limbImgContentWidth);
        $('.z_photo .z_file').css('width', $scope.limbImgContentWidth).css('height', $scope.limbImgContentWidth);
    };

    //初始化上传
    $scope.imgUp = function () {
        var delParent;
        var defaults = {
            fileType : ["jpg","png","bmp","jpeg"],  // 上传文件的类型
            fileSize : 1024 * 1024 * 5             // 上传文件的大小 5M
        };

        //图片结果集
        var upImgArr = [];
        $scope.upImgArr = [];

        //图片base64结果集
        var upImgBaseArr = [];
        $scope.upImgBaseArr = [];

        /*点击图片的文本框*/
        $(".file").change(function(){

            var idFile = $(this).attr("id");
            var file = document.getElementById(idFile);

            //存放图片的父亲元素
            var imgContainer = $(this).parents(".z_photo");

            //获取的图片文件
            var fileList = file.files;

            //文本框的父亲元素
            var input = $(this).parent();
            var imgArr = [];

            //遍历得到的图片文件
            var numUp = imgContainer.find(".up-section").length;

            //总的数量
            var totalNum = numUp + fileList.length;

            if(fileList.length > 1 || totalNum > 4){
                //一次选择上传超过4个 或者是已经上传和这次上传的到的总数也不可以超过4个
                //mui.toast("上传图片数目不可以超过4个，请重新选择");
                mui.toast("一次只能添加一张照片");
            } else if (numUp < 4){

                var date = new Date().getTime();

                fileList = validateUp(fileList, date);

                fileList[0].date = date;

                /**************************************************************************************************/
                // 压缩图片需要的一些元素和对象
                var reader = new FileReader();
                var img = new Image();

                // 缩放图片需要的canvas
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                //图片类型,其实用不到
                var fileType = fileList[0].type;

                reader.readAsDataURL(fileList[0]);

                reader.onload = function(e) {
                    //e.target.result就是图片的base64地址信息
                    img.src = e.target.result;
                };

                img.onload = function(e) {
                    // 图片原始尺寸
                    var originWidth = img.width;
                    var originHeight = img.height;

                    // 最大尺寸限制
                    var maxWidth = 400;
                    var maxHeight = 400;

                    // 目标尺寸
                    var targetWidth = originWidth;
                    var targetHeight = originHeight;

                    // 图片尺寸超过400x400的限制
                    if (originWidth > maxWidth || originHeight > maxHeight) {
                        if (originWidth / originHeight > maxWidth / maxHeight) {
                            // 更宽，按照宽度限定尺寸
                            targetWidth = maxWidth;
                            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                        } else {
                            targetHeight = maxHeight;
                            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                        }
                    }

                    // canvas对图片进行缩放
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // 清除画布
                    context.clearRect(0, 0, targetWidth, targetHeight);

                    // 图片压缩
                    context.drawImage(img, 0, 0, targetWidth, targetHeight);

                    var blob = canvas.toDataURL('image/jpeg', 0.5);

                    upImgBaseArr.push(blob);
                    $scope.upImgBaseArr = upImgBaseArr;

                    var blobs = $scope.toBlob(blob);

                    blobs.date = date;

                    console.log(blobs);

                    //将图片放入缓存中
                    upImgArr.push(blobs);
                    $scope.upImgArr = upImgArr;

                    var $section = $("<section class='up-section fl loading ' data-date='" + date + "'>");
                    imgContainer.prepend($section);

                    var $span = $("<span class='up-span'>");
                    $span.appendTo($section);

                    var $img0 = $("<img class='close-upimg'>").on("click",function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        $(".works-mask").show();
                        delParent = $(this).parent();
                    });

                    $img0.attr("src","img/a7.png").appendTo($section);

                    var $img = $("<img class='up-img up-opcity'>");
                    $img.css("background",'url(' + blob + ')').css('background-size', 'cover');
                    $img.appendTo($section);

                    var $p = $("<p class='img-name-p'>");
                    $p.html(fileList[0].name).appendTo($section);

                    var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
                    $input.appendTo($section);

                    var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
                    $input2.appendTo($section);

                    setTimeout(function(){
                        $(".up-section").removeClass("loading");
                        $(".up-img").removeClass("up-opcity");
                    }, 450);

                    numUp = imgContainer.find(".up-section").length;

                    if(numUp >= 4){
                        $('.z_file').hide();
                        //$(this).parent().hide();
                    }

                    //input内容清空
                    $(this).val("");

                    //初始化样式
                    $scope.initCss();

                };

            }

        });

        $(".z_photo").delegate(".close-upimg","click",function(){
            $(".works-mask").show();
            delParent = $(this).parent();
        });

        $(".wsdel-ok").click(function(){
            $(".works-mask").hide();
            var numUp = delParent.siblings().length;

            if(numUp < 6){
                delParent.parent().find(".z_file").show();
            }

            var date = delParent.attr('data-date');

            delParent.remove();

            //同时将缓存中的图片删除
            for(var i=0;i<($scope.upImgArr).length;i++){
                if($scope.upImgArr[i].date == date){
                    $scope.upImgArr.splice(i, 1);
                }
            }

        });

        $(".wsdel-no").click(function(){
            $(".works-mask").hide();
        });

        function validateUp(files, date){

            //替换的文件数组
            var arrFiles = [];

            //不能上传文件名重复的文件
            for(var i = 0, file; file = files[i]; i++){

                // if($scope.upImgArr === undefined){
                //
                // }else{
                //     for(var p=0;p<($scope.upImgArr).length;p++){
                //
                //         if($scope.upImgArr[p] === undefined){
                //             continue;
                //         }
                //
                //         $scope.upImgArr[p].date = date;
                //
                //         // if($scope.upImgArr[p].name == file.name){
                //         //     mui.toast('重复的文件');
                //         //     return false;
                //         // }
                //     }
                // }

                //获取文件上传的后缀名
                var newStr = file.name.split("").reverse().join("");

                if(newStr.split(".")[0] != null){

                    var type = newStr.split(".")[0].split("").reverse().join("");

                    if(jQuery.inArray(type, defaults.fileType) > -1){
                        // 类型符合，可以上传
                        if (file.size >= defaults.fileSize) {
                            mui.toast(file.name +'"文件过大');
                        } else {
                            // 在这里需要判断当前所有文件中
                            arrFiles.push(file);
                        }
                    }else{
                        mui.toast(file.name +'"上传类型不符合');
                    }
                }else{
                    mui.toast(file.name +'"没有类型, 无法识别');
                }
            }

            return arrFiles;

        }
    };

    //base64转blob
    $scope.toBlob = function (urlData) {
        var bytes = window.atob(urlData.split(',')[1]);
        // 去掉url的头，并转换为byte
        // 处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var  ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab],{type : 'image/jpeg'});
    };

    //初始化标题
    $scope.initTitle = function () {
        var bodyName = '';
        var bodyDisc = '';
        var background = '';

        switch (common.getUrlParam('limb')) {
            case 'left-ancon':
                bodyName = '左侧-肘部';
                bodyDisc = '上肢自然下垂时，经肱骨内上髁和尺骨鹰嘴的水平围长。';
                background = 'url(resources/img/body/ancon.png)';
                break;
            case 'right-ancon':
                bodyName = '右侧-肘部';
                bodyDisc = '上肢自然下垂时，经肱骨内上髁和尺骨鹰嘴的水平围长。';
                background = 'url(resources/img/body/ancon.png)';
                break;
            case 'left-finesse':
                bodyName = '左侧-手腕';
                bodyDisc = '手指伸直与前臂呈直线，测量点在腕关节和手之间。';
                background = 'url(resources/img/body/finesse.png)';
                break;
            case 'right-finesse':
                bodyName = '右侧-手腕';
                bodyDisc = '手指伸直与前臂呈直线，测量点在腕关节和手之间。';
                background = 'url(resources/img/body/finesse.png)';
                break;
            case 'left-knee':
                bodyName = '左侧-膝盖';
                bodyDisc = '直膝站立，大腿肌肉放松，体重平均分布在两腿上，皮尺经髌骨中间进行测量。';
                background = 'url(resources/img/body/knee.png)';
                break;
            case 'right-knee':
                bodyName = '右侧-膝盖';
                bodyDisc = '直膝站立，大腿肌肉放松，体重平均分布在两腿上，皮尺经髌骨中间进行测量。';
                background = 'url(resources/img/body/knee.png)';
                break;
            case 'left-ankle':
                bodyName = '左侧-脚踝';
                bodyDisc = '两腿分开与肩同宽，两腿平均负担体重，测量者将皮尺在小腿踝关节上方最细部位。';
                background = 'url(resources/img/body/ankle.png)';
                break;
            case 'right-ankle':
                bodyName = '右侧-脚踝';
                bodyDisc = '两腿分开与肩同宽，两腿平均负担体重，测量者将皮尺在小腿踝关节上方最细部位。';
                background = 'url(resources/img/body/ankle.png)';
                break;

        }

        $('.titleVal').css('background', background).css('background-size', 'contain').css('background-repeat', 'no-repeat').css('background-position', 'center center');
        $('.bodyName').html(bodyName);
        $('.bodyDisc').html(bodyDisc);
        $scope.Position = bodyName;

    };

    //初始化选择数据
    $scope.initValue = function () {
        var picker = new mui.PopPicker({
            layer: 1
        });

        //1~100cm
        var parent = [];

        for(var i=1;i<101;i++){
            parent.push({value:i,text:i});
        }

        picker.setData(
            parent
        );

        document.getElementById('input-value-div').addEventListener("tap", function(){
            //默认选中
            picker.pickers[0].setSelectedIndex(19);

            picker.show(function(items){
                document.getElementById('value').innerHTML = items[0].text;

                $scope.Value = items[0].text;

            });
        });

    };

    //初始化测量时间
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

    //初始化测量日期
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

            mui('.subBtn').button('loading');

            //对数值的判断
            if($scope.Value === ''){
                mui.toast('请选择测量值');
                mui('.subBtn').button('reset');
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
                mui.toast('测量时间不得大于当前时间');
                $scope.date = nowY + '-' + nowM + '-' + nowD;
                $scope.time = nowH + ':' + nowI;

                $('#date').html(nowY + '-' + nowM + '-' + nowD);
                $('#time').html(nowH + ':' + nowIs);
                mui('.subBtn').button('reset');
                return false;
            }

            mui.showLoading("正在加载..", "div");
            $('#sButton').attr('disabled', true);
            mui('.subBtn').button('loading');

            if($scope.upImgArr[0] === undefined && $scope.upImgArr.length === 0){
                $scope.submit();
            }else{
                $scope.upload();
            }

            /*var btnArray = ['我再想想', '是的'];
            mui.confirm('确认提交数据?', '', btnArray, function(e) {
                if (e.index === 1) {

                    mui.showLoading("正在加载..", "div");

                    if($scope.upImgArr === undefined){
                        $scope.submit();
                    }else{
                        $scope.upload();
                    }

                }

            });*/

        });

    };

    //先上传图片，获取图片地址后再上传其他数据
    $scope.upload = function () {
        $scope.uploadImg = [];

        for(var i=0;i<($scope.upImgArr).length;i++){
            if($scope.upImgArr[i] !== undefined){
                $scope.uploadImg.push($scope.upImgArr[i]);
            }
        }

        //创建formData对象
        var fd = new FormData();

        for(var x=0;x<($scope.uploadImg).length;x++){
            fd.append('file' + x, $scope.uploadImg[x]);
        }

        $.ajax({
            async: false,
            method: 'post',
            processData : false,
            contentType: false,
            //cache: false,
            //dataType: 'JSON',
            url: $scope.platformUrl + '/rest/LymphedemaRecord/'  + $scope.patientId + '/UploadLimbImg',
            //url: 'https://xhyydevelopapp.mdruby.cn/rest/LymphedemaRecord/UploadLimbImg/15952',
            data: fd,
            success:function (data) {
                if(data.result === '200'){
                    $scope.Img = data.data;

                    //提交数据
                    $scope.submit();

                }else{
                    mui.hideLoading();
                    mui.toast('接口异常');
                    window.location.reload();
                }

            },
            error:function (err) {
                mui.toast('接口异常');
                mui.hideLoading();
            }
        });

    };

    //提交数据
    $scope.submit = function () {

        var param = {};

        if($scope.upImgArr === undefined){
            param = {
                PatientID:$scope.patientId,
                Position:$scope.Position,
                Value:$scope.Value,
                CreateDate:$scope.date + ' ' + $scope.time
            };
        }else{
            param = {
                PatientID:$scope.patientId,
                Position:$scope.Position,
                Value:$scope.Value,
                Img:$scope.Img,
                CreateDate:$scope.date + ' ' + $scope.time
            };
        }

        window.location.href = 'index.html?account=' + $scope.account;

        $.ajax({
            async: true,
            method: 'post',
            data: param,
            url: $scope.platformUrl + '/rest/LymphedemaRecord/AddLimb/',
            //url: 'https://xhyydevelopapp.mdruby.cn/rest/LymphedemaRecord/AddLimb',
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
                    }, 2000);

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

    //初始化样式
    $scope.initCss();

    //初始化上传
    $scope.imgUp();

    //初始化标题
    $scope.initTitle();

    //初始化选择数据
    $scope.initValue();

    //初始化测量时间
    $scope.initTime();

    //初始化测量日期
    $scope.initDate();

    //初始化确认框
    $scope.confirm();

    /*******************************************************逻辑-end***********************************************************/

});