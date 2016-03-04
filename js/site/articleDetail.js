(function(){

    KG.Class.define('HWSiteArticleDetailPage', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-SiteArticleDetailPage">',
                    '<p class="hw-tap">{{category.name}}</p>',
                    '<h3>{{data.title}}</h3>',

                    '<p class="hw-st">',
                        '<span class="hw-time">{{data.dateline | formatDate:"yy年mm月dd日"}}</span>',


                        '<span class="hw-wx js_share">',
                            '<i class="fa fa-weixin"></i>',
                            '分享',
                        '</span>',
                        '<span class="hw-view">',
                            '<i class="fa fa-eye"></i>',
                            '{{data.reads}}',
                        '</span>',

                    '</p>',

                    '{{if data.bizInfo}}',
                    //'<div class="hw-biz">',
                    //    '<img src="{{data.bizInfo.logo}}" />',
                    //    '<h6>{{data.bizInfo.name}}</h6>',
                    //    '<p class="hw-p">{{data.bizInfo.address}}</p>',
                    //'</div>',
                    '{{/if}}',

                    '<div class="hw-article">{{#data.msgbody}}</div>',

                    '<div class="hw-share">',
                        '<b class="js_share"><i class="fa fa-weixin"></i>分享文章到微信</b>',
                    '</div>',
                '</div>'
            ].join('');
        },

        getData : function(box, data, next){
            var id = KG.data.get('id');
            KG.request.getSiteArticleDetail({
                id : id
            }, function(flag, rs){
                console.log(rs);

                if(flag){
                    rs.view.msgbody = util.replaceHtmlImgSrcToAbsolute(rs.view.msgbody);
                    next({
                        id : id,
                        data : rs.view,
                        category : rs.category
                    });

                    util.message.publish('HWSiteArticleDetailRightMoreCommentComp', {
                        hotList : rs.hot
                    });
                }
            });
        },

        initEvent : function(){
            this.elem.on('click', '.js_share', function(){
                util.dialog.showQrCode(location.href, '打开微信扫一扫以下二维码即可打开本页面，点击屏幕右上角分享按钮');
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
            next({
                list : []
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

                '</div>',

                '</div>'
            ].join('');
        },

        setListHtml : function(list){
            var h = [
                '{{each list as item}}',
                '<a href="article.html?id={{item.id}}" class="hw-one">',
                '<h4>{{item.title}}</h4>',
                '</a>',
                '{{/each}}'
            ].join('');

            h = template.compile(h)({
                list : list || []
            });

            this.elem.find('.js_box').html(h);
        },

        getData : function(box, data, next){
            next({});
        },

        registerMessage : function(e, data){
            this.setListHtml(data.hotList);
        }
    });

})();