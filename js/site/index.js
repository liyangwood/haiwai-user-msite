
KG.Class.define('HWIndexFocesImage', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-index-focusimage">',

				'<div id="carousel-11" class="carousel slide" data-ride="carousel">',
					'<ol class="carousel-indicators">',
						'{{each list as item}}',
						'<li data-target="#carousel-11" data-slide-to="{{$index}}" class="{{if $index<1}}active{{/if}}"></li>',
						'{{/each}}',
					'</ol>',

					'<div class="carousel-inner" init-self="true" role="listbox">',
						'{{each list as item}}',
						'<a href="{{item.link}}" target="_blank" class="item img-item{{if $index<1}} active{{/if}}">',
							'<img class="js_cimg" src="{{item.pic}}" />',
						'</a>',
						'{{/each}}',
					'</div>',


				'</div>',

			'</div>'
		].join('');
	},
	getData : function(box, data, next){
		next({
			list : data.list
		});
	},
	initEnd : function(){
		this.elem.find('.carousel').carousel({
			interval: 5000
		});
	}
});

KG.Class.define('HWIndexHotNavComp', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWIndexHotNavComp">',
				'<h4>热门导航</h4>',
				'<dd>',
					'{{each list1 as item}}',
					'{{if item.link}}<a href="{{item.link}}" target="_blank">{{item.title}}</a>{{/if}}',
					'{{/each}}',
				'</dd>',
				'<dd>',
				'{{each list2 as item}}',
					'{{if item.link}}<a href="{{item.link}}" target="_blank">{{item.title}}</a>{{/if}}',
				'{{/each}}',
				'</dd>',
				'<dd>',
				'{{each list3 as item}}',
					'{{if item.link}}<a href="{{item.link}}" target="_blank">{{item.title}}</a>{{/if}}',
				'{{/each}}',
				'</dd>',

			'</div>'
		].join('');
	},
	getData : function(box, data, next) {
		var list1 = data.top;
		var list2 = data.middle;
		var list3 = data.bottom;

		next({
			list1 : list1,
			list2 : list2,
			list3 : list3
		});
	}
});

KG.Class.define('HWSiteIndexAppBanner', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWSiteIndexAppBanner">',
				'<div class="appcom">',
					'<a href="/pc/page/site/landing.html" class="button">商家免费入驻</a>',
				'<div class="slogan">',
				'<p>免费下载商家版App</p>',
				'<p>随时随地轻松管理店铺</p>',
				'</div>',
				'<a class="appad" target="_blank"' +
				' href="'+KG.config.SJAPP_AppleStore_Url+'">',
				'<img src="{{root}}/images_beta/app.png" alt="">',
				'</a>',
				'<a class="appstore" target="_blank"' +
				' href="'+KG.config.SJAPP_AppleStore_Url+'">',
				'<img src="{{root}}/images_beta/appstore.png" alt="">',
				'</a>',
				'</div>',
			'</div>'
		].join('');
	},
	getData : function(box, data, next){
		next({
			root : KG.config.SiteRoot
		});
	}
});

KG.Class.define('HWSiteIndexAppBanner1', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="appcom hw-HWSiteIndexAppBanner1">',
				'<div class="bw">',
					'<a class="hw-btn hw-blue-btn" target="_blank" href="'+KG.config.SJAPP_AppleStore_Url+'">商家免费入驻</a>',
				'</div>',
				'<a class="appad" href="'+KG.config.SJAPP_AppleStore_Url+'" target="_blank">',
					'<img src="{{root}}/images_beta/appp.png" alt="">',
				'</a>',
				'<div class="slogan">',
					'<p>免费下载商家版App</p>',
					'<p>随时随地轻松管理店铺</p>',
				'</div>',
				'<a class="appstore" target="_blank" href="'+KG.config.SJAPP_AppleStore_Url+'">',
					'<img src="{{root}}/images_beta/appstore.png" alt="">',
				'</a>',
			'</div>'
		].join('');
	},
	getData : function(box, data, next){
		next({
			root : KG.config.SiteRoot
		});
	}
});

KG.Class.define('HWSiteIndexHotCoupon', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWSiteIndexHotCoupon">',
				'<dt>',
					'<label>热门优惠</label>',
					'<a href="../site/couponlist.html" class="hw-a">查看全部优惠</a>',
				'</dt>',
				'<dd class="js_box"></dd>',
			'</div>'
		].join('');
	},
	setJqVar : function(){
		return {
			box : this.elem.find('.js_box')
		};
	},
	setListHtml : function(data){
		var h = [
			'{{each list as item}}',
			'<div param="{{item.pk_id}}" class="hw-each">',
				'<div class="hw-logo"><img src="{{item.files[0].path | absImage}}" /></div>',
				'<h4>{{item.bizinfo.name_cn || item.bizinfo.name_en}}</h4>',
				'<span class="hw-address">{{item.bizinfo.city}} {{item.bizinfo.state}}</span>',
				'<h3>{{item.subject}}</h3>',
			'</div>',
			'{{/each}}'
		].join('');
		h = template.compile(h)({list : data});

		this.jq.box.html(h);
	},
	registerMessage : function(e, data){
		this.setListHtml(data);
	},
	initEvent : function(){
		this.elem.on('click', '.hw-each', function(e){
			var id = $(this).attr('param');
			util.dialog.showCouponDetail(id);
		});
	}
});

