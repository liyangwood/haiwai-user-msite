
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            box.html('loading');

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

    KG.Class.define('HeadingNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<nav class="kg-header-nav-comp">',
                    '<div class="container">',

                        '<a href="../mybiz/index.html" class="nav js_mybiz">我的店铺</a>',
                        '<a href="../myfav/list.html" class="nav js_myfav">我的收藏</a>',
                        '<a href="../mycoupon/list.html" class="nav js_mycoupon">我的优惠</a>',
                        '<a href="../mysys/index.html" class="nav js_mysys">系统消息</a>',
                        '<a href="../mycount/index.html" class="nav js_mycount">账户</a>',

                    '</div>',
                '</nav>'
            ].join('');
        },
        getData : function(box, data, next){
            var page = KG.data.get('page').split('-');
            page = page[0] || '';

            next({
                page : page
            });
        },
        initEnd : function(){
            var page = this.data.page;
            this.elem.find('.js_'+page).addClass('active');
        }
    });


    KG.Class.define('MybizLeftUserNav', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){

            return [
                '<div class="hw-MybizLeftUserNav">',
                    '<a class="hw-img" href=""><img src="{{user.image}}" /></a>',
                    '<span class="hw-email">{{user.email}}</span>',

                    '<a href="index.html" class="hw-a js_index" style="margin-top: 24px;">我的店铺</a>',
                    '<a href="coupon.html" class="hw-a js_coupon">店铺优惠</a>',
                    '<a href="article.html" class="hw-a js_article">店铺文章</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            var user = KG.user.get();

            var page = KG.data.get('page').split('-');
            page = page[1] || '';

            callback({
                user : user,
                page : page
            });
        },

        initEnd : function(){
            var page = this.data.page;
            this.elem.find('.js_'+page).addClass('active');
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
                '<a class="hw-a js_restart" href="javascript:void(0)">重新营业</a>',
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
        },
        initEvent : function(){
            this.elem.find('.js_restart').click(function(){
                util.dialog.show();
            });
        }
    });

    KG.Class.define('MybizRunningCouponList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',
                '<h4 style="margin-top: 20px;">{{item.title}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:15px;">{{item.count}}人已经领取</p>',

                '<div class="r">',
                '<a class="hw-a" href="">管理优惠</a>',
                '<a class="hw-a" href="">分享</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizCouponList({}, function(flag, rs){
                if(flag){
                    callback({
                        list : rs
                    });
                }
            });
        }
    });

    KG.Class.define('MybizStopCouponList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',
                '<h4 style="margin-top: 10px;">{{item.title}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:10px;">{{item.count}}人已经领取</p>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:5px;">{{item.startTime | formatDate}} 至 {{item.endTime | formatDate}}</p>',

                '<div class="r">',
                '<a class="hw-a" style="margin-top: 30px;" href="">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizCouponList({}, function(flag, rs){
                if(flag){
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
            var info = {
                'store' : ['添加新店铺', 'store_default.png', ''],
                'coupon' : ['添加新优惠', 'coupon_default.png', ''],
                'article' : ['添加新文章', 'article_default.png' ,'createArticle.html']
            };

            var type = this.box.data('type');

            return [
                '<a class="hw-MybizCreateNewStore" href="'+info[type][2]+'">',
                    '<div class="hw-img '+type+'"><img src="../../image/'+info[type][1]+'" /></div>',

                    '<i class="icon">＋</i>',
                    '<b>',info[type][0],'</b>',
                '</a>'
            ].join('');
        },
        initEvent : function(){

        }
    });

    KG.Class.define('MybizArticleList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div>',
                    '<div class="panel-heading">',
                    '<b>文章 ({{list.length}})</b>',
                    '</div>',
                    '<div class="hw-comp-store-list panel-body">',
                    '{{each list as item}}',
                    '<div class="hw-each">',
                    '<img class="hw-img" src="{{item.logo | absImage}}" />',
                    '<h4 style="margin-top:20px;">{{item.title}}</h4>',
                    '<p style="color: #9b9b9b;font-size: 14px;margin-top:20px;">发表于{{item.startTime | formatDate}}</p>',

                    '<div class="r">',
                        '<a class="hw-a" href="editArticle.html?id={{item.id}}">编辑</a>',
                        '<a class="hw-a" href="">分享</a>',
                    '</div>',
                    '</div>',
                    '{{/each}}',
                    '</div>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizCouponList({}, function(flag, rs){
                if(flag){
                    callback({
                        list : rs
                    });
                }
            });
        }
    });

    KG.Class.define('BackPageLink', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="container hw-comp-BackPageLink">',
                    '<a href="{{href}}"><i class="icon fa fa-angle-left"></i>{{title}}</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            next({
                title : box.data('title'),
                href : box.data('href')
            });
        }
    });

})();

KG.component = {
    initEach : function(className, box, data){
        data = data || {};
        new (KG.Class.getByName(className))(box, data);
    },

    init : function(box){
        box = box || $('body')
        var elem = box.find('[role]');

        elem.each(function(){
            var one = $(this);

            //表示已经初始化过
            if(one.attr('init-end')) return;

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