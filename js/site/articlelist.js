

(function(){

    KG.Class.define('SiteAticleListLeftNav', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-SiteAticleListLeftNav">',
                    '{{each list as item}}',
                    '<h4>{{item}}</h4>',
                    '{{/each}}',
                '</div>'
            ].join('');
        },

        getData : function(box, data, next){
            var list = [
                '热门精选',
                '健康知识',
                '教育宝典',
                '美食tips',
                '生活指南',
                '投资理财',
                '商家专栏'
            ];

            next({
                list : list
            });
        },
        initEvent : function(){
            var self = this;
            this.elem.on('click', 'h4', function(){
                var o = $(this);
                if(o.hasClass('active')) return false;
                self.elem.find('h4').removeClass('active');

                o.addClass('active');

                self.publish(o);
            });
        },
        publish : function(o){
            var h = o.html();

            util.message.publish('HWSiteArticleListPage', {
                msg : h,
                elem : o
            });
        },
        initEnd : function(){
            var self = this;
            self.elem.find('h4').eq(0).trigger('click');

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
            next({});
        },

        setTitle : function(tlt){
            this.elem.find('.js_title').html(tlt);
        },

        registerMessage : function(e, data){
            var self = this;

            var tlt = data.msg;
            this.setTitle(tlt);

            KG.request.getSiteArticleList({}, function(flag, rs){
                if(flag){
                    self.setBoxHtml(rs);
                    self.page = 1;

                    self.setIndexPageHtml({});
                }
            });
        },

        getItemTemplate : function(){
            return [
                '{{each list as item}}',
                    '<div class="hw-one">',
                        '<img src="{{item.image}}" />',
                        '<h4>{{item.title}}</h4>',
                        '<h6>{{item.description}}</h6>',
                        '<p>',
                            '<span class="hw-time">{{item.dateline | formatDate:"yy年mm月dd日"}}</span>',

                            '<span class="hw-view">',
                                '<i class="fa fa-eye"></i>',
                                '{{item.view}}',
                            '</span>',
                        '</p>',
                    '</div>',
                '{{/each}}'
            ].join('');
        },

        setBoxHtml : function(list){
            var h = this.getItemTemplate();
            h = template.compile(h)({
                list : list
            });

            this.elem.find('.js_box').html(h);
        },

        initVar : function(){
            this.page = 1;
        },

        setJqVar : function(){
            return {
                pageBox : this.elem.find('.js_cpage')
            };
        },

        initEvent : function(){
            var self = this;
            this.jq.pageBox.on('click', 'a.js_p', function(){
                var o = $(this);
                if(o.hasClass('active')) return false;
                self.jq.pageBox.find('a.js_p').removeClass('active');
                o.addClass('active');

                self.page = o.html();

                //TODO request
            });
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

})();