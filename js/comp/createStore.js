
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

KG.Class.define('MybizStoreInputDatepicker', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="form-group hw-MybizStoreInputDatepicker">',
                '<label>营业时间</label>',
                '<label class="control-label hw-err"></label>',

                '<div class="cb js_b2">',

                    '<select class="js_start">',
                        '{{each timelist as item}}',
                        '<option value="{{item}}">{{item}}</option>',
                        '{{/each}}',
                    '</select>',

                    '<b>－</b>',

                    '<select class="js_end">',
                        '{{each timelist as item}}',
                        '<option value="{{item}}">{{item}}</option>',
                        '{{/each}}',
                    '</select>',

                '</div>',
                '<div class="cc">',
                    '<span>适用于</span>',
                    '{{each DAY as item}}',
                    '<b class="js_day">{{item}}</b>',
                    '{{/each}}',
                '</div>',
                '<button class="hw-btn hw-light-btn js_add">添加营业时间</button>',

                '<div class="ca js_b1" style="display: none;">',

                '</div>',
            '</div>'
        ].join('');
    },
    initStart : function(){
        this.timelist = [
            '休业',
            '01:00AM','01:30AM','02:00AM','02:30AM','03:00AM','03:30AM','04:00AM','04:30AM',
            '05:00AM','05:30AM','06:00AM','06:30AM','07:00AM','07:30AM','08:00AM','08:30AM',
            '09:00AM','09:30AM','10:00AM','10:30AM','11:00AM','11:30AM','12:00AM','12:30AM',
            '01:00PM','01:30PM','02:00PM','02:30PM','03:00PM','03:30PM','04:00PM','04:30PM',
            '05:00PM','05:30PM','06:00PM','06:30PM','07:00PM','07:30PM','08:00PM','08:30PM',
            '09:00PM','09:30PM','10:00PM','10:30PM','11:00PM','11:30PM','12:00PM','12:30PM'
        ];
        this.DAY = ['周一','周二','周三','周四','周五','周六','周日'];
        this.SD = [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday'
        ];

        this.td = [];
    },
    setJqVar : function(){
        var bb = this.elem.find('.js_b2');
        return {
            box : this.elem.find('.js_b1'),
            bb : bb,
            start : bb.find('.js_start'),
            end : bb.find('.js_end')
        };
    },
    getData : function(box, data, next){
        next({
            timelist : this.timelist,
            DAY : this.DAY
        })
    },

    setBoxHtml : function(){
        var xiuye = this.timelist[0];
        var h = [
            '{{each list as item index}}',

            '{{if item.start==="'+xiuye+'"||item.end==="'+xiuye+'"}}',
            '<div><span class="ml">{{item.weekString}}</span> <span class="ml">'+xiuye+'</span>' +
            ' <span param="{{index}}" class="js_del bn">删除</span></div>',
            '{{else}}',
            '<div><span class="ml">{{item.weekString}}</span> <span>{{item.start}}</span> －' +
            ' <span class="ml">{{item.end}}</span>' +
            ' <span param="{{index}}" class="js_del bn">删除</span></div>',
            '{{/if}}',


            '{{/each}}'
        ].join('');

        var list = _.map(this.td, function(item) {
            item.weekString = item.week.join(' ');
            return item;
        });

        h = template.compile(h)({
            list : list
        });

        this.jq.box.html(h);

        this.checkListBox();
        this.reset();
    },

    getAddData : function(){
        var data = {
            start : this.jq.start.val(),
            end : this.jq.end.val()
        };
        data.week = _.map(this.elem.find('.js_day').filter('.active'), function(one){
            return $(one).html();
        });

        return data;
    },

    checkListBox : function(){
        var f = false;
        if(this.td.length > 0){
            f = true;
        }

        if(!f){
            this.jq.box.hide();
        }
        else{
            this.jq.box.show();
        }

    },

    checkDayTime : function(dt){
        if(util.indexOf(dt, this.timelist[0]) !== -1) return true;

        var st = dt[0],
            et = dt[1];
        st = {
            x : parseInt(st.substr(0, 2), 10),
            y : st.substr(5, 2)
        };
        et = {
            x : parseInt(et.substr(0, 2), 10),
            y : et.substr(5, 2)
        };

        if(et.y === st.y){
            if(et.x > st.x){
                return true;
            }
        }
        else if(et.y === 'PM'){
            return true;
        }


        return false;
    },

    showError : function(str){
        if(str){
            this.elem.addClass('has-error').find('.hw-err').html(str);
        }
        else{
            this.elem.removeClass('has-error').find('.hw-err').html('');
        }
    },

    initEvent : function(){
        var self = this;
        this.elem.on('click', '.js_add', function(){
            var data = self.getAddData();

            if(!self.checkDayTime([data.start, data.end])){
                self.showError('时间格式错误');
                return false;
            }
            else{
                self.showError();
            }

            if(data.week.length < 1){
                self.showError('请选择适用于周几');
                return false;
            }
            else{
                self.showError();
            }

            self.td.push(data);
            self.setBoxHtml();


        });
        this.elem.on('click', '.js_day', function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
            }
            else{
                $(this).addClass('active');
            }
        });
        this.jq.box.on('click', '.js_del', function(){
            var index = $(this).attr('param');
            self.td.splice(index, 1);
            self.setBoxHtml();
        });

        this.jq.start.change(function(){
            if($(this).val() === self.timelist[0]){
                self.jq.end.val(self.timelist[0]);
            }
        });
        this.jq.end.change(function(){
            if($(this).val() === self.timelist[0]){
                self.jq.start.val(self.timelist[0]);
            }
        });

    },

    reset : function(){
        this.elem.find('.js_day').removeClass('active');
        this.jq.start.val('08:00AM');
        this.jq.end.val('09:00PM');
    },

    initEnd : function(){
        this.checkListBox();
        this.reset();
    },
    setValue : function(data){
        var self = this;
        var rs = [];
        _.each(data, function(one){
            var tmp = {
                start : one.datetime1,
                end : one.datetime2
            };

            var wt = [];
            _.each(self.SD, function(x, index){
                if(one[x] === '1'){
                    wt.push(self.DAY[index]);
                }
            });
            tmp.week = wt;
            rs.push(tmp);
        });
        self.td = rs;

        self.setBoxHtml();
        self.checkListBox();
    },
    getValue : function(){
        var self = this;
        var rs = [];
        _.each(this.td, function(item){
            var tmp = {
                daytime : [item.start, item.end]
            };

            var wt = [];
            _.each(self.DAY, function(day){
                if(_.contains(item.week, day)){
                    wt.push('1');
                }
                else{
                    wt.push('0');
                }
            });
            tmp.weektime = wt;
            rs.push(tmp);
        });

        return rs;
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

            '<div class="form-group js_tag" style="display: none;">',
                '<label>营业特色</label>',
                '<div class="hw-tagbox">',
                '</div>',
            '</div>',

            '<div {{if biz}}data-value="{{biz.address}}"{{/if}} class="js_address" role="BaseInput" data-label="店铺地址" placeholder="街道地址，如3442 Mackenzie Dr (可选)"></div>',

            '<div {{if biz}}data-value="{{biz.zip}}"{{/if}} style="margin-left: 0;" class="js_zip hw-inline" role="BaseInput" data-require="true" data-label="邮编" placeholder="e.g. 94536"></div>',
            '<div {{if biz}}data-value="{{biz.city}}"{{/if}} class="js_city hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="城市"></div>',
            //'<div {{if biz}}data-value="{{biz.state}}"{{/if}} class="js_state hw-inline" data-delbtn="true" role="BaseInput" data-require="true" data-label="州/省"></div>',

            '<div class="hw-inline form-group">',
                '<label class="require">州/省</label>',
                '<select class="js_state hw-inline">',
                this.stateListHtml,
                '</select>',
            '</div>',


            '<div class="js_wktime" role="MybizStoreInputDatepicker"></div>',




            '<button style="float: right;" class="js_btn hw-btn hw-blue-btn">{{btnText}}</button>',

            '<div>'
        ].join('');
    },
    getData : function(box, data, next){
        var self = this;
        this.type = 'create';

        var list = [function(){
            return KG.request.getAllStoreCategoryList({});
        }];

        if(KG.data.get('id')){
            this.type = 'edit';
            list.push(function(){
                return KG.request.getBizDetailById({
                    bizId : KG.data.get('id')
                });
            });
        }

        util.loading(true);
        KG.request.defer(list, function(catList, bizInfo){
            util.loading(false);

            if(!bizInfo && util.url.hash()==='fromstorage'){
                bizInfo = util.storage.get(self.__name);
                bizInfo.name_cn = bizInfo.bizName;
                bizInfo.tel = bizInfo.bizTel;
                bizInfo.fk_main_tag_id = bizInfo.bizTagId;
                bizInfo.tags = _.map(bizInfo.tags.split(','), function(one){
                    return {
                        pk_id : one
                    };
                });
            }

            next({
                catList : catList,
                biz : bizInfo || false,
                type : self.type,
                btnText : self.type==='create'?'下一步':'保存'
            });
        });

    },
    setJqVar : function(){
        return {
            tagBox : this.elem.find('.hw-tagbox'),
            btn : this.elem.find('.js_btn')
        };
    },

    initStart : function(){

        this.stateListHtml = [
            '<optgroup label="United States">',
            '<option value="AL">Alabama</option>',
            '<option value="AK">Alaska</option>',
            '<option value="AZ">Arizona</option>',
            '<option value="AR">Arkansas</option>',
            '<option value="CA">California</option>',
            '<option value="CO">Colorado</option>',
            '<option value="CT">Connecticut</option>',
            '<option value="DE">Delaware</option>',
            '<option value="DC">District Of Columbia</option>',
        '<option value="FL">Florida</option>',
            '<option value="GA">Georgia</option>',
            '<option value="HI">Hawaii</option>',
            '<option value="ID">Idaho</option>',
            '<option value="IL">Illinois</option>',
            '<option value="IN">Indiana</option>',
            '<option value="IA">Iowa</option>',
            '<option value="KS">Kansas</option>',
            '<option value="KY">Kentucky</option>',
            '<option value="LA">Louisiana</option>',
            '<option value="ME">Maine</option>',
            '<option value="MD">Maryland</option>',
            '<option value="MA">Massachusetts</option>',
            '<option value="MI">Michigan</option>',
            '<option value="MN">Minnesota</option>',
            '<option value="MS">Mississippi</option>',
            '<option value="MO">Missouri</option>',
            '<option value="MT">Montana</option>',
            '<option value="NE">Nebraska</option>',
            '<option value="NV">Nevada</option>',
            '<option value="NH">New Hampshire</option>',
        '<option value="NJ">New Jersey</option>',
        '<option value="NM">New Mexico</option>',
        '<option value="NY">New York</option>',
        '<option value="NC">North Carolina</option>',
        '<option value="ND">North Dakota</option>',
        '<option value="OH">Ohio</option>',
            '<option value="OK">Oklahoma</option>',
            '<option value="OR">Oregon</option>',
            '<option value="PA">Pennsylvania</option>',
            '<option value="RI">Rhode Island</option>',
        '<option value="SC">South Carolina</option>',
        '<option value="SD">South Dakota</option>',
        '<option value="TN">Tennessee</option>',
            '<option value="TX">Texas</option>',
            '<option value="UT">Utah</option>',
            '<option value="VT">Vermont</option>',
            '<option value="VA">Virginia</option>',
           '<option value="WA">Washington</option>',
            '<option value="WV">West Virginia</option>',
        '<option value="WI">Wisconsin</option>',
            '<option value="WY">Wyoming</option>',
            '</optgroup>',
            '<optgroup label="Canada">',
            '<option value="AB">Alberta</option>',
            '<option value="BC">British Columbia</option>',
        '<option value="MB">Manitoba</option>',
            '<option value="NB">New Brunswick</option>',
        '<option value="NL">Newfoundland and Labrador</option>',
        '<option value="NS">Nova Scotia</option>',
        '<option value="ON">Ontario</option>',
            '<option value="PE">Prince Edward Island</option>',
        '<option value="QC">Quebec</option>',
           ' <option value="SK">Saskatchewan</option>',
            '<option value="NT">Northwest Territories</option>',
        '<option value="NU">Nunavut</option>',
            '<option value="YT">Yukon</option>',
            '</optgroup>'
        ].join('');
    },

    getElemObj : function(){
        return {
            name : KG.component.getObj(this.elem.find('.js_name')),
            tel : KG.component.getObj(this.elem.find('.js_tel')),
            address : KG.component.getObj(this.elem.find('.js_address')),
            zip : KG.component.getObj(this.elem.find('.js_zip')),
            city : KG.component.getObj(this.elem.find('.js_city')),
            state : this.elem.find('.js_state'),
            timeinfo : KG.component.getObj(this.elem.find('.js_wktime'))
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
            state : jq.state.val().toUpperCase(),
            tags : this.getTagBoxValue()
        };

        data.timeinfo = jq.timeinfo.getValue();

        return data;
    },

    validate : function(data){
        var jq = this.getElemObj();
        if(!data.bizName){
            jq.name.showError('店铺名称不能为空');
            jq.name.focus();
            return false;
        }
        else{
            jq.name.showError();
        }

        if(!data.bizTel){
            jq.tel.showError('店铺电话不能为空');
            jq.tel.focus();
            return false;
        }
        else{
            jq.tel.showError();
        }

        if(!/^[0-9]{10,11}$/g.test(data.bizTel)){
            jq.tel.showError('店铺电话格式不对');
            jq.tel.focus();
            return false;
        }
        else{
            jq.tel.showError();
        }

        if(!data.bizTagId){
            this.jq.cat.showError('请选择店铺类别');
            this.jq.cat.focus();
            return false;
        }
        else{
            this.jq.cat.showError();
        }

        if(!data.zip){
            jq.zip.showError('请输入邮编');
            jq.zip.focus();
            return false;
        }
        else{
            jq.zip.showError();
        }

        if(!data.city){
            jq.city.showError('请输入城市');
            jq.city.focus();
            return false;
        }
        else{
            jq.city.showError();
        }


        return true;
    },

    initEvent : function(){
        var self = this;
        this.jq.btn.click(function(){
            var data = self.getFormValue();
            console.log(data);
            if(!self.validate(data)){
                return false;
            }
            if(self.type === 'edit'){
                data.bizId = KG.data.get('id');
                KG.request.saveStoreByStep1(data, function(flag, rs){
                    if(flag){
                        console.log(rs);
                        util.toast.alert('修改成功');
                        util.delay(function(){
                            //location.href = '../mybiz/index.html';
                        }, 1000);
                    }
                });

            }
            else{
                //save value to storage
                util.storage.set(self.__name, data);

                KG.request.createStoreByStep1(data, function(flag, rs){
                    if(flag){
                        console.log(rs);
                        location.href = 'createStore_2.html?tmp_biz_id='+rs.entityID+'&main_tag_id='+rs.main_tag_id;
                    }
                });
            }

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

        if(this.type === 'edit'){
            this.jq.cat.disable(true);
        }

        if(this.data.biz){

            var index = util.map(this.data.catList, function(item){return item.pk_id;});
            index = util.indexOf(index, this.data.biz.fk_main_tag_id);
            var tmpData = this.data.catList[index];
            if(index !== -1){
                this.jq.cat.setValue(index);
            }
            else{
                tmpData = {pk_id:this.data.biz.fk_main_tag_id};

            }

            this.switchCategory(tmpData, function(){
                util.each(self.data.biz.tags, function(one){
                    self.jq.tagBox.find('[uid="'+one.pk_id+'"]').attr('checked', true);
                });
            });

            this.elem.find('.js_state').val(this.data.biz.state.toUpperCase());


            this.getElemObj().timeinfo.setValue(this.data.biz.timeinfo.unformat);
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
        this.elem.find('.js_tag').show();
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


            '<div class="js_link" role="BaseInput" data-label="店铺网址" placeholder="e.g. www.xiaofeiyang.com"></div>',
            '<div class="js_wx" role="BaseInput" data-label="微信号" placeholder="e.g. xiaofeiyang"></div>',


            '<div class="form-group">',
            '<label class="lab require">店铺描述</label>',
            '<label class="control-label hw-err"></label>',
            '<textarea style="height: 150px;" class="form-control hw-area js_desc"></textarea>',
            '</div>',

            '<a class="hw-btn hw-light-btn" style="border: none;font-weight: 400;padding: 0;text-align: left;" href="{{backLink}}">返回上一步</a>',
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

        var c = this.getElemObj();

        if(this.type === 'edit'){
            c.net.setValue(this.data.biz.website);
            c.wechat.setValue(this.data.biz.wechat);
            c.desc.val(this.data.biz.briefintro);

            this.jq.btn.html('保存');
        }
        else if(util.url.hash() === 'fromstorage'){
            var data = util.storage.get(this.__name);
            console.log(data);
            c.net.setValue(data.website);
            c.wechat.setValue(data.wechat);
            c.desc.val(data.description);
        }
    },

    getFormValue : function(){
        var jq = this.getElemObj();
        return {
            bizTmpId : this.data.tmpBizId,
            wechat : jq.wechat.getValue(),
            website : jq.net.getValue(),
            description : jq.desc.val()
        };
    },

    validate : function(data){
        var jq = this.getElemObj();
        if(!data.description){
            jq.desc.parent('div.form-group').addClass('has-error').find('.hw-err').html('请输入描述');
            return false;
        }
        else{
            jq.desc.parent('div.form-group').removeClass('has-error').find('.hw-err').html('');
        }

        return true;
    },

    initEvent : function(){
        var self = this;
        this.jq.btn.click(function(){
            var data = self.getFormValue();
            data.dynamic = self.getDynamicData();

            if(!self.validate(data)){
                return false;
            }

            if(self.type === 'create'){
                //save to storage
                util.storage.set(self.__name, data);

                KG.request.createStoreByStep2(data, function(flag, rs){
                    if(flag){
                        console.log(rs);
                        location.href = 'createStore_3.html?tmp_biz_id='+rs+'&main_tag_id='+KG.data.get('mainTagId');
                    }
                });
            }
            else if(self.type === 'edit'){
                data.bizId = self.id;
                delete data.bizTmpId;
                KG.request.saveStoreByStep2(data, function(flag, rs){
                    if(true || flag){
                        console.log(rs);
                        util.toast.alert('修改成功');
                        util.delay(function(){
                            //location.href = '../mybiz/index.html';
                        }, 1000);
                    }
                    else{
                        util.toast.showError('修改失败，请检查');
                    }
                });
            }



        });
    },

    initStart : function(){
        this.type = 'create';
        if(KG.data.get('id')){
            this.id = KG.data.get('id');
            this.type = 'edit';
        }
    },

    getData : function(box, data, next){
        var self = this;

        var backLink = '';
        if(this.type === 'create'){
            var tmpId = KG.data.get('tmpBizId'),
                tagId = KG.data.get('mainTagId');

            backLink = 'createStore.html?tmp_biz_id='+tmpId+'&main_tag_id='+tagId+'#fromstorage';
            KG.request.getTmpStoreDynamicField({
                mainTagId : tagId
            }, function(flag, rs){
                if(flag){
                    console.log(rs);
                    next({
                        tmpBizId : tmpId,
                        backLink : backLink,
                        dynamic : rs
                    });
                }
                else{
                    next({
                        tmpBizId : tmpId,
                        backLink : backLink,
                        dynamic : []
                    });
                }
            });
        }
        else if(this.type === 'edit'){
            backLink = 'editStore.html?id='+self.id;
            var fn1 = function(){
                return KG.request.getBizDetailById({
                    bizId : self.id
                });
            };

            KG.request.defer([fn1], function(bizInfo){
                console.log(bizInfo);
                KG.request.getStoreDynamicField({
                    bizId : self.id,
                    tagid : bizInfo.fk_main_tag_id
                }, function(flag, rs){
                    next({
                        dynamic : rs,
                        backLink : backLink,
                        biz : bizInfo
                    });
                });


            });
        }

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
            case '2':
            case '3':
            case '4':
            case '8':
            case '9':
                rs = '<div class="js_role" role_type="'+item.field_type+'" role="BaseInput" data-label="'+item.field_name+'" ></div>';
                box.append(rs);
                this.dynamicObj[item.field_name] = {
                    obj : KG.component.initWithElement(box.find('[role_type]')),
                    type : item.field_type,
                    val : function(){
                        return this.getValue();
                    }
                };

                if(item.value){
                    this.dynamicObj[item.field_name].obj.setValue(item.value);
                }
                break;
            case '6':
                rs = '<div class="js_role" role_type="'+item.field_type+'" data-label="'+item.field_name+'" role="BaseSelectInput" init-self="true"></div>';
                box.append(rs);

                var list = _.map(item.default_option, function(one){
                    return one.m_value;
                });
                var tmpO = KG.component.initWithElement(box.find('[role_type]'), {
                    list : list,
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

                if(item.value){
                    var index = _.findIndex(list, function(one){
                        return item.value === one;
                    });
                    this.dynamicObj[item.field_name].obj.setValue(index);
                }

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

                if(item.value){
                    box.find('input[type="radio"]').filter('[value="'+item.value+'"]').prop('checked', true);
                }

                break;
            case '7':
                rs = '<div class="hw-dym" param="'+item.field_id+'"><span>'+item.field_name+'</span>';
                _.each(item.default_option, function(one){
                    rs += '<label><input type="checkbox" value="'+one.m_value+'" class="radio-inline" name="'+item.field_id+'" />'+one.m_value+'</label>';
                });
                rs += '</div>';

                box.append(rs);

                this.dynamicObj[item.field_name] = {
                    obj : null,
                    type : item.field_type,
                    val : function(){
                        var r = [];
                        box.find('[param="'+item.field_id+'"]').find('input').each(function(){
                            var o = $(this);
                            if(o.prop('checked')){
                                r.push(o.val());
                            }
                        });
                        return r;
                    }
                };

                if(item.value){
                    _.each(item.value, function(one){
                        box.find('input[type="checkbox"]').filter('[value="'+one+'"]').prop('checked', true);
                    });
                }

            default :
                break;
        }

        if(this.dynamicObj[item.field_name])
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
            bizid : {},
            image : {}
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
            data.bizId = this.prop.bizid;
            data.type = 'tmp';
        }
        else{
            data.type = 'biz';
            data.bizId = this.prop.bizid;
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


    },
    initEnd : function(){

    },
    getImageUrl : function(){
        return this.jq.img.attr('src');
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

    defineProperty : function(){
        return {
            type : {}
        }
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

            self.uploadImageFn(file, function(url, json){
                self.addNewImage(url, json.fileid);
            });

            $(this).val('');
        });

        var type = self.prop.type;
        this.elem.on('click', '.js_del', function(e){
            var o  =$(this);
            var id = $(this).attr('param');

            util.dialog.confirm1({
                YesText : '删除',
                msg : '您确定要删除这张照片吗？',
                YesFn : function(callback){
                    if(type === 'edit'){
                        self.deleteImage(id, function(){
                            o.parent('.js_img').remove();
                        });
                    }
                    else{
                        o.parent('.js_img').remove();
                    }

                    callback();
                }
            });
            return false;

        }).on('click', '.js_img', function(){
            self.showBigImage($(this).find('img').attr('src'));
            return false;
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

    deleteImage : function(id, callback){
        KG.request.deleteStoreImage({
            fileid : id,
            bizId : KG.data.get('id')
        }, function(flag, rs){
            if(flag){
                callback();
            }
            else{
                util.toast.showError(rs);
            }
        });
    },

    getEachHtml : function(url, id){
        var h = [
            '<div class="hw-one js_img">',
            '<img src="{{url}}" />',
            '<b param="'+id+'" class="js_del">删除</b>',
            '</div>'
        ].join('');
        return template.compile(h)({url : url});
    },

    uploadImageFn : function(file, callback){

        if(this.prop.type === 'edit'){
            util.readFile(file, function(binary){
                KG.request.uploadStoreImage({
                    image : binary,
                    bizId : KG.data.get('id')
                }, function(flag, rs){
                    if(flag){
                        callback(KG.config.SiteRoot+rs.files[0], rs);
                    }
                    else{
                        util.toast.showError(rs);
                    }
                });
            });

        }
        else{
            util.readFile(file, function(binary){
                KG.request.uploadStoreImage({
                    image : binary,
                    bizId : util.url.param('tmp_biz_id'),
                    type : 'tmp'
                }, function(flag, rs){
                    if(flag){
                        callback(KG.config.SiteRoot+rs.files[0], rs);
                    }
                    else{
                        util.toast.showError(rs);
                    }
                });
            });
        }

    },

    addNewImage : function(src, id){
        var h = this.getEachHtml(src, id);
        this.jq.add.after(h);
    },

    initEnd : function(){
        var self = this;
        var list = this.data.list;
        util.each(list, function(item){
            var url = KG.config.SiteRoot+item.path;
            self.addNewImage(url, item.pk_id);
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
            '<img class="js_bigimage1" src={{item.url}} />',
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
            '{{if tmpId}}',
            '<div class="hw-upload js_logo" data-biztype="tmp" init-self="true" data-bizid="{{tmpId}}"' +
            ' role="UploadStoreImage"></div>',
            '{{else}}',
            '<div class="hw-upload js_logo" init-self="true" data-image="{{biz | logoPath}}" data-biztype="biz" data-bizid="{{bizId}}" role="UploadStoreImage"></div>',
            '{{/if}}',
            '</div>',


            '<div class="hw-line"></div>',

            '<div class="form-group">',
            '<label class="lab">店铺图片</label>',
            '<div class="js_image" data-type="'+this.type+'" role="MybizUploadStoreImage"' +
            ' init-self="true"></div>',

            '</div>',


            '{{if backLink}}<a class="hw-btn hw-light-btn" style="float: left;border: none;font-weight: 400;" href="{{backLink}}">返回上一步</a>{{/if}}',
            '<button style="float: right;" class="js_btn hw-btn hw-blue-btn">{{btnText}}</button>',


            '</div>'
        ].join('');
    },
    defineProperty : function(){
        return {
            type : {}
        };
    },
    getData : function(box, data, next){
        var backLink;
        this.type = this.prop.type;

        if(this.type === 'create'){
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

                backLink = 'createStore_2.html?tmp_biz_id='+tmpId+'&main_tag_id='+tagId+'#fromstorage';

                next({
                    bigBgImageList : bigBgImageList,
                    backLink : backLink,
                    tmpId : tmpId,
                    tagId : tagId,
                    btnText : '完成'
                });
            });
        }
        else{
            var fn = [];
            KG.request.getBizDetailById({
                bizId : KG.data.get('id')
            }, function(flag, json){


                KG.request.getStoreBigBackgroundPic({
                    mainTagId : json.fk_main_tag_id
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
                        bizId : KG.data.get('id'),
                        backLink : null,
                        tagId : tagId,
                        biz : json,
                        btnText : '保存'
                    });
                });
            });

        }


    },

    initStart : function(){},

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
            console.log(data);

            if(self.type === 'create'){
                var src = self.jq.logo.getImageUrl();
                if(src){
                    data.logo = src;
                }
                KG.request.createStoreByStep3(data, function(flag, rs){
                    if(flag){
                        //location.href = 'http://beta.haiwai.com/biz/view.php?id='+rs;
                        self.showSuccessDialog(rs);
                    }
                });
            }
            else{
                data.bizId = self.data.bizId;
                KG.request.updateStoreByStep3(data, function(flag, rs){
                    if(true || flag){
                        util.toast.alert('修改成功');
                        util.delay(function(){
                            //location.href = '../mybiz/index.html';
                        }, 1000);
                    }
                    else{
                        util.toast.showError('修改失败，请检查');
                    }
                });
            }


        });
    },

    showSuccessDialog : function(id){

        var msg = '<div class="hw-icon"><i class="fa fa-check"></i></div>您的店铺已建成！';
        util.dialog.show({
            foot : true,
            title : msg,
            body : '<p>您马上就可以管理和分享您的店铺，我们会在1-2个工作日之内完成审核，将您的店铺发布到海外同城首页和文学城首页。</p>',
            'class' : 'hw-confirm',
            YesFn : function(){
                var href = util.path.store(id);
                location.href = href;
            },
            YesText : '查看我的店铺',
            NoFn : function(){
                var href = '../mybiz/editStore.html?id='+id;
                location.href = href;
            },
            NoText : '管理我的店铺'
        });
    },

    initEnd : function(){
        var self = this;
        this.image = KG.component.initWithElement(this.elem.find('.js_image'), {
            list : this.data.biz ? this.data.biz.files : []
        });

        var index = 0;
        if(self.data.biz){
            index = _.findIndex(this.data.bigBgImageList, function(one){
                return one.url === self.data.biz.background_pic;
            });
        }
        this.elem.find('.js_bigimage1').eq(index).trigger('click');

        this.jq.logo = KG.component.initWithElement(this.elem.find('.js_logo'), {});
    },

    getFormValue : function(){
        return {
            bizTmpId : this.data.tmpId,
            bgPic : this.jq.bigImage.filter('.active').find('img').attr('src'),
            imageList : this.image.getValue()
        };
    }
});