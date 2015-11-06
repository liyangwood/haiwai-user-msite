'use strict';

HW.App.controller('HomeIndexCtrl', function($scope, $timeout, $user){

    util.extend($scope, {
        weixinLogin : function(){
            HW.helper.loginWithWeixin(function(data){
                //HW.helper.alert(JSON.stringify(data));

                $user.setWithWeixinLogin(data);
                HW.helper.goPath('/home/store-list');
            });
        },

        clickLogin : function(){
            $user.showLoginModal({
                loginSuccessCallback : function(user){
                    // go to list page
                    HW.helper.goPath('/home/store-list');
                }
            });
        }
    });

    $scope.$on('$ionicView.beforeEnter', function(){
        if($user.get('isLogin')){
            HW.helper.goPath('/home/store-list');
        }
    });

    //$scope.isWeixinInstall = true;
    //$timeout(function(){
    //    HW.helper.checkWeixinInstall(function(rs){
    //        $scope.isWeixinInstall = rs;
    //    });
    //}, 200);




});

HW.App.controller('HomeCreateStoreCtrl', [
    '$scope',
    'FindStoreCheckModalFactory',
    function($scope, FindStoreCheckModalFactory){

        util.extend($scope, {
            store : {},
            createNewStore : function(){

                if(!$scope.store.name){
                    HW.helper.toast('请输入店铺名称');
                    return;
                }

                if(!$scope.store.phone || $scope.store.phone.toString().length !== 10){
                    HW.helper.toast('电话号码格式错误, 应该是10位数字');
                    return;
                }

                if($scope.store.category === -1){
                    HW.helper.toast('请选择类别');
                    return;
                }


                HW.helper.loading.show();
                HW.request.createStoreByStep1({
                    bizname : $scope.store.name,
                    biztel : $scope.store.phone,
                    biztagid : $scope.store.category
                }, function(rs, flag){
                    if(flag){
                        util.cache.set('tmp_biz_id', rs);

                        //根据信息寻找匹配的店铺
                        HW.request.findStoreByStep2({
                            tmp_bizid : util.cache.get('tmp_biz_id')
                        }, function(data, f){
                            HW.helper.loading.hide();

                            if(f){
                                var list = util.map(data, function(item){
                                    var tmp = {
                                        id : item.entityID
                                    };

                                    return tmp;
                                });

                                if(list.length > 0){
                                    //找到了匹配的，进入认领页面
                                    HW.helper.goPath('/home/store-detail/'+list[0].id);

                                    FindStoreCheckModalFactory.showModal({
                                        list : list,
                                        store : {}
                                    });
                                }
                                else{
                                    HW.helper.goPath('/home/baseinfo/tmp_biz/'+util.cache.get('tmp_biz_id'));
                                }
                            }
                            else{
                                //没找到匹配店铺，直接进入创建页面
                                HW.helper.goPath('/home/baseinfo/tmp_biz/'+util.cache.get('tmp_biz_id'));
                            }


                        });

                    }
                });

            }
        });

        var F = {
            init : function(){
                //get service category list
                HW.request.getStoreServiceCategoryList({}, function(data){
                    $scope.serviceListData = util.map(data, function(item){
                        item.id = item.pk_id;
                        return item;
                    });
                    $scope.store.category = -1;
                });
            }
        };

        F.init();
    }
]);



