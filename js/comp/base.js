
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            //box.html('loading');

            this._initProp();
            this.initStart();
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
        registerMessage : util.noop,
        initStart : util.noop
    });

    KG.Class.define('Header', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<nav class="kg-header-comp">',
                    '<div class="container" id="js_header_comp">',

                    '<a class="logo" href="/"></a>',
                    '<div class="hw-loc js_loc" style="display: none;">',
                        '<span></span>',
                        '<i class="icon fa fa-caret-down"></i>',
                    '</div>',

                    '<div class="input-group search js_search">',
                        '<span class="input-group-addon hand js_tosearch"><i class="icon"></i></span>',
                        '<input type="text" class="form-control" placeholder="搜索店铺，专家服务...">',
                    '</div>',

                '{{if user.isLogin}}',
                '<div class="right">',

                    '<div class="dropdown" style="margin-right: 40px;">',
                    '<button id="js_right_dd_1" type="button" data-toggle="dropdown" aria-haspopup="true"' +
                    ' aria-expanded="false">',
                    '<img src="../../image/aa.png" />',
                    '</button>',
                    '<div class="dropdown-menu" aria-labelledby="js_right_dd_1">',
                    '<a href="../mybiz/index.html">我的店铺</a>',
                    '<a href="../mybiz/coupon.html">店铺优惠</a>',
                    '<a href="../mybiz/article.html">店铺文章</a>',
                    '</div>',
                    '</div>',

                    '<div class="dropdown">',
                    '<button id="js_right_dd_2" class="c2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                    '<img src="{{user.image}}" />',
                    '</button>',
                    '<div class="dropdown-menu" aria-labelledby="js_right_dd_2">',
                    '<a href="../myfav/list.html">我的收藏</a>',
                    '<a href="../mycoupon/list.html">我的优惠</a>',
                    '<a href="../mysys/index.html">系统消息</a>',
                    '<a href="../mycount/info.html">账户设置</a>',
                    '<a class="js_logout" href="javascript:void(0)">退出登录</a>',
                    '</div>',
                '</div>',
                '{{else}}',
                '<div class="right">',
                    '<a class="hw-light-btn hw-btn" href="../site/landing.html">我是商家</a>',
                    '<a href="javascript:void(0)" class="hw-a js_login">登录</a>',
                    '<a href="javascript:void(0)" class="hw-a js_reg">注册</a>',

                '</div>',
                '{{/if}}',

                '</div>',

                '</div>',
                '</nav>'
            ].join('');
        },

        getData : function(box, data, next){
            var user = KG.user.get();
            next({
                user : user
            });
        },

        initEvent : function(){
            if(this.data.user.isLogin){
                this.initEventByAfterLogin();
            }
            else{
                this.initEventByBeforeLogin();
            }

            var searchBox = this.elem.find('.js_search');
            searchBox.find('input').keyup(function(e){
                if(e.keyCode !== 13){
                    return false;
                }

                var val = $(this).val();
                if(!val){
                    return false;
                }

                location.href = '../site/search.html?keyword='+val;
            });
            searchBox.find('.js_tosearch').click(function(){
                var val = searchBox.find('input').val();
                if(!val){
                    searchBox.find('input').focus();
                    return false;
                }

                location.href = '../site/search.html?keyword='+val;
            });

            this.elem.find('.js_loc').click(function(){
                util.dialog.showSelectLocationRegion();
            });
        },

        initEventByAfterLogin : function(){
            this.elem.find('.js_logout').click(function(){
                KG.user.logout();
            });
        },

        initEventByBeforeLogin : function(){
            this.elem.find('.js_login').click(function(){
                util.dialog.showLoginBox();
            });
            this.elem.find('.js_reg').click(function(){
                util.dialog.showRegBox();
            });
        },

        initEnd : function(){
            var x = KG.data.get('keyword');
            if(x){
                this.elem.find('.js_search').find('input').val(x);
            }

            var regionName = util.cookie.get('region_cn') || '旧金山湾区';
            this.elem.find('.js_loc').show().find('span').html(regionName);
        }
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
            //console.log(data);
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
                '<div class="hw-each" style="padding-left:112px;">',
                //'<div class="hw-img hw-center-image" style="width:96px;"><img src="{{item.logo[0].path | absImage}}"/></div>',
                '<img class="hw-img" style="width:96px;" src="{{item.logo[0].path | absImage}}"/>',
                '<a class="h4" href="{{item.entityID | toStorePath}}">{{item.name_cn}}</a>',
                '<p>{{item | storeFullAddress}}</p>',
                '<em>{{item.commentnum}}条新评论</em>',

                '<div class="r">',
                '<a class="hw-a" href="editStore.html?id={{item.entityID}}">管理店铺</a>',
                '<b class="hw-a js_share" param="{{item.entityID}}">分享</b>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getBizList({}, function(flag, rs){
                var list = [];
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

                KG.component.initWithElement($('div[role="MybizStopStoreList"]'), stopList);

                if(list.length > 0){
                    $('.hw-MybizCreateNewStore').addClass('no_dis');
                }

                KG.component.initWithElement($('div[role="HWMybizIndexStoreAdsBlock"]'), {});
            });
        },
        initEvent : function(){
            this.elem.on('click', '.js_share', function(e){
                //TODO
                var url = KG.config.SiteRoot+'/biz/view.php?id='+$(e.target).attr('param');
                util.dialog.showQrCode(url);

                return false;
            });
        },
        initEnd : function(){
            util.delay(function(){
                util.message.publish('MybizRightStoreRank', 80);
            }, 1000);

            if(this.data.list.length > 0){
                this.elem.parent('.hw-panel').removeClass('nodis');
            }
        }
    });

    KG.Class.define('MybizStopStoreList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                '{{each list as item}}',
                '<div class="hw-each" style="padding-left:112px;">',
                '<img class="hw-img" style="width:96px;" src="{{item.logo[0].path | absImage}}"/>',
                '<h4>{{item.name_cn}}</h4>',
                '<p>{{item.address}}, {{item.city}}, {{item.state}}, {{item.zip}}</p>',
                '<em>{{item.commentnum}}条新评论</em>',

                '<div class="r">',
                '<a class="hw-a js_restart" param="{{item.entityID}}" href="javascript:void(0)">重新营业</a>',
                '<a class="hw-a js_del" param="{{item.entityID}}" href="javascript:void(0)">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var list = data;
            next({
                list : list
            });
        },
        initEvent : function(){
            var self = this;

            this.elem.find('.js_del').click(function(){
                var o = $(this);
                util.dialog.confirm({
                    title : '确认要删除这个店铺吗？',
                    msg : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                    YesFn : function(callback){
                        callback();
                        self.deleteStore(o.attr('param'));
                    }
                });

                return false;
            });

            this.elem.find('.js_restart').click(function(e){
                var id = $(this).attr('param');

                util.dialog.confirm({
                    title : '确认要重新营业么？',
                    msg : '点击确认，此店铺将重新开始营业。',
                    YesFn : function(callback){
                        KG.request.changeStoreOpenStatus({
                            bizId : id,
                            status : true
                        }, function(flag, rs){
                            callback();
                            if(flag){
                                location.reload(true);
                            }
                        });
                    }
                });


            });


        },
        deleteStore : function(id){
            KG.request.deleteStoreById({
                id : id
            }, function(flag){
                if(flag){
                    location.reload();
                }
            });


        },
        initEnd : function(){
            console.log(this.data.list);
            if(this.data.list.length > 0){
                this.elem.parent('.hw-panel').removeClass('nodis');
            }
        }
    });

    KG.Class.define('MybizRunningCouponList', {
        ParentClass : 'BaseComponent',
        initStart : function(){
            this.lastid = null;
            this.list = [];
        },
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                    '<div class="js_box"></div>',
                    '<div class="js_more" role="BaseLoadingMoreStatusBar"></div>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var self = this;


            KG.request.getBizList({}, function(flag, rs){
                var list = [];
                if(flag){
                    list = rs;
                }

                if(list.length < 1){
                    util.dialog.confirm1({
                        msg : '您还没有创建店铺，请先建店！',
                        YesText : '立即建店',
                        YesFn : function(callback){
                            location.href = '../mybiz/createStore.html';
                        }
                    });
                }
            });

            next({});
        },
        initEvent : function(){
            this.elem.on('click', '.js_share', function(e){
                var url = KG.config.SiteRoot+'/classifiedinfo/view.php?id='+$(e.target).attr('param');
                util.dialog.showQrCode(url);
                return false;
            });
            this.elem.on('click', '.js_each', function(){
                var id = $(this).attr('param');
                util.dialog.showCouponDetail(id);
            });
        },

        initEnd : function(){
            var self = this;
            var more = KG.component.getObj(this.elem.find('.js_more'));
            more.setEvent(function(fn){
                self.getListData(function(flag){
                    if(flag){
                        fn();
                    }
                    else{
                        more.setState('hide');
                    }

                });
            });

            more.trigger();
        },

        getListData : function(callback){
            var self = this;
            KG.request.getUserCouponList({
                is_active : '1',
                lastid : this.lastid
            }, function(flag, rs){
                if(flag){
                    self.list = self.list.concat(rs);
                    self.setListHtml();
                    self.lastid = _.last(rs).pk_id;

                    if(rs.length > 0){
                        self.elem.parent('.hw-panel').removeClass('no_dis');
                    }

                    callback(true);
                }
                else{
                    callback(false);
                }
            });
        },

        setListHtml : function(){
            var list = this.list;
            var h = [
                '{{each list as item}}',
                '<div param="item.pk_id" class="hw-each js_each">',
                '<div class="hw-center-image hw-img"><img style="height:auto;" src="{{item | logoPath}}" /></div>',
                '<h4 style="margin-top: 0;padding-top:20px;">{{item.subject}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:15px;">{{item.count}}人已经领取</p>',

                '<div class="r">',
                '<a class="hw-a" href="editCoupon.html?id={{item.pk_id}}">管理优惠</a>',
                '<a class="hw-a js_share" param="{{item.pk_id}}" href="javascript:void(0)">分享</a>',
                '</div>',
                '</div>',
                '{{/each}}'
            ].join('');

            h = template.compile(h)({
                list : list
            });

            this.elem.find('.js_box').html(h);
        }
    });

    KG.Class.define('MybizStopCouponList', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-store-list">',
                    '<div class="js_box"></div>',
                    '<div class="js_more" role="BaseLoadingMoreStatusBar"></div>',

                '</div>'
            ].join('');
        },
        initStart : function(){
            this.lastid = null;
            this.list = [];
        },
        initEvent : function(){
            this.elem.on('click', '.js_del', function(e){
                var o = $(this);
                var id = o.attr('param');
                util.dialog.confirm({
                    msg : '确认删除此优惠么？',
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
        },
        setListHtml : function(){
            var list = this.list;
            var h = [
                '{{each list as item}}',
                '<div class="hw-each">',
                '<div class="hw-center-image hw-img"><img style="height:auto;" src="{{item | logoPath}}" /></div>',
                '<h4 style="margin-top: 0;padding-top:10px;height:30px;">{{item.subject}}</h4>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:10px;">{{item.count}}人已经领取</p>',
                '<p style="color: #9b9b9b;font-size: 14px;margin-top:5px;">{{item.startTime}} 至 {{item.endTime}}</p>',

                '<div class="r">',
                '<a class="hw-a js_del" param="{{item.pk_id}}" style="margin-top: 30px;"' +
                ' href="javascript:void(0)">删除</a>',
                '</div>',
                '</div>',
                '{{/each}}',
            ].join('');

            h = template.compile(h)({
                list : list
            });

            this.elem.find('.js_box').html(h);
        },
        getListData : function(callback){
            var self = this;
            KG.request.getUserCouponList({
                is_active : '0',
                lastid : this.lastid
            }, function(flag, rs){
                if(flag){
                    var list = [];
                    util.each(rs, function(item){
                        //item.startTime =
                        // item.top_start_time>10?moment(item.top_start_time*1000).format('YYYY-MM-DD'):'';
                        item.startTime = item.top_start_time;
                        //item.endTime = item.top_end_time>10?moment(item.top_end_time*1000).format('YYYY-MM-DD'):'';
                        item.endTime = item.top_end_time;

                        list.push(item);
                    });
                    self.list = self.list.concat(list);
                    self.setListHtml();
                    self.lastid = _.last(list).pk_id;

                    if(list.length > 0){
                        self.elem.parent('.hw-panel').removeClass('no_dis');
                    }

                    callback(true);
                }
                else{
                    callback(false);
                }
            });
        },
        initEnd : function(){
            var self = this;
            var more = KG.component.getObj(this.elem.find('.js_more'));
            more.setEvent(function(fn){
                self.getListData(function(flag){
                    if(flag){
                        fn();
                    }
                    else{
                        more.setState('hide');
                    }

                });
            });

            more.trigger();
        }
    });

    KG.Class.define('MybizCreateNewStore', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            var info = {
                'store' : ['添加新店铺', KG.default.storeImage, 'createStore.html'],
                'coupon' : ['添加新优惠', KG.default.couponImage, 'createCoupon.html'],
                'article' : ['添加新文章', KG.default.articleImage, 'createArticle.html']
            };

            var type = this.box.data('type');

            return [
                '<a class="hw-MybizCreateNewStore" href="'+info[type][2]+'">',
                    '<div class="hw-img '+type+'"><img src="'+info[type][1]+'" /></div>',

                    '<i class="icon">＋</i>',
                    '<b>',info[type][0],'</b>',
                '</a>'
            ].join('');
        },
        initEnd : function(){

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
                    '<div style="padding-left:145px;" class="hw-each">',

                    '<div class="hw-img hw-center-image" style="width:130px;"><img src="{{item | logoPath}}"/></div>',

                    '<a class="hw-link" target="_blank" style="margin-top:20px;"' +
                    ' href="{{item.link}}">{{item.title}}</a>',
                    '<p style="color: #9b9b9b;font-size: 14px;margin-top:20px;">发表于{{item.dateline |' +
                    ' formatDate:"yy年mm月dd日"}}</p>',

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
                            one.link = util.path.article(one.id);
                            return one;
                        })
                    });
                }
            });

            KG.request.getBizList({}, function(flag, rs){
                var list = [];
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

                if(runningList.length < 1){
                    util.dialog.confirm1({
                        msg : '您还没有创建店铺，请先建店！',
                        YesText : '立即建店',
                        YesFn : function(callback){
                            location.href = '../mybiz/createStore.html';
                        }
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

    KG.Class.define('HWSelectRegionLocation', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-HWSelectRegionLocation">',
                    '{{each list as item index}}',
                    '<button param="{{index}}" class="js_one hw-btn hw-light-btn">{{item.cn}}</button>',

                    '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){

            KG.request.getHotLocationRegion({}, function(flag, rs){
                var list = [];
                _.each(rs, function(item, key){
                    list.push({
                        id : item.id,
                        cn : item.area_name,
                        name : key
                    });
                });

                next({list : list});
            });


        },
        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_one', function(){
                var o = $(this),
                    index = o.attr('param'),
                    data = self.data.list[index];

                util.cookie.set('regionID', data.id);
                util.cookie.set('region_name', data.name);
                util.cookie.set('region_cn', data.cn);

                KG.request.setHotLocationRegion({
                    regionID : data.id
                }, function(flag, rs){
                    location.reload();
                });

            });
        },
        initEnd : function(){
            var id = util.cookie.get('regionID');
            var index = 0;
            if(id){
                index = _.findIndex(this.data.list, function(one){
                    return one.id.toString() === id;
                });
                this.elem.find('.js_one').eq(index).addClass('active');
            }


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
                        '<a href="javascript:void(0)" class="hw-btn hw-weixin"><i class="icon"></i>微信扫一扫登录</a>',
                        '<a href="javascript:void(0)" class="hw-btn hw-fb"><i class="icon"></i>facebook登录</a>',
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
                '<h4>登录海外同城</h4>',
                '<div class="c-error"></div>',
                '<input type="text" class="js_email" placeholder="邮箱" />',
                '<input type="password" class="js_pwd" placeholder="密码" />',
                '<button class="hw-btn hw-blue-btn js_loginBtn">登录</button>',
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
                '<div class="c-error"></div>',
                '<input type="text" class="js_email" placeholder="邮箱" />',
                '<input type="password" class="js_pwd" placeholder="密码" />',
                '<input type="password" class="js_pwd2" placeholder="确认密码" />',
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
        showError : function(err){
            this.elem.find('.c-error').html(err);
        },

        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_toReg', this.setRegBox.bind(this));
            this.elem.on('click', '.js_toLogin', this.setLoginBox.bind(this));

            this.elem.on('click', '.js_regBtn', function(){
                //click reg button
                var data = self.getRegisterValue();
                console.log(data);
                KG.user.register(data, function(flag, rs){
                    if(flag){
                        var sd = {
                            username : data.email,
                            password : data.password
                        };
                        KG.user.login(sd, function(){
                            location.reload();
                        }, function(err){

                            alert(err);
                        });

                    }
                    else{
                        self.showError(rs);
                    }
                });

            });
            this.elem.on('click', '.js_loginBtn', function(){
                //click login button
                var data = self.getLoginValue();
                KG.user.login(data, function(){
                    location.reload();
                }, function(err){

                    self.showError(err);
                });
            });

            this.elem.on('click', '.hw-weixin', function(){
                util.dialog.showWeixinLoginQrCode(KG.config.WeixinLoginRedirectUrl);
                return false;
            });
        },

        getLoginValue : function(){
            var data = {
                username : this.jq.left.find('.js_email').val(),
                password : this.jq.left.find('.js_pwd').val()
            };
            return data;
        },
        getRegisterValue : function(){
            return {
                email : this.jq.left.find('.js_email').val(),
                password : this.jq.left.find('.js_pwd').val(),
                confirm_password : this.jq.left.find('.js_pwd2').val()
            };
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

    KG.Class.define('StarRank', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-star">',

                '</div>'
            ].join('');
        },
        initStart : function(){
            this.rank = 0;
            this.enableClick = false;
        },
        getData : function(box, data, next){
            this.rank = parseFloat(box.data('rank')) || 0;
            if(box.data('enable')){
                this.enableClick = true;
            }
            next({});
        },

        render : function(){
            var rank = this.rank;

            var list = [];
            for(var i= 1; i<6; i++){
                if(i<rank){
                    list.push('full');
                }
                else if(i === rank){
                    list.push('full');
                }
                else{
                    if(i === rank+0.5){
                        list.push('half');
                    }
                    else{
                        list.push('empty');
                    }

                }
            }

            var h = [
                '{{each list as item index}}',
                '{{if item==="full"}}',
                '<i index="{{index}}" class="icon fa fa-star icon_full"></i>',
                '{{else if item==="half"}}',
                '<i index="{{index}}" class="icon fa fa-star-half-o icon_half"></i>',
                '{{else}}',
                '<i index="{{index}}" class="icon fa fa-star-o icon_empty"></i>',
                '{{/if}}',
                '{{/each}}'
            ].join('');
            h = template.compile(h)({list : list});
            this.elem.html(h);
        },
        setValue : function(v){
            this.rank = v;
            this.render();
        },

        getValue : function(){
            return this.rank;
        },
        initEnd : function(){
            this.render();
        },
        initEvent : function(){
            var self = this;
            if(this.enableClick){
                this.elem.on('click', 'i.fa', function(e){
                    var o = $(e.target);
                    var i = o.attr('index');
                    if(o.hasClass('icon_empty')){
                        self.rank = parseFloat(i)+0.5;
                    }
                    else if(o.hasClass('icon_full')){
                        self.rank = parseInt(i, 10);
                    }
                    else if(o.hasClass('icon_half')){
                        self.rank = parseInt(i, 10)+1;
                    }

                    if(self.rank === 0){
                        self.rank = 0.5;
                    }

                    self.render();
                }).addClass('hand');
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
        box = box || $('body');
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

    if(util.url.param('code') && util.url.param('state')==='aaa'){
        //weixin login
        util.showPageLoading(true);
        KG.request.oauthLoginWithWeixinCode({
            code : util.url.param('code')
        }, function(flag, rs){
            util.showPageLoading(false);
            if(flag){
                KG.user.getUserDetailWithToken(rs, function(user){
                    util.toast.alert('登录成功，请补充资料');
                    _.delay(function(){
                        location.href = '../mycount/info.html';
                    }, 1500);
                });
            }
            else{
                util.toast.showError(rs);
                util.delay(function(){
                    location.href = '../site/index.html';
                }, 2000);
            }
        });

        //util.oauth.weixin(util.url.param('code'));

        return false;
    }


    //check login
    util.showPageLoading(true);
    KG.user.checkLogin(function(){
        var user = KG.user.get();
        if(KG.data.get('needLogin')){
            if(user.isLogin){
                KG.component.init();
            }
            else{

                location.href = '../site/landing.html?redirect_url='+location.href;
            }
        }
        else{
            KG.component.init();
        }

        //util.delay(function(){
            util.showPageLoading(false);
        //}, 500);

    });


});