HW.App.controller('MessageListCtrl', [
    '$scope',
    '$user',
    '$stateParams',
    function($scope, $user, $stateParams){

        var sid = $stateParams.store_id;



        var F = {
            init : function(){

                HW.helper.loading.show();
                HW.request.getMessageList({
                    userid : $user.get('id'),
                    token : $user.get('token'),
                    bizid : sid
                }, function(rs){
                    HW.helper.loading.hide();

                    $scope.list = rs.data || [];
                });

            }
        };

        $scope.storeId = sid;


        F.init();
    }
]);

HW.App.controller('MessageDetailCtrl', [
    '$scope',
    '$user',
    '$stateParams',
    '$ionicScrollDelegate',
    function($scope, $user, $stateParams, $ionicScrollDelegate){
        var sid = $stateParams.store_id,
            mid = $stateParams.message_id;

        HW.helper.loading.show();
        HW.request.getMessageDetail({
            userid : $user.get('id'),
            token : $user.get('token'),
            bizid : sid,
            basecode : mid
        }, function(rs){
            HW.helper.loading.hide();

            $scope.list = util.map(rs.data.reverse(), function(item){
                if(item.touserid.pk_id === $user.get('id')){
                    item.side = 'left';
                    item.u_name = item.userid.nick;
                    item.u_image = HW.config.APPROOT + item.userid.avatar_url;
                }
                else{
                    item.side = 'right';
                    item.u_name = item.userid.nick;
                    item.u_image = HW.config.APPROOT + item.userid.avatar_url;
                }


                return item;
            });

            $scope.touserid = $scope.list[0].userid.pk_id;

            $ionicScrollDelegate.scrollBottom();
        });

        util.extend($scope, {
            publishReplyMessage : function(val, callback){
                if(!val){
                    HW.helper.toast('请输入回复信息');
                    callback();
                    return;
                }

                HW.request.sendMessage({
                    text : val,
                    userid : $user.get('id'),
                    token : $user.get('token'),
                    email : $user.get('email'),
                    bizid : sid,
                    touserid : $scope.touserid

                }, function(rs, flag){
                    if(flag){
                        HW.helper.toast('回复成功');
                        $scope.list.push({
                            side : 'right',
                            msgbody : val,
                            u_name : $user.get('nickname'),
                            u_image : $user.get('image'),
                            postid : Date.now()
                        });

                        $ionicScrollDelegate.scrollBottom(true);
                    }
                    else{

                    }
                    callback();
                });
            }
        });
    }
]);