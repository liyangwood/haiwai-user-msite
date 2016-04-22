
'use strict';
(function($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function(options) {

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function() {
            var $this = $(this).parent(),
                defaults = {
                    delay: 500,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                options = $.extend(true, {}, defaults, options, data),
                timeout;

            $this.hover(function() {
                if(options.instantlyCloseOthers === true)
                    $allDropdowns.removeClass('open');

                window.clearTimeout(timeout);
                $(this).addClass('open');
            }, function() {
                timeout = window.setTimeout(function() {
                    $this.removeClass('open');
                }, options.delay);
            });
        });
    };

    
})(jQuery, this);

(function(){
    if(this.KG){
        this._KG = KG;
    }
    this.KG = {};
}).call(window);


(function(){

    var site = 'http://beta.haiwai.com';
    if(location.host === 'www.haiwai.com'){
        site = 'http://www.haiwai.com';
    }

    KG.config = {
        root : '/haiwai-user-msite',
        SiteRoot : site,
        ApiRoot : site+'/service/api/',
        MD5_KEY : 'm.y^w8oP01K#gs',
        GoogleMapApiKey : 'AIzaSyCjKJoA5eBc75v5pQurBQ3IjP4vNkfoOzw',
        WeixinAppID : 'wx4c519e506d840934',
        WeixinAppSecret : 'a160e78f682317dbf6ed8ffe4e56bc30',
        WeixinLoginRedirectUrl : 'http://beta.haiwai.com/pc/page/site/index.html',

        SJAPP_AppleStore_Url : 'https://itunes.apple.com/us/app/hai-wai-tong-cheng-shang-jia/id974815137',

        WenxuecityUrl : 'http://www.wenxuecity.com'
    };
    KG.config.Wenxuecity_Ads_Url = KG.config.WenxuecityUrl+'#haiwai';

    KG.Const = {

    };

    KG.default = {
        BizBigBgPic : '../../image/default_bg_pic.png',
        articleImage : KG.config.SiteRoot+'/images/lifetools_default_article.png',
        couponImage : KG.config.SiteRoot+'/images/default_event_logo.png',
        storeImage : KG.config.SiteRoot+'/images/default_logo.jpeg'
    };

    var user = {
        image : 'http://www.sinomedianet.com/haiwai2015.3.19/images/default_avatar.png',
        defaultImage : 'http://www.sinomedianet.com/haiwai2015.3.19/images/default_avatar.png',
        email : '',
        userid : '',
        tel : '',
        token : '',
        isLogin : false
    };
    KG.user = {
        get : function(key){
            if(key){
                return user[key];
            }
            return user;
        },

        reset : function(){
            user = _.extend(user, {
                image : '',
                email : '',
                userid : '',
                token : '',
                isLogin : false
            });
        },

        logout : function(){
            var data = {
                act : 'logout',
                func : 'passport'
            };
            data = util.addUserIdToRequestData(data);
            return KG.request.ajax(data, function(flag, rs){
                if(flag){
                    KG.user.reset();
                    util.storage.set('current-login-user', null);
                    location.reload();
                }
            });
        },

        set : function(json){
            user.image = json.avatar_url;
            if(!/^http/.test(user.image)){
                user.image = KG.config.SiteRoot+user.image;
            }
            user.isLogin = true;
            _.extend(user, json);
            return user;
        },

        getUserDetailWithToken : function(opts, success){
            if(opts.pk_id){
                user.userid = opts.pk_id;
                user.token = opts.token;
                user.email = opts.email;

                KG.request.getUserDetailInfo({}, function(f, json){
                    if(f){
                        KG.user.set(json);

                        util.storage.set('current-login-user', user);

                        success(user);
                    }

                });
            }
        },

        login : function(opts, success, error){
            var successFN = function(flag, rs){
                if(rs.pk_id){
                    KG.user.getUserDetailWithToken(rs, success);
                }
                else{
                    error(rs.msg?rs.msg:rs);
                }
            };

            KG.request.login(opts, successFN, error);
        },

        register : function(opts, success, error){
            return KG.request.register(opts, success, error);
        },

        update : function(){
            KG.request.getUserDetailInfo({}, function(f, json){
                if(f){
                    KG.user.set(json);

                    util.storage.set('current-login-user', user);

                }
            });
        },

        checkLogin : function(next){
            next = next || function(){};
            var u = util.storage.get('current-login-user');
            if(u && u.token){
                _.extend(user, u);
                KG.request.checkLogin({}, function(flag, rs){
                    if(flag){
                        KG.user.set(rs);
                        next();
                    }
                    else{
                        KG.user.reset();
                        next();
                    }
                });
            }
            else{
                KG.user.reset();
                next();
            }
        }
    };

    var data = {};
    KG.data = {
        get : function(key){
            if(key){
                return data[key];
            }
            return data;
        },
        add : function(param){
            util.extend(data, param||{});
        }
    };


    KG.validate = {
        email : function(val){
            if(!val){
                return [false, util.const.InputEmail];
            }
            if(!util.validate.email(val)){
                return [false, util.const.InputEmailFormatError];
            }

            return [true];
        },
        password : function(val){
            if(!val){
                return [false, '请输入密码'];
            }
            if(val.length < 6){
                return [false, '密码长度不能少于6位'];
            }

            return [true];
        }
    };

})();


