'use strict';

KG.Class.define('MycountLeftNav', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-comp-MycountLeftNav">',
            '<a class="hw-a js_info" href="info.html">基本信息</a>',
            '<a class="hw-a js_password" href="password.html">修改密码</a>',
            '</div>'
        ].join('');
    },
    getData : function(box, data, next){
        var page = KG.data.get('page').split('-')[1];

        next({
            page : page
        });
    },

    initEvent : function(){

        this.elem.find('.js_password').click(function(){
            if(!KG.user.get('email')){
                util.toast.showError('请先设置注册邮箱！');
                return false;
            }

        });
    },

    initEnd : function(){
        this.elem.find('.js_'+this.data.page).addClass('active');
    }
});

KG.Class.define('MycountChangePasswordForm', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div>',
            '<div class="js_old" data-label="旧密码" data-require="true" data-type="password" role="BaseInput"></div>',
            '<div class="js_pwd" data-label="新密码" data-require="true" data-type="password" role="BaseInput"></div>',
            '<div class="js_pwd2" data-label="确认新密码" data-require="true" data-type="password" role="BaseInput"></div>',

            '<a style="margin-top: 20px;float: right;" href="javascript:void(0)" class="hw-btn hw-blue-btn">保存</a>',
            '</div>'
        ].join('');
    },


    initEvent : function(){
        var self = this;
        this.elem.find('.hw-btn').click(this.submit.bind(this));

        this.jq.oldObj.setBlurEvent(function(val){
            if(!val){
                this.showError('请输入旧密码');
            }
            else{
                this.showError();
            }
        });

        this.jq.pwdObj.setBlurEvent(function(val){
            if(!val){
                this.showError('请输入新密码');
            }
            else if(val.length < 6){
                this.showError('密码长度不能小于6位');
            }
            else{
                this.showError();
            }
        });

        this.jq.pwd2Obj.setBlurEvent(function(val){
            if(val !== self.jq.pwdObj.getValue()){
                this.showError(util.const.PasswordNotEqual);
            }
            else{
                this.showError();
            }
        });
    },

    setJqVar : function(){
        return {
            oldObj : KG.component.getObj(this.elem.find('.js_old')),
            pwdObj : KG.component.getObj(this.elem.find('.js_pwd')),
            pwd2Obj : KG.component.getObj(this.elem.find('.js_pwd2'))
        };
    },

    submit : function(){
        var self = this;
        var oldObj = this.jq.oldObj,
            pwdObj = this.jq.pwdObj,
            pwd2Obj = this.jq.pwd2Obj;

        var v = oldObj.getValue(),
            p1 = pwdObj.getValue(),
            p2 = pwd2Obj.getValue();

        if(!v){
            oldObj.showError('请输入旧密码');
            return;
        }
        if(!p1){
            pwdObj.showError('请输入新密码');
            return;
        }
        if(p1.length < 6){
            pwdObj.showError('密码长度不能小于6位');
            return;
        }
        if(p1!==p2){
            pwd2Obj.showError('二次输入的密码不一致');
            return;
        }

        KG.request.changePassword({
            old : v,
            password : p1
        }, function(flag, rs){
            if(flag){
                util.toast.alert('修改成功');
                self.reset();
            }
            else{
                util.dialog.alert(rs);
            }
        });


    },
    reset : function(){
        var oldObj = this.jq.oldObj,
            pwdObj = this.jq.pwdObj,
            pwd2Obj = this.jq.pwd2Obj;

        oldObj.reset();
        pwdObj.reset();
        pwd2Obj.reset();
    }
});

KG.Class.define('UploadUserImage', {
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
            jq.img.attr('src', KG.user.get('defaultImage'));
        });
    },

    uploadImageFn : function(file, callback){
        var self = this;
        if(!file) return;

        var fr = new FileReader();
        fr.onload = function(e){
            var binary = e.target.result;

            KG.request.uploadUserImage({
                image : binary
            }, function(flag, rs){
                if(flag){
                    var url = KG.config.SiteRoot+rs;
                    self.jq.img.attr('src', url);

                }
                callback();
            });
        };

        fr.readAsDataURL(file);

    }
});

