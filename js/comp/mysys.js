
'use strict';

(function(){

    KG.Class.define('MysysMessageList', {
        ParentClass : 'RightPanelList_1',
        getHeadingTemplate : function(){
            return [
                '<div class="dropdown hw-drop">',
                '<button id="dp_aaa" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                '<input type="text" readonly="true" class="form-control js_type" >',
                '<i class="icon fa fa-caret-down"></i>',
                '</button>',
                '<ul class="dropdown-menu" aria-labelledby="dp_aaa">',
                '<li class="js_a">全部系统消息</li>',
                '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return [
                '<div class="hw-each">',
                '<div class="h4">',
                //'<input type="checkbox" id="ck_aaa" value="">',
                '<label style="margin-left: 0;" class="hw-u" for="ck_aaa">全选</label>',
                '</div>',
                '<div class="r">',
                '<b class="hw-a">删除</b>',
                '</div>',
                '</div>',


                '{{each list as item}}',
                '<div class="hw-each">',
                '<div class="h4">',
                    '<input type="checkbox" value="">',

                    '<span class="hw-u">{{item.fromUser}}</span>',
                    '<b>{{item.title}}</b>',
                '</div>',

                '<div class="r">',
                    '<b class="hw-a">删除</b>',
                '</div>',
                '</div>',
                '{{/each}}',

                '<div class="hw-each">',
                '<div class="h4">',
                //'<input type="checkbox" id="ck_bbb" value="">',
                '<label style="margin-left: 0;" class="hw-u" for="ck_bbb">全选</label>',
                '</div>',
                '<div class="r">',
                '<b class="hw-a">删除</b>',
                '</div>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getSystemMessageList({}, function(flag, rs){
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

        }
    });

})();