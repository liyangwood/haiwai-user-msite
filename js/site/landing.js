

(function(){

    KG.Class.define('HWLandingTopBox', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-landingTopBox container-fluid"><div class="container">',
                    '<h3>创建网上店铺，直达百万顾客</h3>',
                    '<p class="c1">',
                        '两分钟建个高颜值的个性化店面<br/>',
                        '发优惠、发文章，微信群、朋友圈自由传播<br/>',
                        '海外最大的媒体平台帮你直达400万华人',
                    '</p>',

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
            var h = '<a href="javascript:void(0)" style="margin-top: 200px;" class="hw-btn hw-blue-btn">我是商家，创建店铺</a>';

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

            this.elem.on('click', '.js_login', function(e){
                var data = {
                    username  : self.jq.box.find('.js_email').val(),
                    password : self.jq.box.find('.js_pwd').val()
                };

                KG.user.login(data, function(flag, rs){

                });
            });

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

    KG.Class.define('HWLandingBigImage', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-landingBigImage">',
                    '<div class="container-fluid"><div class="box c1">',
                        '<img src="../../image/landing/page01.png" />',
                        '<p class="p1">零成本投入，免费注册海外就可以创建<br/>高颜值、个性化店铺主页，并即刻分享到微信</p>',
                        '<p class="p2">扫描二维码，<br/>免费下载商家版App<br/>随时随地轻松管理店铺</p>',
                    '</div></div>',
                    '<div style="background: #f7f7f7;" class="container-fluid"><div class="box c2">',
                        '<img src="../../image/landing/page02.png" />',
                        '<h3>发优惠，聚人气</h3>',
                        '<p class="p1">优惠券、折扣、买赠…轻松发布各种优惠到<br/>海外同城平台，让更多的顾客认识和喜欢上<br/>您的店铺</p>',
                    '</div></div>',
                    '<div class="container-fluid"><div class="box c3">',
                        '<img src="../../image/landing/page03.png" />',
                        '<h3>发文章，塑品牌</h3>',
                        '<p class="p1">发表专业文章、店铺软文，塑造品牌形象，<br/>同步到微信，收获更多的点赞和粉丝</p>',
                    '</div></div>',
                    '<div style="background: #f7f7f7;" class="container-fluid"><div class="box c4">',
                        '<img src="../../image/landing/page04.png" />',
                    '</div></div>',
                '</div>'
            ].join('');
        }
    });

})();