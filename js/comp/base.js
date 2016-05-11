
'use strict';

(function(){
    KG.Class.define('BaseComponent', {
        _init : function(box, data, config){
            var self = this;
            this.box = box;
            this.config = config || {};

            //box.html('loading');

            this._initProp();
            this.initStart();
            this.getData(box, data, function(rs){
                self.data = rs;

                self.initVar();
                self._initView();

                self._initEvent();
                self._initEnd();


                //处理input的placeholder属性为focus blur的交互方式
                //TODO 去掉这种处理方式
                self.doProcessPlaceholder();
            });



        },
        doProcessPlaceholder : function(){
            this.elem.find('input[placeholder]').add(this.elem.find('textarea[placeholder]')).each(function(){
                var o = $(this);
                var tmp = o.attr('placeholder');
                o.focus(function(){
                    var val = o.val();
                    tmp = o.attr('placeholder') || tmp;
                    if(!val){
                        o.removeAttr('placeholder');
                    }
                }).blur(function(){
                    var val = o.val();
                    if(!val){
                        o.attr('placeholder', tmp);
                    }
                });

            });
        },
        getTemplate : function(){},
        initVar : function(){},
        _initView : function(){
            this.initView();
            this.html = template.compile(this.getTemplate())(this.data);
            this.elem = $(this.html);

            //TODO 以后需要关注这里的体验和性能
            //如果内部包含comp，就开始初始化
            KG.component.init(this.elem);

            this.jq = util.extend(this.setJqVar(), this.callParent('setJqVar'));
        },

        /*
        * 用于定义一些jq的变量到 this.jq 中，方便后续方法全局使用
        * */
        setJqVar : function(){
            return {};
        },

        _initEvent : function(){
            this.initEvent();

            //listen publish message
            util.message.register(this.__name, this.registerMessage.bind(this));
        },
        _initEnd : function(){
            this.elem.data('kg-obj', this);

            var style = this.box.attr('style'),
                cls = this.box.attr('class');
            var param = this.box.attr('param');

            this.elem.attr('style', style);
            this.elem.addClass(cls);
            this.elem.attr('param', param);
            this.box.replaceWith(this.elem);


            this.initEnd();
        },

        getData : function(box, data, callback){
            callback.call(this, {});
        },

        _initProp : function(){
            var prop = util.extend(this.defineProperty(), this.callParent('defineProperty'));

            var rs = {},
                box = this.box;
            util.each(prop, function(item, key){
                item = item || {};

                var val = box.data(key);
                rs[key] = util.isUndefined(val)
                    ? (item.defaultValue)
                    : (util.isFunction(item.getter) ? item.getter(val) : val);
            });

            this.prop = rs;
        },


        /*
        * 定义所有的属性 自动收集 data-key 格式的属性到 this.prop中
        * @return {key : {  }
        *   defaultValue 默认value
        *   getter 可以格式化返回值
        *
        * */
        defineProperty : function(){
            return {};
        },


        initView : util.noop,
        initEnd : util.noop,
        initEvent : util.noop,
        registerMessage : util.noop,
        initStart : util.noop
    });

    KG.Class.define('Header', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){

            var R = [
                '<div class="dropdown-menu" aria-labelledby="js_right_dd_2">',
                '<a style="border-bottom:1px dashed #ebebeb;" href="../mycount/info.html">'+(KG.user.get('nick')||KG.user.get('email'))+'</a>',
                '<a href="../myfav/list.html">我的收藏</a>',
                '<a href="../mycoupon/list.html">我的领取</a>',
                '<a href="../mysys/index.html">系统消息{{if user.system_msg}}({{user.system_msg}}){{/if}}</a>',
                '<a href="../mycount/info.html">帐号设置</a>',
                '<a class="js_logout" href="javascript:void(0)">退出登录</a>'
            ].join('');

            return [
                '<nav class="kg-header-comp" id="js_header_comp">',
                    '<div class="container">',

                    '<a class="logo" href="/"></a>',
                    '<div class="hw-loc js_loc" style="display: none;">',
                        '<span></span>',
                        '<i class="icon fa fa-caret-down"></i>',
                    '</div>',

                    '<div class="input-group search js_search">',
                        '<span class="input-group-addon hand js_tosearch"><i class="icon"></i></span>',
                        '<input type="text" class="form-control" data-placeholder="搜索本地店铺，专家服务…">',
                    '</div>',

                '{{if user.isLogin && user.has_biz}}',
                '<div class="right">',

                    '<div class="dropdown" style="margin-right: 40px;">',
                    '<button data-href="../mybiz/index.html" id="js_right_dd_1" type="button" data-toggle="dropdown"' +
                    ' data-hover="dropdown" aria-haspopup="true" aria-expanded="false">',
                        '<img src="../../image/aa.png" />',
                        '<span>店铺管理</span>',
                    '</button>',
                    '<div class="dropdown-menu" aria-labelledby="js_right_dd_1">',
                    '<a href="../mybiz/index.html">我的店铺</a>',
                    '<a href="../mybiz/coupon.html">店铺优惠</a>',
                    '<a href="../mybiz/article.html">店铺文章</a>',
                    '</div>',
                    '</div>',

                    '<div class="dropdown">',
                    '<button data-href="../myfav/list.html" id="js_right_dd_2" class="c2" type="button" data-toggle="dropdown" data-hover="dropdown" aria-haspopup="true" aria-expanded="false">',
                    '<img src="{{user.image}}" />',
                    '{{if user.system_msg}}<span class="badge hw-badge">{{user.system_msg}}</span>{{/if}}',
                    '<span>帐号管理</span>',
                    '</button>',
                    R,
                    '</div>',
                '</div>',
                '{{else if user.isLogin && !user.has_biz}}',
                '<div class="right">',

                    '<a style="float: left;margin-right: 20px;" class="hw-light-btn hw-btn" href="../site/landing.html">立即建店</a>',

                    '<div style="top:3px;" class="dropdown">',
                    '<button data-href="../myfav/list.html" id="js_right_dd_2" class="c2" type="button" data-toggle="dropdown" data-hover="dropdown" aria-haspopup="true" aria-expanded="false">',
                    '<img src="{{user.image}}" />',
                    '{{if user.system_msg}}<span class="badge hw-badge">{{user.system_msg}}</span>{{/if}}',
                    '<span>帐号管理</span>',
                    '</button>',
                    R,
                    '</div>',
                '</div>',
                '{{else}}',
                '<div class="right">',
                    '<a class="hw-light-btn hw-btn" href="../site/landing.html">立即建店</a>',
                    '<a href="javascript:void(0)" class="hw-a js_login">登录</a>',
                    '<a href="javascript:void(0)" class="hw-a js_reg">注册</a>',

                '</div>',
                '{{/if}}',

                '</div>',

                '</div>',
                '</nav>'
            ].join('');
        },

        getData : function(box, data, next){
            var user = KG.user.get();
            next({
                user : user
            });
        },

        initEvent : function(){
            if(this.data.user.isLogin){
                this.initEventByAfterLogin();
            }
            else{
                this.initEventByBeforeLogin();
            }

            var searchBox = this.elem.find('.js_search');
            searchBox.find('input').keyup(function(e){
                if(e.keyCode !== 13){
                    return false;
                }

                var val = $(this).val();
                if(!val){
                    return false;
                }

                location.href = '../site/search.html?keyword='+val;
            });
            searchBox.find('.js_tosearch').click(function(){
                var val = searchBox.find('input').val();
                if(!val){
                    searchBox.find('input').focus();
                    return false;
                }

                location.href = '../site/search.html?keyword='+val;
            });

            this.elem.find('.js_loc').click(function(){
                util.dialog.showSelectLocationRegion();
            });

            this.elem.find('button[data-href]').click(function(){
                var href = $(this).data('href');
                location.href = href;
                return false;
            });
        },

        initEventByAfterLogin : function(){
            this.elem.find('.js_logout').click(function(){
                KG.user.logout();
            });
        },

        initEventByBeforeLogin : function(){
            this.elem.find('.js_login').click(function(){
                util.dialog.showLoginBox();
            });
            this.elem.find('.js_reg').click(function(){
                util.dialog.showRegBox();
            });
        },

        initEnd : function(){
            var x = KG.data.get('keyword');
            if(x){
                this.elem.find('.js_search').find('input').val(x);
            }

            var regionName = util.cookie.get('region_cn');
            if(!regionName){
                regionName = '旧金山湾区';
            }
            this.elem.find('.js_loc').show().find('span').attr('title', regionName).html(regionName);

            this.elem.find('[data-hover="dropdown"]').dropdownHover();

            this.elem.find('input[data-placeholder]').focus(function(){
                var o = $(this);
                if(!o.val() || o.val() === o.data('placeholder')){
                    o.removeClass('blur').val('');
                }

            }).blur(function(){
                var o = $(this);
                if(!o.val()){
                    o.addClass('blur').val(o.data('placeholder'));
                }

            }).blur();


        },

        getCurrentLocation : function(){
            var name = this.elem.find('.js_loc').find('span').html();
            return {
                name : name
            };
        }
    });

    KG.Class.define('HeadingNav', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<nav class="kg-header-nav-comp">',
                    '<div class="container">',

                        '<a href="../mybiz/index.html" class="nav js_mybiz">我的店铺</a>',
                        '<a href="../myfav/list.html" class="nav js_myfav">我的收藏</a>',
                        '<a href="../mycoupon/list.html" class="nav js_mycoupon">我的优惠</a>',
                        '<a href="../mysys/index.html" class="nav js_mysys">系统消息</a>',
                        '<a href="../mycount/info.html" class="nav js_mycount">账户</a>',

                    '</div>',
                '</nav>'
            ].join('');
        },
        getData : function(box, data, next){
            var page = KG.data.get('page').split('-');
            page = page[0] || '';

            next({
                page : page
            });
        },
        initEnd : function(){
            var page = this.data.page;
            this.elem.find('.js_'+page).addClass('active');
        }
    });




    KG.Class.define('HWSelectRegionLocation', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-HWSelectRegionLocation">',
                    '{{each list as item index}}',
                    '<button param="{{index}}" class="js_one hw-btn hw-light-btn">{{item.cn}}</button>',

                    '{{/each}}',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){

            KG.request.getHotLocationRegion({}, function(flag, rs){
                var list = [];
                _.each(rs, function(item, key){
                    list.push({
                        id : item.id,
                        cn : item.area_name,
                        name : key
                    });
                });

                var rid = util.cookie.get('region_IP_ID'),
                    rname = util.cookie.get('region_IP_ID_Name');
                if(false && KG.user.get('isLogin')){
                    if(!rid || KG.user.get().subregion_detail.id !== rid){
                        rid = KG.user.get().subregion_detail.id;
                        util.cookie.set('region_IP_ID', rid);
                    }

                    list.push({
                        id : rid,
                        cn : '自动定位',
                        name : 'qita'
                    });

                    next({list : list});
                }
                else{

                    if(rid){
                        list.push({
                            id : rid,
                            cn : '自动定位',
                            name : rname
                        });
                        next({list : list});
                    }
                    else{
                        KG.request.getCurrentRegionByIP({}, function(flag, rs){
                            util.cookie.set('region_IP_ID', rs.pk_id);
                            util.cookie.set('region_IP_ID_Name', rs.name);
                            list.push({
                                id : rs.pk_id,
                                cn : '自动定位',
                                name : rs.name
                            });
                            next({list : list});
                        });
                    }

                }

            });


        },
        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_one', function(){
                var o = $(this),
                    index = o.attr('param'),
                    data = self.data.list[index];

                util.cookie.set('regionID', data.id);
                util.cookie.set('region_name', data.name);
                util.cookie.set('region_cn', data.cn);

                if(index > 13){
                    util.cookie.set('region_cn', data.name);
                }

                KG.request.setHotLocationRegion({
                    regionID : data.id
                }, function(flag, rs){
                    location.reload();
                });

            });
        },
        initEnd : function(){
            //var id = util.cookie.get('regionID');
            //
            //if(!id){
            //    id = util.cookie.get('region_IP_ID');
            //}

            var name = KG.component.getObj($('#js_header_comp')).getCurrentLocation().name;

            var index = 0;
            if(name){
                index = _.findIndex(this.data.list, function(one){
                    return one.cn.toString() === name;
                });
                if(index < 0){
                    index = this.data.list.length-1;
                }
            }
            this.elem.find('.js_one').eq(index).addClass('active');



        }
    });

    KG.Class.define('HWBaseLoginAddPassword', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-HWBaseLoginAddPassword">',
                    '<div class="hw-img"><img src="{{user.image}}"/></div>',
                    '<p>{{user.email}}</p>',
                    '<h4>欢迎您！<br/>成为商家用户，请设置密码</h4>',
                    '<div role="BaseInput" data-type="password" class="js_pwd" placeholder="密码（至少6个字符）"></div>',
                    '<button class="hw-btn hw-blue-btn js_btn">确定</button>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var user = KG.user.get();
            next({
                user : user
            });
        },
        initEvent : function(){
            var self = this;
            this.elem.find('.js_btn').click(function(){
                var pwd = KG.component.getObj(self.elem.find('.js_pwd')),
                    val = pwd.getValue();
                if(!val){
                    pwd.showError('请输入密码');
                    pwd.focus();
                    return false;
                }
                else if(!util.validate.password(val)){
                    pwd.showError('密码不能少于6位');
                    pwd.focus();
                    return false;
                }
                else{
                    pwd.showError();
                }

                KG.request.setUserPassword({
                    password : val
                }, function(flag, rs){
                    if(flag){
                        util.dialog.setHiddenDialogFn(null);
                        util.toast.alert('设置成功');
                    }else{
                        alert(rs);
                    }
                });
            });
        },
        initEnd : function(){
            util.dialog.setHiddenDialogFn(function(){
                location.href = '../site/landing.html';
            });

        }
    });

    KG.Class.define('HWBaseLoginAddEmailAndPassword', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-HWBaseLoginAddPassword">',
                '<div class="hw-img"><img src="{{user.image}}"/></div>',
                '<h4>欢迎您！<br/>成为商家用户，请绑定邮箱，设置密码</h4>',
                '<div role="BaseInput" class="js_email" placeholder="邮箱"></div>',
                '<div role="BaseInput" data-type="password" class="js_pwd" placeholder="密码（至少6个字符）"></div>',
                '<button class="hw-btn hw-blue-btn js_btn">确定</button>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var user = KG.user.get();
            next({
                user : user
            });
        },
        initEvent : function(){
            var self = this;
            this.elem.find('.js_btn').click(function(){
                var pwd = KG.component.getObj(self.elem.find('.js_pwd')),
                    val = pwd.getValue();

                var email = KG.component.getObj(self.elem.find('.js_email')),
                    el = email.getValue();

                var vu = KG.validate.email(el);
                if(!vu[0]){
                    email.showError(vu[1]);
                    email.focus();
                    return false;
                }
                else{
                    email.showError();
                }

                if(!val){
                    pwd.showError('请输入密码');
                    pwd.focus();
                    return false;
                }
                else if(!util.validate.password(val)){
                    pwd.showError('密码不能少于6位');
                    pwd.focus();
                    return false;
                }
                else{
                    pwd.showError();
                }

                KG.request.addUserEmailAndPassword({
                    email : el,
                    password : val
                }, function(flag, rs){

                    if(flag){
                        util.dialog.setHiddenDialogFn(null);
                        util.toast.alert('设置成功');
                    }else{
                        alert(rs);
                    }
                });
            });
        },
        initEnd : function(){
            util.dialog.setHiddenDialogFn(function(){
                location.href = '../site/landing.html';
            });

            var self = this;
            var email = KG.component.getObj(self.elem.find('.js_email')),
                pwd = KG.component.getObj(self.elem.find('.js_pwd'));

            email.setBlurEvent(function(val){
                var v = KG.validate.email(val);
                if(!v[0]){
                    this.showError(v[1]);
                }
                else{
                    this.showError();
                }
            });

            pwd.setBlurEvent(function(val){
                var v = KG.validate.password(val);
                if(!v[0]){
                    this.showError(v[1]);
                }
                else{
                    this.showError();
                }
            });

        }
    });

    KG.Class.define('HWLoginRegBoxComp', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-loginRegBoxComp">',
                    '<div class="c-tlt">',
                        '<h4><b>加入海外同城</b><b style="margin-left: 85px;">让生活更简单</b></h4>',
                        '<img src="../../image/haiwai1.png" />',
                    '</div>',

                    '<div class="c-left js_left">',

                    '</div>',

                    '<div class="c-right">',
                        '<h4>用以下账号直接登录</h4>',
                        '<a href="javascript:void(0)" class="hw-btn hw-weixin"><i class="icon"></i>微信扫一扫登录</a>',
                        '<a href="javascript:void(0)" data-loading-text="正在登录..." class="hw-btn hw-fb"><i' +
                        ' class="icon"></i>facebook登录</a>',
                    '</div>',

                    '<div class="c-btm">',

                    '</div>',
                '</div>'
            ].join('');
        },

        setJqVar : function(){
            return {
                tlt : this.elem.find('.c-tlt h4 b'),
                left : this.elem.find('.js_left'),
                btm : this.elem.find('.c-btm')
            };
        },

        setLoginBox : function(){
            this.jq.tlt.hide();

            var h = [
                '<h4>登录海外同城</h4>',
                '<div class="c-error"></div>',
                '<div role="BaseInput" data-type="text" class="js_email" placeholder="邮箱" ></div>',
                '<div role="BaseInput" data-type="password" class="js_pwd" placeholder="密码（至少6个字符）" ></div>',
                '<button class="hw-btn hw-blue-btn js_loginBtn">登录</button>',
                '<p>忘记账号或密码？<a href="../mycount/forgetpassword.html">在这里找回</a></p>'
            ].join('');
            this.jq.left.html(h);

            var h1 = [
                '<p>还没有海外帐户？<a class="hw-btn js_toReg">注册</a></p>'
            ].join('');

            this.jq.btm.html(h1);
            this.initLoginBox();
        },
        initLoginBox : function(){
            var self = this;
            KG.component.init(this.jq.left);

            var obj = {
                email : KG.component.getObj(this.jq.left.find('.js_email')),
                pwd : KG.component.getObj(this.jq.left.find('.js_pwd'))
            };

            obj.email.setBlurEvent(function(val){
                if(!val){
                    this.showError(util.const.InputEmail);
                }
                else if(!util.validate.email(val)){
                    this.showError(util.const.InputEmailFormatError);
                }
                else{
                    this.showError();
                }
            });

            obj.pwd.setBlurEvent(function(val){
                if(!val){
                    this.showError(util.const.InputPassword);
                }
                else{
                    this.showError();
                }
            });

            obj.email.setEnterEvent(function(){
                self.elem.find('.js_loginBtn').trigger('click');
            });
            obj.pwd.setEnterEvent(function(){
                self.elem.find('.js_loginBtn').trigger('click');
            });
        },

        setRegBox : function(){
            var h = [
                '<div class="c-error"></div>',
                '<div role="BaseInput" data-type="text" class="js_email" placeholder="邮箱" ></div>',
                '<div role="BaseInput" data-type="password" class="js_pwd" placeholder="密码（至少6个字符）" ></div>',
                '<div role="BaseInput" data-type="password" class="js_pwd2" placeholder="确认密码" ></div>',
                '<button class="hw-btn hw-blue-btn js_regBtn">注册</button>',
                '<p>点击注册表示您同意海外同城的<a target="_blank" href="../help/terms.html">使用协议</a>和<a target="_blank" href="../help/privacy.html">隐私保护协议</a></p>'
            ].join('');

            this.jq.left.html(h);

            this.jq.tlt.show();

            var h1 = [
                '<h6>已有海外帐户？<a href="javascript:void(0)" class="js_toLogin">直接登录</a></h6>'
            ].join('');
            this.jq.btm.html(h1);

            this.initRegBox();
        },

        initRegBox : function(){
            var self = this;
            KG.component.init(this.jq.left);
            var obj = this.getRegisterObj();

            obj.email.setBlurEvent(function(val){
                var v = KG.validate.email(val);
                if(!v[0]){
                    this.showError(v[1]);
                }
                else{
                    this.showError();
                }
            });

            obj.pwd.setBlurEvent(function(val){
                var v = KG.validate.password(val);
                if(!v[0]){
                    this.showError(v[1]);
                }
                else{
                    this.showError();
                }
            });

            obj.pwd2.setBlurEvent(function(val){
                if(val !== obj.pwd.getValue()){
                    this.showError(util.const.PasswordNotEqual);
                }
                else{
                    this.showError();
                }
            });

            obj.email.setEnterEvent(function(){
                self.elem.find('.js_regBtn').trigger('click');
            });
            obj.pwd.setEnterEvent(function(){
                self.elem.find('.js_regBtn').trigger('click');
            });
            obj.pwd2.setEnterEvent(function(){
                self.elem.find('.js_regBtn').trigger('click');
            });
        },

        defineProperty : function(){
            return {
                type : {
                    defaultValue : 'reg'
                }
            };
        },

        initEvent : function(){
            var self = this;
            this.elem.on('click', '.js_toReg', this.setRegBox.bind(this));
            this.elem.on('click', '.js_toLogin', this.setLoginBox.bind(this));

            this.elem.on('click', '.js_regBtn', function(){
                var o = $(this);
                //click reg button
                var obj = self.getRegisterObj();
                var data = self.getRegisterValue();

                var ve = KG.validate.email(data.email);
                if(!ve[0]){
                    obj.email.showError(ve[1]);
                    obj.email.focus();
                    return false;
                }
                else{
                    obj.email.showError();
                }

                var vp = KG.validate.password(data.password);
                if(!vp[0]){
                    obj.pwd.showError(vp[1]);
                    obj.pwd.focus();
                    return false;
                }
                else{
                    obj.pwd.showError();
                }

                if(data.password !== data.confirm_password){
                    obj.pwd2.showError(util.const.PasswordNotEqual);
                    obj.pwd2.focus();
                    return false;
                }
                else{
                    obj.pwd2.focus();
                }


                console.log(data);

                util.dom.loadingButton(o, true);
                KG.user.register(data, function(flag, rs){
                    if(flag){
                        var sd = {
                            username : data.email,
                            password : data.password
                        };
                        KG.user.login(sd, function(){
                            util.dom.loadingButton(o, false);
                            location.reload();
                        }, function(err){
                            util.dom.loadingButton(o, false);
                            util.toast.showError(err);
                        });

                    }
                    else{
                        util.dom.loadingButton(o, false);
                        self.showError(rs);
                    }
                });

            });
            this.elem.on('click', '.js_loginBtn', function(){
                var o = $(this);
                //click login button
                var obj = self.getLoginObj();
                var data = self.getLoginValue();

                var vu = KG.validate.email(data.username);
                if(!vu[0]){
                    obj.email.showError(vu[1]);
                    obj.email.focus();
                    return false;
                }
                else{
                    obj.email.showError();
                }

                var vp = KG.validate.password(data.password);
                if(!vp[0]){
                    obj.pwd.showError(vp[1]);
                    obj.pwd.focus();
                    return false;
                }
                else{
                    obj.pwd.showError();
                }

                util.dom.loadingButton(o, true);
                KG.user.login(data, function(){
                    util.dom.loadingButton(o, false);
                    location.reload();
                }, function(err){
                    util.dom.loadingButton(o, false);
                    self.showError(err);
                });
            });

            this.elem.on('click', '.hw-weixin', function(){
                util.dialog.showWeixinLoginQrCode(location.href);
                return false;
            });
            this.elem.on('click', '.hw-fb', function(){
                var o = $(this);

                o.button('loading');
                util.Facebook.login(function(flag, rs){

                    if(flag){
                        KG.user.getUserDetailWithToken(rs, function(){

                            location.reload();
                            o.button('reset');
                            util.dialog.hide();
                        });
                    }
                    else{
                        o.button('reset');
                        util.toast.showError(rs);
                    }
                });
            });
        },

        showError : function(error){
            var obj = null;
            if(error.indexOf('密码') !== -1){
                obj = KG.component.getObj(this.jq.left.find('.js_pwd'));
            }
            else{
                obj = KG.component.getObj(this.jq.left.find('.js_email'));
            }

            obj.showError(error);
        },

        getLoginObj : function(){
            var obj = {
                email : KG.component.getObj(this.jq.left.find('.js_email')),
                pwd : KG.component.getObj(this.jq.left.find('.js_pwd'))
            };
            return obj;
        },

        getLoginValue : function(){
            var obj = this.getLoginObj();
            var data = {
                username : obj.email.getValue(),
                password : obj.pwd.getValue()
            };
            return data;
        },

        getRegisterObj : function(){
            return {
                email : KG.component.getObj(this.jq.left.find('.js_email')),
                pwd : KG.component.getObj(this.jq.left.find('.js_pwd')),
                pwd2 : KG.component.getObj(this.jq.left.find('.js_pwd2'))
            };
        },

        getRegisterValue : function(){
            var obj = this.getRegisterObj();
            return {
                email : obj.email.getValue(),
                password : obj.pwd.getValue(),
                confirm_password : obj.pwd2.getValue()
            };
        },

        initEnd : function(){
            if(this.prop.type === 'login'){
                this.setLoginBox();
            }
            else if(this.prop.type === 'reg'){
                this.setRegBox();
            }
        }

    });





})();

