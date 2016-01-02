(function(){

    KG.Class.define('HWSiteArticleDetailPage', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-SiteArticleDetailPage">',
                    '<p class="hw-tap">{{data.tag}}</p>',
                    '<h3>{{data.title}}</h3>',

                    '<p class="hw-st">',
                        '<span class="hw-time">{{data.dateline | formatDate:"yy年mm月dd日"}}</span>',


                        '<span class="hw-wx">',
                            '<i class="fa fa-weixin"></i>',
                            '分享',
                        '</span>',
                        '<span class="hw-view">',
                            '<i class="fa fa-eye"></i>',
                            '{{data.view}}',
                        '</span>',

                    '</p>',

                    '<div class="hw-biz">',
                        '<img src="{{data.bizInfo.logo}}" />',
                        '<h6>{{data.bizInfo.name}}</h6>',
                        '<p class="hw-p">{{data.bizInfo.address}}</p>',
                    '</div>',

                    '<div class="hw-article">{{#data.msgbody}}</div>',

                    '<div class="hw-share">',
                        '<b><i class="fa fa-weixin"></i>分享文章到微信</b>',
                    '</div>',
                '</div>'
            ].join('');
        },

        getData : function(box, data, next){
            KG.request.getSiteArticleDetail({}, function(flag, rs){
                if(flag){
                    next({
                        data : rs
                    });
                }
            });
        }
    });

    KG.Class.define('HWSiteArticleDetailMoreComp', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-HWSiteArticleDetailMoreComp">',
                    '<div class="hw-head">',
                        '<label class="js_title">本店更多文章</label>',
                    '</div>',
                    '<div class="hw-box js_box">',
                        '{{each list as item}}',
                        '<div class="hw-one">',
                            '<img src="{{item.image}}" />',
                            '<h4>{{item.title}}</h4>',

                            '<div class="hw-biz">',
                                '<img src="{{item.bizInfo.logo}}" />',
                                '<h6>{{item.bizInfo.name}}</h6>',
                                '<p class="hw-p">{{item.bizInfo.address}}</p>',
                            '</div>',

                            '<p>',
                            '<span class="hw-time">{{item.dateline | formatDate:"yy年mm月dd日"}}</span>',

                            '<span class="hw-view">',
                            '<i class="fa fa-eye"></i>',
                            '{{item.view}}',
                            '</span>',
                            '</p>',
                        '</div>',
                        '{{/each}}',
                    '</div>',

                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            KG.request.getSiteArticleList({}, function(flag, rs){
                if(flag){
                    next({
                        list : rs
                    });
                }
            });
        }
    });

    KG.Class.define('HWSiteArticleDetailRightMoreCommentComp', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-HWSiteArticleDetailRightMoreCommentComp">',
                '<div class="hw-head">',
                '<label class="js_title">热门文章</label>',
                '</div>',
                '<div class="hw-box js_box">',
                '{{each list as item}}',
                '<div class="hw-one">',
                    '<h4>{{item.title}}</h4>',
                '</div>',
                '{{/each}}',
                '</div>',

                '</div>'
            ].join('');
        },

        getData : function(box, data, next){
            KG.request.getSiteArticleList({}, function(flag, rs){
                if(flag){
                    next({
                        list : rs
                    });
                }
            });
        }
    });

})();