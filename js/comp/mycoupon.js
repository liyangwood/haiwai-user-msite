
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
                '<li class="js_a" param="0"></li>',
                '<li class="js_a" param="1"></li>',
                '<li class="js_a" param="2"></li>',
                '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return '';
        },

        initStart : function(){
            this.type = '';
        },

        getListTemplate : function(){
            return [
                '{{each list as item}}',
                '<div class="hw-each">',
                '<div class="hw-img" data-url="{{item.logo.path | absImage}}" role="BaseLoadingImageBox"></div>',

                '{{if !item.active_time}}',
                '<div class="mask">已过期</div>',
                '{{/if}}',

                '<div style="margin-top: 10px;" class="h4 js_coupon hand" param={{item.pk_id}}>',
                    '<b>{{item.subject}}</b>',
                '</div>',

                '<p style="font-size: 16px;margin-top:20px;">{{item.duaring}}</p>',

                '<div class="r">',
                    '{{if !item.active_time}}',
                        '<b class="hw-a js_del" param="{{item.pk_id}}" style="margin-top: 48px;">删除</b>',
                    '{{else}}',
                        //'<b class="hw-a js_sendphone" param="{{item.pk_id}}" style="margin-top: 18px;">发送短信至手机</b>',
                        '<b style="margin-top:35px;" class="hw-a js_share" param="{{item.pk_id}}">分享</b>',
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
            KG.component.init(this.jq.panelBody);
        },

        setCount : function(json){
            var li = this.elem.find('.js_a');
            li.eq(0).html('全部优惠（'+json.all+'）');
            li.eq(1).html('正在优惠（'+json.is_active+'）');
            li.eq(2).html('过期优惠（'+json.not_active+'）');
        },

        getListData : function(type, callback){
            var self = this;
            var data = {};
            if(type === 1){
                data.is_active = true;
            }
            else if(type === 2){
                data.not_active = true;
            }

            KG.request.getMycouponList(data, function(flag, rs){
                if(flag){
                    self.setCount(rs.count);
                    self.setListHtml(rs.list);
                    callback();
                }
            });
        },
        initEvent : function(){
            var self = this;
            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());

                var type = o.attr('param');
                if(self.type === type){
                    return false;
                }
                else{
                    self.type = type;
                }

                self.getListData(parseInt(type, 0), function(){
                    o.trigger('click');
                });
            });

            this.jq.panelBody.on('click', '.js_coupon', function(){
                var id = $(this).attr('param');
                util.dialog.showCouponDetail(id);
                return false;
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
                    id = o.attr('param'),
                    url = util.path.toMSiteCoupon(id);
                util.dialog.showQrCode(url);
            });
        },
        initEnd : function(){
            this.elem.find('.js_a').eq(0).trigger('click');

        }
    });
})();