KG.component = {
    initEach : function(className, box, data){
        data = data || {};
        new (KG.Class.getByName(className))(box, data);
    },

    init : function(box){
        box = box || $('body');
        var elem = box.find('[role]');

        elem.each(function(){
            var one = $(this);

            //表示已经初始化过
            if(one.attr('init-end')) return;

            //表示需要自己初始化
            if(one.attr('init-self')) return;

            var clsName = one.attr('role');
            KG.component.initEach(clsName, one, {});
        });
    },

    initWithElement : function(elem, data, config){
        var clsName = elem.attr('role');
        if(!clsName){
            return;
        }
        return new (KG.Class.getByName(clsName))(elem, data, config);
    },

    getObj : function(elem){
        var obj = elem.data('kg-obj');
        return obj || null;
    }
};


$(function(){

    if(util.url.param('code') && util.url.param('state')==='aaa'){
        //weixin login
        util.showPageLoading(true);
        KG.request.oauthLoginWithWeixinCode({
            code : util.url.param('code')
        }, function(flag, rs){
            util.showPageLoading(false);
            if(flag){
                KG.user.getUserDetailWithToken(rs, function(user){
                    if(true || user.email){
                        location.href = location.href.replace('code='+util.url.param('code'), '').replace('&state=aaa', '');
                        return false;
                    }
                    util.toast.alert('登录成功，请补充资料');
                    _.delay(function(){
                        location.href = '../mycount/info.html';
                    }, 1500);
                });
            }
            else{
                util.toast.showError(rs);
                util.delay(function(){
                    location.href = '../site/index.html';
                }, 2000);
            }
        });

        //util.oauth.weixin(util.url.param('code'));

        return false;
    }


    //check login
    util.showPageLoading(true);
    KG.user.checkLogin(function(){
        var user = KG.user.get();
        if(KG.data.get('needLogin')){
            if(user.isLogin){
                KG.component.init();
            }
            else{

                var url = '../site/index.html';
                if(KG.data.get('needLoginToUrl')){
                    url = KG.data.get('needLoginToUrl');
                }

                location.href = url;
            }
        }
        else{
            KG.component.init();
        }

        //util.delay(function(){
            util.showPageLoading(false);
        //}, 500);

    });


});