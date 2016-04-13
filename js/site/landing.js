

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
                        '免费创建并发布您的广告到文学城首页一个月',
                    '</p>',

                    '{{if false}}',
                    '<img src="{{user.image}}" class="hw-img" />',
                    '{{else}}',
                    '<img src="../../image/haiwai1.png" class="hw-img" />',
                    '{{/if}}',


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
                '<em>点击注册表示您同意海外同城的<a target="_blank" href="../help/terms.html">使用协议</a>和<a href="../help/privacy.html" target="_blank">隐私保护协议</a></em>',
                '<p>已有海外帐户？<b class="js_toLogin">直接登录</b></p>'
            ].join('');
            this.jq.box.html(h);
        },

        setAfterLoginBox : function(){
            var h = '<a href="../mybiz/createStore.html" style="margin-top: 200px;" class="hw-btn hw-blue-btn">我是商家，创建店铺</a>';

            this.jq.box.html(h);
        },

        getData : function(box, data, next){
            var user = KG.user.get();
            var isLogin = user.isLogin;
            next({
                isLogin : isLogin,
                user : user
            });
        },

        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_toReg', this.setRegBox.bind(this));
            this.elem.on('click', '.js_toLogin', this.setLoginBox.bind(this));

            this.elem.on('click', '.js_login', function(e){
                var o = $(this);
                var data = {
                    username  : self.jq.box.find('.js_email').val(),
                    password : self.jq.box.find('.js_pwd').val()
                };

                if(!data.username){
                    util.toast.showError('请输入邮箱');
                    return false;
                }
                if(!data.password){
                    util.toast.showError('请输入密码');
                    return false;
                }

                util.dom.loadingButton(o, true);
                KG.user.login(data, function(user){
                    util.dom.loadingButton(o, false);

                    if(util.url.param('redirect_url')){
                        location.href = util.url.param('redirect_url');
                    }
                    else{
                        location.href = '../mybiz/index.html';
                    }

                }, function(err){
                    util.dom.loadingButton(o, false);
                    util.toast.showError(err);
                });
            });

            this.elem.on('click', '.js_reg', function(e){
                var o = $(this);
                var data = {
                    email : self.jq.box.find('.js_email').val(),
                    password : self.jq.box.find('.js_pwd').val(),
                    confirm_password : self.jq.box.find('.js_pwd2').val()
                };
                if(!data.email){
                    util.toast.showError('请输入邮箱');
                    return false;
                }
                if(!util.validate.password(data.password)){
                    util.toast.showError('密码格式不正确');
                    return false;
                }
                if(data.password !== data.confirm_password){
                    util.toast.showError('二次输入的密码不一致');
                    return false;
                }

                util.dom.loadingButton(o, true);
                KG.user.register(data, function(flag, rs){

                    if(flag){
                        var sd = {
                            username : data.email,
                            password : data.password
                        };
                        KG.user.login(sd, function(){
                            util.dom.loadingButton(o, false);
                            location.href = '../mybiz/createStore.html';
                        }, function(err){

                            util.dom.loadingButton(o, false);
                            util.toast.showError(err);
                        });
                    }
                    else{
                        util.dom.loadingButton(o, false);
                        util.toast.showError(rs);
                    }
                });
            });

        },

        initEnd : function(){
            if(!this.data.isLogin){
                this.setRegBox();
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

    KG.Class.define('HWLandingPageHeader', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<nav class="kg-header-comp">',
                    '<div class="container" id="js_header_comp">',

                    '<a class="logo" href="/"></a>',

                    '<h1 style="font-weight:400;font-size: 36px;color: #f4a62a;line-height: 50px;margin-left:' +
                    ' 150px;position:relative;top:-4px;">商家中心</h1>',

                '{{if user.isLogin}}',
                '<div class="right">',

                '{{if user.has_biz}}',
                '<div class="dropdown" style="margin-right: 40px;">',
                '<button id="js_right_dd_1" data-href="../mybiz/index.html" data-hover="dropdown" type="button"' +
                ' data-toggle="dropdown"' +
                ' aria-haspopup="true"' +
                ' aria-expanded="false">',
                '<img src="../../image/aa.png" />',
                '<span>店铺管理</span>',
                '</button>',
                '<div class="dropdown-menu" aria-labelledby="js_right_dd_1">',
                '<a href="../mybiz/index.html">我的店铺</a>',
                '<a href="../mybiz/coupon.html">店铺优惠</a>',
                '<a href="../mybiz/article.html">店铺文章</a>',
                '</div>',
                '</div>',
                '{{/if}}',

                '<div class="dropdown">',
                '<button id="js_right_dd_2" data-href="../myfav/list.html" data-hover="dropdown" class="c2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                '<img src="{{user.image}}" />',
                '<span>帐号管理</span>',
                '</button>',
                '<div class="dropdown-menu" aria-labelledby="js_right_dd_2">',
                '<a style="border-bottom:1px dashed #ebebeb;" href="../mycount/info.html">'+(KG.user.get('nick')||KG.user.get('email'))+'</a>',
                '<a href="../myfav/list.html">我的收藏</a>',
                '<a href="../mycoupon/list.html">我的优惠</a>',
                '<a href="../mysys/index.html">系统消息</a>',
                '<a href="../mycount/info.html">账户设置</a>',
                '<a class="js_logout" href="javascript:void(0)">退出登录</a>',
                '</div>',
                '</div>',
                '{{/if}}',

                    '</div><!-- /.container-fluid -->',
                '</nav>'
            ].join('');
        },
        getData : function(box, data, next){
            next({
                user : KG.user.get()
            });
        },
        initEvent : function(){
            this.elem.find('button[data-href]').click(function(){
                var href = $(this).data('href');
                location.href = href;
                return false;
            });
            this.elem.on('click', '.js_logout', function(){
                KG.user.logout();
            });
        },
        initEnd : function(){
            this.elem.find('[data-hover="dropdown"]').dropdownHover();
        }
    });

})();