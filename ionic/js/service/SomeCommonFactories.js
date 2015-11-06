'use strict';

HW.App.factory('FindStoreCheckModalFactory', [
    '$ionicModal',
    '$rootScope',
    'FindStoreCheckPhoneModalFactory',
    '$user',
    '$state',
    'WelcomeToNewStore',

    function($ionicModal, $rootScope, FindStoreCheckPhoneModalFactory, $user, $state, WelcomeToNewStore){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                $ionicModal.fromTemplateUrl(util.getTplFile('find-store-check-modal'), {
                    scope : modalScope,
                    backdropClickToClose : false,
                    hardwareBackButtonClose : false,
                    animation : 'slide-in-up'
                }).then(function(obj){
                    modal = obj;
                    callback();
                });

                util.extend(modalScope, {
                    list : modalConfig.list,
                    //store : modalConfig.store,
                    current : 1,

                    btnYes : function(){
                        if($user.get('isLogin')){
                            var bizid = modalScope.list[modalScope.current-1].id;

                            FindStoreCheckPhoneModalFactory.showModal({
                                submitCallback : function(){
                                    //确认，关联店铺
                                    HW.helper.loading.show();
                                    HW.request.makeSureStore({
                                        userid : $user.get('id'),
                                        bizid : bizid
                                    }, function(rs, flag){
                                        HW.helper.loading.hide();
                                        if(flag){
                                            modalScope.closeModal();
                                            //HW.helper.goPath('/home/store-detail/'+rs.entityID);

                                            HW.helper.reload();

                                            //显示认领成功的提示信息
                                            util.delay(function(){
                                                WelcomeToNewStore.showModal({
                                                    storeId : rs.entityID
                                                });
                                            }, 500);
                                        }
                                        else{
                                            HW.helper.alert('认领失败');
                                        }
                                    });



                                }
                            });
                        }
                        else{
                            $user.showLoginModal({});
                        }
                    },

                    btnNo : function(){
                        modalScope.current++;
                        HW.helper.goPath('/home/store-detail/'+modalScope.list[modalScope.current-1].id);
                    },

                    toCreateStorePath : function(){

                        HW.helper.goPath('/home/baseinfo/tmp_biz/'+util.cache.get('tmp_biz_id'));

                        modalScope.closeModal();
                    },

                    openModal : function(){
                        modal.show();

                    },
                    closeModal : function(){
                        modal.hide();
                        modal.remove();

                        modal = modalScope = null;
                    }
                });


            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();

                    HW.helper.goPath('/home/store-detail/'+modalScope.list[modalScope.current-1].id);
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    list : [],
                    store : {}
                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.hide();
                }
            }
        };

        return out;
    }
]);

HW.App.factory('FindStoreCheckPhoneModalFactory', [
    '$ionicModal',
    '$rootScope',

    function($ionicModal, $rootScope){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                modalScope.value = {};
                $ionicModal.fromTemplateUrl(util.getTplFile('find-store-checkphone-modal'), {
                    scope : modalScope,
                    //backdropClickToClose : false,
                    hardwareBackButtonClose : false,
                    animation : 'slide-in-up'
                }).then(function(obj){

                    modal = obj;

                    callback();
                });

                util.extend(modalScope, {


                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide().then(function(){
                            modalScope.removeModal();
                        });

                    },

                    removeModal : function(){
                        if(!modal) return;
                        modal.remove && modal.remove();
                        modal = modalScope = null;
                    },

                    sendSmsCode : function(e){
                        var btn = util.jq(e.target);
                        if(btn.hasClass('hw-disabled')) return false;

                        var phone = modalScope.value.phone;
                        console.log(modalScope.value);
                        if(!phone){
                            HW.helper.toast('电话号码格式错误');
                            return;
                        }

                        btn.addClass('hw-disabled');
                        HW.request.sendSmsCode({
                            number : phone
                        }, function(rs, flag){
                            if(flag){
                                try{
                                    util.delay(function(){
                                        btn.removeClass('hw-disabled');
                                    }, 5000);
                                }catch(err){}
                                HW.helper.toast(rs);
                            }
                            else{
                                HW.helper.toast(rs);
                                btn.removeClass('hw-disabled');
                            }




                        })
                    },


                    submit : function(){
                        var code = modalScope.value.code,
                            phone = modalScope.value.phone;

                        if(!code){
                            HW.helper.toast('验证码格式错误');
                            return;
                        }

                        HW.request.verifySmsCode({
                            number : phone,
                            code : code
                        }, function(rs, flag){

                            if(flag){
                                //成功以后回调
                                modalScope.removeModal();
                                modalConfig.submitCallback();
                            }
                            else{
                                HW.helper.toast(rs);
                            }


                        });


                    }
                });


            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    submitCallback : util.noop

                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.remove();
                }
            }
        };

        return out;
    }
]);


