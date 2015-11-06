'use strict';

HW.App.controller('ManageCtrl', [
    '$scope',

    function($scope){


        util.extend($scope, {
            data : {},
            loginSuccessCallback : function(){
                HW.helper.reload();
            },
            changeStore : function(){

                var bizid = $scope.data.bizid;

                if(bizid == '-1'){
                    HW.request.getDetailList({
                        userid : HW.user.get('id')

                    }, function(rs){
                        F.dealData(rs);
                    });

                    return;
                }

                HW.helper.loading.show();
                HW.request.getDetailListByBiz({
                    userid : HW.user.get('id'),
                    bizid : bizid
                }, function(rs){
                    F.dealData(rs);
                });
            },
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

        var F = {
            dealData : function(rs){
                HW.helper.loading.hide();

                var cat = $scope.data.category;

                var list = {};
                if(cat === 'all'){
                    $scope.list = {
                        article : rs.article,
                        action : rs.event
                    };
                }
                else if(cat === 'article'){
                    $scope.list = {
                        article : rs.article,
                        action : []
                    };
                }
                else if(cat === 'action'){
                    $scope.list = {
                        article : [],
                        action : rs.event
                    };
                }
            },

            init : function(){
                HW.request.getHomeStoreListData({
                    userid : HW.user.get('id'),
                    token : HW.user.get('token')
                }, function(rs){
                    console.log(rs);
                    $scope.bizlist = rs;
                    $scope.data.bizid = '-1';

                    $scope.data.category = 'all';

                    $scope.changeStore();
                })
            }
        };

        F.init();
    }
]);