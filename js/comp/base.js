
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(){
            this.initVar();
            this.initView();
            this.initEvent();
            this.initEnd();
        },
        initVar : function(){},
        initView : function(){},
        initEvent : function(){},
        initEnd : function(){}
    });
})();