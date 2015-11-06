
/*
* 这里是私有业务逻辑
* 所以没有使用angular factory包装
* 目的是层次分开，angular只是实线层，考虑以后可能会更换的情况
* */

(function(){
    var HW = {};

    /*
    * 一些全局配置信息
    * */
    HW.config = {
        ROOT : './',
        //APPROOT : 'http://www.haiwai.com',
        APP_NAME : 'HaiWaiApp',

        appid : 'wx938e1cb96883c1b0',
        appsecret : '516c988f03321e9727e34ebb2135e834',

        SERVER : 'http://beta.haiwai.com',
        //SERVER : 'http://office.haiwai.com',


        MD5_KEY : 'm.y^w8oP01K#gs',


        end : ''
    };

    HW.config.APPROOT = HW.config.SERVER;

    HW.config.API_PATH = HW.config.SERVER + '/service/api/';

    if(window.RES_ROOT){
        HW.config.ROOT = window.RES_ROOT;
    }





    /*
    * 初始化angular app
    * */
    //HW.App = angular.module(HW.config.APP_NAME, ['ionic', 'uiGmapgoogle-maps', 'ngIOS9UIWebViewPatch', 'ngCordova']);
    HW.App = angular.module(HW.config.APP_NAME, ['ionic', 'ngCordova']);
    //HW.App.config(['$ionicConfigProvider', 'uiGmapGoogleMapApiProvider', function($ionicConfigProvider, uiGmapGoogleMapApiProvider){
    HW.App.config([
        '$ionicConfigProvider',
        '$sceDelegateProvider',

        function($ionicConfigProvider, $sceDelegateProvider){

            //tabs强制放到底部，否则android默认是放到顶部的
            $ionicConfigProvider.tabs.position('bottom');

            //$ionicConfigProvider.views.maxCache(0);
            $ionicConfigProvider.backButton.text('返回');
            $ionicConfigProvider.backButton.previousTitleText('');


            //load google map
            //uiGmapGoogleMapApiProvider.configure({
            //    //    key: 'your api key',
            //    china : true,
            //    v: '3.17',
            //    libraries: 'weather,geometry,visualization'
            //});

            //禁用页面的侧滑返回的功能
            $ionicConfigProvider.views.swipeBackEnabled(false);

            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                HW.config.ROOT + '**'
            ]);

    }]);

    window.HW = HW;
})();