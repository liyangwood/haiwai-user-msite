
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            this.getData(box, data, function(rs){
                self.data = rs;

                self.initVar();
                self._initView();
                self.initEvent();
                self._initEnd();
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
            var style = this.box.attr('style'),
                cls = this.box.attr('class');

            this.elem.attr('style', style);
            this.elem.addClass(cls);
            this.box.replaceWith(this.elem);

            this.initEnd();
        },

        getData : function(box, data, callback){
            callback.call(this, {});
        },


        initView : util.noop,
        initEnd : util.noop
    });


    KG.Class.define('MybizLeftUserNav', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){

            return [
                '<div class="hw-MybizLeftUserNav">',
                    '<a class="hw-img" href=""><img src="{{user.image}}" /></a>',
                    '<span class="hw-email">{{user.email}}</span>',

                    '<a href="" class="hw-a active" style="margin-top: 24px;">我的店铺</a>',
                    '<a href="" class="hw-a">店铺优惠</a>',
                    '<a href="" class="hw-a">店铺文章</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            var user = KG.user.get();

            callback({
                user : user
            });
        }
    });

    KG.Class.define('MybizRightStoreRank', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-MybizRightStoreRank">',
                    '<span>您的店铺吸引力</span>',
                    '<b>{{range}}%</b>',
                    '<div class="range"><em style="width:{{range}}%;"></em></div>',
                    '<p>如何创建有影响力的店铺？</p>',
                    '<a style="margin-top: 20px;" href="">完善店铺信息增加认知度</a>',
                    '<a href="">更多精美图片增加可信度</a>',
                    '<a href="">多发文章增加专业度</a>',
                    '<a href="">常发活动增加活跃度</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            var range = box.data('range');

            callback({
                range : range
            });
        }
    });

    KG.Class.define('MybizRunningStoreList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',
                '<h4>{{item.name_cn}}</h4>',
                '<p>{{item.address}}, {{item.city}}, {{item.state}}, {{item.zip}}</p>',
                '<em>{{item.commentnum}}条新评论</em>',

                '<div class="r">',
                '<a class="hw-a" href="">管理店铺</a>',
                '<a class="hw-a" href="">分享</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizList({}, function(flag, rs){
                if(flag){
                    console.log(rs);
                    callback({
                        list : rs
                    });
                }
            });
        }
    });

    KG.Class.define('MybizStopStoreList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',
                '<h4>{{item.name_cn}}</h4>',
                '<p>{{item.address}}, {{item.city}}, {{item.state}}, {{item.zip}}</p>',
                '<em>{{item.commentnum}}条新评论</em>',

                '<div class="r">',
                '<a class="hw-a" href="">重新营业</a>',
                '<a class="hw-a" href="">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizList({}, function(flag, rs){
                if(flag){
                    console.log(rs);
                    callback({
                        list : rs
                    });
                }
            });
        }
    });

    KG.Class.define('MybizCreateNewStore', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-MybizCreateNewStore">',
                    '<img src="../../image/user_default.png" />',

                    '<i class="glyphicon glyphicon-plus"></i>',
                    '<b>添加新店铺</b>',
                '</div>'
            ].join('');
        }
    });

})();

KG.component = {
    initEach : function(className, box, data){
        data = data || {};
        new (KG.Class.getByName(className))(box, data);
    },

    init : function(){
        var elem = $('[role]');

        elem.each(function(){
            var one = $(this);

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