(function(){

    KG.Class.define('HWSiteArticleDetailPage', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-SiteArticleDetailPage">',
                    '<a class="hw-tag" href="../site/articlelist.html?category=hot">生活指南<a/>{{if category}} <span class="hw-tag">&gt;</span> <a href="../site/articlelist.html?category={{category.category_id}}" class="hw-tag">{{category.name}}</a>{{/if}}',
                    '<h3>{{data.title}}</h3>',

                    '<p class="hw-st">',
                        '{{if data.username&&data.category_id!=="30"}}<span class="hw-time" style="margin-right:20px;">文章来源 : {{data.username}}</span>{{/if}}',
                        '<span class="hw-time">{{data.dateline | formatDate:"yy年mm月dd日"}}</span>',


                        '<span class="hw-wx js_share">',
                            '<i class="fa fa-weixin"></i>',
                            '分享文章',
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
                        '<b class="js_share"><i class="fa fa-weixin"></i>分享文章</b>',
                    '</div>',
                '</div>'
            ].join('');
        },

        getData : function(box, data, next){
            var id = KG.data.get('id');
            util.loading(true);
            KG.request.getStoreArticleDetail({
                id : id
            }, function(flag, rs){
                console.log(rs);

                util.loading(false);
                if(flag){
                    try{
                        rs.view.msgbody = decodeURIComponent(rs.view.msgbody);
                    }catch(e){}

                    rs.view.msgbody = util.replaceHtmlImgSrcToAbsolute(rs.view.msgbody);
                    var addGoogleAd = rs.category.category_id !== '30';
                    next({
                        id : id,
                        data : rs.view,
                        category : rs.category,
                        bizInfo : rs.view.bizinfo,
                        addGoogleAd : addGoogleAd
                    });

                    util.message.publish('HWSiteArticleDetailRightMoreCommentComp', {
                        hotList : rs.hot,
                        addGoogleAd : addGoogleAd
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
            var id = this.data.id;
            this.elem.on('click', '.js_share', function(){
                util.dialog.showQrCode(util.path.toMSiteArticle(id), '打开微信扫一扫以下二维码即可打开本页面，点击屏幕右上角分享按钮');
            });
        },

        initEnd : function(){
            //add google ad
            if(this.data.addGoogleAd){
                this.addGoogleAd();
            }
        },
        addGoogleAd : function(){
            var h = '<div role="HWBaseGoogleAdIFrame" data-id="292571" style="margin-bottom:20px;width:728px;height:90px;float:left;margin-left:14px;"></div>';
            h = $(h);
            this.elem.before(h);
            KG.component.initWithElement(h);
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
                '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item.pic | absImage}}"></div>',
                '<h4>{{item.title}}</h4>',

                '<div param="{{bizInfo.entityID | toStorePath}}" class="hw-biz">',
                '<img src="{{bizInfo | logoPath}}" />',
                '<h6>{{bizInfo.name_cn}}</h6>',
                '<p class="hw-p">{{bizInfo | storeFullAddress}}</p>',
                '</div>',

                '<p style="display: block;">',
                '{{if item.dateline}}<span class="hw-time">{{item.dateline | formatDate:"mm/dd/yy"}}</span>{{/if}}',

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
                bizInfo : list.length > 0 ? list[0].bizinfo : {}
            });

            this.elem.find('.js_box').html(h);
            KG.component.init(this.elem.find('.js_box'));

            if(list.length > 0){
                this.elem.removeClass('no_dis');
            }
        },
    });

    KG.Class.define('HWSiteArticleDetailRightMoreCommentComp', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div>',
                '<div class="hw-HWSiteArticleDetailRightMoreCommentComp">',
                '<div class="hw-head">',
                '<label class="js_title">热门文章</label>',
                '</div>',
                '<div class="hw-box js_box">',

                '</div>',

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
            if(data.addGoogleAd){
                this.addGoogleAd();
            }
        },
        addGoogleAd : function(){
            var sy = 'style="width:300px;height:250px;border:none;margin-top:25px;"';

            var h = '<div style="width:300px;">';
            //h += '<div role="HWBaseGoogleAdIFrame" data-id="292557"' +
            //    ' style="margin-top:20px;width:300px;height:250px;"></div>';
            //h += '<div role="HWBaseGoogleAdIFrame" data-id="292569"' +
            //    ' style="margin-top:20px;width:300px;height:600px;"></div>';
            //h += '<div role="HWBaseGoogleAdIFrame" data-id="292557"' +
            //    ' style="margin-top:20px;width:300px;height:250px;"></div>';
            h += '<iframe '+sy+' src="//a.impactradius-go.com/gen-ad-code/260225/284381/4015/" width="300" height="250" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe>';
            h += '<iframe '+sy+' src="//a.impactradius-go.com/gen-ad-code/260225/286628/4015/" width="300" height="250" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe>';
            h += '<iframe '+sy+' src="//a.impactradius-go.com/gen-ad-code/260225/286629/4015/" width="300" height="250" scrolling="no" frameborder="0" marginheight="0" marginwidth="0"></iframe>';

            h += '</div>';

            h = $(h);
            this.elem.append(h);
            KG.component.init(h);
        }
    });

})();