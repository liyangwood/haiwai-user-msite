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

    KG.Class.define('BaseInput', {
        ParentClass : 'BaseComponent',
        defineProperty : function(){
            return {
                value : {
                    defaultValue : ''
                },
                label : {},
                require : {},
                type : {
                    defaultValue : 'text'
                },
                delbtn : {}
            };
        },
        getTemplate : function(){
            return [
                '<div class="form-group hw-comp-BaseInput">',
                '<label class="lab {{if require}}require{{/if}}" for="{{uuid}}">{{label}}</label>',
                '<label class="control-label hw-err"></label>',
                '<input type="{{type}}" class="form-control" id="{{uuid}}" placeholder="{{placeholder}}">',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var prop = this.prop;
            next({
                value : prop.value,
                label : prop.label,
                require : prop.require,
                type : prop.type,
                placeholder : box.attr('placeholder') || '',
                uuid : 'lb_'+util.getUuid()
            });
        },

        initEvent : function(){
            var self = this;
            if(this.prop.delbtn){
                var ip = this.elem.find('input');

                ip.after('<i class="fa del fa-times-circle" style="display: none;"></i>');
                this.jq.delBtn = this.elem.find('.del');

                this.jq.delBtn.click(function(){
                    ip.val('');
                    self.checkDeleteIcon();
                    ip.focus();
                });

                ip.bind('keyup', this.checkDeleteIcon.bind(this));
                ip.bind('paste', this.checkDeleteIcon.bind(this));
            }
        },

        initEnd : function(){
            if(this.prop.value){
                this.elem.find('input').val(this.prop.value);
            }
        },

        checkDeleteIcon : function(){
            var val = this.elem.find('input').val();
            if(val){
                this.jq.delBtn.show();
            }
            else{
                this.jq.delBtn.hide();
            }

        },

        getValue : function(){
            return this.elem.find('input').val()
        },
        showError : function(msg){
            if(msg){
                this.elem.addClass('has-error');
                this.elem.find('.hw-err').html(msg);
            }
            else{
                this.elem.removeClass('has-error');
                this.elem.find('.hw-err').html('');
            }
        },
        reset : function(){
            this.elem.find('input').val('');
            this.showError(false);
        }
    });


    KG.Class.define('BaseSelectInput', {
        ParentClass : 'BaseInput',
        getTemplate : function(){
            return [
                '<div class="form-group hw-comp-BaseSelectInput">',
                    '<label class="lab {{if require}}require{{/if}}">{{label}}</label>',
                    '<div class="dropdown hw-drop">',
                        '<button id="{{uuid}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                        '<input type="text" readonly="true" class="form-control js_input" placeholder="{{placeholder}}">',
                        '<i class="icon fa fa-caret-down"></i>',
                        '</button>',
                        '<ul class="dropdown-menu" aria-labelledby="{{uuid}}">',
                        '{{each list as item}}',
                        '<li index="{{$index}}" class="js_drop">',
                            this.getEachHtml(),
                        '</li>',
                        '{{/each}}',
                        '</ul>',
                    '</div>',
                '</div>'
            ].join('');
        },
        initVar : function(){
            this.index = 0;
        },
        getData : function(box, data, next){
            //点击drop的回调
            this.clickCallback = data.clickCallback;

            //设置drop的innerHTML
            this.getEachHtml = data.getEachHtml || function(){
                    return '{{item}}';
                };

            var prop = this.prop;
            next({
                value : prop.value,
                label : prop.label,
                require : prop.require,
                placeholder : box.attr('placeholder') || '',
                uuid : 'dl_'+util.getUuid(),
                list : data.list
            });
        },
        initEvent : function(){
            var self = this;
            var input = this.elem.find('.js_input');
            this.elem.find('.js_drop').click(function(){
                input.val($(this).text());

                var index = $(this).attr('index');
                self.index = index;
                self.clickCallback(self.data.list[index]);
            });
        },
        initEnd : function(){

        },
        getValue : function(){
            return this.data.list[this.index];
        },
        setValue : function(index){
            this.elem.find('.js_drop').filter('[index="'+index+'"]').trigger('click');
        },
        setOnlyValue : function(val){
            this.elem.find('.js_input').val(val);
        }
    });

    KG.Class.define('MybizArticleForm', {
        ParentClass : 'BaseForm',
        getInsideTemplate : function(){
            return [
                '{{if pageTitle}}<h3>{{pageTitle}}<h3>{{/if}}',
                '<div placeholder="请选择店铺" class="js_biz" data-label="将文章发布到" data-require="true" role="BaseSelectInput" init-self="true"></div>',
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

        defineProperty : function(){
            return {
                title : {
                    defaultValue : ''
                },
                type : {
                    defaultValue : 'create'
                }
            };
        },

        getData : function(box, data, callback){
            var title = this.prop.title,
                type = this.prop.type;


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

        },

        initEnd : function(){
            CKEDITOR.replace('lb_ccc');

            var biz = this.elem.find('.js_biz');
            KG.component.initWithElement(biz, {
                list : this.data.bizList,
                clickCallback : function(rs){
                    console.log(rs);
                },
                getEachHtml : function(){
                    return '{{item.name_cn}}, {{item | storeFullAddress}}';
                }
            });
        }
    });


    KG.Class.define('MybizUploadCouponImage', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MybizUploadStoreImage hw-coupon-uploadimage">',
                '<div class="hw-add js_add">',
                '<i class="icon fa fa-plus-square-o"></i>',
                '<p>添加新图片</p>',
                '<input class="js_input" type="file" />',
                '</div>',


                '</div>'
            ].join('');
        },

        setJqVar : function(){
            return {
                add : this.elem.find('.js_add'),
                fileInput : this.elem.find('.js_input')
            };
        },

        getData : function(box, data, next){
            var tmp = KG.user.get('image');
            var list = data.list;
            next({
                list : list
            });
        },

        initEvent : function(){
            var self = this;
            this.jq.fileInput.change(function(){
                var file = this.files[0];

                self.uploadImageFn(file, function(url){
                    self.addNewImage(url);
                });

                $(this).val('');
            });

            this.elem.click(function(e){
                var o = $(e.target);

                var x = o.closest('.js_del');
                if(x.length > 0){
                    // click delete
                    util.dialog.confirm1({
                        YesText : '删除',
                        msg : '您确定要删除这张照片吗？',
                        YesFn : function(){
                            self.deleteImage(x);
                            util.dialog.hide();
                        }
                    });


                    return false;
                }

                x = o.closest('.js_img');
                if(x.length > 0){
                    // show big image
                    self.showBigImage(x.find('img').attr('src'));
                    return false;
                }
            });


        },

        showBigImage : function(url){
            var list = this.getImageList();
            var index = util.indexOf(list, url);
            util.dialog.showFocusImage(index, list);
        },

        getImageList : function(){
            var list = this.elem.find('.js_img');
            return util.map(list, function(one){
                var o = $(one);
                return o.find('img').attr('src');
            });
        },

        getValue : function(){
            return this.getImageList();
        },

        deleteImage : function(o){
            var img = o.closest('.js_img');
            img.remove();

            var len = this.getImageList().length;
            if(len < 3){
                this.jq.add.show();
            }
        },

        getEachHtml : function(url){
            var h = [
                '<div class="hw-one js_img">',
                '<img src="{{url}}" />',
                '<b class="js_del">删除</b>',
                '</div>'
            ].join('');
            return template.compile(h)({url : url});
        },

        uploadImageFn : function(file, callback){
            util.uploadImage(file, function(url){
                var url = KG.config.SiteRoot+url;

                callback(url);
            });
        },

        addNewImage : function(src){
            var len = this.getImageList().length;
            if(len === 2){
                this.jq.add.hide();
            }

            var h = this.getEachHtml(src);
            this.jq.add.after(h);
        },

        initEnd : function(){
            var self = this;
            var list = this.data.list;
            util.each(list, function(url){
                self.addNewImage(url);
            });
        }

    });


    KG.Class.define('MybizCouponForm', {
        ParentClass : 'BaseForm',
        getInsideTemplate : function(){
            return [
                '{{if pageTitle}}<h3>{{pageTitle}}<h3>{{/if}}',
                '<div placeholder="请选择店铺" class="js_biz" data-label="将优惠发布到" data-require="true" role="BaseSelectInput" init-self="true"></div>',
                '<div class="form-group">',

                '<div class="js_title" role="BaseInput" data-label="优惠标题" data-require="true" placeholder="e.g. 美食府金秋品尝会，邀您免费试吃"></div>',

                '<div class="form-group">',
                    '<label style="display: block;">优惠开始时间</label>',
                    '<input style="width: 410px;display: inline-block" type="text" class="form-control js_startDate" readonly="true" placeholder="2015-10-10">',
                    '<input style="width: 140px;display: inline-block;margin-left: 50px;" type="text" class="form-control js_startTime" placeholder="8:30AM">',
                '</div>',

                '<div class="form-group">',
                    '<label style="display: block;">优惠结束时间</label>',
                    '<input style="width: 410px;display: inline-block" type="text" class="form-control js_endDate" readonly="true" placeholder="2015-10-10">',
                    '<input style="width: 140px;display: inline-block;margin-left: 50px;" type="text" class="form-control js_endTime" placeholder="8:30AM">',
                '</div>',


                '<div class="form-group">',
                    '<label class="require" for="lb_ccc">优惠描述</label>',
                    '<textarea style="height: 170px;" placeholder="优惠宣传、细节、方式、如何报名等信息提升参与度" class="form-control" id="lb_ccc"></textarea>',
                '</div>',

                '<div class="form-group">',
                    '<label class="lab">优惠图片</label>',
                    '<div class="js_image" role="MybizUploadCouponImage" init-self="true"></div>',
                '</div>',

                '<a href="javascript:void(0)" class="hw-btn hw-blue-btn">{{btnText}}</a>'
            ].join('');
        },

        setJqVar : function(){
            return {
                startDate : this.elem.find('.js_startDate'),
                startTime : this.elem.find('.js_startTime'),
                endDate : this.elem.find('.js_endDate'),
                endTime : this.elem.find('.js_endTime')
            };
        },

        defineProperty : function(){
            return {
                title : {
                    defaultValue : ''
                },
                type : {
                    defaultValue : 'create'
                }
            };
        },

        getData : function(box, data, callback){
            var title = this.prop.title,
                type = this.prop.type;


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
                    bizList : bizList,
                    btnText : type==='edit'?'保存':'创建'
                });
            });


        },

        initEvent : function(){
            this.jq.startDate.datepicker({
                format: "yyyy-mm-dd",
                autoclose: true
            });

            this.jq.endDate.datepicker({
                format: "yyyy-mm-dd",
                autoclose: true
            });
        },

        initEnd : function(){

            var biz = this.elem.find('.js_biz');
            KG.component.initWithElement(biz, {
                list : this.data.bizList,
                clickCallback : function(rs){
                    console.log(rs);
                },
                getEachHtml : function(){
                    return '{{item.name_cn}}, {{item | storeFullAddress}}';
                }
            });

            this.image = KG.component.initWithElement(this.elem.find('.js_image'), {
                list : this.data.imageList || [KG.user.get('image'), KG.user.get('image')]
            });
        }
    });






    KG.Class.define('BaseUploadImage', {
        ParentClass : 'BaseComponent',

        setJqVar : function(){
            return {
                img : this.elem.find('.js_img'),
                btn : this.elem.find('.js_btn'),
                fileInput : this.elem.find('input[type="file"]')
            }
        },
        defineProperty : function(){
            return {
                image : {}
            }
        },

        initEvent : function(){
            var btn = this.jq.btn,
                img = this.jq.img;

            var self = this;
            this.jq.fileInput.bind('change', function(e){
                var file = this.files[0];

                btn.button('loading');

                self.uploadImageFn(file, function(){
                    btn.button('reset');
                });
            });

        },
        uploadImageFn : function(file, callback){
            var self = this;
            util.uploadImage(file, function(url){
                var url = KG.config.SiteRoot+url;

                self.jq.img.attr('src', url);

                callback();
            });
        }
    });





















})();