
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
                '<li class="js_a" param="0">全部优惠（{{listLen}}）</li>',
                '<li class="js_a" param="1">正在优惠（{{runningLen}}）</li>',
                '<li class="js_a" param="2">过期优惠（{{stopLen}}）</li>',
                '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return '';
        },
        getListTemplate : function(){
            return [
                '{{each list as item}}',
                '<div class="hw-each">',
                '<img class="hw-img" src="{{item.logo | absImage}}" />',

                '{{if !item.active_time}}',
                '<div class="mask">已过期</div>',
                '{{/if}}',

                '<div style="margin-top: 10px;" class="h4">',
                    '<b>{{item.subject}}</b>',
                '</div>',

                '<p style="font-size: 16px;margin-top:20px;">{{item.top_start_time}} 至 {{item.top_end_time}}</p>',

                '<div class="r">',
                    '{{if !item.active_time}}',
                        '<b class="hw-a js_del" param="{{item.pk_id}}" style="margin-top: 48px;">删除</b>',
                    '{{else}}',
                        '<b class="hw-a js_sendphone" param="{{item.pk_id}}" style="margin-top: 18px;">发送短信至手机</b>',
                        '<b class="hw-a js_share" param="{{item.pk_id}}">分享</b>',
                        '<b class="hw-a js_del" param="{{item.pk_id}}">删除</b>',

                    '{{/if}}',
                '</div>',
                '</div>',
                '{{/each}}'
            ].join('');
        },

        setListHtml : function(data){
            var h = template.compile(this.getListTemplate())({
                list : data
            });
            this.jq.panelBody.html(h);
        },

        getData : function(box, data, next){
            KG.request.getMycouponList({}, function(flag, rs){

                var allList = rs,
                    runningList = [],
                    stopList = [];
                util.each(allList, function(item){
                    if(item.active_time){
                        runningList.push(item);
                    }
                    else{
                        stopList.push(item);
                    }
                });


                next({
                    list : allList,
                    runningList : runningList,
                    stopList : stopList,
                    stopLen : stopList.length,
                    runningLen : runningList.length,
                    listLen : allList.length
                });
            });
        },
        initEvent : function(){
            var self = this;
            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());

                var type = o.attr('param'),
                    list = null;
                switch(type){
                    case '0':
                        list = self.data.list;
                        break;
                    case '1':
                        list = self.data.runningList;
                        break;
                    case '2':
                        list = self.data.stopList;
                        break;
                }
                self.setListHtml(list);
            });

            //delete btn
            this.jq.panelBody.on('click', '.js_del', function(e){
                var o = $(this),
                    id = o.attr('param');
                util.dialog.confirm({
                    msg : '确认删除这条优惠么？',
                    YesFn : function(close){
                        close();

                        KG.request.deleteMyFavCoupon({id : id}, function(flag, rs){
                            console.log(flag, rs);
                            if(flag){
                                location.reload(true);
                            }
                        });
                    }
                });
            });
            this.jq.panelBody.on('click', '.js_share', function(){
                var o = $(this),
                    id = o.attr('param');
                util.dialog.showQrCode('http://www.haiwai.com');
            });
        },
        initEnd : function(){
            this.elem.find('.js_a').eq(0).trigger('click');

        }
    });
})();