HW.App.controller('HomeInputStoreBaseInfo', [
    '$scope',
    '$user',
    '$stateParams',
    'WelcomeToNewStore',

    function($scope, $user, $stateParams, WelcomeToNewStore){
        var tmp_bizid = $stateParams.tmp_biz_id;

        HW.helper.loading.show();
        HW.request.getTempBizInfo({
            tmp_bizid : tmp_bizid
        }, function(data){
            var tagInfo = data.taginfo.split(',');

            var storeData = {
                name : data.name,
                phone : data.tel,
                tagid : tagInfo[0],
                bizid : tmp_bizid,
                description : data.description,
                region : '',
                region_tree : $user.get('isLogin')?$user.get('region_tree'):[]
            };

            if(data.logo){
                storeData.logo = HW.config.APPROOT+data.logo;
            }

            //根据服务类别获得tag
            HW.request.getStoreTagDetail({
                biztagid : tagInfo[0]
            }, function(rs){
                HW.helper.loading.hide();


                storeData.taglist = util.map(rs, function(item){

                    util.each(tagInfo.slice(1, tagInfo.length), function(key){
                       if(key == item.pk_id){
                           item.active = true;
                           return false;
                       }
                    });

                    item.id = item.pk_id;
                    return item;
                });
                storeData.timeInfo = rs.timeinfo || [];

                $scope.storeData = storeData;
                console.log(storeData);
            });


        });

        $scope.publishCallback = function(store){
            if(!$user.get('isLogin')){
                $user.showLoginModal({
                    loginSuccessCallback : function(){
                        $scope.publishCallback(store);
                    }
                });

                return false;
            }

            console.log(store);

            HW.helper.loading.show();
            HW.request.createNewOrModifyStore({
                tmp_bizid : store.bizid,
                biztagid : store.tagid,
                bizname : store.name,
                address : store.address || '',
                tel : store.phone || '',
                description : store.description || '',
                taglist : store.tagid_list || [],
                timeInfo : store.timeInfo,
                zipcode : store.zipcode,
                state : store.state,
                city : store.city,
                wechat : store.wechat,
                website : store.website
            }, function(rs, flag){
                if(flag){
                    //HW.helper.goPath('/home/store-detail/'+rs.msg);

                    //用 step4 把临时店铺和用户关联起来
                    HW.request.createStoreByStep4({
                        tmp_bizid : rs,
                        userid : $user.get('id'),
                        token : $user.get('token')
                    }, function(result, f){
                        HW.helper.loading.hide();
                        if(f){
                            HW.helper.goPath('/home/store-detail/'+result);

                            //显示高亮信息
                            util.delay(function(){
                                WelcomeToNewStore.showModal({
                                    storeId : result
                                });
                            }, 500);

                        }
                    });

                }
            });
        };

        $scope.publishFn = function(){
            $scope.$broadcast('StoreInfo.Puhlish');
        };
    }
]);

//修改店铺基本信息的页面，注意page和上面的完善临时店铺信息的page是同一个，修改的时候要注意
HW.App.controller('HomeModifyStoreCtrl', [
    '$scope',
    '$user',
    '$stateParams',
    '$ionicNavBarDelegate',

    function($scope, $user, $stateParams, $ionicNavBarDelegate){
        var sid = $stateParams.store_id;

        var store;

        HW.helper.loading.show();
        HW.request.getHomeStoreDetailData({
            userid : $user.get('id'),
            token : $user.get('token'),
            bizid : sid
        }, function(rs){

            store = {
                bizid : sid,
                isStore : true,
                name : rs.name_cn,
                address : rs.address,
                phone : rs.tel,
                tagid : rs.fk_main_tag_id,

                description : rs.briefintro,
                imgList : util.map(rs.files, function(item){
                    item.id = item.pk_id;
                    item.url = HW.config.APPROOT + item.path;
                    return item;
                }),
                timeInfo : rs.timeinfo.unformat,

                region : rs.region || '',
                zipcode : parseInt(rs.zip || ''),
                state : rs.state,
                city : rs.city,
                wechat : rs.wechat,
                website : rs.website
            };

            if(rs.logo){
                store.logo = HW.config.APPROOT + rs.logo.path;
            }

            ////根据服务类别获得tag
            HW.request.getStoreTagDetail({
                biztagid : store.tagid
            }, function(json){
                HW.helper.loading.hide();

                store.taglist = util.map(json, function(item){

                    util.each(rs.tags, function(one){
                        if(one.pk_id == item.pk_id){
                            item.active = true;
                            return false;
                        }
                    });

                    item.id = item.pk_id;
                    return item;
                });

                console.log(store);
                $scope.storeData = store;
            });


        });

        $scope.publishCallback = function(){


            HW.helper.loading.show();
            HW.request.modifyStore({
                userid : $user.get('id'),
                bizid : sid,
                biztagid : store.tagid,
                name : store.name,
                address : store.address || '',
                tel : store.phone,
                briefintro : store.description,
                taglist : store.tagid_list || [],
                //daytime : store.daytime,
                //weektime : store.weektime || [],
                token : $user.get('token'),
                timeInfo : store.timeInfo || [],
                zipcode : store.zipcode,
                state : store.state,
                city : store.city,
                wechat : store.wechat,
                website : store.website
            }, function(rs, flag){
                HW.helper.loading.hide();
                if(flag){
                    HW.helper.toast('修改成功');

                    HW.helper.goPath('/home/store-detail/'+rs);
                }
            });
        };


        $scope.publishFn = function(){
            $scope.$broadcast('StoreInfo.Puhlish');
        };




    }
]);


