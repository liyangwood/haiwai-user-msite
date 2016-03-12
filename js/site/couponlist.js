
KG.Class.define('SiteCouponFilterComp', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-SiteCouponFilterComp">',
            '<div class="c">',
            '<label>优惠分类</label>',
            '<p class="js_cat">',

            '</p>',
            '</div>',
            '<div class="c js_dybox">',

            '</div>',

            '<div class="c">',
            '<label>地区</label>',
            '<p class="js_loc">',

            '</p>',
            '</div>',

            '</div>'
        ].join('');
    },

    initStart : function(){
        this.tag = null;
        this.region = null;
    },

    setTagListHtml : function(catlist){
        var list = _.values(catlist);
        var h = [
            '<span param="all">不限</span>',
            '{{each list as item}}',
            '<span param="{{item.pk_id}}">{{item.name}}</span>',
            '{{/each}}'
        ].join('');
        h = template.compile(h)({list : list});
        this.jq.catBox.html(h);
    },


    setRegionListHtml : function(regionList){
        var h = [
            '<span param="all">不限</span>',
            '{{each list as item}}',
            '<span param="{{item.id}}">{{item.name}}</span>',
            '{{/each}}'
        ].join('');
        h = template.compile(h)({list : regionList});
        this.jq.locBox.html(h);
    },

    getData : function(box, data, next){
        next({});
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
            self.tag = o.attr('param');
            self.setFilter();
        });
        this.jq.locBox.on('click', 'span', function(e){
            var o = $(this);
            if(o.hasClass('active')) return false;
            self.jq.locBox.find('span').removeClass('active');

            o.addClass('active');
            self.region = o.attr('param');
            self.setFilter();
        });

    },
    setFilter : function(){

        var data = {
            subtag : this.tag!=='all'?this.tag:null,
            subregion : this.region!=='all'?this.region:null
        };

        console.log(data);
        util.message.publish('HWSiteCouponListPage', data);
    },
    initEnd : function(){},
    setHtmlEnd : function(data){
        var catId = data.catId || 'all',
            regionId = data.regionId || 'all';
        this.jq.catBox.find('span[param="'+catId+'"]').addClass('active');
        this.jq.locBox.find('span[param="'+regionId+'"]').addClass('active');
    },
    registerMessage : function(e, data){
        this.setTagListHtml(data.catlist);
        this.setRegionListHtml(data.subregion);

        this.setHtmlEnd(data);
    }
});

