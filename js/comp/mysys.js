
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
                '<li class="js_a"></li>',
                '</ul>',
                '</div>'
            ].join('');
        },
        getBodyTemplate : function(){
            return [
                '<div class="hw-each">',
                '<div class="h4">',
                //'<input type="checkbox" id="ck_aaa" value="">',
                '<label style="margin-left: 0;cursor: pointer;" class="hw-u js_sel_all" for="ck_aaa">全选</label>',
                '</div>',
                '<div class="r">',
                '<b class="hw-a js_del_all">删除</b>',
                '</div>',
                '</div>',


                '{{each list as item}}',
                '<div class="hw-each">',
                '<div class="h4">',
                    '<input param="{{item.id}}" type="checkbox" class="js_check" value="">',

                    '<a href="messageDetail.html?id={{item.id}}" class="hw-u">海外管理员</a>',
                    '<a {{if item.view>0}}style="font-weight:400;"{{/if}} href="messageDetail.html?id={{item.id}}" class="hw-p">{{item.title}}</a>',
                '</div>',

                '<div class="r">',
                    '<span>{{item.dateline | formatDate:"mm月dd日"}}</span>',
                    '<b param="{{item.id}}" class="js_del hw-a">删除</b>',
                '</div>',
                '</div>',
                '{{/each}}',

                '<div class="hw-each">',
                '<div class="h4">',
                //'<input type="checkbox" id="ck_bbb" value="">',
                '<label style="margin-left: 0;cursor: pointer;" class="hw-u js_sel_all" for="ck_bbb">全选</label>',
                '</div>',
                '<div class="r">',
                '<b class="hw-a js_del_all">删除</b>',
                '</div>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getSystemMessageList({}, function(flag, rs){
                next({
                    list : rs.rs,
                    count : {
                        read : rs.read,
                        unread : rs.unread,
                        all : parseInt(rs.read, 10)+parseInt(rs.unread, 10)
                    }
                });
            });
        },
        initEvent : function(){
            var self = this;
            var txt = this.elem.find('.js_type');
            this.elem.find('.js_a').click(function(){
                var o = $(this);
                txt.val(o.text());
            });

            this.elem.on('click', '.js_del', function(e){
                var id = $(this).attr('param');
                var o = $(this).closest('.hw-each');
                self.deleteOneMessage(id, function(){
                    o.fadeOut(200, function(){
                        o.remove();
                    });
                });
            });

            this.elem.find('.js_sel_all').click(function(){
                var check = self.elem.find('.js_check');
                check.each(function(){
                    var o = $(this);
                    o.prop('checked', !o.prop('checked'));
                });
            });

            this.elem.find('.js_del_all').click(function(){
                var check = self.elem.find('.js_check');
                var list = [];
                util.each(check, function(one){
                    var elem = $(one);
                    if(elem.prop('checked')){
                        list.push(elem.attr('param'));
                    }
                });

                self.deleteSelectMessage(list, function(){
                    location.reload();
                });
            });
        },
        initEnd : function(){
            //this.elem.find('.js_a').eq(0).html('全部系统消息（'+this.data.count.all+'）');
            this.elem.find('.js_a').eq(0).html('全部系统消息');
            this.elem.find('.js_a').eq(0).trigger('click');
            if(this.data.list.length < 1){
                this.elem.addClass('no_dis');
                var h = '<div role="HWNoContentDiv" style="width:840px;float: right;height:240px;" data-text="暂无系统消息"></div>';
                this.elem.after(h);
                KG.component.initWithElement($('div[role="HWNoContentDiv"]'));
            }


        },
        deleteOneMessage : function(id, callback){
            util.dialog.confirm({
                msg : '确认要删除此系统消息么？',
                YesFn : function(close){
                    close();
                    KG.request.deleteSystemMessageById({
                        id : id
                    }, function(flag, rs){
                        if(flag){
                            callback();
                        }
                    });
                }
            });
        },
        deleteSelectMessage : function(list, callback){

            util.dialog.confirm({
                msg : '确认要删除这些系统消息么？',
                YesFn : function(close){
                    close();
                    KG.request.deleteSystemMessageById({
                        ids : list
                    }, function(flag, rs){
                        if(flag){
                            callback();
                        }
                        else{
                            alert(rs);
                        }
                    });
                }
            });
        }
    });


    KG.Class.define('MycountMessageDetail', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MycountMessageDetail">',
                    '<h4>{{data.title}}</h4>',
                    '<small>{{data.dateline | formatDate}}</small>',
                    '<p>{{#data.msgbody}}</p>',
                    '<div class="hw-ft">',
                        '<a href="index.html" style="margin-left: 25px;" class="hw-btn hw-blue-btn">返回</a>',
                        '<button class="js_del hw-btn hw-light-btn">删除</button>',
                    '</div>',
                '</div>'
            ].join('');
        },
        defineProperty : function(){
            return {
                msgId : {
                    defaultValue : ''
                }
            };
        },
        getData : function(box, data, next){
            var id = this.prop.msgId || KG.data.get('msgId');
            KG.request.getSystemMessageDetail({
                id : id
            }, function(flag, rs){
                if(flag){
                    next({
                        id : id,
                        data : rs
                    });
                }
            });

        },
        initEvent : function(){
            var msgId = this.data.id;
            this.elem.find('.js_del').click(function(){
                util.dialog.confirm({
                    msg : '确认要删除此系统消息么？',
                    YesFn : function(){
                        KG.request.deleteSystemMessageById({
                            id : msgId
                        }, function(flag, rs){
                            if(flag){
                                location.href = 'index.html';
                            }
                        });
                    }
                });
            });
        }
    });

})();