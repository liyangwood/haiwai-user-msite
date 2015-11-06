'use strict';

HW.App.controller('ArticleDetailCtrl', [
    '$scope',

    function($scope){

        $scope.articleId = util.url.param('id');

        $scope.comment = {};

        HW.helper.loading.show();
        HW.request.getArticleDetail({
            articleId : $scope.articleId,
            userid : HW.user.get('id'),
            token : HW.user.get('token')
        }, function(rs){
            HW.helper.loading.hide();

            $scope.article = rs;
            $scope.article.msgbody = decodeURIComponent(rs.msgbody);
            $scope.article.commentlist = rs.comments || [];

            //store card
            var store = rs.bizinfo;
            store.logo = HW.config.APPROOT+store.logo;
            $scope.store = store;

            util.setTitle(rs.title);
        });


        util.extend($scope, {
            sendComment : function(){
                var val = $scope.comment.value;
                if(!val){
                    HW.helper.toast('请输入评论');
                    return;
                }

                HW.request.sendComment({
                    userid : HW.user.get('id'),
                    bizid : $scope.bizid,
                    msg : val,
                    entity : $scope.articleId,
                    type : 'article',
                    token : HW.user.get('token')
                }, function(rs, flag){
                    if(flag){
                        HW.helper.toast('发送成功');

                        $scope.article.commentlist.unshift({
                            userinfo : {
                                nick : HW.user.get('nickname'),
                                avatar_url : HW.user.get('image').replace(HW.config.APPROOT, '')
                            },
                            msg : val,
                            datetime : '刚刚'
                        });
                    }

                    $scope.comment.value = '';
                });
            }
        });
    }
]);
