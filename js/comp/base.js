
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
            util.message.register(this.__name, this.registerMessage.bind(this));
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
                    '<b class="js_rg">{{range}}%</b>',
                    '<div class="range"><em style="width:{{range}}%;"></em></div>',
                    '<p>如何创建有影响力的店铺？</p>',
                    '<a style="margin-top: 20px;" href="">完善店铺信息增加认知度</a>',
                    '<a href="">更多精美图片增加可信度</a>',
                    '<a href="">多发文章增加专业度</a>',
                    '<a href="">常发活动增加活跃度</a>',
                '</div>'
            ].join('');
        },
        setJqVar : function(){
            return {
                wr : this.elem.find('.range').find('em'),
                txt : this.elem.find('.js_rg')
            };

        },
        getData : function(box, data, callback){
            var range = this.prop.range;

            callback({
                range : range
            });
        },

        setValue : function(x){
            this.data.range = x;
            this.jq.wr.css('width', x+'%');
            this.jq.txt.text(x+'%');
        },

        registerMessage : function(e, data){
            console.log(data);
            this.setValue(data);
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
        getData : function(box, data, next){
            KG.request.getBizList({}, function(flag, rs){
                var list = []
                if(flag){
                    list = rs;
                }

                var runningList = [],
                    stopList = [];
                util.each(list, function(item){
                    if(item.visible === '1'){
                        runningList.push(item);
                    }
                    else{
                        stopList.push(item);
                    }
                });
                next({
                    list : runningList
                });

                util.message.publish('kg-mybiz-stop-list', stopList);
            });
        },
        initEvent : function(){
            this.elem.find('.js_share').click(function(){
                var url = 'http://www.haiwai.com';
                util.dialog.showQrCode(url);

                return false;
            });
        },
        initEnd : function(){
            util.delay(function(){
                util.message.publish('MybizRightStoreRank', 80);
            }, 1000);
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
        getData : function(box, data, next){
            util.message.register('kg-mybiz-stop-list', function(e, list){
                next(list || []);
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
                '<h4 style="margin-top: 20px;">{{item.subject}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:15px;">{{item.count}}人已经领取</p>',

                '<div class="r">',
                '<a class="hw-a" href="editCoupon.html?id={{item.fk_entityID}}">管理优惠</a>',
                '<a class="hw-a js_share" href="">分享</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getUserArticleAndCouponList({}, function(flag, rs){
                if(flag){
                    var list = [];
                    util.each(rs.event, function(item){
                        if(item.active_status != '0'){
                            list.push(item);
                        }
                    });
                    next({
                        list : list
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
                '<h4 style="margin-top: 10px;height:20px;">{{item.subject}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:10px;">{{item.count}}人已经领取</p>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:5px;">{{item.startTime}} 至 {{item.endTime}}</p>',

                '<div class="r">',
                '<a class="hw-a js_del" param="{{item.pk_id}}" style="margin-top: 30px;"' +
                ' href="javascript:void(0)">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getUserArticleAndCouponList({}, function(flag, rs){
                if(flag){
                    var list = [];
                    util.each(rs.event, function(item){
                        if(item.active_status == '0'){
                            item.startTime = item.top_start_time>10?moment(item.top_start_time*1000).format('YYYY-MM-DD'):'';
                            item.endTime = item.top_end_time>10?moment(item.top_end_time*1000).format('YYYY-MM-DD'):'';

                            list.push(item);
                        }
                    });
                    next({
                        list : list
                    });
                }
            });
        },
        initEvent : function(){
            this.elem.on('click', '.js_del', function(e){
                var o = $(this);
                var id = o.attr('param');
                util.dialog.confirm({
                    msg : '确认删除此店铺么？',
                    YesFn : function(callback){
                        KG.request.deleteCouponById({
                            id : id
                        }, function(flag, rs){
                            callback();

                            if(flag){
                                o.closest('.hw-each').fadeOut(400, function(){
                                    $(this).remove();
                                });
                            }
                            else{
                                alert(rs);
                            }
                        });
                    }
                });
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
                    '{{if item.logo}}',
                    '<img class="hw-img" src="{{item.logo | absImage}}" />',
                    '{{else}}',
                    '<img class="hw-img" src="',KG.user.get().defaultImage,'" />',
                    '{{/if}}',
                    '<a class="hw-link" target="_blank" style="margin-top:20px;"' +
                    ' href="{{item.link}}">{{item.title}}</a>',
                    '<p style="color: #9b9b9b;font-size: 14px;margin-top:20px;">发表于{{item.dateline | formatDate}}</p>',

                    '<div class="r">',
                        '<a class="hw-a" href="editArticle.html?id={{item.id}}">编辑</a>',
                        '<a class="hw-a js_share" param="{{item.link}}" href="javascript:void(0)">分享</a>',
                    '</div>',
                    '</div>',
                    '{{/each}}',
                    '</div>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            KG.request.getUserArticleAndCouponList({}, function(flag, rs){
                console.log(rs);
                if(flag){
                    callback({
                        list : _.map(rs.article, function(one){
                            one.link = util.link.article(one.id);
                            return one;
                        })
                    });
                }
            });
        },

        initEvent : function(){
            this.elem.on('click', '.js_share', function(e){
                var o = $(this),
                    link = o.attr('param');
                util.dialog.showQrCode(link);
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


    KG.Class.define('HWLoginRegBoxComp', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-loginRegBoxComp">',
                    '<div class="c-tlt">',
                        '<h4><b>加入海外同城</b><b style="margin-left: 85px;">让生活更简单</b></h4>',
                        '<img src="../../image/haiwai1.png" />',
                    '</div>',

                    '<div class="c-left js_left">',

                    '</div>',

                    '<div class="c-right">',
                        '<h4>用以下账号直接登录</h4>',
                        '<a class="hw-btn hw-weixin"></a>',
                        '<a class="hw-btn hw-fb"></a>',
                    '</div>',

                    '<div class="c-btm">',

                    '</div>',
                '</div>'
            ].join('');
        },

        setJqVar : function(){
            return {
                tlt : this.elem.find('.c-tlt h4 b'),
                left : this.elem.find('.js_left'),
                btm : this.elem.find('.c-btm')
            };
        },

        setLoginBox : function(){
            this.jq.tlt.hide();

            var h = [
                '<h4>登陆海外同城</h4>',
                '<input type="text" placeholder="邮箱" />',
                '<input type="password" placeholder="密码" />',
                '<button class="hw-btn hw-blue-btn js_loginBtn">登陆</button>',
                '<p>忘记账号或密码？<a href="#">在这里找回</a></p>'
            ].join('');
            this.jq.left.html(h);

            var h1 = [
                '<p>还没有海外帐户？<a class="hw-btn js_toReg">注册</a></p>'
            ].join('');

            this.jq.btm.html(h1);
        },

        setRegBox : function(){
            var h = [
                '<input type="text" placeholder="邮箱" />',
                '<input type="password" placeholder="密码" />',
                '<input type="password" placeholder="确认密码" />',
                '<button class="hw-btn hw-blue-btn js_regBtn">注册</button>',
                '<p>点击注册表示您同意海外同城的<a href="#">使用协议</a>和<a href="#">隐私保护协议</a></p>'
            ].join('');

            this.jq.left.html(h);

            this.jq.tlt.show();

            var h1 = [
                '<h6>已有海外帐户？<a href="javascript:void(0)" class="js_toLogin">直接登录</a></h6>'
            ].join('');
            this.jq.btm.html(h1);
        },

        defineProperty : function(){
            return {
                type : {
                    defaultValue : 'reg'
                }
            };
        },

        initEvent : function(){
            this.elem.on('click', '.js_toReg', this.setRegBox.bind(this));
            this.elem.on('click', '.js_toLogin', this.setLoginBox.bind(this));

            this.elem.on('click', '.js_regBtn', function(){
                //click reg button
                util.dialog.showRegBox({});
            });
            this.elem.on('click', '.js_loginBtn', function(){
                //click login button
                util.dialog.showLoginBox({});
            });
        },

        initEnd : function(){
            if(this.prop.type === 'login'){
                this.setLoginBox();
            }
            else if(this.prop.type === 'reg'){
                this.setRegBox();
            }
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