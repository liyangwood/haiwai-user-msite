'use strict';

HW.App.controller('PublishHomeCtrl', [
    '$scope',
    '$user',

    function($scope, $user){

        HW.request.getHomeStoreListData({
            userid : $user.get('id'),
            token : $user.get('token')
        }, function(rs){
            $scope.disabled = rs.length<1 ? true : false;
        });

        util.extend($scope, {

            loginSuccessCallback : function(){
                HW.helper.reload();
            },

            pubArticle : function(e){
                if($scope.disabled) return false;

                $scope.fn.publishArticle({
                    submitCallback : function(rs){
                        HW.helper.goPath('/publish/article/'+rs.bizid+'/'+rs.id);
                    }
                });
            },
            pubAction : function(e){
                if($scope.disabled) return false;

                $scope.fn.publishAction({
                    submitCallback : function(rs){
                        HW.helper.goPath('/publish/action-detail/'+rs.bizid+'/'+rs.id);
                    }
                });
            },
            pubStore : function(){
                $scope.fn.publishStore();
            }
        });

    }
]);