KG.Class.define('HWSiteIndexNewStoreRecommend', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWSiteIndexNewStoreRecommend">',
			'<dt>',
				'<label>新店推荐</label>',
			'</dt>',
				'<dd class="js_box"></dd>',
			'</div>'
		].join('');
	},
	setJqVar : function(){
		return {
			box : this.elem.find('.js_box')
		};
	},
	registerMessage : function(e, data){
		var list = data;
		var rs = [];
		_.each(list, function(item, index){
			if(index%5 === 0){
				rs[index/5] = [];
			}
			rs[Math.floor(index/5)].push(item);
		});

		this.setListHtml(rs);
	},
	setListHtml : function(data){
		var he = [
			'<div class="item hw-onebox{{if $index<1}} active{{/if}}">',
				'{{each item as one}}',
				'<a class="hw-one" href="{{one.entityID | toStorePath}}" target="_blank">',
					'<img src="{{one.logo | absImage}}" />',
					'<h4>{{one.name_cn || one.name_en}}</h4>',
					'<p class="hw-p">{{one | storeFullAddress}}</p>',
					'<p class="hw-n">{{one.promotion}}</p>',
				'</a>',
				'{{/each}}',
			'</div>'
		].join('');

		var h = [
			'<div id="carousel-22" class="carousel slide" data-ride="carousel">',
			'<ol class="carousel-indicators">',
			'{{each list as item}}',
			'<li data-target="#carousel-22" data-slide-to="{{$index}}" class="{{if $index<1}}active{{/if}}"></li>',
			'{{/each}}',
			'</ol>',

			'<div class="carousel-inner" init-self="true" role="listbox">',
			'{{each list as item}}',
			he,
			'{{/each}}',
			'</div>',

			'<a class="left carousel-control" href="#carousel-22" init-self="true" role="button"' +
			' data-slide="prev">',
			'<span class="icon fa fa-angle-left" aria-hidden="true"></span>',

			'</a>',
			'<a class="right carousel-control" href="#carousel-22" init-self="true" role="button"' +
			' data-slide="next">',
			'<span class="icon fa fa-angle-right" aria-hidden="true"></span>',
			'</a>',


			'</div>'
		].join('');

		h = template.compile(h)({list : data});
		this.jq.box.html(h);
		this.jq.box.find('.carousel').carousel({
			interval: 5000
		});
	}
});

KG.Class.define('HWSiteIndexHotArticle', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWSiteIndexHotArticle">',
			'<dt>',
			'<label>生活指南</label>',
			'</dt>',
			'<dd class="js_box"></dd>',
			'</div>'
		].join('');
	},
	setJqVar : function(){
		return {
			box : this.elem.find('.js_box')
		};
	},

	setLeftBox : function(topData, listData){
		var h = [
			'<div class="detail lef">',
				'<h2 class="stitle">最新文章</h2>',
				'<a href="{{top.id | toArticlePath}}" target="_blank" class="fl top">',
					'<div class="topimg">',
						'<img class="" alt="" src="{{top.pic | absImage}}">',
					'</div>',
					'<div class="toptitle">{{top.title}}</div>',
					'<div class="toptext">',
						'{{top.description}}',
					'</div>',
				'</a>',

				'<div class="m20">',
					'<div class="list">',
						'<ul class="l_ul1">',
						'{{each list as item}}',
						'<li> <span class="round">●</span><a target="_blank" class="check_more2" href="{{item.id | toArticlePath}}">{{item.title}}</a> </li>',
						'{{/each}}',
						'</ul>',
					'</div>',
				'</div>',
		'</div>'
		].join('');
		h = template.compile(h)({
			top : topData,
			list : listData
		});

		this.jq.box.append(h);
	},

	setRightBox : function(rightData){
		var h = [
			'<div class="detail rig">',
			'<h2 class="stitle">热门文章</h2>',
			'<div class="m20">',
			'<div class="list">',
			'<ul class="l_ul1">',
			'{{each list as item index}}',
			'<li> <strong class="roundb"><span>{{index+1}}</span></strong>',
				'<a target="_blank" class="check_more2" href="{{item.id | toArticlePath}}">{{item.title}}</a></li>',
			'{{/each}}',
			'</ul>',
		'</div>',
		'</div>',
		'</div>'
		].join('');

		h = template.compile(h)({
			list : rightData
		});

		this.jq.box.append(h);
	},
	registerMessage : function(e, data){
		this.setLeftBox(data.top, data.list);
		this.setRightBox(data.right);
	}
});

KG.Class.define('HWSiteIndexDataComp', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return '<div class="nodis"></div>';
	},
	getData : function(){

		util.loading(true);
		KG.request.getSiteHomePageData({}, function(flag, rs){
			console.log(rs);
			util.loading(false);

			KG.component.initWithElement($('div[role="HWIndexFocesImage"]'), {
				list : rs.votes
			});
			KG.component.initWithElement($('div[role="HWIndexHotNavComp"]'), rs.bar_hot);

			util.message.publish('HWSiteIndexHotCoupon', rs.classifiedinfo);
			util.message.publish('HWSiteIndexNewStoreRecommend', rs.biz);
			util.message.publish('HWSiteIndexHotArticle', {
				top : rs.lifetools.lifetools_top,
				list : rs.lifetools.lifetools_new,
				right : rs.lifetools.lifetools_hot
			});
		});
	}
});