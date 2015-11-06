'use strict';

HW.App.factory('$user', [
    '$helper',
    '$rootScope',
    '$ionicModal',
    function($helper, $rootScope, $ionicModal){
        /*
         * 和用户相关的数据
         * */
        var user = {
            id : '',
            username : '',
            password : '',
            nickname : '',
            email : '',
            birthday : '',
            address : '',
            sex : '',
            region_tree : '',
            location : '',
            phone : '',

            otherEmail : '',
            career : '',
            signature : '',

            token : '',

            isLogin : false,

            image : '',

            currentCity : ''
        };

        var modal = null,
            modalSetting = {},
            modalScope = null;

        var F = {
            init : function(){
                //先从storage中取出数据
                var data = $helper.data.getCurrentUser();
                if(!data){

                    HW.user.reset();
                    F.initModal();
                }
                else{
                    util.extend(user, data);
                    HW.user.check(function(){
                        user.isLogin = true;
                    }, function(){
                        HW.user.reset();
                    });

                }

                var tmp = HW.helper.data.getCurrentUser();
                user = util.extend(user, tmp||{});

                util.log('currentUser is init end');
            },

            initModal : function(){
                if(modalScope) return;
                modalScope = $rootScope.$new();



                $ionicModal.fromTemplateUrl('tpl/login-modal.html', {
                    scope : modalScope,
                    focusFirstInput : true,
                    animation : 'slide-in-up'
                }).then(function(obj){
                    modal = obj;
                });

                modalScope.username = user.username;
                modalScope.password = user.password;

                modalScope.style = {
                    top : util.getStatusBarHeight()+'px'
                };

                util.extend(modalScope, {
                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide();
                        modal.remove();
                        modal = null;
                        modalScope = null;
                    },
                    loginSuccessCallback : function(user){
                        $helper.toast('登录成功');
                        modalScope.closeModal();

                        modalSetting.loginSuccessCallback(user);
                    }
                });

                //Cleanup the modal when we're done with it!
                modalScope.$on('$destroy', function() {
                    modal.remove();
                });

            },

            showModal : function(opts){
                modalSetting = opts;
                if(!modal){
                    this.initModal();
                    util.delay(function(){
                        F.showModal(opts);
                    }, 200);
                }
                else{

                    modal.show();
                }
            }
        };

        var out = {
            get : function(key){
                if(util.isNull(user.isLogin)){
                    F.init();
                }

                if(key && util.isString(key)){
                    return user[key] || null;
                }


                return user;
            },

            showLoginModal : function(opts){
                opts = util.extend({
                    loginSuccessCallback : util.noop,
                    loginErrorCallback : util.noop
                }, opts||{});

                F.showModal(opts);
            },
            closeLoginModal : function(){
                modalScope.closeModal();
            },

            set : function(key, val){
                if(arguments.length===1 && util.isObject(key)){
                    //如果只有一个参数并且是object，则和user合并
                    util.extend(user, key);

                    if(key['region_tree']){
                        //处理location

                        var tmp = util.map(key['region_tree'], function(item){
                            item.id = item.pk_id;
                            return item;
                        });

                        user['location'] = util.map(tmp, function(item){
                            return item.name;
                        }).join(' , ');
                        user['region_tree'] = tmp.reverse();

                    }
                }
                else if(util.isString(key) && !util.isUndefined(val)){
                    //如果是key value，则放到user中
                    user[key] = val;
                }

                HW.helper.data.saveCurrentUser(user);
                return user;
            },

            setWithWeixinLogin : function(data){
                this.set({
                    nickname : data.nickname,
                    sex : data.sex===1?'男':'女',
                    location : data.city,
                    image : data.headimgurl,
                    isLogin : true
                });
            },

            reset : function(){

                util.each(user, function(item, key){
                    if(key === 'username' || key === 'password') return;

                    item = null;
                });
                user.isLogin = false;


                HW.helper.data.saveCurrentUser(user);
            },

            login : function(opts, callback, errorFn){
                errorFn = errorFn || util.noop;
                var self = this;

                var email = opts.username,
                    pwd = opts.password;

                if(!email){
                    HW.helper.toast('邮箱格式错误');
                    return;
                }
                if(!pwd){
                    HW.helper.toast('密码格式错误');
                    return;
                }

                HW.helper.loading.show();
                HW.request.login({
                    username : email,
                    password : pwd
                }, function(rs, status){
                    HW.helper.loading.hide();
                    if(!status){
                        //login faith
                        HW.helper.alert(rs);
                        errorFn();
                        return false;
                    }

                    //login success
                    self.set(rs);
                    self.set('id', rs['pk_id']);
                    self.set('password', pwd);
                    self.set('isLogin', true);

                    //get user info
                    var uid = self.get('id');
                    HW.request.getUserDetailInfo({
                        userid : uid
                    }, function(data, flag){
                        if(flag && data[uid]){
                            var ud = data[uid];
                            self.set(ud);
                            self.set('nickname', ud.nick);
                            self.set('phone', ud.tel);
                            self.set('image', HW.config.APPROOT + ud['avatar_url']);
                            self.set('username', email);

                            callback(self.get());
                        }
                    });



                });


            },

            reg : function(opts, success, error){
                error = error || util.noop;

                var self = this;

                var email = opts.username,
                    pwd = opts.password,
                    pwd2 = opts.password2;

                if(!email){
                    HW.helper.toast('邮箱格式错误');
                    return;
                }
                if(!pwd){
                    HW.helper.toast('密码格式错误');
                    return;
                }
                if(pwd.length < 6){
                    HW.helper.toast('密码不能少于6位');
                    return;
                }
                if(pwd !== pwd2){
                    HW.helper.toast('二次输入的密码不一致');
                    return;
                }

                HW.request.register({
                    email : email,
                    password : pwd,
                    password2 : pwd2
                }, function(rs, flag){
                    if(flag){
                        HW.helper.toast('注册成功');
                        self.set('username', email);
                        self.set('email', email);
                        self.set('password', pwd);
                        success();
                        return;
                    }

                    if(!flag){
                        HW.helper.toast(rs);
                        return;
                    }

                });

            },

            check : function(okFn, errorFn){
                errorFn = errorFn || util.noop;
                var self = this;
                if(user.isLogin && user.token){
                    HW.request.checkLogin({
                        token : user.token
                    }, function(rs, flag){
                        if(flag){

                            okFn();
                        }
                        else{
                            self.reset();

                            errorFn();
                        }
                    });
                }
            },

            logout : function(okFn, errorFn){
                errorFn = errorFn || util.noop;

                var self = this;
                HW.request.logout({
                    token : self.get('token')
                }, function(rs, flag){
                    if(flag){
                        HW.helper.alert('退出成功');

                        self.reset();
                        okFn();
                    }
                });
            }
        };


        HW.user = out;
        F.init();
        return out;
    }
]);