//这里把一些全局需要的namespace初始化
HW.App.run(function($helper, $request){
    $helper.init();
    $request.init();
});


/*
* 对 rootScope 进行一些必要的处理
* */

HW.App.run(function(
    $ionicPlatform,
    $rootScope,
    $window,
    $ionicHistory,
    $state,
    $user,

    $cordovaFile
){

    //$window.alert($ionicPlatform.ready);
    document.addEventListener('deviceready', function(){


    });
    //angular.element(document).ready(function(){
    //    $window.alert(555);

    //});
    ionic.Platform.ready(function(){
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }



    });

    $rootScope.$on('$ionicView.beforeEnter', function() {

        //添加全局控制逻辑，控制tabs是否隐藏
        $rootScope.hideTabs = $state.current.hideTab || false;

        if($state.current.requireLogin && !$user.get('isLogin')){
            HW.helper.goPath('/home');
        }

    });

    $rootScope.fn = {
        formatDate: util.formatDate,
        openUrl : HW.helper.openUrl,
        getRecentDate : util.getRecentDate,
        goPath : HW.helper.goPath,
        alert : HW.helper.alert,

        clickHome : function(self){
            //TODO 临时方案，以后处理
            if(self.$tabSelected) return false;
            if(HW.user.get('isLogin')){
                HW.helper.goPath('/home/store-list');
            }
            else{
                HW.helper.goPath('/home');
            }
        },

        goBack : function(){
            if($state.current.needAskSaveOrNot){
                //ask need save or not
                HW.helper.popup.showConfirm({
                    text : '是否放弃编辑？',
                    Yes : function(){
                        $ionicHistory.goBack();
                    }
                });

            }
            else{
                $ionicHistory.goBack();
            }
        },

        showShareBox : HW.helper.share.showBox,

        formatPhone : function(number){
            if(!number) return '';
            number = number.toString();
            if(number.length<10) return number;
            var arr = number.split('');
            arr.splice(3, 0, '-');
            arr.splice(7, 0, '-');

            return arr.join('');
        },

        //publishStore : PubStoreModalFactory.showModal
        publishStore : function(){
            $state.go('tab.home-create-store');
        }
    };



    $rootScope.global = {
        user : $user.get(),
        URLROOT : HW.config.APPROOT
    };







});