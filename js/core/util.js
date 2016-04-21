
'use strict';

(function(){
    var _uuid = 1;


    var util = {};

    //merge underscore
    _.extend(util, _);

    util.extend(util, {
        setPageTitle : function(str){
            if(str){
                document.title = str;
            }
        },

        addUserIdToRequestData : function(data){
            data = data || {};
            data.userid = KG.user.get('userid');
            data.token = KG.user.get('token');

            return data;
        },

        formatDate : function(date, format){
            if(date.toString().length === 10){
                date = parseInt(date)*1000;
            }

            var d = new Date(date);
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

        getUuid : function(){
            return 'uuid_'+_uuid++;
        },

        uploadImage : function(file, callback){

            if(!file) return;

            var fr = new FileReader();
            fr.onload = function(e){
                var binary = e.target.result;

                KG.request.uploadImage({
                    image : binary
                }, function(flag, rs){
                    if(flag){
                        callback(rs.files[0]);
                    }
                });
            };

            fr.readAsDataURL(file);
        },

        readFile : function(file, callback){
            var fr = new FileReader();
            fr.onload = function(e){
                var binary = e.target.result;
                callback(binary);
            };
            fr.readAsDataURL(file);
        },

        getQrCode : function(url, size){
            size = size || 240;
            return 'http://api.qrserver.com/v1/create-qr-code/?size='+size+'x'+size+'&data='+encodeURIComponent(url);
        },

        showPageLoading : function(f){
            return false;
            f = f || false;
            if(f){
                $('#fakeLoader').show().fakeLoader({
                    timeToHide : 20000,
                    spinner : 'spinner7',
                    bgColor : 'rgba(0,0,0,0)'
                });
            }
            else{
                $('#fakeLoader').hide();
            }

        },

        loading : function(f){
            return false;
            f = f || false;
            if(f){
                $('#fakeLoader1').show().fakeLoader({
                    timeToHide : 50000,
                    spinner : 'spinner7',
                    bgColor : 'rgba(0,0,0,0)'
                });
            }
            else{
                $('#fakeLoader1').hide();
            }
        },

        replaceHtmlImgSrcToAbsolute : function(html){
            var reg = new RegExp('<img\.*src=(\"|\')([^\"\']+)(\"|\')\\s*([\\w]+=(\"|\')([^\"\']*)(\"|\')\\s*)*/>', 'g');
            return html.replace(reg, function(match){
                console.log(match);
                var src = arguments[2];
                if(/^http/.test(src)){
                    return match;
                }
                else{
                    return match.replace(src, KG.config.SiteRoot+src);
                }

            });
        },

        removeHtmlTag : function(html){
            return html.replace(/<([^>]*)>/g, '');
        },

        getLatAndLongWithAddress : function(address, callback){
            var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+KG.config.GoogleMapApiKey;
            $.getJSON(url, {}, function(rs){
                if(rs.status === 'OK'){
                    callback(rs.results[0].geometry.location);
                }
            });
        }
    });


    util.cookie = {
        get : function(name) {
            var tmp, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)","gi");
            if( tmp = reg.exec( unescape(document.cookie) ) )
                return(tmp[2]);
            return null;
        },

        set : function(name, value, expires, path, domain) {
            path = path || "/";
            expires = expires || 'never';
            var str = name + "=" + escape(value);
            if(expires){
                if (expires == 'never') {
                    expires = 100*365*24*60;
                }
                var exp = new Date();
                exp.setTime(exp.getTime() + expires*60*1000);
                str += "; expires="+exp.toGMTString();
            }
            if(path){
                str += "; path=" + path;
            }
            if(domain){
                str += "; domain=" + domain;
            }
            document.cookie = str;
        },

        remove: function(name, path, domain) {
            document.cookie = name + "=" +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                "; expires="+new Date(0).toGMTString();
        }
    };

    util.dom = {
        scrollTo : function(top){
            var win = $(window);

            //TODO;
            win.scrollTop(top);
        },

        showErrorPopover : function(obj, msg, opts){
            var color = '#ff0000';

            if(msg === false){
                obj.popover('destroy');
                return;
            }

            opts = opts || {};
            obj.popover({
                placement : opts.placement || 'bottom',
                html : true,
                //title : '',
                trigger : opts.trigger || 'click',
                content : '<span style="color:'+color+'">'+msg+'</span>'
            }).popover('show');
        },

        loadingButton : function(btn, f){

            if(f){
                if(!btn.data('loading-text')){
                    btn.data('loading-text', 'Loading...');
                }

                btn.addClass('btn-loading').button('loading');
            }
            else{
                btn.removeClass('btn-loading').button('reset');
            }
        }
    };

    //TODO 优化逻辑
    var MessageParam = {};
    util.message = {
        register : function(name, fn){
            var callback = function(e, data){
                data = MessageParam[name] ? MessageParam[name].data : data;
                fn(e, data);
            };

            $('body').unbind(name).bind(name, callback);

            if(MessageParam[name]){
                var tmp = MessageParam[name];
                fn(null, tmp.data);

                //delete(MessageParam[name]);
            }
        },
        publish : function(name, data){
            MessageParam[name] = {
                data : data
            };

            $('body').trigger(name, data);
        }
    };


    var hiddenDialogFn = null;
    util.dialog = {
        setHiddenDialogFn : function(fn){
            hiddenDialogFn = fn;
        },
        init : function(){
            var html = [
                '<div class="modal fade" id="kg_modal_dialog" tabindex="-1" role="dialog">',
                '<div class="modal-dialog" role="document">',
                '<div class="modal-content box">',

            '</div>',
            '</div>',
            '</div>'
            ].join('');
            html = $(html);

            html.on('hidden.bs.modal', function(){
                var box = html.find('.box');
                box.find('.js_yes').unbind('click');
                box.find('.js_no').unbind('click');

                box.empty();

                if(hiddenDialogFn){
                    hiddenDialogFn();
                    hiddenDialogFn = null;
                }
            });


            html.appendTo('body');
        },

        get : function(opts){
            if($('#kg_modal_dialog').length < 1){
                util.dialog.init();
            }
            var obj = $('#kg_modal_dialog');

            if(!opts){
                return obj;
            }

            var p = util.extend({
                title : '信息提示',
                body : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                foot : true,
                type : 'confirm',

                YesText : '确认',
                YesFn : util.noop,
                NoText : '取消',
                NoFn : function(callback){
                    callback();
                },

                end : null
            }, opts);

            var html = [
                '{{if type!=="toast"}}',
                '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="fa fa-times"></i></button>',
                '</div>',
                '{{/if}}',

                '<div class="modal-body">',
                    '{{if title}}',
                        '<h4 class="hw-title">{{#title}}</h4>',
                    '{{/if}}',

                    '{{if body}}<div class="hw-body">{{#body}}</div>{{/if}}',

                '</div>',

                '{{if foot}}',
                '<div class="modal-footer">',
                    '<button type="button" class="hw-btn hw-light-btn js_no">{{NoText}}</button>',
                    '{{if YesText}}<button type="button" class="hw-btn hw-blue-btn js_yes">{{YesText}}</button>{{/if}}',
                '</div>',
                '{{/if}}'
            ].join('');

            html = template.compile(html)(p);

            obj.find('.box').html(html);

            obj.find('.js_yes').click(function(e){
                p.YesFn(function(){
                    util.dialog.hide();
                }, e);
            });

            obj.find('.js_no').click(function(e){
                p.NoFn(function(){
                    util.dialog.hide();
                }, e);
            });


            //class
            obj.attr('class', 'modal fade');
            if(opts.class){
                obj.addClass(opts.class);
            }


            return obj;
        },

        show : function(opts){
            var obj = util.dialog.get(opts);

            if(opts.beforeShowFn){
                opts.beforeShowFn.call(obj);
            }
            if($('body').hasClass('modal-open')){
                obj.addClass('in');
            }
            else{
                obj.modal('show');
            }

        },
        hide : function(){
            var obj = util.dialog.get();
            obj.modal('hide');
        },

        showImageList : function(list, clickFn){
            var h = [
                '<div class="js_box">',
                    '{{each list as item index}}',
                    '<div role="BaseLoadingImageBox" param="{{index}}" data-url="{{item}}" class="img-item"></div>',
                    '{{/each}}',
                '</div>'
            ].join('');
            h = template.compile(h)({
                list : list
            });
            util.dialog.show({
                body : h,
                foot : false,
                'class' : 'hw-dialog-imglist',
                title : '('+list.length+')'
            });


            var obj = util.dialog.get();
            KG.component.init(obj.find('.js_box'));
            obj.find('.js_box').on('click', '.img-item', function(){
                var index = $(this).attr('param');
                clickFn(index);
                return false;
            });
        },

        showFocusImage : function(index, list){
            var h = [
                '<div id="cb_cccc" class="carousel slide" data-ride="carousel">',
                    <!-- Indicators -->
                    '<ol class="carousel-indicators">',
                    '{{each list}}',
                    '<li data-target="#cb_cccc" data-slide-to="{{$index}}" class="{{if index==$index}}active{{/if}}"></li>',
                    '{{/each}}',
                    '</ol>',

                    '<div class="carousel-inner" role="listbox">',
                        '{{each list as url}}',
                        '<div class="item {{if index==$index}}active{{/if}}">',
                            '<a target="_blank" href="{{url}}"><img src="{{url}}"></a>',
                            //'<div class="carousel-caption">',
                            //'</div>',
                        '</div>',
                        '{{/each}}',

                    '</div>',

                    '<a class="left carousel-control" href="#cb_cccc" role="button" data-slide="prev">',
                        '<span style="top:128px;" class="icon fa fa-angle-left" aria-hidden="true"></span>',
                        '<span class="sr-only">Previous</span>',
                    '</a>',
                    '<a class="right carousel-control" href="#cb_cccc" role="button" data-slide="next">',
                        '<span style="top:128px;" class="icon fa fa-angle-right" aria-hidden="true"></span>',
                        '<span class="sr-only">Next</span>',
                    '</a>',
                '</div>'
            ].join('');
            h = template.compile(h)({
                list : list,
                index : index
            });

            util.dialog.show({
                body : h,
                foot : false,
                'class' : 'hw-carousel',
                title : ''
            });

            return util.dialog.get();
        },

        confirm : function(opts){
            var param = {
                title : opts.msg,
                body : false,
                NoText : '取消',
                YesText : opts.YesText || '确认',
                'class' : 'hw-confirm',
                YesFn : opts.YesFn
            };

            if(opts.title){
                param.title = opts.title;
                param.body = opts.msg;
            }

            util.dialog.show(param);
        },
        confirm1 : function(opts){
            var param = {
                title : opts.msg,
                body : false,
                NoText : '取消',
                YesText : opts.YesText || '确认',
                'class' : 'hw-confirm1',
                YesFn : opts.YesFn
            };
            util.dialog.show(param);
        },

        showQrCode : function(codeUrl, title){
            var h = '<div class="hw-qr"><img src="'+util.getQrCode(codeUrl, 200)+'" /></div>';

            util.dialog.show({
                body : h,
                title : title || '打开微信扫一扫以下二维码即可打开本店页面，点击屏幕右上角分享按钮',
                foot : false,
                'class' : 'hw-dialog-qrcode'
            });
        },

        showWeixinLoginQrCode : function(redUrl){
            var h = '<div class="hw-qr" id="js_weixin_qr"></div>';
            util.dialog.show({
                body : h,
                title : '',
                foot : false,
                'class' : 'hw-dialog-qrcode'
            });
            console.log(redUrl)
            return new WxLogin({
                id : 'js_weixin_qr',
                appid: KG.config.WeixinAppID,
                scope: "snsapi_login",
                redirect_uri: encodeURIComponent(redUrl),
                state: 'aaa',
                style: "black",   //white
                href: ""
            });
        },

        showLoginBox : function(opts){
            var param = {
                foot : false,
                'class' : 'hw-dialog-login',
                body : '<div class="js_role" role="HWLoginRegBoxComp" data-type="login"></div>',

                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        },

        showLoginAddPasswordBox : function(){
            var param = {
                foot : false,
                'class' : 'hw-dialog-logininfo',
                body : '<div class="js_role" role="HWBaseLoginAddPassword"></div>',

                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        },

        showLoginAddEmailAndPasswordBox : function(){
            var param = {
                foot : false,
                'class' : 'hw-dialog-logininfo',
                body : '<div class="js_role" role="HWBaseLoginAddEmailAndPassword"></div>',

                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        },

        showRegBox : function(opts){
            var param = {
                foot : false,
                'class' : 'hw-dialog-login',
                body : '<div class="js_role" role="HWLoginRegBoxComp" data-type="reg"></div>',

                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        },
        alert : function(msg, body){
            body = body || '';
            util.dialog.show({
                foot : false,
                title : msg,
                body : '<p>'+body+'</p>',
                'class' : 'hw-dialog-alert'
            });
        },

        showCouponDetail : function(couponID){
            var param = {
                foot : false,
                title : '',
                'class' : 'hw-dialog-coupon',
                body : '<div class="js_role" role="HWSiteCouponDetailComp" data-coupon="'+couponID+'"></div>',
                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        },

        showSelectLocationRegion : function(){
            var param = {
                foot : false,
                title : '选择地区',
                'class' : 'hw-dialog-region',
                body : '<div class="js_role" role="HWSelectRegionLocation"></div>',
                beforeShowFn : function(){
                    var o = this;
                    KG.component.initWithElement(o.find('.js_role'));
                }
            };
            util.dialog.show(param);
        }
    };

    util.alert = function(msg){
        util.dialog.alert(msg);
    };


    util.toast = {
        showError : function(msg, opts){
            var h = '<div class="hw-icon" style="border: none;"><i style="color: #f4a62a; top:4px;font-size:' +
                '32px;" class="fa fa-exclamation-circle"></i></div>';
            util.dialog.alert(h+msg, '');
        },
        alert : function(msg, body){
            body = body || '';
            var h = '<div class="hw-icon"><i class="fa fa-check"></i></div>';
            util.dialog.alert(h+msg, body);

            util.delay(function(){
                try{
                    util.dialog.hide();
                }catch(e){}
            }, 3000);
        }
    };



    util.url = {
        param : function(key, url){
            url = url || location.search;

            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
                results = regex.exec(url);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        hash : function(){
            return location.hash.replace(/^#/, '');
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

    util.path = {
        go : function(url){
            location.href = url;
        },

        article : function(id){
            return '../view/article.html?id='+id;
        },
        store : function(id){
            return '../view/store.html?id='+id;
        },

        toMSiteStore : function(id){
            return KG.config.SiteRoot+'/mobile/ionic/store.html?id='+id;
        },
        toMSiteArticle : function(id){
            return KG.config.SiteRoot+'/mobile/ionic/article.html?id='+id;
        },
        toMSiteCoupon : function(id){
            return KG.config.SiteRoot+'/mobile/ionic/action.html?id='+id;
        }
    };

    util.validate = {
        email : function(email){
            var reg = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

            return reg.test(email);
        },
        AmericanPhone : function(phone){
            var reg = /^[0-9]{10}$/;
            return reg.test(phone);
        },
        password : function(pwd){
            if(!pwd) return false;
            if(pwd.length < 6) return false;

            return true;
        }
    };

    util.pic = {
        replaceToBig : function(src){
            if(src.indexOf('s_pic0')>0){
                src = src.replace('s_pic0', 'pic0');
            }
            return src;
        }
    };


    //和业务逻辑有关的帮助方法
    util.helper = {
        getBizListByType : function(data, type){
            type = type || 'running';
            var runningList = [],
                stopList = [];
            util.each(data, function(item){
                if(item.visible === '1'){
                    runningList.push(item);
                }
                else{
                    stopList.push(item);
                }
            });

            var rs = runningList;
            if(type !== 'running'){
                rs = stopList;
            }
            return rs;
        }
    };

    util.const = {
        InputEmail : '请输入邮箱',
        InputEmailFormatError : '输入邮箱格式不正确',
        InputPassword : '请输入密码',
        PasswordNotEqual : '二次输入的密码不一致'
    };



    window.util = KG.util = util;


    //debug
    if(!util.url.param('debug')){
        console.log = console.error = function(){};
    }
})();






(function(){
    template.helper('equal', function(x, y){
        return x===y;
    });

    template.helper('absImage', function(url){
        if(/^http/.test(url)){
            return url;
        }

        return KG.config.SiteRoot+url;
    });

    template.helper('siteUrl', function(url){
        if(/^http/.test(url)){
            return url;
        }

        return 'http://'+url;
    });


    template.helper('formatDate', function(date, format){
        return util.formatDate(date, format||'yy年mm月dd日 h:m:s');
    });


    template.helper('storeFullAddress', function(item){
        var h = '';
        if(item.address){
            h += item.address+', ';
        }
        if(item.city){
            h += item.city+', ';
        }
        if(item.state){
            h += item.state.toUpperCase()+' ';
        }
        if(item.zip){
            h += item.zip;
        }
        return h;
    });
    template.helper('storeFullAddress1', function(item){
        return item.address_t+', '+item.city+', '+item.state+' '+item.zip;
    });
    template.helper('defaultUserImage', function(image){
        if(!image){
            return KG.user.get('defaultImage');
        }
        return image;
    });
    template.helper('decode', function(str){
        if(!str) return '';
        var rs;
        try{
            rs = decodeURIComponent(str);
        }catch(e){
            rs = str;
        }
        return rs;
    });
    template.helper('htmlToTextNoBr', function(html){
        var h = '';
        try{
            h = decodeURIComponent(html).replace(/<([^>]*)>/g, '');
        }catch(e){
            h = html.replace(/<([^>]*)>/g, '');
        }
        return h;
    });
    template.helper('htmlToText', function(html){
        var h = '';
        try{
            h = decodeURIComponent(html).replace(/<([^>]*)>/g, '');
        }catch(e){
            h = html.replace(/<([^>]*)>/g, '');
        }
        h = h.replace(/\n/g, '<br/>');
        return h;
    });

    template.helper('toArticlePath', function(id){
        return util.path.article(id);
    });
    template.helper('toStorePath', function(id){
        return util.path.store(id);
    });

    template.helper('logoPath', function(item){
        var logo = item.logo[0].path;
        if(/^http/.test(logo)){
            return logo;
        }

        return KG.config.SiteRoot + logo;
    });
    template.helper('formatPhone', function(num){
        var rs = num.toString().split('');
        rs.splice(3, 0, '-');
        rs.splice(7, 0, '-');
        return rs.join('');
    });
})();


$(function(){
    window.fbAsyncInit = function() {
        FB.init({
            appId : '250258495319287',
            cookie : true,
            xfbml : true,
            version : 'v2.5'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    var filed = [
        'email',
        'first_name',
        'last_name',
        'name',
        'gender',
        'picture'

    ].join(',');
    window.util.Facebook = {
        getTokenWithData : function(data, callback){
            //alert(JSON.stringify(data));
            KG.request.oauthLoginWithFacebook({
                openID : data.id,
                email : data.email,
                nick : data.name,
                image : data.picture.data.url
            }, function(flag, rs){
                if(flag){
                    callback(true, rs);
                }
                else{
                    callback(false, rs);
                }

            });


        },

        login : function(callback){


            FB.getLoginStatus(function(res){
                if(res.status === 'connected'){
                    FB.api('/me', function(response) {
                        console.log(response);
                        util.Facebook.getTokenWithData(response, callback);
                    }, {fields : filed});
                }
                else{
                    FB.login(function(res){
                        console.log(res);
                        if(res.status === 'connected'){
                            FB.api('/me', function(response) {
                                console.log(response);
                                util.Facebook.getTokenWithData(response, callback);
                            }, {fields : filed});
                        }
                        else{
                            util.toast.showError('登录失败');
                            callback(false);
                            _.delay(function(){
                                location.reload();
                            }, 2000);
                        }
                    });
                }
            });


        }
    };
});