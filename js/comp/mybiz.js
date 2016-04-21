KG.Class.define('MybizEditStoreLeftDropdown', {
    ParentClass : 'BaseSelectInput',
    getTemplate : function(){
        return [
            '<div class="dropdown hw-comp-MybizEditStoreLeftDropdown">',
            '<button id="{{uuid}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
            '<input type="text" readonly="true" class="form-control js_input" value="{{value}}">',
            '<i class="icon fa fa-caret-down"></i>',
            '</button>',
            '<ul class="dropdown-menu" aria-labelledby="{{uuid}}">',
            '{{each list as item}}',
            '<li index="{{$index}}" class="js_drop">',
            this.getEachHtml(),
            '</li>',
            '{{/each}}',
            '</ul>',
            '</div>'
        ].join('');
    },
    getData : function(box, data, next){

        //设置drop的innerHTML
        this.getEachHtml = function(){
            return '{{item}}';
        };

        var list = ['正在营业', '暂停营业', '删除店铺'];

        var prop = this.prop;
        next({
            value : list[0],
            placeholder : '',
            uuid : 'dl_'+util.getUuid(),
            list : list,
            bizId : KG.data.get('id')
        });
    },
    clickCallback : function(item){
        var self = this;
        if(item === this.data.list[1]){
            //stop
            util.dialog.confirm({
                title : '确认要暂停营业吗？',
                msg : '点击确认，您的店铺将会进入暂停营业的状态。暂停营业的店铺将不可以修改基本信息，但您可以在任何时候将它转为营业中的状态。',
                YesFn : function(callback){
                    self.stopStore.call(self);

                    callback();
                }
            });
        }
        else if(item === this.data.list[2]){
            //delete
            util.dialog.confirm({
                title : '确认要删除这个店铺吗？',
                msg : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                YesFn : function(callback){
                    self.deleteStore();

                    callback();
                }
            });
        }
    },
    stopStore : function(){
        //alert(this.data.bizId);
        KG.request.changeStoreOpenStatus({
            bizId : this.data.bizId,
            status : false
        }, function(flag, rs){
            if(flag){
                util.toast.alert('暂停成功');
                _.delay(function(){
                    location.href = '../mybiz/index.html';
                }, 1000);
            }
        });
    },
    deleteStore : function(){

        KG.request.deleteStoreById({
            id : this.data.bizId
        }, function(flag){
            if(flag){
                location.href = '../mybiz/index.html';
            }
        });
    }
});

