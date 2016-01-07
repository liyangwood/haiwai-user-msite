
(function(){

    KG.Class.define('SiteCouponFilterComp', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-SiteCouponFilterComp">',
                    '<div class="c">',
                        '<label>优惠分类</label>',
                        '<p class="js_cat">',
                            '<span param="all">不限</span>',
                            '{{each tagList as item}}',
                            '<span param="{{item.id}}">{{item.name}}</span>',
                            '{{/each}}',
                        '</p>',
                    '</div>',

                    '<div class="c">',
                        '<label>地区</label>',
                        '<p class="js_loc">',
                            '<span param="all">不限</span>',
                            '{{each locList as item}}',
                            '<span param="{{item}}">{{item}}</span>',
                            '{{/each}}',
                        '</p>',
                    '</div>',

                    '</div>'
            ].join('');
        },
        getData : function(box, data, next){
            var tagList = [
                {
                    name : '餐饮美食',
                    id : '001'
                },
                {
                    name : '私家小店',
                    id : '002'
                }
            ];

            var locList = [
                'San Francisco',
                'Palo Alto',
                'San Mateo',
                'San Jose',
                'Cuppertino',
                'Fremont',
                'Union City',
                'Sunnyvale',
                'Palo Alto',
                'San Mateo',
                'San Jose',
                'Cuppertino',
                'Fremont'
            ];

            next({
                tagList : tagList,
                locList : locList,

                tag : null,
                loc : null
            });
        },
        setJqVar : function(){
            return {
                catBox : this.elem.find('.js_cat'),
                locBox : this.elem.find('.js_loc')
            };
        },

        initEvent : function(){
            var self = this;
            this.jq.catBox.on('click', 'span', function(e){
                var o = $(this);
                if(o.hasClass('active')) return false;
                self.jq.catBox.find('span').removeClass('active');

                o.addClass('active');
                self.data.tag = o.attr('param');
                self.setFilter();
            });
            this.jq.locBox.on('click', 'span', function(e){
                var o = $(this);
                if(o.hasClass('active')) return false;
                self.jq.locBox.find('span').removeClass('active');

                o.addClass('active');
                self.data.loc = o.attr('param');
                self.setFilter();
            });
        },
        setFilter : function(){
            var data = this.data;
            console.log(data.tag, data.loc);

            util.message.publish('hw-SiteCouponFilterComp', data);
        },
        initEnd : function(){
            var self = this;
            this.jq.catBox.find('span').eq(0).addClass('active');
            this.jq.locBox.find('span').eq(0).addClass('active');
            this.data.tag = 'all';
            this.data.loc = 'all';

            util.delay(function(){
                self.setFilter();
            }, 500);
        }
    });

    KG.Class.define('SiteCouponAscComp', {
        ParentClass : 'BaseComponent',
        getTemplate : function(){
            return [
                '<div class="hw-SiteCouponAscComp">',
                    '<b>人气<i class="fa fa-arrow-down"></i></b>',
                '</div>'
            ].join('');
        }
    });

    KG.Class.define('HWSiteCouponListPage', {
        ParentClass : 'BaseComponent',

        getTemplate : function(){
            return [
                '<div class="hw-HWSiteCouponListPage">',
                    '<div role="SiteCouponFilterComp"></div>',

                    '<div style="margin-top: 24px;" role="SiteCouponAscComp"></div>',

                    '<div class="box js_box"></div>',

                    '<div class="hw-cpage js_cpage"></div>',
                '</div>'
            ].join('');
        },

        initVar : function(){
            this.tag = null;
            this.loc = null;
            this.page = 1;
        },

        setJqVar : function(){
            return {
                box : this.elem.find('.js_box'),
                pageBox : this.elem.find('.js_cpage')
            };
        },

        getData : function(box, data, next){

            next({});
        },

        initEvent : function(){
            var self = this;
            //reg message
            util.message.register('hw-SiteCouponFilterComp', function(e, data){
                self.loc = data.loc;
                self.tag = data.tag;
                self.page = 1;

                self.getListData(function(list){
                    self.setBoxHtml(list);

                    self.setIndexPageHtml({});
                });
            });

            this.jq.pageBox.on('click', 'a.js_p', function(){
                var o = $(this);
                if(o.hasClass('active')) return false;
                self.jq.pageBox.find('a.js_p').removeClass('active');
                o.addClass('active');

                self.page = o.html();
                self.getListData(function(list){
                    self.setBoxHtml(list);
                });
            });


            this.jq.pageBox.on('click', '.js_prev', function(e){
                //TODO prev btn
            });

            this.jq.pageBox.on('click', '.js_next', function(){
                //TODO next btn
            });
        },

        getListData : function(callback){
            var loc = self.loc,
                tag = self.tag,
                page = self.page;

            //this.jq.box.empty();

            KG.request.getBizCouponList({}, function(flag, rs){
                if(flag){
                    callback(rs);
                }
            });

        },

        getItemTemplate : function(){
            return [
                '{{each list as item}}',
                '<div class="hw-one">',
                    '<div class="hw-logo"><img src="{{item.logo | absImage}}" /></div>',

                    '<h4>{{item.bizInfo.name}}</h4>',
                    '<span class="hw-address">{{item.bizInfo.address}}</span>',
                    '<h3>{{item.title}}</h3>',
                '</div>',
                '{{/each}}'
            ].join('');
        },

        setBoxHtml : function(list){

            var h = this.getItemTemplate();
            h = template.compile(h)({
                list : list
            });

            this.jq.box.html(h);

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

            this.jq.pageBox.html(h);
        }
    });

})();