


KG.Class.define('SiteStoreFilterComp', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div style="min-height: 50px;" class="hw-SiteStoreFilterComp">',
			'<div class="c">',
				'<label>营业特色</label>',
				'<p class="js_cat">',

				'</p>',
			'</div>',
			'<div class="c js_dybox">',

			'</div>',

			'<div class="c no_dis">',
				'<label>地区</label>',
				'<p class="js_loc">',

				'</p>',
			'</div>',

			'</div>'
		].join('');
	},

	initStart : function(){
		this.tag = null;
		this.dy = {};
		this.region = null;
	},

	setTagListHtml : function(catlist){
		var list = _.values(catlist);
		var h = [
			'<span param="all">不限</span>',
			'{{each list as item}}',
			'<span param="{{item.tag_id}}">{{item.name}}</span>',
			'{{/each}}'
		].join('');
		h = template.compile(h)({list : list});
		this.jq.catBox.html(h);
	},

	setDynamicListHtml : function(dyList){
		var tpl = [
			'<label>{{title}}</label>',
			'<p class="">',
				'<span dy_id="{{id}}" param="all">不限</span>',
				'{{each list as val}}',
				'<span dy_id="{{id}}" param="{{val}}">{{val}}</span>',
				'{{/each}}',
			'</p>'
		].join('');

		var h = '';
		_.each(dyList, function(item, key){
			h += template.compile(tpl)({
				title : item.field_name,
				list : item.options,
				id : key
			});
		});
		this.jq.dybox.html(h);
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
			locBox : this.elem.find('.js_loc'),
			dybox : this.elem.find('.js_dybox')
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
		this.jq.dybox.on('click', 'span', function(e){
			var o = $(this);
			if(o.hasClass('active')) return false;
			o.parent().find('span').removeClass('active');

			o.addClass('active');

			self.dy[o.attr('dy_id')] = o.attr('param');
			self.setFilter();
		});

	},
	setFilter : function(){

		var data = {
			subtag : this.tag!=='all'?this.tag:'-1',
			subregion : this.region!=='all'?this.region:'-1'
		};

		data.dy = {};
		_.each(this.dy, function(val, key){
			if(val !== 'all'){
				data.dy['dyf_'+key+'_s'] = val;
			}

		});
		console.log(data);
		util.message.publish('HWSiteStoreListPage', data);
	},
	initEnd : function(){},
	setHtmlEnd : function(data){
		var catId = data.catId || 'all',
			regionId = data.regionId || 'all';
		this.jq.catBox.find('span[param="'+catId+'"]').addClass('active');
		this.jq.locBox.find('span[param="'+regionId+'"]').addClass('active');
		this.jq.dybox.find('span[param="all"]').addClass('active');
	},
	registerMessage : function(e, data){
		this.setTagListHtml(data.catlist);
		this.setDynamicListHtml(data.dynamic.option);
		this.setRegionListHtml(data.subregion);

		this.setHtmlEnd(data);
	}
});

KG.Class.define('SiteStoreAscComp', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-SiteStoreAscComp">',
			//'<b>人气<i class="fa fa-arrow-down"></i></b>',
			'<div class="hw-box">',
				'<label><input checked="true" type="radio" param="0" name="SiteStoreAscComp" />查看全部</label>',
				'<label><input type="radio" param="4" name="SiteStoreAscComp" />只看优惠商家</label>',
				//'<label><input type="radio" param="3" name="SiteStoreAscComp" />只看认证商家</label>',
			'</div>',
			'</div>'
		].join('');
	},
	initEvent : function(){
		this.elem.find('.hw-box label input').change(function(e){
			var o = $(this);
			if(o.prop('checked')){
				var p = o.attr('param');
				util.message.publish('HWSiteStoreListPage', {
					publisher_type : p
				});
			}
		});
	},
	initEnd : function(){

	}
});

