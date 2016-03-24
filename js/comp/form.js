'use strict';
(function(){


    KG.Class.define('MybizArticleForm', {
        ParentClass : 'BaseForm',
        getInsideTemplate : function(){
            return [
                '{{if pageTitle}}<h3>{{pageTitle}}<h3>{{/if}}',
                '<div placeholder="请选择店铺" class="js_biz" data-label="将文章发布到" data-require="true" role="BaseSelectInput" init-self="true"></div>',

                '<div class="js_title" role="BaseInput" data-label="文章标题" data-require="true" placeholder="e.g. 海底捞成功的秘密"></div>',

                '<div class="form-group">',
                    '<label class="require" for="lb_ccc">文章正文</label>',
                    '<label class="control-label hw-err"></label>',
                    '<textarea class="form-control" id="lb_ccc"></textarea>',
                '</div>',
                '{{if type==="edit"}}<b class="hw-delete js_del">删除这篇文章</b>{{/if}}',
                '<a href="javascript:void(0)" class="js_btn hw-btn hw-blue-btn">{{btnText}}</a>'
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

            var id = KG.data.get('id');


            var getBizList = function(){
                return KG.request.getBizList({});
            };

            var list = [getBizList];

            if(type === 'edit'){
                list.push(function(){
                    return KG.request.getStoreArticleDetail({
                        id : id
                    });
                });
            }

            KG.request.defer(list, function(bizList, articleData){
                callback({
                    id : id,
                    pageTitle : title,
                    bizList : _.isArray(bizList)?bizList:[],
                    articleData : articleData,
                    type : type,

                    btnText : type==='edit'?'保存':'发表'
                });
            });


        },

        initVar : function(){
            this.biz = null;
            this.cat = 30;
        },

        validate : function(data){
            var jq = this.getElemObj();
            if(!data.bizId){
                jq.biz.showError('请选择要发布的店铺');
                jq.biz.focus();
                return false;
            }
            else{
                jq.biz.showError();
            }

            if(!data.title){
                jq.title.showError('请输入文章标题');
                jq.title.focus();
                return false;
            }
            else{
                jq.title.showError();
            }


            if(!data.msgbody){
                $(this.ck.element.$).parent('div.form-group').addClass('has-error').find('.hw-err').html('请输入文章正文');
                return false;
            }
            else{
                $(this.ck.element.$).parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
            }

            return true;
        },

        initEvent : function(){
            var self = this;
            this.elem.find('.js_btn').click(function(){
                var data = self.getFormValue();
                if(!self.validate(data)) return false;

                if(self.prop.type === 'edit'){
                    data.id = self.data.id;
                    KG.request.createStoreArticle(data, function(flag, rs){
                        if(flag){
                            console.log(rs);
                            util.toast.alert('修改成功');
                            util.delay(function(){
                                location.href = 'article.html'
                            }, 2000);
                        }
                    });
                }
                else{
                    KG.request.createStoreArticle(data, function(flag, rs){
                        if(flag){
                            console.log(rs);
                            util.toast.alert('发表成功');
                            util.delay(function(){
                                location.href = 'article.html'
                            }, 2000);

                        }
                    });
                }

            });

            if(this.prop.type === 'edit'){
                this.elem.find('.js_del').click(function(){
                    util.dialog.confirm1({
                        msg : '确认要删除这篇文章么？',
                        YesFn : function(){
                            KG.request.deleteArticle({
                                id : self.data.id
                            }, function(flag, rs){
                                if(flag){
                                    location.href = '../mybiz/article.html';
                                }
                                else{
                                    util.toast.showError(rs);
                                }
                            });
                        }
                    });
                });
            }


        },

        getElemObj : function(){
            return {
                biz : KG.component.getObj(this.elem.find('.js_biz')),
                title : KG.component.getObj(this.elem.find('.js_title'))
            };
        },

        getFormValue : function(){
            var c = this.getElemObj();
            return {
                category : this.cat,
                bizId : this.biz,
                title : c.title.getValue(),
                msgbody : this.ck.getData()
            };
        },

        getCKEditorConfig : function(){
            //thanks http://www.wenxuecity.com/include/editor/ckeditor/wxccust/wxcconfig.js
            var config = {
                extraPlugins : 'DlgPicture, autolink',
                toolbar : [
                    {name : 'part1', items : ['Bold','Italic','Underline']},
                    {name : 'part2', items : ['DlgPicture']}
                ],
                removePlugins : 'elementspath',
                resize_enabled : false,
                fontSize_sizes : '中号/16px;大号/24px;'
            };
        },

        initEnd : function(){
            var self = this;
            this.ck = CKEDITOR.replace('lb_ccc', this.getCKEditorConfig);

            var biz = this.elem.find('.js_biz');
            KG.component.initWithElement(biz, {
                list : this.data.bizList,
                clickCallback : function(rs){
                    console.log(rs);
                    self.biz = rs.entityID;
                },
                getEachHtml : function(){
                    return '{{item.name_cn}}, {{item | storeFullAddress}}';
                }
            });


            if(this.prop.type === 'edit'){
                this.setFormValue(this.data.articleData);
            }
        },
        setFormValue : function(data){
            console.log(data);
            var c = this.getElemObj();
            c.biz.setValue(_.findIndex(this.data.bizList, function(one){
                return one.fk_entityID === data.entityID;
            }));


            c.title.setValue(data.title);
            this.ck.setData(data.msgbody);
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

        getEachHtml : function(url, id){
            var h = [
                '<div class="hw-one js_img">',
                '<img src="{{url}}" />',
                '<b param="{{id}}" class="js_del">删除</b>',
                '</div>'
            ].join('');
            return template.compile(h)({
                url : url,
                id : id
            });
        },

        uploadImageFn : function(file, callback){

            //TODO
            util.readFile(file, function(binary){
                KG.request.uploadCouponImage({
                    image : binary,
                    id : util.url.param('id')
                }, function(flag, rs){
                    if(flag){
                        console.log(rs);
                    }
                });
            });
        },

        addNewImage : function(url, id){
            var len = this.getImageList().length;
            if(len === 2){
                this.jq.add.hide();
            }

            var h = this.getEachHtml(url, id);
            this.jq.add.after(h);
        },

        initEnd : function(){
            var self = this;
            var list = this.data.list;
            console.log(list);
            util.each(list, function(item){
                self.addNewImage(KG.config.SiteRoot+item.path, item.pk_id);
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
                    '<label class="">优惠开始时间</label>',
                    '<label style="right:190px;" class="control-label hw-err"></label>',
                    '<input style="width: 410px;display: block;" type="text" class="form-control js_startDate" readonly="true" placeholder="10/20/2015">',
                    //'<input style="width: 140px;display: inline-block;margin-left: 50px;" type="text" class="form-control js_startTime" placeholder="8:30AM">',
                '</div>',

                '<div class="form-group">',
                    '<label class="require">优惠结束时间</label>',
                    '<label style="right:190px;" class="control-label hw-err"></label>',
                    '<input style="width: 410px;display: block;" type="text" class="form-control js_endDate" readonly="true" placeholder="10/20/2016">',
                    '<label style="vertical-align: top;position: absolute;top: 14px;left:425px;">不限结束时间<input style="position: relative; top: 13px;left:8px;" class="js_endlimit" type="checkbox" /></label>',
                    //'<input style="width: 140px;display: inline-block;margin-left: 50px;" type="text" class="form-control js_endTime" placeholder="8:30AM">',
                '</div>',


                '<div class="form-group">',
                    '<label class="require" for="lb_ccc">优惠描述</label>',
                    '<label class="control-label hw-err"></label>',
                    '<textarea style="height: 170px;" placeholder="优惠宣传、细节、方式、如何报名等信息提升参与度" class="js_desc form-control" id="lb_ccc"></textarea>',
                '</div>',

                '<div class="form-group">',
                    '<label class="lab">优惠图片</label>',
                    '<div class="js_image" role="MybizUploadCouponImage" init-self="true"></div>',
                '</div>',

                '{{if type==="edit"}}<b class="hw-delete js_del_coupon">删除这个优惠</b>{{/if}}',
                '<a href="javascript:void(0)" class="hw-btn hw-blue-btn js_btn">{{btnText}}</a>'
            ].join('');
        },

        setJqVar : function(){
            return {
                startDate : this.elem.find('.js_startDate'),
                startTime : this.elem.find('.js_startTime'),
                endDate : this.elem.find('.js_endDate'),
                endTime : this.elem.find('.js_endTime'),
                desc : this.elem.find('.js_desc'),
                endlimit : this.elem.find('.js_endlimit'),

                btn : this.elem.find('.js_btn')
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

        getElemObj : function(){
            return {
                title : KG.component.getObj(this.elem.find('.js_title')),
                image : KG.component.getObj(this.elem.find('.js_image'))
            };
        },

        getFormValue : function(){
            var c = this.getElemObj();
            var data = {
                biz : this.jq.biz.getValue().entityID,
                subject : c.title.getValue(),
                description : this.jq.desc.val(),
                startDate : this.jq.startDate.val(),
                endDate : this.jq.endDate.val(),
                imageList : c.image.getValue()
            };
            if(this.jq.endlimit.prop('checked')){
                data.endDate = 'unlimit';
            }
            return data;
        },

        validate : function(data){
            data = data || this.getFormValue();
            var c = this.getElemObj();

            if(!data.biz){
                this.jq.biz.showError('请选择发布的店铺');
                this.jq.biz.focus();
                return false;
            }
            else{
                this.jq.biz.showError();
            }

            if(!data.subject){
                c.title.showError('请输入优惠标题');
                c.title.focus();
                return false;
            }
            else{
                c.title.showError();
            }

            if(data.startDate && moment(data.startDate).isBefore(moment(new Date()), 'day')){
                this.jq.startDate.parent('div.form-group').addClass('has-error').find('.hw-err').html('开始时间不能早于当前时间');
                this.jq.startDate.focus();
                return false;
            }
            else{
                this.jq.startDate.parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
            }

            if(!data.endDate){
                this.jq.endDate.parent('div.form-group').addClass('has-error').find('.hw-err').html('请选择结束时间');
                this.jq.endDate.focus();
                return false;
            }
            else{
                this.jq.endDate.parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
            }

            var start = data.startDate ? moment(data.startDate) : moment(new Date());
            if(data.endDate!=='unlimit'&&moment(data.endDate).isBefore(start, 'day')){
                this.jq.endDate.parent('div.form-group').addClass('has-error').find('.hw-err').html('结束时间不能早于开始时间');
                this.jq.endDate.focus();
                return false;
            }
            else{
                this.jq.endDate.parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
            }


            if(!data.description){
                this.jq.desc.parent('div.form-group').addClass('has-error').find('.hw-err').html('请输入优惠描述');
                this.jq.desc.focus();
                return false;
            }
            else{
                this.jq.desc.parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
            }



            //TODO validate
            return true;
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
                    return KG.request.getCouponDetail({id : KG.data.get('id')});
                });
            }

            KG.request.defer(list, function(bizList, couponData){
                callback({
                    pageTitle : title,
                    bizList : bizList,
                    btnText : type==='edit'?'保存':'创建',
                    type : type,
                    couponData : couponData || null
                });
            });


        },

        initEvent : function(){
            var self = this;
            this.jq.startDate.datepicker({
                format: "mm/dd/yyyy",
                autoclose: true
            });

            this.jq.endDate.datepicker({
                format: "mm/dd/yyyy",
                autoclose: true
            });


            this.jq.btn.click(function(){
                var data = self.getFormValue();
                console.log(data);
                if(!self.validate(data)){
                    return false;
                }

                if(self.prop.type === 'edit'){
                    data.id = KG.data.get('id');
                }

                if(true){
                    //create btn
                    KG.request.createStoreCouponEvent(data, function(flag, rs){
                        if(flag){
                            console.log(rs);
                            if(self.prop.type === 'edit'){
                                util.toast.alert('修改成功');
                                util.delay(function(){
                                    location.href = '../mybiz/coupon.html';
                                }, 1000);
                                return false;
                            }

                            //create success
                            var msg = '<div class="hw-icon"><i class="fa fa-check"></i></div>创建优惠成功！别忘了点击“分享”，让更多的人知道！';
                            util.dialog.show({
                                foot : true,
                                title : msg,
                                body : '',
                                'class' : 'hw-dialog-alert',
                                YesFn : function(){

                                    location.href = '../mybiz/coupon.html';
                                },
                                YesText : '确定'
                            });
                        }


                    });
                }
            });

            this.elem.find('.js_endlimit').change(function(){

                self.jq.endDate.attr('disabled', $(this).prop('checked'));

            });

            if(this.prop.type === 'edit'){
                this.elem.find('.js_del_coupon').click(function(){
                    var id = KG.data.get('id');
                    util.dialog.confirm1({
                        msg : '确认要删除这个优惠么？',
                        YesFn : function(){
                            KG.request.deleteCouponById({
                                id : id
                            }, function(flag, rs){
                                if(flag){
                                    location.href = '../mybiz/coupon.html';
                                }
                                else{
                                    util.toast.showError(rs);
                                }
                            });
                        }
                    })
                });
            }
        },

        initEnd : function(){

            var biz = this.elem.find('.js_biz');
            this.jq.biz = KG.component.initWithElement(biz, {
                list : this.data.bizList,
                clickCallback : function(rs){
                    console.log(rs);
                },
                getEachHtml : function(){
                    return '{{item.name_cn}}, {{item | storeFullAddress}}';
                }
            });

            var imageList = [];
            if(this.prop.type === 'edit'){
                imageList = this.data.couponData.files;
            }
            this.image = KG.component.initWithElement(this.elem.find('.js_image'), {
                list : imageList
            });

            if(this.data.couponData){
                this.setFormValue(this.data.couponData);
            }
        },
        setFormValue : function(data){
            var self = this;
            console.log(data);
            var c = this.getElemObj();
            this.jq.biz.setValue(_.findIndex(this.data.bizList, function(one){
                return one.fk_entityID === data.entityID;
            }));
            c.title.setValue(data.subject);
            this.jq.desc.val(data.description);
            this.jq.startDate.val(moment(data.top_start_time*1000).format('MM/DD/YYYY'));

            if(!data.top_end_time || parseInt(data.top_end_time)<1 || data.top_end_time==='unlimit'){
                this.elem.find('.js_endlimit').prop('checked', true);
                this.jq.endDate.attr('disabled', true);
            }
            else{
                this.jq.endDate.val(moment(data.top_end_time*1000).format('MM/DD/YYYY'));
            }


            if(data.files.length > 0){
                _.each(data.files, function(item){
                    self.image.addNewImage(KG.config.SiteRoot+item.path);
                });
            }

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