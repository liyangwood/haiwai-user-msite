


HW.App.provider('appRouter', function($stateProvider){
    var PageRoot = HW.config.ROOT + 'page/',
        TplRoot = HW.config.ROOT + 'tpl/';

    function getPage(page){
        return PageRoot + page + '.html';
    }


    util.extend(this, {
        init : function(){
            $stateProvider.state('tab', {
                url : '',
                abstract : true,
                views : {
                    'global-view' : {
                        templateUrl : TplRoot + 'tab.html'
                    }
                }
            });

            $stateProvider.state('tab.home', {
                //hideTab : true,
                url : '/home',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home'),
                        controller : 'HomeIndexCtrl'
                    }
                }
            }).state('tab.home-create-store', {
                hideTab : true,
                url : '/home/create-store',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-create-store'),
                        controller : 'HomeCreateStoreCtrl'
                    }
                }
            }).state('tab.home-store-list', {
                hideTab : false,
                requireLogin : true,
                url : '/home/store-list',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-list'),
                        controller : 'HomeStoreListCtrl'
                    }
                }
            }).state('tab.home-input-store-baseinfo', {
                hideTab : true,
                needAskSaveOrNot : true,
                url : '/home/baseinfo/tmp_biz/:tmp_biz_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-input-store-baseinfo'),
                        controller : 'HomeInputStoreBaseInfo'
                    }
                }
            }).state('tab.home-modify-store', {
                hideTab : true,
                needAskSaveOrNot : true,
                url : '/home/modify-store/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-modify-store-info'),
                        controller : 'HomeModifyStoreCtrl'
                    }
                }
            }).state('tab.home-store-manage', {
                requireLogin : true,
                hideTab : true,
                url : '/home/store-manage/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-manage-index'),
                        controller : 'HomeStoreManageIndexCtrl'
                    }
                }
            }).state('tab.home-store-detail', {
                hideTab : true,
                url : '/home/store-detail/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-detail'),
                        controller : 'HomeStoreDetailCtrl'
                    }
                }
            }).state('tab.home-store-manage-reply', {
                hideTab : true,
                url : '/home/store-manage/reply/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-manage-reply'),
                        controller : 'HomeStoreManageReplyCtrl'
                    }
                }
            }).state('tab.home-store-manage-reply-detail', {
                hideTab : true,
                params : {
                    data : {}
                },
                url : '/home/store-manage/reply-detail',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-manage-reply-detail'),
                        controller : 'HomeStoreManageReplyDetailCtrl'
                    }
                }
            }).state('tab.home-message-list', {
                hideTab : true,
                requireLogin : true,
                url : '/home/message-list/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('message-list'),
                        controller : 'MessageListCtrl'
                    }
                }
            }).state('tab.home-message-detail', {
                hideTab : true,
                requireLogin : true,
                url : '/home/message-detail/:store_id/:message_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('message-detail'),
                        controller : 'MessageDetailCtrl'
                    }
                }
            }).state('tab.home-store-publish-list', {
                hideTab : true,
                requireLogin : true,
                url : '/home/publish-list/:store_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('home-store-publish-list'),
                        controller : 'HomeStorePublishListCtrl'
                    }
                }
            });



            $stateProvider.state('tab.pub', {
                url : '/publish',
                views : {
                    'tab-pub' : {
                        templateUrl : getPage('publish'),
                        controller : 'PublishHomeCtrl'
                    }
                }
            });

            $stateProvider.state('tab.user', {
                url : '/user',
                views : {
                    'tab-user' : {
                        templateUrl : getPage('user'),
                        controller : 'UserCtrl'
                    }
                }
            }).state('tab.user-change-password', {
                hideTab : true,
                url : '/user/change-password',
                views : {
                    'tab-user' : {
                        templateUrl : getPage('user-change-password'),
                        controller : 'UserChangePasswordCtrl'
                    }
                }
            }).state('tab.user-change-info', {
                hideTab : true,
                url : '/user/change-info',
                views : {
                    'tab-user' : {
                        templateUrl : getPage('user-change-info'),
                        controller : 'UserChangeInfoCtrl'
                    }
                }
            });

            $stateProvider.state('tab.manage', {
                url : '/manage',
                views : {
                    'tab-manage' : {
                        templateUrl : getPage('manage'),
                        controller : 'ManageCtrl'
                    }
                }
            });

            //article detail
            $stateProvider.state('tab.home-article-detail', {
                hideTab : true,
                url : '/home/article/:bizid/:article_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('article-detail'),
                        controller : 'ArticleDetailCtrl'
                    }
                }
            }).state('tab.pub-article-detail', {
                hideTab : true,
                url : '/publish/article/:bizid/:article_id',
                views : {
                    'tab-pub' : {
                        templateUrl : getPage('article-detail'),
                        controller : 'ArticleDetailCtrl'
                    }
                }
            }).state('tab.manage-article-detail', {
                hideTab : true,
                url : '/manage/article/:bizid/:article_id',
                views : {
                    'tab-manage' : {
                        templateUrl : getPage('article-detail'),
                        controller : 'ArticleDetailCtrl'
                    }
                }
            });


            //action detail
            $stateProvider.state('tab.home-action-detail', {
                hideTab : true,
                url : '/home/action-detail/:bizid/:action_id',
                views : {
                    'tab-home' : {
                        templateUrl : getPage('action-detail-page'),
                        controller : 'ActionDetailCtrl'
                    }
                }
            }).state('tab.pub-action-detail', {
                hideTab : true,
                url : '/publish/action-detail/:bizid/:action_id',
                views : {
                    'tab-pub' : {
                        templateUrl : getPage('action-detail-page'),
                        controller : 'ActionDetailCtrl'
                    }
                }
            }).state('tab.manage-action-detail', {
                hideTab : true,
                url : '/manage/action-detail/:bizid/:action_id',
                views : {
                    'tab-manage' : {
                        templateUrl : getPage('action-detail-page'),
                        controller : 'ActionDetailCtrl'
                    }
                }
            });
        }
    });

    this.$get = function(){
    };

});

HW.App.config(function($stateProvider, $urlRouterProvider, appRouterProvider){

    //配置路由
    appRouterProvider.init();

    $urlRouterProvider.otherwise('/home/store-list');

});