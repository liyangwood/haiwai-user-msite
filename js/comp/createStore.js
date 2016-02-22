
(function(){

    KG.Class.define('MybizCreateStoreStepInfo', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-stepinfo {{step}}">',
                    '<div class="c c1"><i class="fa fa-check"></i></div>',
                    '<div class="d d1"></div>',
                    '<div class="c c2"><i class="fa fa-check"></i></div>',
                    '<div class="d d2"></div>',
                    '<div class="c c3"><i class="fa fa-check"></i></div>',
                    '<p class="p p1">基本信息</p>',
                    '<p class="p p2">更多描述</p>',
                    '<p class="p p3">上传图片</p>',
                '</div>'
            ].join('');
        },

        defineProperty : function(){
            return {
                step : {
                    defaultValue : 'step1'
                }
            };
        },

        getData : function(box, data, next){
            next({
                step : this.prop.step
            });
        }
    });


    KG.Class.define('MybizStoreInfoFormStep1', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MybizStoreInfoFormStep1">',
                    '<div {{if biz}}data-value="{{biz.name_cn}}"{{/if}} class="js_name" role="BaseInput" data-label="店铺名称" data-require="true" placeholder="e.g. 小肥羊Fremont店 （请尽量用中文名，分店请尽量添加城市名）"></div>',
                    '<div {{if biz}}data-value="{{biz.tel}}"{{/if}} class="js_tel" role="BaseInput" data-label="营业电话" data-require="true" placeholder="e.g. 5107687776"></div>',

                    '<div class="js_cat" data-label="服务类别" data-require="true" role="BaseSelectInput" init-self="true" placeholder="请选择一种类别"></div>',

                    '<div {{if biz}}data-value="{{biz.address}}"{{/if}} class="js_address" role="BaseInput" data-label="店铺地址" placeholder="街道地址，如3442 Mackenzie Dr (可选)"></div>',

                    '<div {{if biz}}data-value="{{biz.zip}}"{{/if}} style="margin-left: 0;" class="js_zip hw-inline" role="BaseInput" data-require="true" data-label="邮编" placeholder="e.g. 94536"></div>',
                    '<div {{if biz}}data-value="{{biz.city}}"{{/if}} class="js_city hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="城市"></div>',
                    '<div {{if biz}}data-value="{{biz.state}}"{{/if}} class="js_state hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="州/省"></div>',

                    '<div class="form-group js_tag">',
                        '<label>营业特色</label>',
                        '<div class="hw-tagbox">',


                        '</div>',
                    '</div>',


                    '<button style="float: right;" class="js_btn hw-btn hw-blue-btn">下一步</button>',

                '<div>'
            ].join('');
        },
        getData : function(box, data, next){

            var list = [function(){
                return KG.request.getAllStoreCategoryList({});
            }];

            if(KG.data.get('id')){
                list.push(function(){
                    return KG.request.getBizDetailById({
                        bizId : KG.data.get('id')
                    });
                });
            }

            KG.request.defer(list, function(catList, bizInfo){
                next({
                    catList : catList,
                    biz : bizInfo || false
                });
            });

        },
        setJqVar : function(){
            return {
                tagBox : this.elem.find('.hw-tagbox'),
                btn : this.elem.find('.js_btn')
            };
        },

        getElemObj : function(){
            return {
                name : KG.component.getObj(this.elem.find('.js_name')),
                tel : KG.component.getObj(this.elem.find('.js_tel')),
                address : KG.component.getObj(this.elem.find('.js_address')),
                zip : KG.component.getObj(this.elem.find('.js_zip')),
                city : KG.component.getObj(this.elem.find('.js_city')),
                state : KG.component.getObj(this.elem.find('.js_state'))
            };
        },

        getFormValue : function(){
            var jq = this.getElemObj();
            var data = {
                bizName : jq.name.getValue(),
                bizTel : jq.tel.getValue(),
                bizTagId : this.jq.cat.getValue()['pk_id'],
                zip : jq.zip.getValue(),
                address : jq.address.getValue(),
                city : jq.city.getValue(),
                state : jq.state.getValue(),
                tags : this.getTagBoxValue()
            };

            return data;
        },

        validate : function(){
            return true;
        },

        initEvent : function(){
            var self = this;
            this.jq.btn.click(function(){
                var data = self.getFormValue();
                console.log(data);
                if(self.validate(data)){
                    KG.request.createStoreByStep1(data, function(flag, rs){
                         if(flag){
                             console.log(rs);
                             location.href = 'createStore_2.html?tmp_biz_id='+rs.entityID+'&main_tag_id='+rs.main_tag_id;
                         }
                    });
                }


                //location.href = 'createStore_2.html';
            });
        },

        initEnd : function(){
            var self = this;
            var cat = this.elem.find('.js_cat');
            this.jq.cat = KG.component.initWithElement(cat, {
                list : this.data.catList,
                getEachHtml : function(){
                    return '{{item.name}}';
                },
                clickCallback : function(item){
                    self.switchCategory.call(self, item);
                }
            });

            if(this.data.biz){
                var index = util.map(this.data.catList, function(item){return item.pk_id;});
                index = util.indexOf(index, this.data.biz.fk_main_tag_id);
                var tmpData = this.data.catList[index];
                this.jq.cat.setOnlyValue(tmpData.name);

                this.switchCategory(tmpData, function(){
                    util.each(self.data.biz.tags, function(one){
                        self.jq.tagBox.find('[uid="'+one.pk_id+'"]').attr('checked', true);
                    });
                });
            }

        },
        switchCategory : function(item, callback){
            callback = callback || util.noop;

            var catId = item.pk_id;

            var self = this;

            KG.request.getAllStoreTagByCategory({
                catId : catId
            }, function(flag, rs){
                if(!flag) return;

                self.setTagHtml(rs);

                callback();
            });
        },

        setTagHtml : function(tagList){
            var h = '{{each list as item}}<label><input type="checkbox" uid="{{item.pk_id}}" />{{item.name}}</label>{{/each}}';

            h = template.compile(h)({list:tagList});
            this.jq.tagBox.html(h);
        },

        getTagBoxValue : function(){
            var arr = [];
            this.jq.tagBox.find('input[type="checkbox"]').each(function(){
                var o = $(this);
                if(o.prop('checked')){
                    arr.push(o.attr('uid'));
                }
            });
            return arr.join(',');
        }
    });


    KG.Class.define('MybizStoreInfoFormStep2', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MybizStoreInfoFormStep2">',
                    '<div class="js_dybox"></div>',

                    //
                    //'<div class="hw-dym">',
                    //    '<span>是否有停车位</span>',
                    //    '<label><input type="radio" class="radio-inline" name="ra_bbb" />是</label>',
                    //    '<label><input type="radio" class="radio-inline" name="ra_bbb" />否</label>',
                    //'</div>',
                    //
                    //'<div class="hw-dym">',
                    //    '<span>是否提供Wi-Fi</span>',
                    //    '<label><input type="radio" class="radio-inline" name="ra_ccc" />是</label>',
                    //    '<label><input type="radio" class="radio-inline" name="ra_ccc" />否</label>',
                    //'</div>',



                    '<div class="js_link" role="BaseInput" data-label="店铺网址" placeholder="e.g. www.xiaofeiyang.com"></div>',
                    '<div class="js_wx" role="BaseInput" data-label="微信号" placeholder="e.g. xiaofeiyang"></div>',


                    '<div class="form-group">',
                        '<label class="lab">店铺描述</label>',
                        '<textarea style="height: 150px;" class="form-control hw-area js_desc"></textarea>',
                    '</div>',

                    '<a class="hw-btn hw-light-btn" style="border: none;font-weight: 400;" href="createStore.html">返回上一步</a>',
                    '<button style="float: right;" class="js_btn hw-btn hw-blue-btn">下一步</button>',

                '<div>'
            ].join('');
        },
        setJqVar : function(){
            return {
                btn : this.elem.find('.js_btn')
            };
        },

        getElemObj : function(){
            return {
                net : KG.component.getObj(this.elem.find('.js_link')),
                wechat : KG.component.getObj(this.elem.find('.js_wx')),
                desc : this.elem.find('.js_desc')
            };
        },

        initEnd : function(){
            this.renderDynamicBox();

            var list = ['100-200', '200-300', '300-400', '大于400'];

            this.jq.money = KG.component.initWithElement(this.elem.find('.js_money'), {
                list : list,
                clickCallback : function(item){
                    console.log(item)
                }
            });
        },

        getFormValue : function(){
            var jq = this.getElemObj();
            return {
                bizTmpId : this.data.tmpBizId,
                wechat : jq.wechat.getValue(),
                description : jq.desc.val()
            };
        },

        initEvent : function(){
            var self = this;
            this.jq.btn.click(function(){
                var data = self.getFormValue();
                data.dynamic = self.getDynamicData();

                KG.request.createStoreByStep2(data, function(flag, rs){
                    if(flag){
                        console.log(rs);
                        location.href = 'createStore_3.html?tmp_biz_id='+rs+'&main_tag_id='+KG.data.get('mainTagId');
                    }
                });

            });
        },

        getData : function(box, data, next){
            var tmpId = KG.data.get('tmpBizId'),
                tagId = KG.data.get('mainTagId');

            KG.request.getTmpStoreDynamicField({
                mainTagId : tagId
            }, function(flag, rs){
                if(flag){
                    console.log(rs);
                    next({
                        tmpBizId : tmpId,
                        dynamic : rs
                    });
                }
                else{
                    next({
                        tmpBizId : tmpId,
                        dynamic : []
                    });
                }
            });
        },

        initVar : function(){
            this.dynamicObj = {};
        },

        /*
        * 1=>"单行文字",
         2=>"数字",
         3=>"文本框",
         4=>"电话号码",
         5=>"单选项（按钮）",
         6=>"单选项（下拉）",
         7=>"多选项（勾选）",
         8=>"URL",
         9=>"EMAIL"

         * */
        renderDynamicBox : function(){
            var self = this;
            var list = this.data.dynamic;

            var rs = '';
            util.each(list, function(item){
                self.renderEachDynamic(item);
            });
        },

        getDynamicData : function(){
            var rs = {};
            _.each(this.dynamicObj, function(item, key){
                rs['dynamic_fields['+item.id+'][type]'] = item.type;
                rs['dynamic_fields['+item.id+'][value]'] = util.isFunction(item.val)?item.val.call(item.obj):item.val;
            });

            return rs;
        },

        renderEachDynamic : function(item){
            var self = this;
            var box = this.elem.find('.js_dybox');


            var rs = '';
            switch (item.field_type){
                case '1':
                    rs = '<div class="js_role" role_type="'+item.field_type+'" role="BaseInput" data-label="'+item.field_name+'" ></div>';
                    box.append(rs);
                    this.dynamicObj[item.field_name] = {
                        obj : KG.component.initWithElement(box.find('[role_type]')),
                        type : item.field_type,
                        val : function(){
                            return this.getValue();
                        }
                    };
                    break;
                case '6':
                    rs = '<div class="js_role" role_type="'+item.field_type+'" data-label="'+item.field_name+'" role="BaseSelectInput" init-self="true"></div>';
                    box.append(rs);
                    var tmpO = KG.component.initWithElement(box.find('[role_type]'), {
                        list : _.map(item.default_option, function(one){
                            return one.m_value;
                        }),
                        clickCallback : function(x){
                            console.log(x)
                        }
                    });
                    this.dynamicObj[item.field_name] = {
                        obj : tmpO,
                        type : item.field_type,
                        val : function(){
                            return this.getValue();
                        }
                    };
                    break;
                case '5':
                    rs = '<div class="hw-dym" param="'+item.field_id+'"><span>'+item.field_name+'</span>';
                    _.each(item.default_option, function(one){
                        rs += '<label><input type="radio" value="'+one.m_value+'" class="radio-inline" name="'+item.field_id+'" />'+one.m_value+'</label>';
                    });
                    rs += '</div>';

                    box.append(rs);

                    this.dynamicObj[item.field_name] = {
                        obj : null,
                        type : item.field_type,
                        val : function(){
                            var r = '';
                            box.find('[param="'+item.field_id+'"]').find('input').each(function(){
                                var o = $(this);
                                if(o.prop('checked')){
                                    r = o.val();
                                }
                            });
                            return r;
                        }
                    };

                    break;

                default :
                    break;
            }

            this.dynamicObj[item.field_name].id =item.field_id;
        }

    });


    KG.Class.define('UploadStoreImage', {
        ParentClass : 'BaseUploadImage',
        getTemplate : function(){
            return [
                '<div>',
                '<div class="hw-img-box">',
                '<img class="js_img" src="{{image}}" />',
                '<b class="js_del">删除</b>',
                '</div>',


                '<button data-loading-text="正在上传..." class="hw-btn js_btn">从电脑上传图片</button>',
                '<input type="file" />',
                '</div>'
            ].join('');
        },
        defineProperty : function(){
            return {
                biztype : {
                    defaultValue : 'tmp'
                },
                bizid : {}
            };
        },
        getData : function(box, data, next){
            next({
                image : this.prop.image
            });
        },

        setJqVar : function(){
            return {
                delBtn : this.elem.find('.js_del')
            };
        },
        initEvent : function(){
            this.callParent('initEvent');

            var b = this.elem.find('.js_del');
            this.elem.find('.hw-img-box').hover(function(){
                b.slideDown(200);
            }, function(){
                b.slideUp(200);
            });

            var jq = this.jq;
            jq.delBtn.click(function(){
                jq.img.attr('src', '');
            });
        },
        uploadImageFn : function(file, callback){
            var self = this;
            var data = {};
            if(this.prop.biztype === 'tmp'){
                data.bizTmpId = this.prop.bizid;
            }

            var fr = new FileReader();
            fr.onload = function(e){
                data.image = e.target.result;

                KG.request.uploadTmpBizLogo(data, function(flag, rs){
                    if(flag){
                        console.log(rs);
                        self.jq.img.attr('src', KG.config.SiteRoot+rs.files[0]);
                    }

                    callback();
                });
            };

            fr.readAsDataURL(file);


        }
    });


    KG.Class.define('MybizUploadStoreImage', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MybizUploadStoreImage">',
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


    KG.Class.define('MybizStoreInfoFormStep3', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-comp-MybizStoreInfoFormStep3">',

                    '{{if bigBgImageList}}',
                    '<div class="form-group">',
                        '<label class="lab">选择店铺背景图片</label>',
                        '<div style="width: 700px;margin-left: -7px;">',
                        '{{each bigBgImageList as item}}',
                            '<div class="hw-bigimage">',
                                '<div class="js_bigimage c-box">',
                                    '<img class="js_bigimage" src={{item.url}} />',
                                    '<i class="fa fa-check"></i>',
                                '</div>',

                                '<a href="{{item.url}}" target="_blank">查看大图</a>',
                            '</div>',
                        '{{/each}}',
                        '</div>',
                    '</div>',
                    '{{/if}}',

                    '<div class="form-group">',
                        '<label class="lab">店铺Logo</label>',
                        '<p class="hw-img-p">店铺／专属页Logo图片是重要的品牌识别标识，建议您上传店铺Logo或职业头像，以增加专业性。该Logo也将用于您的店铺／专属页与用户互动的头像，如回复评论、发布文章、活动。 </p>',
                        '<div class="hw-upload" data-biztype="tmp" data-bizid="{{tmpId}}"' +
                        ' role="UploadStoreImage"></div>',
                    '</div>',


                    '<div class="hw-line"></div>',

                    '<div class="form-group">',
                        '<label class="lab">店铺图片</label>',
                        '<div class="js_image" role="MybizUploadStoreImage" init-self="true"></div>',

                    '</div>',


                    '<a class="hw-btn hw-light-btn" style="float: left;border: none;font-weight: 400;" href="createStore_2.html">返回上一步</a>',
                    '<button style="float: right;" class="js_btn hw-btn hw-blue-btn">完成</button>',


                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var tmpId = KG.data.get('tmpBizId'),
                tagId = KG.data.get('mainTagId');
            KG.request.getStoreBigBackgroundPic({
                mainTagId : tagId
            }, function(flag, rs){
                var bigBgImageList;
                if(flag){
                    bigBgImageList = rs;
                }
                else{
                    bigBgImageList = null;
                }

                next({
                    bigBgImageList : bigBgImageList,
                    tmpId : tmpId,
                    tagId : tagId
                });
            });

        },

        setJqVar : function(){
            return {
                bigImage : this.elem.find('.js_bigimage'),
                btn : this.elem.find('.js_btn')
            };
        },

        initEvent : function(){
            var self = this;
            this.jq.bigImage.click(function(e){
                var o = $(this);

                if(o.hasClass('active')) return false;
                self.jq.bigImage.removeClass('active');
                o.addClass('active');
            });

            this.jq.btn.click(function(e){
                var data = self.getFormValue();
                KG.request.createStoreByStep3(data, function(flag, rs){
                    if(flag){
                        location.href = 'http://beta.haiwai.com/biz/view.php?id='+rs;
                    }
                });
            });
        },

        initEnd : function(){
            this.image = KG.component.initWithElement(this.elem.find('.js_image'), {
                list : this.data.imageList || []
            });

            this.elem.find('.js_bigimage').eq(0).trigger('click');
        },

        getFormValue : function(){
            return {
                bizTmpId : this.data.tmpId,
                bgPic : this.jq.bigImage.filter('.active').find('img').attr('src'),
                imageList : this.image.getValue()
            };
        }
    });




































})();