KG.Class.define('MybizLeftUserNav', {
    ParentClass : 'BaseComponent',

    getTemplate : function(){

        return [
            '<div class="hw-MybizLeftUserNav" style="height: auto;">',
            //'<a class="hw-img" href=""><img src="{{user.image}}" /></a>',
            //'<span class="hw-email">{{user.email}}</span>',

                '<a href="index.html" class="hw-a js_index">管理店铺</a>',
                '<a href="coupon.html" class="hw-a js_coupon">发布优惠</a>',
                '<a href="article.html" class="hw-a js_article">发布文章</a>',
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
            '<div class="hw-img" role="BaseLoadingImageBox" style="width:96px;" data-url="{{item | logoPath}}"></div>',
            '<a class="h4" href="{{item.entityID | toStorePath}}">{{item.name_cn ||item.name_en}}</a>',
            '<p>{{item | storeFullAddress}}</p>',
            '<em>{{item.commentnum}}条评论</em>',

            '<div class="r">',
            '<a class="hw-a" href="editStore.html?id={{item.entityID}}">修改店铺信息</a>',
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

            KG.component.initWithElement($('div[role="HWMybizIndexStoreAdsBlock"]'), {
                bizList : runningList
            });
        });
    },
    initEvent : function(){
        this.elem.on('click', '.js_share', function(e){
            var id = $(this).attr('param'),
                url = util.path.toMSiteStore(id);
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
            '<div class="hw-img" role="BaseLoadingImageBox" style="width:96px;" data-url="{{item | logoPath}}"></div>',
            //'<h4 style="display: inline-block" class="h4">{{item.name_cn}}</h4>',
            '<a class="h4" href="{{item.entityID | toStorePath}}">{{item.name_cn ||item.name_en}}</a>',
            '<p>{{item.address}}, {{item.city}}, {{item.state}}, {{item.zip}}</p>',
            '<em>{{item.commentnum}}新评论</em>',

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

            KG.component.initWithElement($('div[role="HWMybizIndexStoreAdsBlock"]'), {
                bizList : runningList
            });
        });

        next({});
    },
    initEvent : function(){
        this.elem.on('click', '.js_share', function(e){
            var id = $(this).attr('param'),
                url = util.path.toMSiteCoupon(id);

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

                    if(self.list.length < 6){
                        more.setState('hide');
                    }
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


                if(rs.length > 0){
                    self.lastid = _.last(rs).pk_id;
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
            '<div param="{{item.pk_id}}" class="hw-each js_each hand">',
            '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item | logoPath}}"></div>',
            '<h4 style="margin-top: 0;padding-top:20px;overflow: hidden;width:330px;text-overflow: ellipsis;">{{item.subject}}</h4>',
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
        KG.component.init(this.elem.find('.js_box'));
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
            '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item | logoPath}}"></div>',
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
        KG.component.init(this.elem.find('.js_box'));
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


                if(list.length > 0){
                    self.lastid = _.last(list).pk_id;
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

                    if(self.list.length < 6){
                        more.setState('hide');
                    }
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
    initStart : function(){
        this.list = [];
        this.lastid = null;
        this.count = 0;
    },
    getTemplate : function(){
        return [
            '<div>',
            '<div class="panel-heading">',
            '<b class="js_len"></b>',
            '</div>',
            '<div class="hw-comp-store-list panel-body js_box">',

            '</div>',
            '<div class="js_more" role="BaseLoadingMoreStatusBar"></div>',

            '</div>'
        ].join('');
    },
    getData : function(box, data, next){

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

            KG.component.initWithElement($('div[role="HWMybizIndexStoreAdsBlock"]'), {
                bizList : runningList
            });
        });

        next({});
    },

    getListData : function(callback){
        var self = this;
        KG.request.getUserArticleList({
            lastid_article : this.lastid
        }, function(flag, rs){
            if(flag && rs.list.length > 0){
                var list = _.map(rs.list, function(one){
                    one.link = util.path.article(one.id);
                    return one;
                });
                self.list = self.list.concat(list);
                self.count = parseInt(rs.count.all, 10);
                self.setListHtml();
                self.lastid = _.last(list).id;


                if(self.list.length < self.count){
                    callback(true);
                }
                else{
                    callback(false);
                }

            }
            else{
                callback(false);
            }

        });
    },

    initEvent : function(){
        this.elem.on('click', '.js_share', function(e){
            var o = $(this),
                link = o.attr('param');
            util.dialog.showQrCode(link);
        });
    },
    setListHtml : function(){
        var list = this.list;
        var h = [
            '{{each list as item}}',
            '<div style="padding-left:145px;" class="hw-each">',

            '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item | logoPath}}" style="width:130px;"></div>',

            '<a class="hw-link" target="_blank" style=""' +
            ' href="{{item.link}}">{{item.title}}</a>',
            '<p style="color: #9b9b9b;font-size: 14px;margin-top:20px;">发表于{{item.dateline |' +
            ' formatDate:"yy年mm月dd日"}}</p>',

            '<div class="r">',
            '<a class="hw-a" href="editArticle.html?id={{item.id}}">编辑</a>',
            '<a class="hw-a js_share" param="{{item.link}}" href="javascript:void(0)">分享</a>',
            '</div>',
            '</div>',
            '{{/each}}'
        ].join('');

        h = template.compile(h)({
            list : list
        });

        this.elem.find('.js_len').html('文章 ('+this.count+')');

        this.elem.find('.js_box').html(h);
        KG.component.init(this.elem.find('.js_box'));
    },

    initEnd : function(){
        var self = this;
        var more = KG.component.getObj(this.elem.find('.js_more'));
        more.setEvent(function(fn){
            self.getListData(function(flag){
                if(self.list.length < 1){
                    self.elem.closest('.hw-panel').hide();
                }

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

KG.Class.define('HWMybizIndexStoreAdsBlock', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){

        return [
            '<div class="hw-HWMybizIndexStoreAdsBlock">',
            '<h4 class="js_title">店铺文学城广告位</h4>',
            '<div class="js_box"></div>',

            '</div>'
        ].join('');
    },
    setTitle : function(title){
        if(title){
            this.elem.find('.js_title').html(title).show();
        }
        else{
            this.elem.find('.js_title').hide();
        }

    },
    showSelectBizDialog : function(list, callback){
        var self = this;
        var h = [
            '<div class="hw-ads-bizlist">',
            '{{each list as item index}}',
            '<div class="hw-each">',
            '<img src="{{item | logoPath}}" />',
            '<h4>{{item.name_cn || item.name_en}}</h4>',
            '<p class="hw-adress">{{item | storeFullAddress}}</p>',
            '<p class="hw-tel">{{item.tel}}</p>',
            '<button param="{{index}}" class="hw-btn hw-blue-btn js_select">选择</button>',
            '</div>',
            '{{/each}}',
            '</div>'
        ].join('');

        h = template.compile(h)({
            list : list
        });

        var param = {
            foot : false,
            title : '请选择您要推广的店铺',
            body : h,
            'class' : 'hw-dialog-selectBizForAds',
            beforeShowFn : function(){
                var o = this;
                //o.modal({
                //    keyboard : false,
                //    backdrop : 'static'
                //});

                o.find('.hw-ads-bizlist').on('click', '.js_select', function(){
                    var index = $(this).attr('param');

                    util.dialog.hide();
                    callback(list[index]);
                });
            }
        };

        util.dialog.show(param);
    },
    getData : function(box, data, next){
        var self = this;
        this.type = null;
        this.ads = null;
        this.bizList = data.bizList;
        console.log(this.bizList)
        var user = KG.user.get();
        if(user.ads_postid){
            KG.request.getAdsDetail({
                id : user.ads_postid
            }, function(flag, rs){
                if(flag){
                    self.type = rs.status;
                    self.ads = rs;
                    next({});
                }
                else{
                    util.toast.showError(rs);
                }
            });
        }
        else{
            this.type = 'create';
            next({});
        }

    },

    setJqVar : function(){
        return {
            box : this.elem.find('.js_box')
        };
    },
    initEvent : function(){
        var self = this;

    },

    showCreateBox : function(){
        var self = this;
        var h = [
            '<div class="cg">',
            '<img src="../../image/adsbanner1.png" />',
            '我们为店主提供<a href="http://www.wenxuecity.com" target="_blank">文学城首页</a>价值$300一个月免费广告服务，地理定向推广您在海外同城的店铺。一分钟即可自助创建160*90的图片广告。无需任何预付费信息，创建成功审核后自动发布。',

                '<a class="hw-btn js_btn" href="javascript:void(0)">免费创建广告</a>',
            '</div>',

        ].join('');

        this.jq.box.html(h);
        this.elem.find('.js_btn').click(function(){
            if(self.bizList.length < 1){
                util.toast.showError('您没有可以创建广告的店铺');
                return false;
            }
            else if(self.bizList.length === 1){
                location.href = '../mybiz/createAds.html?store='+self.bizList[0].entityID;
                return false;
            }
            self.showSelectBizDialog(self.bizList, function(data){
                location.href = '../mybiz/createAds.html?store='+data.entityID;
            });
        });

        this.setTitle();
        this.elem.css({
            border : '1px solid #f4a62a',
            'border-radius' : '2px'
        });
    },
    showShowingBox : function() {
        var h = decodeURIComponent(this.ads.share);
        h += '<div class="cf"> 您创建的图片广告已在<a href="http://www.wenxuecity.com" target="_blank">文学城首页</a>发布，我们的广告采用轮播的形式，即有其他店主新的广告，您的广告会自动下移，直到轮出广告区域。请随时留意您的广告是否下线，一个月以内可无限次自助上线广告。广告下线我们会在此处提示，请留意。</div>';
        h += '<a class="hw-btn hw-blue-btn js_btn" href="../mybiz/createAds.html?id='+this.ads.postid+'">修改广告</a>';
        this.jq.box.addClass('hw-showing').html(h);
        this.setTitle('广告已上线');

    },
    showWaitingBox : function(){
        var h = decodeURIComponent(this.ads.share);
        h += '<div class="cf">您的广告已创建，我们需要 1-2个工作日审核发布到<a href="http://www.wenxuecity.com" target="_blank">文学城首页</a></div>';
        h += '<a class="hw-btn hw-blue-btn js_btn" href="../mybiz/createAds.html?id='+this.ads.postid+'">修改广告</a>';
        this.jq.box.addClass('hw-waiting').html(h);
        this.setTitle('广告正在审核中');
    },
    showInvisibleBox : function(){
        var self = this;
        var h = decodeURIComponent(this.ads.share);
        h += '<div class="cf">由于广告过多，您的广告已轮出<a href="http://www.wenxuecity.com" target="_blank">文学城首页</a>，一个月内可自助上线广告。</div>';
        h += '<a class="hw-btn hw-blue-btn js_btn" param="'+this.ads.postid+'" href="javascript:void(0)">重新上线</a>';
        this.jq.box.addClass('hw-waiting').html(h);

        this.elem.find('.js_btn').click(function(){
            var id = $(this).attr('param');

            KG.request.resubmitAds({
                id : id
            }, function(flag, rs){
                if(flag){
                    util.toast.alert('重新上线成功');
                    _.delay(function(){
                        location.reload();
                    }, 2000);
                }
                else{
                    util.toast.showError(rs);
                }
            });
        });
        this.setTitle('广告已下线');
    },
    showClosedBox : function(){
        var h = decodeURIComponent(this.ads.share);
        h += '<div class="cf">您的一个月免费广告推广期已过，重新上线请查阅<a href="../help/ads_help.html" target="_blank">广告服务</a></div>';
        //h += '<a class="hw-btn hw-light-btn js_btn" href="javascript:void(0)">408-675-8754</a>';
        this.jq.box.addClass('hw-waiting').html(h);
        this.setTitle('广告已下线');
    },
    initEnd : function(){
        switch(this.type){
            case 'create':
                this.showCreateBox();
                break;
            case 'showing':
                this.showShowingBox();
                break;
            case 'waiting':
                this.showWaitingBox();
                break;
            case 'invisible':
                this.showInvisibleBox();
                break;
            case 'closed':
                this.showClosedBox();
                break;
        }
    }
});

KG.Class.define('HWMybizCrateAdsFormUploadImage', {
    ParentClass : 'BaseUploadImage',
    getTemplate : function(){
        return [
            '<div>',
            '<div class="hw-img-box">',
            '<img class="js_img" src="{{image}}" />',
            '</div>',


            '<button data-loading-text="正在上传..." class="hw-btn js_btn">从电脑上传图片</button>',
            '<input type="file" />',
            '</div>'
        ].join('');
    },
    getData : function(box, data, next){

        next({
            image : this.prop.image
        });
    },

    setJqVar : function(){
        return {};
    },
    initEvent : function(){
        var btn = this.jq.btn,
            img = this.jq.img;

        var self = this;
        this.jq.fileInput.bind('change', function(e){
            var file = this.files[0];

            btn.button('loading');

            self.uploadImageFn(file, function(){
                btn.button('reset');

                self.elem.trigger('change_end');
            });
        });

    },

    getImageUrl : function(){
        return this.jq.img.attr('src');
    }
});
KG.Class.define('HWMybizCreateAdsPageForm', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-HWMybizCreateAdsPageForm">',
                '<label class="require hw-label">1.选择模版</label>',
                '<dd class="s-tpl"><dd>',

                '<label class="require hw-label">2.选择图片</label>',
                '<div class="s-img" init-self="true" role="HWMybizCrateAdsFormUploadImage"></div>',

                '<label class="hw-label require">3.填写内容</label>',
                '<form class="form-horizontal s-form">',
                    '<div class="form-group">',
                        '<label class="col-sm-2 control-label require">标题</label>',
                        '<div class="col-sm-8">',
                            '<input type="text" class="form-control js_name" placeholder="">',
                            '<span class="hw-tip">建议填写店铺名称，或者想要宣传的产品/服务名称</span>',
                        '</div>',
                    '</div>',

                    '<div class="form-group">',
                    '<label class="col-sm-2 control-label require">文字第一行</label>',
                    '<div class="col-sm-10">',
                        '<input type="text" class="form-control js_ad1" placeholder="职位名称或营业特色">',
                        '<span class="hw-tip">建议填写职位名称，营业特色，电话号码或想要宣传的产品/服务等</span>',
                    '</div>',
                    '</div>',

                    '<div class="form-group">',
                    '<label class="col-sm-2 control-label require">文字第二行</label>',
                    '<div class="col-sm-10">',
                        '<input type="text" class="form-control js_ad2" placeholder="广告宣传语">',
                        '<span class="hw-tip">建议填写职位名称，营业特色，电话号码或想要宣传的产品/服务等</span>',
                    '</div>',
                    '</div>',

                    '<div class="form-group">',
                    '<label class="col-sm-2 control-label require">文字第三行</label>',
                    '<div class="col-sm-10">',
                        '<input type="text" class="form-control js_tel" placeholder="">',
                        '<span class="hw-tip">建议填写职位名称，营业特色，电话号码或想要宣传的产品/服务等</span>',
                    '</div>',
                    '</div>',

                    '<div class="s-btn">',
                        '<a href="../mybiz/index.html" class="hw-btn hw-light-btn hw-back">取消</a>',

                        '<button class="hw-btn hw-blue-btn hw-sub js_sub">'+(this.postid?"保存":"创建广告")+'</button>',
                    '</div>',

                '</form>',

            '</div>'
        ].join('');
    },
    getData : function(box, data, next){
        var self = this;
        self.postid = KG.data.get('id');
        util.loading(true);

        if(self.postid){
            KG.request.getAdsDetail({
                id : self.postid,
                bizinfo : true
            }, function(flag, rs){
                util.loading(false);
                if(flag){
                    self.bizId = rs.fk_entityID;
                    self.bizData = rs.bizinfo;
                    self.logo = rs.pic;
                    self.name = rs.title;
                    self.ad1 = rs.ad1;
                    self.ad2 = rs.ad2;
                    self.tel = rs.tel;

                    if(rs.type === 3){
                        self.tpl = 3;
                    }
                    else{
                        self.tpl = 'common'+rs.type;
                    }

                    next({});
                }
                else{
                    //TODO
                }
            });
        }
        else{
            var storeID = util.url.param('store');
            if(!storeID){
                util.toast.showError('店铺参数错误');
                util.delay(function(){
                    location.href = '../mybiz/createStore.html';
                }, 2000);
                return false;
            }

            KG.request.getStoreDetail({
                id : storeID
            }, function(flag, rs){
                util.loading(false);
                if(flag){
                    self.bizId = storeID;
                    self.bizData = rs;
                    self.logo = KG.config.SiteRoot+self.bizData.logo[0].path;
                    self.tpl = 'common1';
                    self.tel = self.bizData.tel;

                    next({});
                }
            });

        }


    },


    initStart : function(){
        this.bizId = null;
        this.bizData = null;
        this.tpl = '';
        this.logo = '';
        this.name = '';
        this.ad1 = '';
        this.ad2 = '';
        this.tel = '';

        this.tagList = {
            '27' : 'canyinmeishi',
            '131' : 'canyinmeishi',
            '41' : 'jiazhuangqingjie',
            '214' : 'kehoufudao',
            '366' : 'kuijibaoxian',
            '383' : 'kuijibaoxian',
            '195' : 'qicheweixiu',
            '643' : 'sijiaxiaodian',
            '294' : 'zhongyiyayi',
            '297' : 'zhongyiyayi',
            '345' : 'zhongyiyayi',
            '479' : 'xiuxianmeirong'
        };
    },
    setJqVar : function(){
        return {
            name : this.elem.find('.js_name'),
            ad1 : this.elem.find('.js_ad1'),
            ad2 : this.elem.find('.js_ad2'),
            tel : this.elem.find('.js_tel')
        };
    },
    setImageTemplate : function(){
        var self = this;
        var list = ['common1', 'common2'];
        var tag = this.bizData.fk_main_tag_id;
        if(this.tagList[tag]){
            list.push(this.tagList[tag]);
        }
        else{
            list.push('canyinmeishi');
        }


        var h = _.map(list, function(one){
            return '<img class="js_tpl" param="'+one+'" src="../../image/createad/'+one+'.png" />';
        });
        var box = this.elem.find('.s-tpl');
        box.html(h.join(''));
        if(this.tpl === 'common1'){
            box.find('img').eq(0).addClass('active');
        }
        else if(this.tpl === 'common2'){
            box.find('img').eq(1).addClass('active');
        }
        else{
            box.find('img').eq(2).addClass('active');
            self.jq.ad2.attr('disabled', true).parents('.form-group').addClass('disable');
        }
    },
    initEvent : function(){
        var self = this;
        this.elem.find('.s-tpl').on('click', 'img', function(){
            var o = $(this);
            if(o.hasClass('active')) return false;
            o.parent().find('img').removeClass('active');
            o.addClass('active');

            if(self.elem.find('.s-tpl img').index(o) === 2){
                self.jq.ad2.attr('disabled', true).parents('.form-group').addClass('disable');
            }
            else{
                self.jq.ad2.removeAttr('disabled').parents('.form-group').removeClass('disable');
            }

            self.toPreviewAD();
        });

        var tm = null;
        this.elem.find('.s-form').on('keyup', 'input', function(e){
            if(tm){
                window.clearTimeout(tm);
            }
            tm = window.setTimeout(function(){
                self.toPreviewAD();
            }, 200);

        });

        self.elem.find('.s-btn .js_sub').click(function(){
            var o = $(this);
            var data = self.getSubmitData();
            var m = '广告已提交审核，审核时间为1-2个工作日';
            if(self.postid){
                data.id = self.postid;
                m = '修改成功，审核时间为1-2个工作日';
            }

            console.log(data);
            if(!data.title){
                util.toast.showError('请输入标题');
                return false;
            }
            if(!data.ad1){
                util.toast.showError('请输入文字第一行');
                return false;
            }
            if(!data.tel){
                util.toast.showError('请输入文字第三行');
                return false;
            }

            util.dom.loadingButton(o, true);
            KG.request.createAds(data, function(flag, rs){
                util.dom.loadingButton(o, false);
                if(flag){
                    util.toast.alert(m);
                    util.delay(function(){
                        location.href = '../mybiz/index.html';
                    }, 2000);
                }
                else{
                    util.toast.showError(rs);
                }
            });

            return false;
        });
    },
    initEnd : function(){
        var self = this;
        this.elem.find('.s-img').attr('data-image', this.logo);
        this.jq.logo = KG.component.initWithElement(this.elem.find('.s-img'));
        this.jq.logo.elem.bind('change_end', this.toPreviewAD.bind(this));

        this.setImageTemplate();

        this.jq.name.val(this.name);
        this.jq.ad1.val(this.ad1);
        this.jq.ad2.val(this.ad2);
        this.jq.tel.val(this.tel);

        util.delay(function(){
            self.toPreviewAD();
        }, 100);
    },
    getFormValue : function(){
        this.tpl = this.elem.find('.js_tpl').filter('.active').attr('param');
        this.logo = this.jq.logo.getImageUrl();
        this.name = this.jq.name.val();
        this.ad1 = this.jq.ad1.val();
        this.ad2 = this.jq.ad2.val();
        this.tel = this.jq.tel.val();

        return {
            template : this.tpl,
            logo : this.logo,
            bizName : this.name,
            bizAd1 : this.ad1,
            bizAd2 : this.ad2,
            bizTel : this.tel,
            bizLink : KG.config.SiteRoot+'/pc/page/view/store.html?id='+this.bizId
        };
    },

    toPreviewAD : function(){
        var data = this.getFormValue();
        util.message.publish('HWMybizCreateAdsPagePreivew', data);
    },

    getSubmitData : function(){
        this.getFormValue();
        var data = {
            title : this.name,
            ad1 : this.ad1,
            ad2 : this.ad2,
            tel : this.tel,
            bizId : this.bizId,
            tag : this.bizData.fk_main_tag_id,
            logo : this.logo,
            region : this.bizData.fk_region_id
        };

        if(this.tpl === 'common1'){
            data.type = 1;
        }
        else if(this.tpl === 'common2'){
            data.type = 2;
        }
        else{
            data.type = 3;
        }

        data.html = $('.hw-right-box .hw-preview').html();


        return data;
    }
});

KG.Class.define('HWMybizCreateAdsPagePreivew', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-right-box"><div class="box">',
                '<h4 class="hw-title">广告预览</h4>',
                '<div class="hw-preview"></div>',
            '</div></div>'
        ].join('');
    },
    registerMessage : function(e, data){
        this.setPreivewHtml(data);
    },
    setJqVar : function(){
        return {
            box : this.elem.find('.hw-preview')
        };
    },
    setPreivewHtml : function(data){
        var x;
        if(data.template === 'common1' || data.template === 'common2'){
            x = 'hw-ad-'+data.template;
        }
        else{
            x = 'hw-ad-t3 hw-ad-'+data.template;
        }
        var h = [
            '<a href="{{bizLink}}" target="_blank" class="hw-ad '+x+'">',
            '<div class="hw-logo"><img src="{{logo}}"/></div>',
            '<p class="hw-name">{{bizName}}</p>',
            '<p class="hw-ad1">{{bizAd1}}</p>',
            '<p class="hw-ad2">{{bizAd2}}</p>',
            '<p class="hw-tel">{{bizTel}}</p>',
            '</a>'
        ].join('');
        h = template.compile(h)(data);

        this.jq.box.html(h);

        this.elem.find('.box').show();
        console.log(this.elem.offset())
    },
    initEnd : function(){

        this.elem.find('.box').affix({
            offset : {
                top : 177-25
            }
        });
    }
});