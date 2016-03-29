(function(){

    KG.Class.define('HWSiteArticleDetailPage', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-SiteArticleDetailPage">',
                    '<a class="hw-tag" href="../site/articlelist.html?category=hot">精选内容<a/>{{if category}} <span class="hw-tag">|</span> <a href="../site/articlelist.html?category={{category.category_id}}" class="hw-tag">{{category.name}}</a>{{/if}}',
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

                    '{{if bizInfo}}',
                    '<a class="hw-biz" href="{{bizInfo.entityID | toStorePath}}" style="display: block;">',
                        '<img src="{{bizInfo | logoPath}}" />',
                        '<h6>{{bizInfo.name_cn}}</h6>',
                        '<p class="hw-p">{{bizInfo | storeFullAddress}}</p>',
                    '</a>',
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
            util.loading(true);
            KG.request.getSiteArticleDetail({
                id : id
            }, function(flag, rs){
                console.log(rs);

                util.loading(false);
                if(flag){
                    try{
                        rs.view.msgbody = decodeURIComponent(rs.view.msgbody);
                    }catch(e){}
console.log(rs.view.msgbody)
                    rs.view.msgbody = util.replaceHtmlImgSrcToAbsolute(rs.view.msgbody);
                    next({
                        id : id,
                        data : rs.view,
                        category : rs.category,
                        bizInfo : rs.biz
                    });

                    util.message.publish('HWSiteArticleDetailRightMoreCommentComp', {
                        hotList : rs.hot
                    });

                    if(rs.relative){
                        util.message.publish('HWSiteArticleDetailMoreComp', {
                            list : rs.relative,
                            biz : rs.biz
                        });
                    }
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
                '<div class="hw-HWSiteArticleDetailMoreComp no_dis">',
                    '<div class="hw-head">',
                        '<label class="js_title">本店更多文章</label>',
                    '</div>',
                    '<div class="hw-box js_box">',

                    '</div>',

                '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            next({});
        },
        registerMessage : function(e, data){
            this.setListHtml(data.list, data.biz);
        },
        initEvent : function(){
            this.elem.on('click', '.hw-biz', function(){
                var url = $(this).attr('param');
                location.href = url;
                return false;
            });
        },
        setListHtml : function(list, biz){
            var h = [
                '{{each list as item}}',
                '<a class="hw-one" style="display: block" href="article.html?id={{item.id}}">',
                '<img src="{{item.pic | absImage}}" />',
                '<h4>{{item.title}}</h4>',

                '<div param="{{bizInfo.entityID | toStorePath}}" class="hw-biz">',
                '<img src="{{bizInfo.logo | absImage}}" />',
                '<h6>{{bizInfo.name_cn}}</h6>',
                '<p class="hw-p">{{bizInfo | storeFullAddress}}</p>',
                '</div>',

                '<p style="display: inline-block;">',
                '<span class="hw-time">{{item.msgbody | htmlToText}}</span>',

                '<span class="hw-view">',
                '<i class="fa fa-eye"></i>',
                '{{item.reads}}',
                '</span>',
                '</p>',
                '</a>',
                '{{/each}}'
            ].join('');

            h = template.compile(h)({
                list : list || [],
                bizInfo : biz
            });

            this.elem.find('.js_box').html(h);

            if(list.length > 0){
                this.elem.removeClass('no_dis');
            }
        },
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