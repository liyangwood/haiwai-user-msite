'use strict';
(function(){
    KG.Class.define('BaseForm', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="container hw-comp-bform">',
                    this.getInsideTemplate(),
                '</div>'
            ].join('');
        },
        getInsideTemplate : function(){}
    });



    KG.Class.define('MybizArticleForm', {
        ParentClass : 'BaseForm',
        getInsideTemplate : function(){
            return [
                '{{if pageTitle}}<h3>{{pageTitle}}<h3>{{/if}}',
                '<div class="form-group">',
                    '<label class="require">将文章发布到</label>',
                    '<div class="dropdown">',
                        '<button class="hw-drop" id="dl_aaa" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                            '<input type="text" readonly="true" class="form-control js_biz" >',
                            '<i class="icon fa fa-caret-down"></i>',
                        '</button>',
                        '<ul class="dropdown-menu" aria-labelledby="dl_aaa">',
                            '{{each bizList as item}}',
                            '<li class="js_drop">{{item.name_cn}}, {{item | storeFullAddress}}</li>',
                            '{{/each}}',
                        '</ul>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="require" for="lb_bbb">文章标题</label>',
                    '<input type="email" class="form-control" id="lb_bbb" placeholder="e.g. 海底捞成功的秘密">',
                '</div>',

                '<div class="form-group">',
                    '<label class="require" for="lb_ccc">文章正文</label>',
                    '<textarea class="form-control" id="lb_ccc"></textarea>',
                '</div>',
                '<a href="javascript:void(0)" class="hw-btn hw-blue-btn">发表</a>'
            ].join('');
        },

        getData : function(box, data, callback){
            var title = box.data('title') || '',
                type = box.data('type') || 'create';


            var getBizList = function(){
                return KG.request.getBizList({});
            };

            var list = [getBizList];

            if(type === 'edit'){
                list.push(function(){
                    return KG.request.getBizCouponList({});
                });
            }

            KG.request.defer(list, function(bizList){
                callback({
                    pageTitle : title,
                    bizList : bizList
                });
            });


        },

        initEvent : function(){
            var biz = this.elem.find('.js_biz');
            this.elem.find('.js_drop').click(function(){
                  biz.val($(this).text());
            });
        },

        initEnd : function(){
            CKEDITOR.replace('lb_ccc');
        }
    });





























})();