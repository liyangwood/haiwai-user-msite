
KG.Class.define('HWSiteStoreBigBackgroundImage', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return ['<div class="c-bg"><img src="" /></div>'].join('');
	},
	registerMessage : function(e, url){
		this.elem.css({
			top : $('.hw-site-page').offset().top - 24
		});
		this.elem.find('img').attr('src', url);
	}
});

KG.Class.define('HWSiteStoreDetailPage', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		var T1 = [
			'<div class="c-top">',
				'<img class="hw-logo" src="{{biz.logo.path | absImage}}" />',
				'<p class="hw-renling">申请认领</p>',
				'<div class="c-r">',
					'<h4>{{biz.name_cn}}</h4>',
					'<div class="hw-star" role="StarRank" data-rank="{{biz.rankid}}"></div>',
					'<span class="hw-rp">{{biz.comments.length}}条评论</span>',
					'<p class="hw-p">地址：{{biz | storeFullAddress}}</p>',
					'<p class="hw-p">特色：{{biz.tag_name}}</p>',
					'<p class="hw-p">电话：{{biz.tel}}</p>',
				'</div>',
				'<b class="hw-act js_fav"><i class="icon fa fa-star-o"></i>收藏</b>',
				'<b class="hw-act js_reply" style="left: 800px;"><i class="icon fa fa-external-link"></i>评论</b>',
				'<b class="hw-act js_share" style="left: 900px;"><i class="icon fa fa-wechat"></i>分享</b>',
			'</div>'
		].join('');

		//briefinfo
		var T2 = [
			'<div class="c-box">',
				'<dt class="c-title"><p>简介</p></dt>',
				'<dd class="c-content hw-brief">',
					'{{biz.briefintro}}',
				'</dd>',
			'</div>'
		].join('');

		//dynamic field
		var T3 = [
			'{{if biz.dynamic_list.length > 0}}',
			'<div style="margin-top: 30px;" class="c-box">',
				'<img src="{{biz.logo.path | absImage}}" style="width:100%;" />',
				'<dd class="c-content">',
					'{{each biz.dynamic_list as item}}',
					'<p class="hw-la">{{item.title}} : {{item.value}}</p>',
					'{{/each}}',
				'</dd>',
			'</div>',
			'{{/if}}'
		].join('');

		//timeinfo
		var T4 = [
			'<div style="margin-top: 30px;" class="c-box">',
				'<dt class="c-title"><p>营业时间</p></dt>',
				'<dd class="c-content">',
					'{{each biz.timeinfo_list as item}}',
					'<p class="hw-la">{{item.day}} : {{item.time}}</p>',
					'{{/each}}',
				'</dd>',
			'</div>'
		].join('');

		//coupon
		var T5 = [
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title"><p>本店优惠</p></dt>',
				'<dd class="c-content" style="padding: 0 15px;">',
				'{{each biz.events as item}}',
					'<div class="hw-item hw-cp">',
						'<img src="http://beta.haiwai.com/images_beta/eassyimg.png" />',
						'<h4>{{item.subject}}</h4>',
						'<p class="hw-lt">{{item.count}}人已领取</p>',
					'</div>',
				'{{/each}}',
				'</dd>',
			'</div>'
		].join('');

		var T6 = [
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title"><p>本店文章</p></dt>',
				'<dd class="c-content" style="padding: 0 15px;">',
				'{{each biz.articles as item}}',
				'<a href="../view/article.html?id={{item.id}}" target="_blank" style="display: block;" class="hw-item hw-art">',
					'<img src="{{item.image}}" />',
					'<h4>{{item.title}}</h4>',
					'<p class="hw-lt">{{item.msgbody | htmlToText}}</p>',
				'</a>',
				'{{/each}}',
				'</dd>',
			'</div>'
		].join('');

		//image list
		var T7 = [
			'<div class="c-box">',
				'<dt class="c-title">',
					'<p>图片 ({{biz.files.length}})</p>',
					//'<b>全部图片</b>',
				'</dt>',
				'<dd class="c-content hw-imglist" style="padding: 0 15px;">',
					'{{if biz.files.length>0}}',
					'<div id="carousel-11" class="carousel slide" data-ride="carousel">',


						'<div class="carousel-inner" init-self="true" role="listbox">',
							'{{each biz.image_list as item}}',
							'<div class="item{{if $index<1}} active{{/if}}"><div class="img-item">',
								'{{each item as one}}',
									'<img class="js_cimg" param={{one.index}} src="{{one.path | absImage}}" />',
								'{{/each}}',
							'</div></div>',
							'{{/each}}',
						'</div>',

						'<a class="left carousel-control" href="#carousel-11" init-self="true" role="button"' +
						' data-slide="prev">',
							'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>',

						'</a>',
						'<a class="right carousel-control" href="#carousel-11" init-self="true" role="button"' +
						' data-slide="next">',
							'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>',
						'</a>',
					'</div>',
					'{{/if}}',
				'</dd>',
			'</div>'
		].join('');

		return [
			'<div class="hw-HWSiteStoreDetailPage">',
				T1,
				'<div class="hw-left-box">',
					T7, T5,T6,
				'</div>',
				'<div class="hw-right-box">',
					T2,T3,T4,
				'</div>',
			'</div>'
		].join('');
	},
	makeBizData : function(rs){
		var h = _.map(rs.tags, function(one){
			return one.name;
		});
		rs.tag_name = h.join('，');

		h = _.map(rs.dyfields, function(one){
			return {
				title : one.field_name,
				value : one.value
			};
		});
		rs.dynamic_list = h;

		var xc = {
			monday : '周一',
			tuesday : '周二',
			wednesday : '周三',
			thursday : '周四',
			friday : '周五',
			saturday : '周六',
			sunday : '周日'
		};

		h = [];
		console.log(rs.timeinfo)
		_.each(rs.timeinfo.format, function(v, k){
			if(!v || !v[0]) return true;
			var l = v[0].replace(',', ' - ');
			var t = k.split(' - '),
				tk = xc[t[0]];
			if(t[1]){
				tk += ' - '+xc[t[1]];
			}

			h.push({
				day : tk,
				time : l
			});
		});
		rs.timeinfo_list = h;


		//image list
		h = [];
		_.each(rs.files, function(v, i){
			if(i%4===0){
				h[Math.floor(i/4)] = [];
			}
			v.index = i;
			h[Math.floor(i/4)][i%4] = v;
		});
		rs.image_list = h;
		rs.imagelist = _.map(rs.files, function(item){
			return KG.config.SiteRoot+item.path;
		});

		return rs;
	},
	getData : function(box, data, next){
		var self = this;
		var id = KG.data.get('id');
		KG.request.getStoreDetail({
			id : id
		}, function(flag, rs){
			if(flag){
				var biz = self.makeBizData(rs);
				console.log(biz);
				next({
					id : id,
					biz : biz
				});

				var bg_pic = biz.background_pic.length > 5 ? biz.background_pic : KG.default.BizBigBgPic;
				util.message.publish('HWSiteStoreBigBackgroundImage', bg_pic);
			}
		});

		KG.request.getStoreCommentData({bizId : id}, function(flag, rs){
			console.log(rs);
		});
	},
	initEvent : function(){
		var self = this;
		this.elem.find('.hw-imglist').on('click', '.js_cimg', function(e){
			var index = $(e.target).attr('param');
			util.dialog.showFocusImage(index, self.data.biz.imagelist);
		});

		this.elem.find('.c-top').on('click', '.js_share', function(){
			util.dialog.showQrCode(location.href);
		}).on('click', '.js_fav', function(){
			var o = $(this);
			if(KG.user.get('isLogin')){
				KG.request.addFavForStore({
					bizId : self.data.id
				}, function(flag, rs){
					if(flag){
						o.html('<i class="icon fa fa-star"></i>已收藏').removeClass('js_fav');
					}
					else{
						o.html('<i class="icon fa fa-star"></i>已收藏').removeClass('js_fav');
					}
				});
			}
			else{
				util.dialog.showLoginBox();
			}
		});
	},
	initEnd : function(){
		//$('.carousel').carousel();
	}
});