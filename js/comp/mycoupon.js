
'use strict';

(function(){
    KG.Class.define('MycouponList', {
        ParentClass : 'RightPanelList_1',

        getHeadingTemplate : function(){
            return [
                '<div class="dropdown hw-drop">',
                '<button id="dp_aaa" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                '<input type="text" readonly="true" class="form-control js_type" >',
                '<i class="icon fa fa-caret-down"></i>',
                '</button>',
                '<ul class="dropdown-menu" aria-labelledby="dp_aaa">',
                '<li class="js_a">全部优惠（0）</li>',
                '<li class="js_a">正在优惠（0）</li>',
                '<li class="js_a">过期优惠（0）</li>',
                '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return [
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',

                '{{if item.stop}}',
                '<div class="mask">已过期</div>',
                '{{/if}}',

                '<div style="margin-top: 10px;" class="h4">',
                    '<b>{{item.title}}</b>',
                '</div>',

                '<p style="font-size: 16px;margin-top:20px;">{{item.startTime | formatDate}} 至 {{item.endTime | formatDate}}</p>',

                '<div class="r">',
                    '{{if item.stop}}',
                        '<b class="hw-a" style="margin-top: 48px;">删除</b>',
                    '{{else}}',
                        '<b class="hw-a" style="margin-top: 18px;">发送短信至手机</b>',
                        '<b class="hw-a">分享</b>',
                        '<b class="hw-a">删除</b>',

                    '{{/if}}',
                '</div>',
                '</div>',
                '{{/each}}'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getBizCouponList({}, function(flag, rs){
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