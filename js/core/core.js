
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
        ApiRoot : site+'/service/api/'

    };

    KG.Const = {

    };

    var user = {
        image : KG.config.root+'/image/user_default.png',
        defaultImage : KG.config.root+'/image/user_default.png',
        email : 'haiwai@chinagate.com',
        userid : 10051,
        tel : '5735769567',
        token : 'f6fa860fbb037584c6fae08875cfa163',
        isLogin : true
    };
    KG.user = {
        get : function(key){
            if(key){
                return user[key];
            }
            return user;
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


