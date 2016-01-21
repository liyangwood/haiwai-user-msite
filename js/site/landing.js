

(function(){

    KG.Class.define('HWLandingTopBox', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-landingTopBox container-fluid"><div class="container">',
                    '<div></div>',

                    '<img src="../../image/haiwai1.png" class="hw-img" />',

                    '<div class="hw-box">',

                    '</div>',
                '</div></div>'
            ].join('');
        },
        setJqVar : function(){
            return {
                box : this.elem.find('.hw-box')
            };
        },

        defineProperty : function(){
            return {
                login : {
                    defaultValue : false
                }
            };
        },

        setLoginBox : function(){
            var h = [
                '<input style="margin-top: 55px;" type="text" class="hw-input js_email" placeholder="邮箱" />',
                '<input type="password" style="margin-top: 25px;" class="hw-input js_pwd" placeholder="密码" />',
                '<a href="javascript:void(0)" class="hw-btn hw-blue-btn js_login">立即登录，创建店铺</a>',
                '<p>还没有海外帐户？<b class="js_toReg">注册</b></p>'
            ].join('');
            this.jq.box.html(h);
        },

        setRegBox : function(){
            var h = [
                '<input style="margin-top: 10px;" type="text" class="hw-input js_email" placeholder="邮箱" />',
                '<input type="password" style="margin-top: 15px;" class="hw-input js_pwd" placeholder="密码" />',
                '<input type="password" style="margin-top: 15px;" class="hw-input js_pwd2" placeholder="确认密码" />',
                '<a href="javascript:void(0)" style="margin-top: 15px;" class="hw-btn hw-blue-btn js_reg">立即注册，创建店铺</a>',
                '<em>点击注册表示您同意海外同城的<a href="">使用协议</a>和<a>隐私保护协议</a></em>',
                '<p>已有海外帐户？<b class="js_toLogin">直接登录</b></p>'
            ].join('');
            this.jq.box.html(h);
        },

        setAfterLoginBox : function(){
            var h = '<a href="javascript:void(0)" style="margin-top: 180px;" class="hw-btn hw-blue-btn">我是商家，创建店铺</a>';

            this.jq.box.html(h);
        },

        getData : function(box, data, next){
            console.log(this.prop);
            var isLogin = this.prop.login;
            next({
                isLogin : isLogin
            });
        },

        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_toReg', this.setRegBox.bind(this));
            this.elem.on('click', '.js_toLogin', this.setLoginBox.bind(this));

        },

        initEnd : function(){
            if(!this.data.isLogin){
                this.setLoginBox();
                this.elem.addClass('hw-not-login');
            }
            else{
                this.elem.addClass('hw-is-login');
                this.setAfterLoginBox();
            }
        }
    });

})();