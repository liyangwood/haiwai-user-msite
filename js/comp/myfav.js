

'use strict';

(function(){



    KG.Class.define('MyfavLeftUserNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){

            return [
                '<div style="height: 200px;" class="hw-MybizLeftUserNav">',
                '<a class="hw-img" href=""><img src="{{user.image}}" /></a>',
                '<span class="hw-email">{{user.email}}</span>',

                '<a href="javascript:void(0)" class="hw-a js_{{page}}" style="margin-top: 24px;">{{dir}}</a>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, callback){
            var user = KG.user.get();

            var page = KG.data.get('page').split('-');
            var p1 = page[0];

            page = page[1] || '';

            p1 = {
                myfav : '收藏店铺',
                mycoupon : '我的优惠',
                mysys : '系统消息'
            }[p1];
            callback({
                user : user,
                page : page,
                dir : p1
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
                    '<img class="hw-img" src="{{item.logo | absImage}}" />',

                    '{{if item.bizType==="pause"}}',
                    '<div class="mask">暂停营业</div>',
                    '{{/if}}',

                    '<div class="h4">',
                        '<a class="h4" href="{{item.entityID | toStorePath}}">{{item.name_cn}}</a>',
                        '<i class="icon icon-v">v</i>',

                        //'<i class="icon icon-coupon"></i>',
                        //'<span class="cpt">全场满100送代金券</span>',
                    '</div>',
                    '<div style="margin-top: 0;" role="StarRank" data-rank="3.5"></div>',
                    '<span style="margin-left: 10px;font-size: 14px;">{{item.commentnum}}条评论</span>',
                    '<p style="font-size: 14px;margin-top:8px;">地址 : {{item | storeFullAddress}} &nbsp;&nbsp; 电话 : {{item.tel}}</p>',

                    '<div class="r">',
                        '<b class="hw-a js_share" style="margin-top: 18px;">分享</b>',
                        '<b class="hw-a js_toReply">评论</b>',
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
                                alert(rs);
                            }
                        });
                    }
                });

            });

            this.elem.on('click', '.js_toReply', function(){
                alert('To Reply Page');
            });

            this.elem.on('click', '.js_share', function(e){
                var url = 'http:www.wenxuecity.com';
                alert('share biz url '+url);
                util.dialog.showQrCode(url);
            });
        },
        initEnd : function(){
            this.elem.find('.js_a').eq(0).trigger('click');


            KG.component.init(this.elem);
        }
    });



})();