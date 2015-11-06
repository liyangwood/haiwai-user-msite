/*
* 这里放一些和App相关的帮助类和方法
* 用angular factory包装了一下，返回$helper
* namespace HW.helper
* */

HW.App.factory('$helper', function(
    $ionicLoading,
    $window,
    $location,
    $state,
    $http,
    $ionicPopup,


    $cordovaCamera,
    $cordovaToast,
    $cordovaGeolocation,
    $cordovaAppVersion,
    $cordovaInAppBrowser,
    $cordovaDialogs,
    $ionicActionSheet,
    $cordovaKeyboard
){

    var WEIXIN_INSTALL = null,


        END = null;

    var F = {
        init : function(){
            //
            util.log('HW.helper is ok');
        },


        alert : function(str, callback){
            callback = callback || util.noop;

            if(!util.inDevice()){
                $window.alert(str);
                callback();
                return;
            }

            $cordovaDialogs.alert(str, '提示信息', '确定').then(callback);
        },

        getAppVersion : function(callback){
            if(!util.inDevice()){
                callback('1.1.1');
                return;
            }

            if(HW.config.version){
                callback(HW.config.version);
                return;
            }
            $cordovaAppVersion.getAppVersion().then(function(version){
                HW.config.version = version;
                callback(version);
            });
        },


        openUrl : function(url, opts){
            var setting = {
                location: 'no',
                clearcache: 'yes',
                toolbar: 'yes',
                toolbarposition : 'top'
            };
            $cordovaInAppBrowser.open(url, '_blank', setting);
        },

        reload : function(){
            $state.reload();
        },

        reloadToIndex : function(){
            $window.location.href = 'index.html';
        },

        goPath : function(path){
            $location.path(path);
        },

        checkUpdateForIos : function(){
            if(!util.isIOS()) return;

            var url = 'http://itunes.apple.com/lookup?id='+HW.config.appleAppId;
        },

        checkWeixinInstall : function(callback){
            if(!util.inDevice()){
                return callback(false);
            }
            if(!util.isNull(WEIXIN_INSTALL)){
                return callback(WEIXIN_INSTALL);
            }

            // check weixin is install
            if(util.inDevice()){
                Wechat.isInstalled(function(installed){
                    if(installed){
                        WEIXIN_INSTALL = true;
                    }
                    else{
                        WEIXIN_INSTALL = false;
                    }
                    callback(WEIXIN_INSTALL);
                }, function (reason) {
                    alert(reason);
                    HW.helper.toast(reason);
                    WEIXIN_INSTALL = false;
                    callback(WEIXIN_INSTALL);
                });
            }
        },

        loginWithWeixin : function(callback){
            var scope = "snsapi_userinfo";
            Wechat.auth(scope, function (response) {
                //TODO 这里的逻辑以后要放在server上处理，隐藏secret，不能在client处理
                var code = response.code;
                var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+HW.config.appid+'&secret='+HW.config.appsecret+'&code='+code+'&grant_type=authorization_code';

                $http.get(url).success(function(rs){

                    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+rs.access_token+'&openid='+rs.openid;

                    $http.get(url).success(function(data){
                        HW.helper.alert(JSON.stringify(data));


                        callback(data);
                    });

                });


            }, function (reason) {
                HW.helper.toast(reason);
            });
        }
    };


    F.popup = {

        /*
         * popup.confirm
         * @param opts.title
         * @param opts.text
         * @param opts.Yes {text:, callback: }
         * #param opts.No {text:, callback: }
         * */
        showConfirm : function(opts){
            opts = util.extend({
                title : '信息提示',
                text : '',
                okText : '确定',
                cancelText : '取消'
            }, opts||{});

            if(util.inDevice()){

                //在APP中，使用native方式
                $cordovaDialogs.confirm(opts.text, opts.title, [opts.cancelText, opts.okText]).then(function(buttonIndex){
                    if(buttonIndex === 2){
                        opts.Yes();
                    }
                    else if(buttonIndex === 1){
                        if(opts.No){
                            opts.No();
                        }
                    }
                });

                return;
            }


            var confirmPopup = $ionicPopup.confirm({
                title: opts.title,
                template: opts.text,
                okText : opts.okText,
                cancelText : opts.cancelText
            });
            confirmPopup.then(function(res) {
                if(res) {
                    opts.Yes();

                } else {
                    if(opts.No){
                        opts.No();
                    }
                }
            });
        }

        //TODO 把alert也迁移过来
    };

    F.keyboard = {
        close : function(){
            try{
                $cordovaKeyboard.close();
            }catch(e){}
        }
    };

    F.loading = {
        show : function(str, opts){
            str = str || '';
            angular.extend({}, opts||{});

            $ionicLoading.show({
                template : '<ion-spinner style="stroke: #fff;" icon="ios-small"></ion-spinner><span style="position: relative;top: -8px;">'+str+'</span>'
            });
        },
        hide : function(){
            $ionicLoading.hide();
        }
    };

    F.toast = function(str){
        if(util.inDevice()){
            $cordovaToast.show(str, 'short', 'bottom');

            return;
        }

        $ionicLoading.show({
            template : str,
            noBackdrop : true,
            duration : 1000
        });
    };

    /*
     * 一些测试性能或效率的方法，只在调试阶段使用
     * */
    F.test = {
        getWatchersSize : function(){
            var $ = angular.element;
            var root = $(document.getElementsByTagName('body'));
            var watchers = [];

            var f = function (element) {
                if (element.data().hasOwnProperty('$scope')) {
                    angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                        watchers.push(watcher);
                    });
                }

                angular.forEach(element.children(), function (childElement) {
                    f($(childElement));
                });
            };

            f(root);

            //util.log(watchers);

            return watchers.length;
        }
    };


    F.data = {
        saveNews : function(newsId, data){
            var key = 'hw-news-'+newsId;
            util.storage.set(key, data);
        },
        getNews : function(newsId){
            var key = 'hw-news-'+newsId;
            return util.storage.get(key);
        },

        saveCurrentUser : function(data){
            var key = 'hw-current-user';
            util.storage.set(key, data);
        },
        getCurrentUser : function(){
            return util.storage.get('hw-current-user');
        }
    };

    function getCacheKey(key){
        return 'hw-cache-'+key;
    }
    F.cache = {
        save : function(key, data){
            util.cache.set(getCacheKey(key), data);
        },
        get : function(key){
            return util.cache.get(getCacheKey(key));
        }
    };


    F.camera = {
        check : function(){
            if(!navigator.camera){
                F.toast('没有照相机环境');
                return false;
            }

            return true;
        },

        getPicture : function(opts, successFn, failFn){
            if(!this.check()) return;

            var options = {
                quality: 5,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 480,
                targetHeight: 400,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            opts = util.extend(options, opts||{});

            $cordovaCamera.getPicture(opts).then(successFn, failFn||util.noop);
        },

        getFromLibrary : function(opts, successFn, failFn){
            this.getPicture(opts, successFn, failFn);
        },
        getFromCamera : function(opts, successFn, failFn){
            opts = opts || {};
            opts.sourceType = Camera.PictureSourceType.CAMERA;

            this.getPicture(opts, successFn, failFn);
        },


        dataURIToBlob : function(dataURI){
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++)
            {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ab], { "type": mimeString });
            return bb;
        }

    };

    F.geolocation = {
        getPosition : function(opts, successFn, failFn){
            if(!util.inDevice()){
                F.toast('无法获得当前位置');
                return;
            }

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                F.toast(position.coords.latitude+' - '+position.coords.longitude);
                successFn(position);
            }, failFn||util.noop);
        }
    };

    F.share = {
        showBox : function(opts){

            return false;

            var pyqBtn = { text: '微信朋友圈', id : 'wx_pyq'},
                hyBtn = { text: '微信好友', id : 'wx_hy'},
                sqBtn = { text: '添加到书签', id : 'bookmark'},
                fbBtn = { text: 'Facebook', id : 'fb'},
                xtBtn = { text: '更多', id : 'system'};
            var buttons = null;
            if(!util.inDevice()){
                buttons = [sqBtn];
            }
            else{
                if(ionic.Platform.isIOS()){
                    buttons = [pyqBtn, hyBtn, fbBtn, sqBtn, xtBtn];
                }
                else if(ionic.Platform.isAndroid()){
                    buttons = [pyqBtn, hyBtn, sqBtn, xtBtn];
                }
                else{
                    buttons = [sqBtn];
                }
            }


            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                //destructiveText: 'Delete',
                titleText: '<b>分享</b>',
                cancelText: '关闭',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    switch(buttons[index]['id']){
                        case 'bookmark':
                            F.share.toMyBookmarkList(opts);
                            break;
                        case 'wx_pyq':
                            F.share.toWechatTimeline(opts);
                            break;
                        case 'wx_hy':
                            F.share.toWechatSession(opts);
                            break;
                        case 'fb':
                            F.share.toFacebook(opts);
                            break;
                        case 'system':
                            F.share.toSystemShare(opts);
                            break;

                    }

                    return true;
                }
            });

            return hideSheet;

        },

        toWechat : function(target, opts){
            if(util.isUndefined(window.Wechat)){
                F.toast('当前环境不能分享');
                return false;
            }

            var config = util.extend({
                title : '',
                description : '',
                url : '',
                success : util.noop,
                error : util.noop
            }, opts||{});

            var successFn = config.success,
                errorFn = config.error;

            target = target || 'FAVORITE';

            Wechat.share({
                message: {
                    title: config.title,
                    description: config.description,
                    //mediaTagName: "wenxuecity",
                    //thumb: "www/image/logo-20140515.png",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: config.url
                    }
                },
                scene: Wechat.Scene[target]
            }, function () {
                util.log('share success');
                F.toast('分享成功');

                successFn();
            }, function (reason) {
                F.toast(reason);
                errorFn(reason);
            });


        },

        //到微信朋友圈
        toWechatTimeline : function(opts){
            return this.toWechat('TIMELINE', opts);
        },


        //到微信好友
        toWechatSession : function(opts){
            return this.toWechat('SESSION', opts);
        },

        toMyBookmarkList : function(opts){
            if(!HW.user.get('isLogin')){
                HW.user.showLoginModal({});
                return;
            }

            var user = HW.user.get();
            HW.request.addBookmark({
                title : opts.title,
                url : opts.url,
                userid : user.userid,
                username : user.username,
                token : user.token
            }, function(rs){
                F.toast('添加成功');
            });

        },

        toSystemShare : function(opts){
            if(!util.inDevice()){
                F.toast('当前环境不能分享');
                return false;
            }
            window.plugins.socialsharing.share(opts.title, opts.title, null, opts.url);
        },

        toFacebook : function(opts){
            if(!util.inDevice()){
                F.toast('当前环境不能分享');
                return false;
            }

            // title, img, url, successFn, errorFn
            window.plugins.socialsharing.shareViaFacebook(
                opts.title,
                null,
                opts.url,
                function(){
                    F.toast('分享成功');
                }, function(error){
                    F.toast('分享失败');
                    util.error(error);
                }
            );
        }

    };



    HW.helper = F;
    return F;
});
