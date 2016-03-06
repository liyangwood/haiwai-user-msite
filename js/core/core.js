
'use strict';
(function(){
    if(this.KG){
        this._KG = KG;
    }
    this.KG = {};
}).call(window);


(function(){

    var site = 'http://beta.haiwai.com';

    KG.config = {
        root : '/haiwai-user-msite',
        SiteRoot : site,
        ApiRoot : site+'/service/api/',
        MD5_KEY : 'm.y^w8oP01K#gs'
    };

    KG.Const = {

    };

    KG.default = {
        BizBigBgPic : '../../image/default_bg_pic.png'
    };

    var user = {
        image : KG.config.root+'/image/user_default.png',
        defaultImage : KG.config.root+'/image/user_default.png',
        email : 'liyang@chinagate.com',
        userid : 14678,
        tel : '5735769567',
        token : '5847ac0c8efb8552d1b7c42a4c3f2418',
        isLogin : true
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
                    location.reload();
                }
            });
        },

        login : function(opts, success, error){
            var successFN = function(flag, rs){
                if(rs.pk_id){
                    user.userid = rs.pk_id;
                    user.token = rs.token;
                    user.email = rs.email;

                    KG.request.getUserDetailInfo({}, function(f, json){
                        if(f){
                            user.image = KG.config.SiteRoot+json.avatar_url;
                            user.isLogin = true;
                            _.extend(user, json);

                            util.storage.set('current-login-user', user);

                            success(user);
                        }

                    });
                }
                else{
                    error(rs.msg?rs.msg:rs);
                }
            };

            KG.request.login(opts, successFN, error);
        },

        update : function(){
            KG.request.getUserDetailInfo({}, function(f, json){
                if(f){
                    user.image = KG.config.SiteRoot+json.avatar_url;
                    user.isLogin = true;
                    _.extend(user, json);

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
                        user.userid = rs;
                        user.isLogin = true;
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



})();


