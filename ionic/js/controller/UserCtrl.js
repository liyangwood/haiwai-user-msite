'use strict';

HW.App.controller('UserCtrl', [
    '$scope',
    '$user',

    function($scope, $user){

        $scope.user = $user.get();

        util.extend($scope, {
            loginSuccessCallback : function(){
                HW.helper.reload();
            },
            logout : function(){
                $user.logout(function(){
                    //HW.helper.reload();
                });
            }
        });

        if($scope.user.isLogin){
            util.delay(function(){
                var uid =  $user.get('id');
                if(!uid) return;
                HW.request.getUserDetailInfo({
                    userid : uid
                }, function(data, flag){
                    if(flag && data[uid]){
                        var ud = data[uid];
                        $user.set(ud);
                        $user.set('nickname', ud.nick);
                        $user.set('phone', ud.tel);
                        $user.set('image', HW.config.APPROOT + ud['avatar_url']);


                        $scope.user = $user.get();
                    }
                });
            }, 0);
        }

    }
]);

HW.App.controller('UserChangePasswordCtrl', [
    '$scope',
    '$user',

    function($scope, $user){

        $scope.data = {
            oldpwd : $user.get('password') || '',
            pwd : '',
            pwd2 : ''
        };

        util.extend($scope, {
            okFn : function(){
                var oldpwd = $scope.data.oldpwd,
                    pwd = $scope.data.pwd,
                    pwd2 = $scope.data.pwd2;


                //if(!oldpwd){
                //    HW.helper.toast('请输入原始密码');
                //    return false;
                //}
                if(!pwd){
                    HW.helper.toast('请输入新密码');
                    return false;
                }
                if(pwd!==pwd2){
                    HW.helper.toast('二次输入的密码不一致');
                    return false;
                }


                HW.request.changePassword({
                    password : pwd,
                    userid : $user.get('id'),
                    token : $user.get('token')
                }, function(rs, flag){
                    if(flag){
                        $user.set('password', pwd);
                        HW.helper.goPath('/user');
                    }
                    else{
                        HW.helper.toast('修改失败');
                    }
                });

            }
        });

    }
]);

HW.App.controller('UserChangeInfoCtrl', [
    '$scope',
    '$user',

    function($scope, $user){

        $scope.data = {
            region_tree : $user.get('region_tree'),
            region : $user.get('region'),
            nickname : $user.get('nickname'),
            image : $user.get('image')
        };

        $scope.okFn = function(){

            var data = $scope.data;

            HW.helper.loading.show();
            HW.request.modifyUserInfo({
                nickname : data.nickname,
                region : data.region,
                userid : $user.get('id'),
                token : $user.get('token')
            }, function(rs, flag){
                HW.helper.loading.hide();
                if(flag){
                    HW.helper.goPath('/user');
                }
                else{
                    HW.helper.toast(rs);
                }
            });

        };

        $scope.getPhoto = function(self){
            var file = self.files[0];
            if(!file) return false;

            var fr = new FileReader();
            fr.onload = function(e){
                var binary = e.target.result;

                $scope.$apply(function(){

                    //uploadImage
                    HW.helper.loading.show('正在上传图片');
                    HW.request.uploadUserImage({
                        image : binary,
                        userid : $user.get('id'),
                        token : $user.get('token')
                    }, function(rs, flag){
                        HW.helper.loading.hide();
                        if(flag){
                            var tmp = HW.config.APPROOT+rs;
                            $scope.data.image = tmp;
                            $user.set('image', tmp);
                        }
                        else{
                            HW.helper.toast('上传失败');
                        }
                    });

                });


                console.log($scope.html);

            };
            fr.readAsDataURL(file);
        };


    }
]);
