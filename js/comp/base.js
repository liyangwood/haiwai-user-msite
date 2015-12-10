
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            this.getData(elem, data, function(rs){
                self.data = rs;

                self.initVar();
                self._initView();
                this.initEvent();
                this._initEnd();
            });



        },
        getTemplate : function(){},
        initVar : function(){},
        _initView : function(){
            this.initView();
            this.html = template.compile(this.getTemplate())(this.data);
            this.elem = $(this.html);
        },
        initEvent : function(){

        },
        _initEnd : function(){
            this.box.replace(this.elem);

            this.initEnd();
        },


        initView : util.noop,
        initEnd : util.noop
    });


    KG.Class.define('MybizLeftUserNav', {
        parent : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-MybizLeftUserNav">',

                '</div>'
            ].join('');
        },
        getData : function(elem, data, callback){
            callback({});
        }
    });



})();

KG.component = {
    initEach : function(className, box, data){
        data = data || {};
        new (KG.class.getByName(className))(box, data);
    },

    init : function(){
        var elem = $('[role]');

        util.each(elem, function(one){
            //表示已经初始化过
            if(one.attr('init')) return;

            //表示需要自己初始化
            if(one.attr('init-self')) return;

            var clsName = one.attr('role');
            KG.component.initEach(clsName, one, {});
        });
    }
};


$(function(){
    //dom ready
    KG.component.init();
});