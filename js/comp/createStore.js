
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
                    '<div class="js_name" role="BaseInput" data-label="店铺名称" data-require="true" placeholder="e.g. 小肥羊Fremont店 （请尽量用中文名，分店请尽量添加城市名）"></div>',
                    '<div class="js_tel" role="BaseInput" data-label="营业电话" data-require="true" placeholder="e.g. 5107687776"></div>',

                    '<div class="js_cat" data-label="服务类别" data-require="true" role="BaseSelectInput" init-self="true" placeholder="请选择一种类别"></div>',

                    '<div class="js_address" role="BaseInput" data-label="店铺地址" placeholder="街道地址"></div>',

                    '<div style="margin-left: 0;" class="js_zip hw-inline" role="BaseInput" data-require="true" data-label="邮编" placeholder="e.g. 94536"></div>',
                    '<div class="js_zip hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="城市"></div>',
                    '<div class="js_zip hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="州/省"></div>',

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

            KG.request.defer(list, function(catList){
                next({
                    catList : catList
                });
            });

        },
        setJqVar : function(){
            return {
                tagBox : this.elem.find('.hw-tagbox')
            };
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
        },
        switchCategory : function(item){
            var catId = item.pk_id;

            var self = this;

            KG.request.getAllStoreTagByCategory({
                catId : catId
            }, function(flag, rs){
                if(!flag) return;

                self.setTagHtml(rs);
            });
        },

        setTagHtml : function(tagList){
            var h = '{{each list as item}}<label><input type="checkbox" uid="{{item.pk_id}}" />{{item.name}}</label>{{/each}}';

            h = template.compile(h)({list:tagList});
            this.jq.tagBox.html(h);
        }
    });











































})();