KG.Class.define('SiteCouponAscComp', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        return [
            '<div class="hw-SiteCouponAscComp">',
            //'<b>人气<i class="fa fa-arrow-down"></i></b>',
            '<b>&nbsp;</b>',
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

            '<div style="margin-top: 24px;" class="nodis" role="SiteCouponAscComp"></div>',

            '<div class="box js_box nodis"></div>',
            '<div class="box1 js_box1 nodis"></div>',

            '<div class="hw-cpage js_cpage"></div>',
            '</div>'
        ].join('');
    },

    initStart : function() {
        this.page = 1;
    },

    setJqVar : function(){
        return {
            box : this.elem.find('.js_box'),
            box1 : this.elem.find('.js_box1'),
            pageBox : this.elem.find('.js_cpage')
        };
    },

    getData : function(box, data, next){
        var self = this;
        this.tagId = util.url.param('tag');
        this.subTagId = util.url.param('subtag');
        this.regionId = util.url.param('subregion');
        if(!this.tagId){
            alert('wrong param');
            return;
        }

        util.loading(true);
        self.getListData(function(rs){
            console.log(rs);
            util.message.publish('SiteCouponFilterComp', {
                catlist : rs.event_tag,
                subregion : rs.subregion,

                catId : self.subTagId,
                regionId : self.regionId
            });

            util.loading(false);
            self.setBoxHtml(rs.list);
        });




        next({});
    },



    registerMessage : function(e, data){
        var self = this;
        this.subTagId = data.subtag;
        this.regionId = data.subregion;

        this.page = 1;
        util.loading(true);
        this.getListData(function(rs){
            self.setBoxHtml(rs.list, false);
            util.loading(false);
        });
    },

    initEvent : function(){
        var self = this;


        //this.jq.pageBox.on('click', 'a.js_p', function(){
        //	var o = $(this);
        //	if(o.hasClass('active')) return false;
        //	self.jq.pageBox.find('a.js_p').removeClass('active');
        //	o.addClass('active');
        //
        //	self.page = o.html();
        //	self.getListData(function(list){
        //		self.setBoxHtml(list);
        //	});
        //});
        //
        //
        //this.jq.pageBox.on('click', '.js_prev', function(e){
        //	//TODO prev btn
        //});
        //
        //this.jq.pageBox.on('click', '.js_next', function(){
        //	//TODO next btn
        //});

        this.jq.pageBox.on('click', '.js_more', function(){
            self.jq.pageBox.find('.loading').show();
            self.jq.pageBox.find('.js_more').hide();

            self.page++;
            self.getListData(function(rs){
                self.setBoxHtml(rs.list, true);
            });

        });

        this.jq.box.on('click', '.hw-one', function(e){
            var id = $(this).attr('param');
            util.dialog.showCouponDetail(id);
        });
    },

    checkLoadingState : function(list){
        list = list || [];
        var self = this;
        if(list.length > 19){
            self.jq.pageBox.show();
            self.jq.pageBox.find('.loading').hide();
            self.jq.pageBox.find('.js_more').show();
        }
        else{
            self.jq.pageBox.hide();
        }
    },

    initEnd : function(){
        this.setLoadingStateHtml();
    },

    getListData : function(callback){
        var self = this;
        KG.request.getCouponListByTag({
            tag : this.tagId,
            subtag : this.subTagId,
            subregion : this.regionId,
            page : this.page
        }, function(flag, rs){
            if(flag){
                callback(rs);
                self.checkLoadingState(rs.list);
            }

        });

    },

    // block style
    getItemTemplate : function(){
        return [
            '{{each list as item}}',
            '<div param="{{item.ci_id_i}}" class="hw-one">',
            '<div class="hw-logo"><img src="{{item.pic | absImage}}" /></div>',

            '<h4>{{item.subject_cntmw}}</h4>',
            '<span class="hw-address">{{item.description_cntmw}}</span>',
            //'<h3>{{item.title}}</h3>',
            '</div>',
            '{{/each}}'
        ].join('');

        //return [
        //    '{{each list as item}}',
        //    '<a href="{{item.entityID_i | toStorePath}}" target="_blank" class="hw-one">',
        //    '<div class="hw-logo"><img src="{{item.logo | absImage}}" /></div>',
        //
        //    '<div class="right">',
        //    '<h4>{{item.name_cn_cntmw}}</h4>',
        //    '<span class="hw-address">{{item | storeFullAddress}}</span>',
        //    '</div>',
        //    '</a>',
        //    '{{/each}}'
        //].join('');
    },

    // list style
    getItemTemplate1 : function(){
        return [
            '{{each list as item}}',
            '<a href="{{item.entityID_i | toStorePath}}" target="_blank" class="hw-one1">',
            '<div class="hw-logo"><img src="{{item.logo | absImage}}" /></div>',

            '<div class="right">',
            '<h4>{{item.name_cn_cntmw}}</h4>',
            '<div class="ca">',
            '<div class="hw-star" role="StarRank" data-rank="3"></div>',

            '</div>',
            '<div class="hw-address">{{item | storeFullAddress1}}</div>',
            '</div>',
            '</a>',
            '{{/each}}'
        ].join('');
    },

    setBoxHtml : function(list, isAppend){
        isAppend = isAppend || false;

        var h = this.getItemTemplate();
        h = template.compile(h)({
            list : list
        });

        if(isAppend){
            this.jq.box.append(h).show();
        }
        else{
            this.jq.box.html(h).show();
        }

        KG.component.init(this.jq.box);
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

        this.jq.pageBox.html(h);
    }
});