KG.Class.define('HWSiteStoreListPage', {
	ParentClass : 'BaseComponent',

	getTemplate : function(){
		return [
			'<div class="hw-HWSiteStoreListPage">',
			'<div role="SiteStoreFilterComp"></div>',

			'<div role="SiteStoreAscComp"></div>',

			'<div class="box js_box nodis"></div>',
			'<div class="box1 js_box1 nodis"></div>',

			'<div class="hw-cpage js_cpage"></div>',
			'</div>'
		].join('');
	},

	initStart : function() {
		this.page = 1;
		this.dy = {};

		this.publisher_type = 0;
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
			next({});
			util.message.publish('SiteStoreFilterComp', {
				catlist : rs.second_tagid,
				dynamic : rs.dy_fields,
				subregion : rs.subregion,

				catId : self.subTagId,
				regionId : self.regionId
			});

			util.loading(false);
			self.setBoxHtml(rs.list);

		});

	},



	registerMessage : function(e, data){
		var self = this;
		if(data.subtag)
			this.subTagId = data.subtag;

		if(data.subregion)
			this.regionId = data.subregion;

		if(data.dy)
			this.dy = data.dy;

		if(data.publisher_type){
			this.publisher_type = data.publisher_type;
		}

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

		this.elem.on('click', '.js_coupon_item', function(e){
			var id = $(this).attr('param');
			util.dialog.showCouponDetail(id);
			return false;
		});
	},

	checkLoadingState : function(list){
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
		var data = {
			tag : this.tagId,
			subtag : this.subTagId,
			subregion : this.regionId,
			publisher_type : this.publisher_type,
			dy : this.dy,
			page : this.page
		};
		if(data.subtag === '-1'){
			delete data.subtag;
		}
		if(data.subregion === '-1'){
			delete data.subregion;
		}

		KG.request.getStoreListByTag(data, function(flag, rs){
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
			'<a href="{{item.entityID_i | toStorePath}}" target="_blank" class="hw-one">',
				'<div class="hw-logo"><img src="{{item.logo[0].path | absImage}}" /></div>',

				'<div class="right">',
					'<h4>{{item.name_cn_cntmw}}</h4>',
					'<span class="hw-address">{{item | storeFullAddress}}</span>',
				'</div>',
			'</a>',
			'{{/each}}'
		].join('');
	},

	// list style
	getItemTemplate1 : function(){
		return [
			'{{each list as item}}',
			'<a href="{{item.entityID | toStorePath}}" target="_blank" class="hw-one1">',
			'<div class="hw-logo" role="BaseLoadingImageBox" data-url="{{item | logoPath}}"></div>',

			'<div class="right">',
				'<h4>{{item.name_cn || item.name_en}}</h4>',
				//'{{if item.verified_time}}<i class="icon icon-v">v</i>{{/if}}',
				'<div class="ca">',
					'<div class="hw-star" role="StarRank" data-rank="{{item.star}}"></div>',
					'<span>{{item.commentnum}}条评论</span>',
				'</div>',
				'<div class="hw-address">地址 : {{item | storeFullAddress}}&nbsp;&nbsp;电话 : {{item.tel}}</div>',

				'{{if item.event}}',
				'<div param="{{item.event.pk_id}}" class="hw-coupon js_coupon_item">',
					'<i class="icon"></i><span>{{item.event.subject}}</span>',
				'</div>',
				'{{/if}}',

			'</div>',
			'</a>',
			'{{/each}}'
		].join('');
	},

	setBoxHtml : function(list, isAppend){

		isAppend = isAppend || false;

		var h = this.getItemTemplate1();
		h = template.compile(h)({
			list : list
		});

		if(isAppend){
			this.jq.box1.append(h).show();
		}
		else{
			if(list.length < 1){
				h = '<div role="HWNoContentDiv" style="height:240px;" data-text="暂无本类商家"></div>';
			}

			this.jq.box1.html(h).show();
		}

		KG.component.init(this.jq.box1);
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