HW.App.factory('PubStoreModalFactory', [
    '$ionicModal',
    '$rootScope',

    function($ionicModal, $rootScope){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                $ionicModal.fromTemplateUrl('tpl/publish-store-modal.html', {
                    scope : modalScope,
                    //backdropClickToClose : false,
                    animation : 'slide-in-right'
                }).then(function(obj){
                    modal = obj;
                    callback();
                });

                util.extend(modalScope, {

                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide();
                    },

                    removeModal : function(){
                        if(!modal) return;
                        modal.remove();
                        modal = modalScope = null;
                    },
                    publishCallback : function(){
                        modalScope.closeModal();
                    }

                });


            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    submitCallback : util.noop

                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.remove();
                }
            }
        };

        return out;
    }
]);

HW.App.factory('PubArticleModalFactory', [
    '$ionicModal',
    '$rootScope',

    function($ionicModal, $rootScope){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                $ionicModal.fromTemplateUrl(util.getTplFile('publish-article-modal'), {
                    scope : modalScope,
                    //backdropClickToClose : false,
                    animation : 'slide-in-right'
                }).then(function(obj){
                    modal = obj;
                    callback();
                });

                modalScope.data = {
                    imgList : []
                };

                util.extend(modalScope, {

                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide();
                        modalScope.removeModal();
                    },

                    removeModal : function(){
                        if(!modal) return;
                        modal.remove();
                        modal = modalScope = null;
                    },

                    publish : function(){
                        var data = modalScope.data;


                        //if(data.category == '-1'){
                        //    HW.helper.toast('请选择文章分类');
                        //    return;
                        //}
                        if(!data.title){
                            HW.helper.toast('请输入文章标题');
                            return;
                        }
                        if(!data.msgbody){
                            HW.helper.toast('请输入文章内容');
                            return;
                        }

                        //biz
                        //data.biz = [];
                        //util.each(data.bizlist, function(item){
                        //    if(item.select){
                        //        data.biz.push(item.biz_id);
                        //    }
                        //});
                        if(!data.biz){
                            HW.helper.toast('请选择要发布的店铺');
                            return;
                        }
                        data.biz = [data.biz];

                        console.log(data);

                        HW.helper.loading.show();
                        HW.request.publishArticle({
                            userid : HW.user.get('id'),
                            category_id : data.category,
                            title : data.title,
                            msgbody : data.msgbody,
                            bizlist : data.biz,
                            token : HW.user.get('token')
                        }, function(rs){
                            HW.helper.loading.hide();
                            if(rs.id){
                                HW.helper.toast('发布成功');
                                if(modalConfig.submitCallback){
                                    modalConfig.submitCallback({
                                        id : rs.id,
                                        bizid : data.biz[0]
                                    });
                                }
                                else{
                                    HW.helper.goPath('/home/article/'+data.biz[0]+'/'+rs.id);
                                }

                                modalScope.closeModal();
                            }

                        });


                    }

                });

                //init data
                HW.request.getArticleCategoryList({}, function(rs){
                    modalScope.data.categorylist = rs;
                    modalScope.data.category = '-1';
                });

                //get list
                HW.request.getHomeStoreListData({
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(list){
                    if(!modalScope) return false;
                    modalScope.data.bizlist = list;

                    if(modalConfig.storeId){
                        var tmp = util.find(modalScope.data.bizlist, function(item){
                            return item.biz_id === modalConfig.storeId;
                        });
                        if(tmp){
                            tmp.select = true;
                            modalScope.data.biz = tmp.biz_id;
                        }
                        else{
                            //modalScope.data.bizlist[0].select = true;
                            modalScope.data.biz = modalScope.data.bizlist[0].biz_id;
                        }
                    }
                    else{
                        //modalScope.data.bizlist[0].select = true;
                        modalScope.data.biz = modalScope.data.bizlist[0].biz_id;
                    }

                });




            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    submitCallback : null,
                    storeId : null

                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.remove();
                }
            }
        };

        return out;
    }
]);

