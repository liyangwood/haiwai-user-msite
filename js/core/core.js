
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

        login : function(opts, success, error){
            var successFN = function(flag, rs){
                if(rs.pk_id){
                    user.userid = rs.pk_id;
                    user.token = rs.token;
                    user.email = rs.email;

                    KG.request.getUserDetailInfo({}, function(f, json){
                        console.log(json);
                    });
                }
            };

            KG.request.login(opts, successFN, error);
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


