

'use strict';

(function(){

    KG.Class.define('StarRank', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-star">',
                    '{{each list as item}}',
                    '{{if item==="full"}}',
                        '<i class="icon fa fa-star"></i>',
                    '{{else if item==="half"}}',
                        '<i class="icon fa fa-star-half-o"></i>',
                    '{{else}}',
                        '<i class="icon fa fa-star-o"></i>',
                    '{{/if}}',
                    '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var rank = parseFloat(box.data('rank'));

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

            next({
                list : list
            });
        }
    });

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
                        '<li class="js_a">全部收藏店铺</li>',
                        '<li class="js_a">正在优惠店铺</li>',
                        '<li class="js_a">暂停营业店铺</li>',
                    '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return [
                '{{each list as item}}',
                '<div class="hw-each">',
                    '<img class="hw-img" src="{{item.logo | absImage}}" />',

                    //'{{if item.stop}}',
                    '<div class="mask">暂停营业</div>',
                    //'{{/if}}',

                    '<div class="h4">',
                        '<b>{{item.name_cn}}</b>',
                        '<i class="icon icon-v">v</i>',

                        '<i class="icon icon-coupon"></i>',
                        '<span class="cpt">全场满100送代金券</span>',
                    '</div>',
                    '<div style="margin-top: 0;" role="StarRank" data-rank="3.5"></div>',
                    '<span style="margin-left: 10px;font-size: 14px;">{{item.commentnum}}条评论</span>',
                    '<p style="font-size: 14px;margin-top:8px;">地址 : {{item | storeFullAddress}} &nbsp;&nbsp; 电话 : {{item.tel}}</p>',

                    '<div class="r">',
                        '<b class="hw-a" style="margin-top: 18px;">分享</b>',
                        '<b class="hw-a">评论</b>',
                        '<b class="hw-a">取消收藏</b>',
                    '</div>',
                '</div>',
                '{{/each}}'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getBizList({}, function(flag, rs){
                next({
                    list : rs
                });
            });
        },
        initEvent : function(){
            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());
            });
        },
        initEnd : function(){
            this.elem.find('.js_a').eq(0).trigger('click');


            KG.component.init(this.elem);
        }
    });



})();