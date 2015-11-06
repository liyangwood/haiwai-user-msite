'use strict';

HW.App.controller('ActionDetailCtrl', [
    '$scope',

    function($scope){

        $scope.actionId = util.url.param('id');

        $scope.reply = {};

        HW.helper.loading.show();
        HW.request.getActionDetail({
            actionId : $scope.actionId,
            userid : HW.user.get('id'),
            token : HW.user.get('token')
        }, function(rs){
            HW.helper.loading.hide();
            $scope.action = rs;
            $scope.action.description = decodeURIComponent(rs.description);


            //store card
            var store = rs.bizinfo;
            store.logo = HW.config.APPROOT+store.logo;
            $scope.store = store;


            util.setTitle(rs.subject);
        });



        util.extend($scope, {
            sendComment : function(){
                var val = $scope.reply.value;
                if(!val){
                    HW.helper.toast('请输入评论');
                    return;
                }

                HW.request.sendComment({
                    userid : HW.user.get('id'),
                    bizid : $scope.bizid,
                    msg : val,
                    entity : $scope.actionId,
                    type : 'action',
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        HW.helper.toast('发送成功');


                        $scope.action.comment.unshift({
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
            }
        });
    }
]);