HW.App.factory('PubActionModalFactory', [
    '$ionicModal',
    '$rootScope',
    '$filter',

    function($ionicModal, $rootScope, $filter){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                $ionicModal.fromTemplateUrl(util.getTplFile('pub-action'), {
                    scope : modalScope,
                    //backdropClickToClose : false,
                    animation : 'slide-in-right'
                }).then(function(obj){
                    modal = obj;
                    callback();
                });


                modalScope.data = {
                    imgList : []
                };
                util.extend(modalScope, {
                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide();
                        modalScope.removeModal();
                    },

                    removeModal : function(){
                        if(!modal) return;
                        modal.remove();
                        modal = modalScope = null;
                    },

                    publish : function(){
                        var data = modalScope.data;

                        if(!data.title){
                            HW.helper.toast('请输入活动标题');
                            return;
                        }
                        if(!data.description){
                            HW.helper.toast('请输入活动描述');
                            return;
                        }
                        if(!data.startDate){
                            HW.helper.toast('请选择活动开始时间');
                            return;
                        }
                        if(!data.endDate){
                            HW.helper.toast('请选择活动结束时间');
                            return;
                        }

                        //biz
                        //data.biz = [];
                        //util.each(data.bizlist, function(item){
                        //    if(item.select){
                        //        data.biz.push(item.biz_id);
                        //    }
                        //});
                        if(!data.biz){
                            HW.helper.toast('请选择要发布的店铺');
                            return;
                        }
                        data.biz = [data.biz];


                        var startDate = $filter('date')(data.startDate, "yyyy-MM-dd");
                        var endDate = $filter('date')(data.endDate, "yyyy-MM-dd");

                        //TODO imgList需要处理，现在逻辑不对

                        HW.helper.loading.show();
                        HW.request.publishAction({
                            userid : HW.user.get('id'),
                            bizid : '',
                            title : data.title,
                            description : data.description,
                            bizlist : data.biz,
                            startDate : startDate,
                            endDate : endDate,
                            token : HW.user.get('token'),
                            imgList : data.imgList || null
                        }, function(rs, flag){
                            if(flag){
                                HW.helper.toast('发布成功');
                                if(modalConfig.submitCallback){
                                    modalConfig.submitCallback({
                                        id : rs,
                                        bizid : data.biz[0]
                                    });
                                }
                                else{
                                    HW.helper.goPath('/home/action-detail/'+data.biz[0]+'/'+rs);
                                }
                                modalScope.closeModal();
                            }

                            HW.helper.loading.hide();
                        });
                    }

                });




                //get list
                HW.request.getHomeStoreListData({
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(list){
                    if(!modalScope) return false;
                    modalScope.data.bizlist = list;

                    if(modalConfig.storeId){
                        var tmp = util.find(modalScope.data.bizlist, function(item){
                            return item.biz_id === modalConfig.storeId;
                        });
                        if(tmp){
                            tmp.select = true;
                            modalScope.data.biz = tmp.biz_id;
                        }
                        else{
                            //modalScope.data.bizlist[0].select = true;
                            modalScope.data.biz = modalScope.data.bizlist[0].biz_id;
                        }
                    }
                    else{
                        modalScope.data.biz = modalScope.data.bizlist[0].biz_id;
                    }
                });


            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    submitCallback : null,
                    storeId : null

                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.remove();
                }
            }
        };

        return out;
    }
]);


HW.App.factory('WelcomeToNewStore', [
    '$ionicModal',
    '$rootScope',

    function($ionicModal, $rootScope){

        var modalScope = null,
            modalConfig = {},
            modal = null;

        var F = {
            initModal : function(callback){
                modalScope = $rootScope.$new();
                modalScope.value = {};
                $ionicModal.fromTemplateUrl(util.getTplFile('WelcomeToNewStore'), {
                    scope : modalScope,
                    //backdropClickToClose : true,
                    hardwareBackButtonClose : false,
                    animation : 'none'
                }).then(function(obj){
                    modal = obj;
                    callback();
                });

                util.extend(modalScope, {

                    goToManage : function(e){

                        e.stopPropagation();
                        //modalScope.hide();
                        modalScope.removeModal();

                        HW.helper.goPath('/home/store-manage/'+modalConfig.storeId);
                    },


                    openModal : function(){
                        modal.show();
                    },
                    closeModal : function(){
                        modal.hide();
                    },

                    removeModal : function(){
                        if(!modal) return;
                        modal.remove();
                        modal = modalScope = null;
                    }


                });


            },
            showModal : function(config){
                modalConfig = config;

                if(modal){
                    return modal.show();
                }

                this.initModal(function(){
                    modal.show();
                });
            }
        };

        var out = {
            showModal : function(opts){
                opts = util.extend({
                    storeId : null,

                }, opts||{});

                F.showModal(opts);
            },
            hideModal : function(){
                if(modal){
                    modal.remove();
                }
            }
        };

        return out;
    }
]);