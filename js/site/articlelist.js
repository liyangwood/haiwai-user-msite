



KG.Class.define('SiteAticleListLeftNav', {
    ParentClass : 'BaseComponent',

    getTemplate : function(){
        return [
            '<div class="hw-SiteAticleListLeftNav">',
            '{{each list as item}}',
            '<a class="h4" href="articlelist.html?category={{item.category_id}}">{{item.name}}</a>',
            '{{/each}}',
            '</div>'
        ].join('');
    },

    getData : function(box, data, next){

        var list = [];
        var cat = util.url.param('category');

        KG.request.getArticleCategoryList({}, function(flag, rs){
            list = [{
                category_id : 'hot',
                name : '热门精选'
            }].concat(rs).concat(list);

            next({
                list : list,
                cat : cat.toString()
            });

        });

    },
    initEvent : function(){

    },
    initEnd : function(){
        var self = this;
        var cat = this.data.cat;
        var index = _.findIndex(this.data.list, function(item){
            return item.category_id === cat;
        });
        this.elem.find('.h4').eq(index).addClass('active');
        util.message.publish('HWSiteArticleListPage', {
            category : self.data.list[index]
        });


        this.elem.affix({
            offset : {
                top : this.elem.offset().top
            }
        });

    }
});

KG.Class.define('HWSiteArticleListPage', {
    ParentClass : 'BaseComponent',

    getTemplate : function(){
        return [
            '<div class="hw-HWSiteArticleListPage">',
            '<div class="hw-head">',
            '<label class="js_title"></label>',
            '</div>',
            '<div class="hw-box js_box"></div>',
            '<div class="hw-cpage js_cpage"></div>',
            '</div>'
        ].join('');
    },
    getData : function(box, data, next){
        var cat = KG.data.get('categoryID');
        console.log(cat);
        util.loading(true);
        KG.request.getSiteArticleList({
            category : cat
        }, function(flag, rs){
            util.loading(false);
            if(flag){
                console.log(rs);
                next({
                    list : rs.list,
                    cat : cat
                });

            }
        });
    },

    initEnd : function(){
        this.setBoxHtml(this.data.list);
        this.setLoadingStateHtml();

        if(this.data.list.length > 0){
            this.lastid = this.data.list[this.data.list.length -1].id;
            this.jq.pageBox.find('.loading').hide();
            this.jq.pageBox.find('.js_more').show();
        }
        else{
            this.jq.pageBox.hide();
        }
    },

    setTitle : function(tlt){
        this.elem.find('.js_title').html(tlt);
    },

    registerMessage : function(e, data){
        var self = this;

        var cat = data.category;
        this.setTitle(cat.name);
    },

    getItemTemplate : function(){
        return [
            '{{each list as item}}',
            '<div  class="hw-one">',
            '<div class="hw-img" role="BaseLoadingImageBox" data-url="{{item | logoPath}}"></div>',
            '<a target="_blank" href="../view/article.html?id={{item.id}}" class="hw-h4">{{item.title}}</a>',

            '{{if item.bizinfo}}',
            '<a href="../view/store.html?id={{item.bizinfo.entityID}}" target="_blank" class="hw-biz">',
                '<img src="{{item.bizinfo | logoPath}}" />',
                '<b>{{item.bizinfo.name_cn || item.bizinfo.name_en}}</b>',
                '<p>{{item.bizinfo | storeFullAddress}}</p>',
            '</a>',
            '{{else}}',
            '<h6>{{item.description | decode}}</h6>',
            '{{/if}}',


            '<p>',
            '<span class="hw-time">{{item.dateline | formatDate:"yy年mm月dd日"}}</span>',

            '<span class="hw-view">',
            '<i class="fa fa-eye"></i>',
            '{{item.reads}}',
            '</span>',
            '</p>',
            '</div>',
            '{{/each}}'
        ].join('');
    },

    setBoxHtml : function(list){
        _.map(list, function(item){
            //item.image = KG.config.SiteRoot+item.pic;
            item.description = item.msgbody.replace(/<([^>]*)>/g, '');
            return item;
        });
        var h = this.getItemTemplate();
        h = template.compile(h)({
            list : list
        });

        this.elem.find('.js_box').append(h);
        KG.component.init(this.elem.find('.js_box'));
    },

    initVar : function(){
        this.lastid = this.data.length > 0 ? this.data.list[this.data.list.length-1].id : null;
    },

    setJqVar : function(){
        return {
            pageBox : this.elem.find('.js_cpage')
        };
    },

    initEvent : function(){
        var self = this;
        this.jq.pageBox.on('click', '.js_more', function(){
            self.jq.pageBox.find('.loading').show();
            self.jq.pageBox.find('.js_more').hide();
            KG.request.getSiteArticleList({
                category : self.data.cat,
                lastid : self.lastid
            }, function(flag, rs){
                if(flag){
                    self.setBoxHtml(rs.list);
                    if(rs.list.length > 0){
                        self.lastid = rs.list[rs.list.length -1].id;
                        self.jq.pageBox.find('.loading').hide();
                        self.jq.pageBox.find('.js_more').show();
                    }
                    else{
                        self.jq.pageBox.hide();
                    }
                }
            });
        });
    },

    setLoadingStateHtml : function(){
        var h = [
            '<nav class="c-lb"><i class="loading" style="display: none;"></i><b class="js_more">加载更多</b></nav>'
        ].join('');

        this.elem.find('.js_cpage').html(h);
    },

    setIndexPageHtml : function(data){
        var h = [
            '<nav>',
            '<ul class="pagination">',
            '<li>',
            '<a href="javascript:void(0)" class="js_prev">上一页</a>',
            '</li>',

            '{{each pageList as item}}',
            '<li><a href="javascript:void(0)" class="js_p">{{item}}</a></li>',
            '{{/each}}',

            '<li>',
            '<a href="javascript:void(0)" class="js_next">下一页</a>',
            '</li>',
            '</ul>',
            '</nav>'
        ].join('');

        var totalPage = data.totalPage || 5,
            pageList = [];
        for(var i= 0; i<totalPage; i++){
            pageList.push(i+1);
        }

        h = template.compile(h)({
            pageList : pageList
        });

        this.elem.find('.js_cpage').html(h);
    }

});

