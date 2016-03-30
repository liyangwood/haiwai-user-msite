

'use strict';

(function(){



    KG.Class.define('MyfavLeftUserNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){

            return [
                '<div style="height: auto;" class="hw-MybizLeftUserNav">',
                '<a class="hw-img" href="javascript:void(0)"><img src="{{user.image}}" /></a>',
                '<span class="hw-email">{{user.email}}<a href="../mycount/info.html">[账户设置]</a></span>',


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
                        '<li data-type="all" class="js_a">全部收藏店铺({{list.length}})</li>',
                        '<li data-type="deal" class="js_a">正在优惠店铺({{dealList.length}})</li>',
                        '<li data-type="pause" class="js_a">暂停营业店铺({{pauseList.length}})</li>',
                    '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return '';
        },

        setListHtml : function(data, type){
            var h = [
                '{{each list as item}}',
                '<div class="hw-each">',
                    '<img class="hw-img" src="{{item | logoPath}}" />',

                    '{{if item.bizType==="pause"}}',
                    '<div class="mask">暂停营业</div>',
                    '{{/if}}',

                    '<div class="h4">',
                        '<a class="h4" target="_blank" href="{{item.entityID | toStorePath}}">{{item.name_cn}}</a>',
                        '{{if item.verified&&item.verified==="yes"}}<i class="icon icon-v">v</i>{{/if}}',

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
                        '<b param="{{item.bookmarkid}}" class="hw-a js_del">取消收藏</b>',
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

            this.jq.panelBody.html(h);
            KG.component.init(this.jq.panelBody);
        },
        getData : function(box, data, next){

            var list = [],
                pauseList = [],
                dealList = [];

            KG.request.getMyfavStoreList({}, function(flag, rs){
                console.log(flag, rs);
                if(flag){
                    list = rs;
                }



                util.each(list, function(item){
                    if(item.visible.toString() === '-1'){
                        item.bizType = 'pause';
                        pauseList.push(item);
                    }
                    else if(item.is_promote.toString() === '1'){
                        item.bizType = 'deal';
                        dealList.push(item);
                    }
                });

                next({
                    list : list,
                    pauseList : pauseList,
                    dealList : dealList
                });
            });


        },
        initEvent : function(){
            var self = this;

            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());

                var type = o.data('type');
                var list;
                if(type === 'all'){
                    list = self.data.list;
                }
                else if(type === 'deal'){
                    list = self.data.dealList;
                }
                else if(type === 'pause'){
                    list = self.data.pauseList;
                }


                self.setListHtml(list);
            });

            this.elem.on('click', '.js_del', function(e){
                var id = $(e.target).attr('param');

                util.dialog.confirm({
                    msg : '确认取消收藏此店铺么？',
                    YesFn : function(callback){
                        KG.request.deleteMyFavStore({
                            id : id
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


            KG.component.init(this.elem);
        }
    });



})();