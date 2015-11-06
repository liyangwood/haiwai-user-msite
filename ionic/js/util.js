/*
 * 这里放一些和业务无关的辅助method
 * namespace HW.util, util
 *
 **/
(function(){
    var util = {
        debug : true,
        log : function(){
            //console.log.apply(console, arguments);
        },
        error : function(){
            //console.error.apply(console, arguments);
        },

        getTplFile : function(name){
            return HW.config.ROOT + 'tpl/'+name+'.html';
        },
        getPageFile : function(){
            return HW.config.ROOT + 'page/'+name+'.html';
        },

        setTitle : function(title){
            document.title = title;
        },




        /*
         * 把array按照参数分成若干组 [1,2,3,4] -> [[1,2], [3,4]]
         * @param arr
         * @param num
         * @return Array
         * */
        cutArrayByNum : function(arr, num){
            var rs = [];
            var len = Math.ceil(arr.length / num);

            for(var i= 0; i<len; i++){
                rs[i] = [];
            }

            var n= 0,
                size = arr.length;
            while(n < size){
                var rsIndex = Math.floor(n / num),
                    tmp = rs[rsIndex];

                var ta = n % num;
                tmp[ta] = arr[n];

                n++;
            }

            return rs;
        },

        formatDate : function(format, date){
            var d = date ? new Date(parseInt(date.length>12?date:date*1000, 10)) : new Date();
            var year = d.getFullYear(),
                month = addZero(d.getMonth() + 1),
                day = addZero(d.getDate()),
                hour = addZero(d.getHours()),
                min = addZero(d.getMinutes()),
                sec = addZero(d.getSeconds());

            function addZero(x){
                if(x<10) return '0'+x;
                return x;
            }

            return format.replace('yy', year).replace('mm', month).replace('dd', day).replace('h', hour).replace('m', min).replace('s', sec);
        },

        getRecentDate : function(timestamp){
            if(timestamp.length < 5) return timestamp;
            nd = parseInt(timestamp)*1000;
            var xd = new Date().getTime();

            var tmp = (xd - nd) / 1000,
                rs = '';
            if(tmp < 60){
                rs = Math.floor(tmp)+'秒前';
            }
            else if(tmp < 60 * 60){
                rs = Math.floor(tmp/(60))+'分钟前';
            }
            else if(tmp < 60*60*24){
                rs = Math.floor(tmp/(60*60))+'小时前';
            }
            else{
                rs = util.formatDate('yy-mm-dd h:m', Math.floor(nd/1000));
            }

            return rs;
        },

        inDevice : function(){
            return window.cordova ? true : false;
        },

        getStatusBarHeight : function(){
            var rs =  this.inDevice() ? 20 : 0;

            if(ionic.Platform.isAndroid()){
                rs = 0;
            }

            return rs;
        },

        isAndroid : ionic.Platform.isAndroid,
        isIOS : ionic.Platform.isIOS
    };

    util.string = {
        contain : function(all, str){
            return all.indexOf(str) !== -1;
        }
    };

    util.dom = {
        getClientSize : function(){
            var w = window.innerWidth || document.body.clientWidth,
                h = window.innerHeight || document.body.clientHeight;


            return {
                width : w,
                height : h
            }
        }
    };

    util.storage = {
        set : function(key, value, opts){
            opts = util.extend({
                expires : 'max'
            }, opts||{});

            //if(util.isObject(value) || util.isArray(value)){
            //    value = JSON.stringify(value);
            //}
            var json = JSON.stringify({
                data : value
            });
            //TODO 处理数据存储过期时限

            window.localStorage.setItem(key, json);
        },
        get : function(key){
            var data = window.localStorage.getItem(key);
            if(!data) return null;
            return JSON.parse(data).data;
        }
    };

    util.url = {
        param : function(key){
            var rs = _.object(_.compact(_.map(location.search.slice(1).split('&'), function(item) {  if (item) return item.split('='); })));
            return rs[key];
        }
    };

    /*
     * 内存缓存
     * */
    var CacheStorage = {};
    util.cache = {
        set : function(key, value, opts){
            CacheStorage[key] = value;
        },
        get : function(key){
            return CacheStorage[key] || null;
        }
    };

    util.jq = angular.element;

    //使用underscore
    _.extend(util, _);

    //util.animation = window.collide.animation;

    if(!util.debug){
        console.log = console.error = util.noop;
    }

    window.util = util;
})();