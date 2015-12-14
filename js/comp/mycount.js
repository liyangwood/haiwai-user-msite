'use strict';

(function(){

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

        initEnd : function(){
            KG.component.init(this.elem);
        },

        initEvent : function(){
            this.elem.find('.hw-btn').click(this.submit.bind(this));
        },

        submit : function(){
            var oldObj = KG.component.getObj(this.elem.find('.js_old')),
                pwdObj = KG.component.getObj(this.elem.find('.js_pwd')),
                pwd2Obj = KG.component.getObj(this.elem.find('.js_pwd2'));

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
            if(p1!==p2){
                pwd2Obj.showError('二次输入的密码不一致');
                return;
            }

            util.alert(v+p1+p2);


            this.reset();
        },
        reset : function(){
            var oldObj = KG.component.getObj(this.elem.find('.js_old')),
                pwdObj = KG.component.getObj(this.elem.find('.js_pwd')),
                pwd2Obj = KG.component.getObj(this.elem.find('.js_pwd2'));

            oldObj.reset();
            pwdObj.reset();
            pwd2Obj.reset();
        }
    });


})();