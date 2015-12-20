
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            //box.html('loading');

            this._initProp();
            this.getData(box, data, function(rs){
                self.data = rs;

                self.initVar();
                self._initView();

                self._initEvent();
                self._initEnd();
            });



        },
        getTemplate : function(){},
        initVar : function(){},
        _initView : function(){
            this.initView();
            this.html = template.compile(this.getTemplate())(this.data);
            this.elem = $(this.html);

            //TODO 以后需要关注这里的体验和性能
            //如果内部包含comp，就开始初始化
            KG.component.init(this.elem);

            this.jq = util.extend(this.setJqVar(), this.callParent('setJqVar'));
        },

        /*
        * 用于定义一些jq的变量到 this.jq 中，方便后续方法全局使用
        * */
        setJqVar : function(){
            return {};
        },

        _initEvent : function(){
            this.initEvent();

            //listen publish message
            util.message.register(this.__name, this.registerMessage);
        },
        _initEnd : function(){
            this.elem.data('kg-obj', this);

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

        _initProp : function(){
            var prop = util.extend(this.defineProperty(), this.callParent('defineProperty'));

            var rs = {},
                box = this.box;
            util.each(prop, function(item, key){
                item = item || {};

                var val = box.data(key);
                rs[key] = util.isUndefined(val)
                    ? (item.defaultValue)
                    : (util.isFunction(item.getter) ? item.getter(val) : val);
            });

            this.prop = rs;
        },


        /*
        * 定义所有的属性 自动收集 data-key 格式的属性到 this.prop中
        * @return {key : {  }
        *   defaultValue 默认value
        *   getter 可以格式化返回值
        *
        * */
        defineProperty : function(){
            return {};
        },


        initView : util.noop,
        initEnd : util.noop,
        initEvent : util.noop,
        registerMessage : util.noop
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
                        '<a href="../mycount/info.html" class="nav js_mycount">账户</a>',

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
            var range = this.prop.range;

            callback({
                range : range
            });
        },
        defineProperty : function(){
            return {
                range : {
                    defaultValue : 0
                }
            };
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
                '<a class="hw-a" href="editStore.html?id={{item.entityID}}">管理店铺</a>',
                '<b class="hw-a js_share">分享</b>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizList({}, function(flag, rs){
                if(flag){
                    callback({
                        list : rs
                    });
                }
            });
        },
        initEvent : function(){
            this.elem.find('.js_share').click(function(){
                var url = 'http://www.haiwai.com';
                util.dialog.showQrCode(url);

                return false;
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
                '<a class="hw-a js_restart" href="">重新营业</a>',
                '<a class="hw-a js_del" href="">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getBizList({}, function(flag, rs){
                if(flag){
                    callback({
                        list : rs
                    });
                }
            });
        },
        initEvent : function(){
            var self = this;
            this.elem.find('.js_restart').click(function(){
                util.dialog.show();
            });

            this.elem.find('.js_del').click(function(){
                util.dialog.confirm({
                    title : '确认要删除这个店铺吗？',
                    msg : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                    YesFn : self.deleteStore
                });

                return false;
            });

            this.elem.find('.js_restart').click(function(e){
                //TODO restart store
            });


        },
        deleteStore : function(callback){
            //TODO delete store

            callback();

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
                '<a class="hw-a js_share" href="">分享</a>',
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
                'store' : ['添加新店铺', 'store_default.png', 'createStore.html'],
                'coupon' : ['添加新优惠', 'coupon_default.png', 'createCoupon.html'],
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

    KG.Class.define('MybizEditStoreLeftNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MycountLeftNav">',
                '<a class="hw-a js_editStore" href="editStore.html?id={{bizId}}">基本信息</a>',
                '<a class="hw-a js_editStore_2" href="editStore_2.html?id={{bizId}}">更多描述</a>',
                '<a class="hw-a js_editStore_3" href="editStore_3.html?id={{bizId}}">上传图片</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var page = KG.data.get('page').split('-')[1];

            var bizId = KG.data.get('id');

            next({
                page : page,
                bizId : bizId
            });
        },

        initEnd : function(){
            this.elem.find('.js_'+this.data.page).addClass('active').click(function(){
                return false;
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
    },

    initWithElement : function(elem, data, config){
        var clsName = elem.attr('role');
        if(!clsName){
            return;
        }
        return new (KG.Class.getByName(clsName))(elem, data, config);
    },

    getObj : function(elem){
        var obj = elem.data('kg-obj');
        return obj || null;
    }
};


$(function(){
    //dom ready
    KG.component.init();
});