KG.Class.define('SelectLocationRange', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-comp-SelectLocationRange">',
            '<select class="js_country">',
            '{{each countryList as item}}',
            '<option value="{{item.id}}" {{if item.id==region[0]}}selected="true"{{/if}}>{{item.name}}</option>',
            '{{/each}}',
            '</select>',

            '<select class="js_state"></select>',
            '<br />',
            '<select style="display: none;" class="js_city"></select>',
            '<select style="display: none;" class="js_area"></select>',
            '</div>'
        ].join('');
    },

    defineProperty : function(){
        return {
            region : {
                defaultValue : '1,-1,-1,-1'
            }
        };
    },

    setJqVar : function(){
        return {
            country : this.elem.find('.js_country'),
            state : this.elem.find('.js_state'),
            city : this.elem.find('.js_city'),
            area : this.elem.find('.js_area')
        };
    },

    getData : function(box, data, next){
        if(this.prop.region.toString() === '-1'){
            this.prop.region = 1;
        }

        var self = this;
        KG.request.getAllAddressAreaInfo({}, function(flag, rs){
            var countryList = self.getListData(rs);

            var all = {};

            var loop = function(list){
                util.each(list, function(item){
                    all[item.pk_id] = item;
                    if(item.child){
                        loop(item.child);
                    }
                });
            };
            loop(rs);

            var region = self.prop.region.toString().split(',');
            next({
                countryList : countryList,
                all : all,
                region : region
            });

        })
    },

    initEventEnd : function(){
        var self = this;
        this.jq.country.change(function(){
            var val = $(this).val();
            self.changeCountry(val);
        });

        this.jq.state.change(function(){
            var val = $(this).val();
            self.changeState(val);
        });

        this.jq.city.change(function(){
            var val = $(this).val();
            self.changeCity(val);
        });
    },

    changeCountry : function(cid, v){
        if(!cid || cid.toString()==='-1'){
            this.jq.state.val('-1');
            this.jq.city.val('-1').hide();
            this.jq.area.val('-1').hide();
            return;
        }
        var list = this.getListData(this.data.all[cid].child);

        this.setListHtml(list, this.jq.state, v);
    },
    changeState : function(cid, v){
        if(!cid || cid.toString()==='-1'){
            this.jq.city.val('-1').hide();
            this.jq.area.val('-1').hide();
            return;
        }
        var list = this.getListData(this.data.all[cid].child);

        this.setListHtml(list, this.jq.city, v);
    },
    changeCity : function(cid, v){
        if(!cid || cid.toString()==='-1'){
            this.jq.area.val('-1').hide();
            return;
        }
        var list = this.getListData(this.data.all[cid].child);

        this.setListHtml(list, this.jq.area, v);

    },

    getListData : function(data){
        return util.map(data, function(item){
            item.id = item.pk_id;
            return item;
        });
    },


    setListHtml : function(data, box, value){
        if(!data || data.length < 1){
            box.hide();
            return;
        }

        var h = [
            '<option value="-1">请选择</option>',

            '{{each data as item}}',
            '<option value="{{item.id}}">{{item.name}}</option>',
            '{{/each}}'
        ].join('');
        box.html(template.compile(h)({data : data}));


        value = value || '-1';
        box.show().find('[value="'+value+'"]').attr('selected', true);
        box.trigger('change');
    },
    getValue : function(){
        var tmp = [
            this.jq.country.val(),
            this.jq.state.val(),
            this.jq.city.val(),
            this.jq.area.val()
        ];

        var rs;
        util.each(tmp, function(val){
            if(val && val !== '-1'){
                rs = val;
            }
        });
        return rs;
    },
    setValue : function(region){
        var a = this.data.all[region];
        console.log(a);
    },
    initEnd : function(){
        var region = this.data.region;

        var a = region[0],
            b = region[1],
            c = region[2],
            d = region[3];

        this.changeCountry(a, b);
        this.changeState(b, c);
        this.changeCity(c, d);

        this.initEventEnd();
    }
});

