

'use strict';

(function(){
    var _uuid = 1;


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
        },

        getUuid : function(){
            return 'uuid_'+_uuid++;
        },

        uploadImage : function(file, callback){

            if(!file) return;

            var fr = new FileReader();
            fr.onload = function(e){
                var binary = e.target.result;

                KG.request.uploadImage({
                    image : binary
                }, function(flag, rs){
                    if(flag){
                        callback(rs.files[0]);
                    }
                });
            };

            fr.readAsDataURL(file);
        },
    });

    util.message = {
        register : function(name, fn){
            $('body').unbind(name).bind(name, fn);
        },
        publish : function(name, data){
            $('body').trigger(name, data);
        }
    };

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

            if(!opts){
                return obj;
            }

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

                    '{{if body}}<div class="hw-body">{{#body}}</div>{{/if}}',

                '</div>',

                '{{if foot}}',
                '<div class="modal-footer">',
                    '<button type="button" class="hw-btn hw-light-btn" data-dismiss="modal">{{NoText}}</button>',
                    '{{if YesText}}<button type="button" class="hw-btn hw-blue-btn js_yes">{{YesText}}</button>{{/if}}',
                '</div>',
                '{{/if}}'
            ].join('');

            html = template.compile(html)(p);

            obj.find('.box').html(html);

            obj.find('.js_yes').click(p.YesFn);


            //class
            obj.attr('class', 'modal fade');
            if(opts.class){
                obj.addClass(opts.class);
            }

            return obj;
        },

        show : function(opts){
            var obj = util.dialog.get(opts);
            obj.modal();
        },
        hide : function(){
            var obj = util.dialog.get();
            obj.modal('toggle');
        },


        showFocusImage : function(index, list){
            var h = [
                '<div id="cb_cccc" class="carousel slide" data-ride="carousel">',
                    <!-- Indicators -->
                    '<ol class="carousel-indicators">',
                    '{{each list}}',
                    '<li data-target="#cb_cccc" data-slide-to="{{$index}}" class="{{if index==$index}}active{{/if}}"></li>',
                    '{{/each}}',
                    '</ol>',

                    '<div class="carousel-inner" role="listbox">',
                        '{{each list as url}}',
                        '<div class="item {{if index==$index}}active{{/if}}">',
                            '<img src="{{url}}">',
                            //'<div class="carousel-caption">',
                            //'</div>',
                        '</div>',
                        '{{/each}}',

                    '</div>',

                    '<a class="left carousel-control" href="#cb_cccc" role="button" data-slide="prev">',
                        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',
                        '<span class="sr-only">Previous</span>',
                    '</a>',
                    '<a class="right carousel-control" href="#cb_cccc" role="button" data-slide="next">',
                        '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
                        '<span class="sr-only">Next</span>',
                    '</a>',
                '</div>'
            ].join('');
            h = template.compile(h)({
                list : list,
                index : index
            });

            util.dialog.show({
                body : h,
                foot : false,
                'class' : 'hw-carousel',
                title : ''
            });
        },

        confirm : function(opts){
            util.dialog.show({
                title : opts.msg,
                body : false,
                NoText : '取消',
                YesText : opts.YesText,
                'class' : 'hw-confirm',
                YesFn : opts.YesFn
            });
        }
    };

    util.alert = function(msg){
        util.dialog.show({
            body : msg,
            NoText : '确定',
            YesText : false
        });
    };





    util.url = {
        param : function(key, url){
            url = url || location.search;

            key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
                results = regex.exec(url);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
    template.helper('defaultUserImage', function(image){
        if(!image){
            return KG.user.get('defaultImage');
        }
        return image;
    });
})();