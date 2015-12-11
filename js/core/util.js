

'use strict';

(function(){
    var util = {};

    //merge underscore
    _.extend(util, _);

    util.extend(util, {
        formatDate : function(date, format){
            if(date.toString().length === 10){
                date = parseInt(date)*1000;
            }

            var d = new Date(date);
            var year = d.getFullYear(),
                month = addZero(d.getMonth() + 1),
                day = addZero(d.getDate()),
                hour = addZero(d.getHours()),
                min = addZero(d.getMinutes()),
                sec = addZero(d.getSeconds());

            function addZero(x){
                if(x<10) return '0'+x;
                return x;
            }

            return format.replace('yy', year).replace('mm', month).replace('dd', day).replace('h', hour).replace('m', min).replace('s', sec);
        }
    });

    util.dialog = {
        init : function(){
            var html = [
                '<div class="modal fade" id="kg_modal_dialog" tabindex="-1" role="dialog">',
                '<div class="modal-dialog" role="document">',
                '<div class="modal-content box">',

            '</div>',
            '</div>',
            '</div>'
            ].join('');
            html = $(html);

            html.on('hidden.bs.modal', function(){
                var box = html.find('.box');
                box.find('.js_yes').unbind('click');

                box.empty();
            });


            html.appendTo('body');
        },

        get : function(opts){
            if($('#kg_modal_dialog').length < 1){
                util.dialog.init();
            }
            var obj = $('#kg_modal_dialog');

            var p = util.extend({
                title : '信息提示',
                body : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                foot : true,
                type : 'confirm',

                YesText : '确认',
                YesFn : util.noop,
                NoText : '取消',

                end : null
            }, opts);

            var html = [
                '{{if type!=="toast"}}',
                '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="fa fa-times"></i></button>',
                '</div>',
                '{{/if}}',

                '<div class="modal-body">',
                    '{{if title}}',
                        '<h4 class="hw-title">{{title}}</h4>',
                    '{{/if}}',

                    '<div class="hw-body">{{#body}}</div>',

                '</div>',

                '{{if foot}}',
                '<div class="modal-footer">',
                    '<button type="button" class="hw-btn hw-light-btn" data-dismiss="modal">{{NoText}}</button>',
                    '<button type="button" class="hw-btn hw-blue-btn js_yes">{{YesText}}</button>',
                '</div>',
                '{{/if}}'
            ].join('');

            html = template.compile(html)(p);

            obj.find('.box').html(html);

            obj.find('.js_yes').click(p.YesFn);

            return obj;
        },

        show : function(opts){
            var obj = util.dialog.get(opts);
            obj.modal();
        },
        hide : function(){
            var obj = util.dialog.get();
            obj.modal('hide');
        }
    };


    window.util = KG.util = util;
})();






(function(){
    template.helper('formatDate', function(date, format){
        return util.formatDate(date, format||'yy年mm月dd日 h:m:s');
    });

    template.helper('storeFullAddress', function(item){
        return item.address+', '+item.city+', '+item.state+' '+item.zip;
    });
})();