//查看我的店铺页面
HW.App.controller('HomeStoreListCtrl', [
    '$scope',
    '$user',
    '$state',
    function($scope, $user, $state){

        var F = {
            init : function(){
                //get list data
                HW.helper.loading.show();
                HW.request.getHomeStoreListData({
                    userid : $user.get('id'),
                    token : $user.get('token')
                },function(data){
                    HW.helper.loading.hide();

                    $scope.listData = data || [];

                });
            }
        };


        util.extend($scope, {

            pubAction : function(e){
                if(util.jq(e.target).hasClass('hw-disabled')){
                    return false;
                }

                $scope.fn.publishAction({});
            },
            pubArticle : function(e){
                if(util.jq(e.target).hasClass('hw-disabled')){
                    return false;
                }
                $scope.fn.publishArticle();
            },
            createStore : function(){
                $scope.fn.publishStore({
                    submitCallback : function(){
                        console.log('pub store');
                    }
                });
            },
            goToManagePage : function(item){
                $state.go('tab.home-store-manage', {
                    'store_id' : item.biz_id,
                    storeData : item
                });
            },
            goToReply : function(item, e){
                HW.helper.goPath('/home/store-manage/reply/'+item.biz_id);
                e.stopPropagation();
            },
            goToMessage : function(item, e){
                HW.helper.goPath('/home/message-list/'+item.biz_id);
                e.stopPropagation();
            }
        });


        F.init();
    }
]);


//店铺管理页面
HW.App.controller('HomeStoreManageIndexCtrl', [
    '$scope',
    '$stateParams',
    'StoreDetailFactory',

    function($scope, $stateParams, StoreDetailFactory){
        var sid = $stateParams.store_id;

        HW.helper.loading.show();
        StoreDetailFactory.getData(sid, function(data){
            HW.helper.loading.hide();
            $scope.store = data;
        });


        util.extend($scope, {
            storeId : sid,
            goToStore : function(){
                HW.helper.goPath('/home/store-detail/'+sid);
            },
            pubArticle : function(){
                $scope.fn.publishArticle({
                    storeId : sid
                });
            },
            pubAction : function(){
                $scope.fn.publishAction({
                    storeId : sid
                });
            }
        });
    }
]);


