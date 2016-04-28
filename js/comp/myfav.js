

'use strict';

(function(){

    KG.Class.define('MyfavLeftUserNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){

            return [
                '<div style="height: auto;" class="hw-MybizLeftUserNav">',
                '<a class="hw-img" href="javascript:void(0)"><img src="{{user.image}}" /></a>',
                '<span class="hw-email">{{user.email}}<a style="display: block;" href="../mycount/info.html">[帐号设置]</a></span>',


                //'<a href="javascript:void(0)" class="hw-a js_{{page}}" style="margin-top: 24px;">{{dir}}</a>',
                '<a href="../myfav/list.html" class="hw-a js_myfav" style="margin-top:24px;">我的收藏</a>',
                '<a href="../mycoupon/list.html" class="hw-a js_mycoupon">我的领取</a>',
                '<a href="../mysys/index.html" class="hw-a js_mysys">系统消息</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            var user = KG.user.get();

            var page = KG.data.get('page').split('-');

            page = page[0] || '';


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

    KG.Class.define('RightPanelList_1', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="panel hw-panel hw-comp-RightPanelList-1" style="width: 844px;float: right;">',
                '<div class="panel-heading">',
                    this.getHeadingTemplate(),
                '</div>',
                '<div class="hw-comp-store-list hw-right-panel-list panel-body">',
                    this.getBodyTemplate(),
                '</div>',
                '</div>'
            ].join('');
        },
        setJqVar : function(){
            return {
                panelTitle : this.elem.find('.panel-heading'),
                panelBody : this.elem.find('.panel-body')
            };
        },
        getHeadingTemplate : function(){},
        getBodyTemplate : function(){}
    });


    KG.Class.define('MyfavList', {
        ParentClass : 'RightPanelList_1',
        getHeadingTemplate : function(){
            return [
                '<div class="dropdown hw-drop">',
                    '<button id="dp_aaa" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                        '<input type="text" readonly="true" class="form-control js_type" >',
                        '<i class="icon fa fa-caret-down"></i>',
                    '</button>',
                    '<ul class="dropdown-menu" aria-labelledby="dp_aaa">',
                        '<li data-type="all" class="js_a"></li>',
                        '<li data-type="deal" class="js_a"></li>',
                        '<li data-type="pause" class="js_a"></li>',
                    '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return '<div class="js_box"></div>';
                //+ '<div class="js_more" role="BaseLoadingMoreStatusBar"></div>';
        },

        setListHtml : function(data, type){
            var h = [
                '{{each list as item}}',
                '<div class="hw-each">',
                    //'<img class="hw-img" src="{{item | logoPath}}" />',
                    '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item | logoPath}}"></div>',

                    '{{if item.bizType==="pause"}}',
                    '<div class="mask">暂停营业</div>',
                    '{{/if}}',

                    '<div class="h4">',
                        '<a class="h4" target="_blank" href="{{item.entityID | toStorePath}}">{{item.name_cn}}</a>',
                        //'{{if item.verified&&item.verified==="yes"}}<i class="icon icon-v">v</i>{{/if}}',

                        '{{if item.event_info}}',
                        '<i class="icon icon-coupon"></i>',
                        '<span class="hand cpt js_coupon"' +
                        ' param="{{item.event_info.pk_id}}">{{item.event_info.subject}}</span>',
                        '{{/if}}',

                    '</div>',
                    '<div style="margin-top: 0;" role="StarRank" data-rank="{{item.star}}"></div>',
                    '<span style="margin-left: 10px;font-size: 14px;">{{item.commentnum}}条评论</span>',
                    '<p style="font-size: 14px;margin-top:8px;">地址 : {{item | storeFullAddress}} &nbsp;&nbsp; 电话 : {{item.tel}}</p>',

                    '<div class="r">',
                        '<b class="hw-a js_share" param="{{item.entityID}}" style="margin-top: 18px;">分享</b>',
                        '<a class="hw-a" href="{{item.entityID | toStorePath}}#hw-id-reply">评论</a>',
                        '<b param="{{item.entityID}}" class="hw-a js_del">取消收藏</b>',
                    '</div>',
                '</div>',
                '{{/each}}'
            ].join('');

            h = template.compile(h)({
                list : data,
                type : {
                    pause : type==='pause'?true:false,
                    deal : type==='deal'?true:false
                }
            });

            if(data.length < 1){
                h = '<div role="HWNoContentDiv" style="height:180px;" data-text="暂无收藏店铺"></div>';
            }

            this.jq.panelBody.find('.js_box').html(h);
            KG.component.init(this.jq.panelBody);
        },

        initStart : function(){
            this.type = '';
        },

        getListData : function(type, callback){
            var self = this;
            var data = {};
            if(type === 'pause'){
                data.not_open = true;
            }
            else if(type === 'deal'){
                data.is_active = true;
            }

            KG.request.getMyfavStoreList(data, function(flag, rs){
                console.log(flag, rs);
                if(flag){
                    self.setCount(rs.count);

                    var list = _.map(rs.list, function(item){
                        item.bizType = type;

                        if(item.visible === '-1'){
                            item.bizType = 'pause';
                        }

                        return item;
                    });

                    self.setListHtml(list, type);
                    callback();
                }


            });
        },
        getData : function(box, data, next){

            next({});
        },
        setCount : function(json){
            var li = this.elem.find('.js_a');
            li.eq(0).html('全部收藏店铺('+json.all+')');
            li.eq(1).html('正在优惠店铺('+json.is_active+')');
            li.eq(2).html('暂停营业店铺('+json.is_closed+')');
        },
        initEvent : function(){
            var self = this;

            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());

                var type = o.data('type');
                if(self.type === type){
                    return false;
                }
                else{
                    self.type = type;
                }
                self.getListData(type, function(){
                    o.trigger('click');
                });
            });

            this.elem.on('click', '.js_del', function(e){
                var id = $(e.target).attr('param');

                util.dialog.confirm({
                    msg : '确认取消收藏此店铺么？',
                    YesFn : function(callback){
                        KG.request.deleteMyFavStore({
                            bizId : id
                        }, function(flag, rs){
                            callback();
                            if(flag){
                                $(e.target).closest('.hw-each').fadeOut(400, function(){
                                    $(this).remove();
                                });
                            }
                            else{
                                util.toast.showError(rs);
                            }
                        });
                    }
                });

            });


            this.elem.on('click', '.js_share', function(e){
                var id = $(this).attr('param'),
                    url = util.path.toMSiteStore(id);

                util.dialog.showQrCode(url);
            });

            this.elem.on('click', '.js_coupon', function(){
                var id = $(this).attr('param');
                util.dialog.showCouponDetail(id);
            });
        },
        initEnd : function(){
            this.elem.find('.js_a').eq(0).trigger('click');



        }
    });



})();