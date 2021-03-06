

KG.Class.define('HWSiteSearchStoreListPage', {
	ParentClass : 'BaseComponent',

	getTemplate : function(){
		return [
			'<div class="hw-HWSiteStoreListPage">',
				'<div class="hw-SiteStoreSearchFilterComp js_sb1">',
					'“{{keyword}}”的搜索结果',
				'</div>',

				'<div class="box js_box nodis"></div>',
				'<div class="box1 js_box1 nodis"></div>',

				'<div class="hw-cpage js_cpage"></div>',
			'</div>'
		].join('');
	},

	initStart : function() {
		this.keyword = KG.data.get('keyword');
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

		if(!this.keyword){
			alert('wrong param');
			return;
		}

		util.loading(true);
		self.getListData(function(rs){
			next({
				keyword : self.keyword
			});
			util.loading(false);

			if(rs.length > 0){
				self.setBoxHtml(rs);
			}
			else{
				self.setEmptyHtml();
			}

		});

	},

	setEmptyHtml : function(){
		var loc = KG.component.getObj($('#js_header_comp')).getCurrentLocation().name;

		this.elem.find('.js_sb1').remove();
		var h = [
			'<div class="hw-empty">',
				'<p style="margin-bottom:20px;">对不起，在'+loc+'没有“'+this.keyword+'”的搜索结果。您可以：</p>',
				'<p style="margin:0;">1. 试着换换搜索词</p>',
				'<p style="margin:0;">2. 鼠标放到导航栏的本地商家，看看还有哪些分类</p>',
				'<p>3. 点击网页左上角的地区名称，切换所在地区</p>',
			'</div>'
		].join('');

		this.jq.box1.show().html(h);
	},

	registerMessage : function(e, data){

	},

	initEvent : function(){
		var self = this;

		this.jq.pageBox.on('click', '.js_more', function(){
			self.jq.pageBox.find('.loading').show();
			self.jq.pageBox.find('.js_more').hide();

			self.page++;
			self.getListData(function(rs){
				self.setBoxHtml(rs, true);
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

		KG.request.searchStoreByKeyword({
			keyword : self.keyword,
			page : self.page
		}, function(flag, rs){
			console.log(rs);
			if(flag){
				callback(rs);
				self.checkLoadingState(rs);
			}
			else{
				callback([]);
				self.checkLoadingState([]);
			}

		});

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
			'<div class="hw-address">地址 : {{item | storeFullAddress}}</div>',

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
			this.jq.box1.html(h).show();
		}

		KG.component.init(this.jq.box1);
	},
	setLoadingStateHtml : function(){
		var h = [
			'<nav class="c-lb"><i class="loading" style="display: none;"></i><b class="js_more">加载更多</b></nav>'
		].join('');

		this.elem.find('.js_cpage').html(h);
	}
});