//查看店铺页面
HW.App.controller('HomeStoreDetailCtrl', [
    '$scope',
    '$stateParams',
    'StoreDetailFactory',

    function($scope, $stateParams, StoreDetailFactory){
        var sid = util.url.param('id');
        $scope.storeId = sid;

        $scope.reply = {};


        HW.helper.loading.show();
        StoreDetailFactory.getData(sid, function(data){
            HW.helper.loading.hide();


            $scope.store = data;

            $scope.manageButtonShow = (data.ownerID === HW.user.get('id'));
            $scope.shareOption = {
                type : 'store',
                id : sid
            };


            util.setTitle(data.name_cn||data.name_en);
        });

        $scope.sendComment = function(){
            var val = $scope.reply.value;
            if(!val){
                HW.helper.toast('请输入评论');
                return;
            }

            HW.request.sendComment({
                userid : HW.user.get('id'),
                bizid : sid,
                msg : val,
                dataID : sid,
                token : HW.user.get('token'),
                type : 'store'
            }, function(rs, flag){
                if(flag){
                    HW.helper.toast('回复成功');
                    $scope.store.comments.unshift({
                        id : rs,
                        userinfo : {
                            nick : HW.user.get('nickname'),
                            avatar_url : HW.user.get('image').replace(HW.config.APPROOT, '')
                        },
                        msg : val,
                        datetime : '刚刚'
                    });
                }
                $scope.reply.value = '';
            });
        };

        util.extend($scope, {
            deleteAction : function(id, index){
                HW.request.deleteAction({
                    id : id,
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        $scope.store.events.splice(index, 1);
                    }
                });
            },

            deleteArticle : function(id, index){
                HW.request.deleteArticle({
                    id : id,
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        $scope.store.articles.splice(index, 1);
                    }
                });
            },
            openUrl : function(url){
                if(url){
                    HW.helper.openUrl(url);
                }
            },

            checkIsSettingOrNot : function(str){
                if($scope.checkIsSetting(str)){
                    HW.helper.goPath('home/modify-store/'+sid);
                }
            },
            checkIsSetting : function(str){
                if(!str) return false;
                return str.indexOf('未设置') > 0;
            },

            goToMap : function(){
                var url = 'https://www.google.com/maps/place/'+$scope.store.address;
                HW.helper.openUrl(url);
            }
        });



    }
]);

HW.App.controller('HomeStoreManageReplyCtrl', [
    '$scope',
    '$state',
    '$stateParams',

    function($scope, $state, $stateParams){
        var sid = $stateParams.store_id;

        HW.helper.loading.show();
        HW.request.getAllReplyListByBiz({
            userid : HW.user.get('id'),
            bizid : sid
        }, function(rs, flag){
            HW.helper.loading.hide();
            $scope.list = flag?rs:[];
        });

        $scope.goToDetail = function(item){
            $state.go('tab.home-store-manage-reply-detail', {
                data : item
            });
        };

    }
]);

HW.App.controller('HomeStoreManageReplyDetailCtrl', [
    '$scope',
    '$stateParams',
    function($scope, $stateParams){
        var data = $stateParams.data;

        $scope.data = data;
        console.log(data);
        $scope.publishComment = function(val, callback){

            if(!val){
                HW.helper.toast('请输入回复信息');
                callback();
                return;
            }

            val = '回复 '+data.userinfo.nick+': '+val;

            HW.request.sendComment({
                userid : HW.user.get('id'),
                bizid : data.fk_entityID,
                msg : val,
                entity : data.fk_entityID,
                token : HW.user.get('token'),
                type : 'store'
            }, function(rs, flag){
                if(flag){
                    HW.helper.toast('回复成功');
                }

                callback();
            });

        };

        $scope.sendReport = function(){

            HW.helper.loading.show();
            HW.request.sendReplyReport({
                replyId : data.id,
                bizid : data. fk_entityID,
                userid : HW.user.get('id'),
                token : HW.user.get('token')
            }, function(rs, flag){
                HW.helper.loading.hide();
                HW.helper.toast('举报成功');
            });


        };
    }
]);

HW.App.controller('HomeStorePublishListCtrl', [
    '$scope',
    '$stateParams',
    function($scope, $stateParams){
        var sid = $stateParams.store_id;
        $scope.bizid = sid;

        var F = {
            dealData : function(rs){
                HW.helper.loading.hide();


                $scope.list = {
                    article : rs.article,
                    action : rs.event
                };
            }
        };

        HW.helper.loading.show();
        HW.request.getDetailListByBiz({
            userid : HW.user.get('id'),
            bizid : sid
        }, function(rs){
            F.dealData(rs);
        });

        util.extend($scope, {
            deleteAction : function(id, index){
                HW.request.deleteAction({
                    id : id,
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        $scope.list.action.splice(index, 1);
                    }
                });
            },

            deleteArticle : function(id, index){
                HW.request.deleteArticle({
                    id : id,
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        $scope.list.article.splice(index, 1);
                    }
                });
            }
        });
    }
]);


























