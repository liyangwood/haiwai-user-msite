
'use strict';
(function(){
    if(this.KG){
        this._KG = KG;
    }
    this.KG = {};
}).call(window);


(function(){

    var site = 'http://www.haiwai.com';

    KG.config = {
        root : '/haiwai-user-msite',
        SiteRoot : site,
        ApiRoot : site+'/service/api/'

    };

    KG.Const = {

    };

    var user = {
        image : KG.config.root+'/image/user_default.png',
        email : 'haiwai@chinagate.com',
        userid : 10051,
        token : '',
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


    template.helper('absImage', function(url){
        if(/^http/.test(url)){
            return url;
        }

        return KG.config.SiteRoot+url;
    });

})();