KG.Class.define('MycountChangeInfoForm', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div>',
            '<div class="js_username" data-value="{{user.nick}}" data-label="用户名" data-require="true" role="BaseInput"></div>',
            '<div class="js_regemail" data-value="{{user.email}}" data-label="注册邮箱" data-require="true" data-type="email" role="BaseInput"></div>',
            //'<div class="js_pwd2" data-label="确认新密码" data-require="true" data-type="password" role="BaseInput"></div>',
            '<div class="form-group">',
            '<label class="lab">头像</label>',
            '<div data-image="{{user.avatar_url | absImage}}" class="hw-upload" role="UploadUserImage"></div>',
            '</div>',

            '<div class="hw-line"></div>',

            '<div class="form-group">',
            '<label class="lab require">所在地区</label>',
            '<div class="js_loc" data-region="{{region}}" init-self="true" role="SelectLocationRange"></div>',
            '</div>',

            '<div class="js_phone" data-value="{{user.tel}}" data-label="联络电话" role="BaseInput"></div>',
            '<div class="js_wx" data-value="{{user.ims_value}}" data-label="微信号" role="BaseInput"></div>',

            '<div class="hw-line"></div>',

            '<div class="form-group">',
            '<label class="lab">个人介绍</label>',
            '<textarea class="form-control hw-area js_desc">{{user.signature}}</textarea>',
            '</div>',

            '<a style="margin-top: 20px;float: right;" href="javascript:void(0)" class="js_btn hw-btn hw-blue-btn">保存</a>',
            '</div>'
        ].join('');
    },

    setJqVar : function(){
        return {
            btn : this.elem.find('.js_btn')
        };
    },

    getElemObj : function(){
        return {

            nick : KG.component.getObj(this.elem.find('.js_username')),
            email : KG.component.getObj(this.elem.find('.js_regemail')),
            tel : KG.component.getObj(this.elem.find('.js_phone')),
            wechat : KG.component.getObj(this.elem.find('.js_wx')),
            region : KG.component.getObj(this.elem.find('.js_loc')),
            desc : this.elem.find('.js_desc')
        };
    },
    getData : function(box, data, next){
        KG.request.getUserDetailInfo({}, function(flag, rs){
            console.log(rs);
            var region = [],
                tmp = rs.region_tree.reverse();
            for(var i= 0, len=tmp.length; i<len; i++){
                region.push(tmp[i]?tmp[i].pk_id:'-1');
            }
            next({
                region : region.join(','),
                user : rs
            });
        });

    },
    initBlurEvent : function(){
        var obj = this.getElemObj();
        obj.nick.setBlurEvent(function(val){
            if(!val){
                this.showError('请输入用户名');
            }
            else{
                this.showError();
            }
        });

        obj.email.setBlurEvent(function(val){
            var v = KG.validate.email(val);
            if(!v[0]){
                this.showError(v[1]);
            }
            else{
                this.showError();
            }
        });
    },
    initEvent : function(){
        this.jq.btn.click(this.submit.bind(this));
        this.initBlurEvent();
    },
    submit : function(){

        var jq = this.getElemObj();

        var data = {
            nickname : jq.nick.getValue(),
            email : jq.email.getValue(),
            tel : jq.tel.getValue(),
            wechat : jq.wechat.getValue(),
            region : jq.region.getValue(),
            description : jq.desc.val()
        };

        console.log(data);

        //TODO validate
        if(!data.nickname){
            jq.nick.showError('请输入用户名');
            jq.nick.focus();
            return false;
        }
        else{
            jq.nick.showError();
        }

        if(!data.email){
            jq.email.showError('请输入注册邮箱');
            jq.email.focus();
            return false;
        }
        else{
            jq.email.showError();
        }

        KG.request.modifyUserInfo(data, function(flag, rs){
            if(!flag){
                util.toast.showError(rs);
                return false;
            }
            util.toast.alert('修改成功');
            KG.user.update();

            _.delay(function(){
                location.reload();
            }, 2000);
        });

    },

    initEnd : function(){
        KG.component.initWithElement(this.elem.find('.js_loc'));
    }

});

KG.Class.define('HWMycountForgetPasswordForm', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-HWMycountForgetPasswordForm">',
                '<p>请输入您的注册邮箱</p>',
                '<input type="text" class="form-control" />',
                '<button class="hw-btn hw-blue-btn">找回密码</button>',
            '</div>'
        ].join('');
    },
    initEvent : function(){
        var btn = this.elem.find('.hw-btn'),
            inp = this.elem.find('input');

        btn.click(function(){
            var val = inp.val();

            if(!util.validate.email(val)){
                util.dom.showErrorPopover(inp, '注册邮箱格式错误', {
                    placement : 'right'
                });
                return false;
            }
            else{
                util.dom.showErrorPopover(inp, false);
            }

            KG.request.sendResetPasswordEmail({
                email : val
            }, function(flag, rs){
                if(flag){
                    util.toast.alert('发送邮件成功', '找回密码信息已发送至'+val+'，请查收邮件并按照提示操作！');
                }
                else{
                    util.toast.showError(rs);
                }
            });
        });
    }
});

KG.Class.define('HWMycountResetPasswordForm', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-HWMycountResetPasswordForm">',
                '<div class="js_pwd" data-label="设置新密码" data-require="true" data-type="password" role="BaseInput"></div>',
                '<div class="js_pwd1" data-label="确认新密码" data-require="true" data-type="password" role="BaseInput"></div>',
                '<button class="hw-btn hw-blue-btn">保存</button>',
            '</div>'
        ].join('');
    },
    getElemObj : function(){
        return {
            pwd : KG.component.getObj(this.elem.find('.js_pwd')),
            pwd1 : KG.component.getObj(this.elem.find('.js_pwd1'))
        };
    },
    initEvent : function(){
        var self = this,
            jq = this.getElemObj();
        this.elem.find('.hw-btn').click(function(){
            var pwd = jq.pwd.getValue(),
                pwd1 = jq.pwd1.getValue();

            if(!pwd || pwd.length < 6){
                jq.pwd.showError('密码长度不能小于6位');
                return false;
            }
            else{
                jq.pwd.showError();
            }

            if(pwd !== pwd1){
                jq.pwd1.showError('二次输入的密码不一致');
                return false;
            }
            else{
                jq.pwd1.showError();
            }


            var data = {
                check : KG.data.get('check'),
                email : KG.data.get('email'),
                password : pwd
            };
            KG.request.resetPassword(data, function(flag, rs){
                if(flag){
                    KG.user.login({
                        username : KG.data.get('email'),
                        password : pwd
                    }, function(user){
                        location.href = '../site/index.html';
                    });
                }
                else{
                    util.toast.showError(rs);
                }
            });
        });
    }
});