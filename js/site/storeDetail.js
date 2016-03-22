
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
				'{{if biz.verified=="unverified"}}<p class="hw-renling">申请认领</p>{{/if}}',
				'<div class="c-r">',
					'<h4>{{biz.name_cn}}{{if biz.verified=="yes"}}<i class="icon icon-v">v</i>{{/if}}</h4>',
					'<div class="hw-star" role="StarRank" data-rank="{{biz.star}}"></div>',
					'<a href="#hw-id-reply" class="hw-rp">{{biz.comments.length}}条评论</a>',
					'<p class="hw-p">地址：{{biz | storeFullAddress}}</p>',
					'<p class="hw-p">特色：{{biz.tag_name}}</p>',
					'<p class="hw-p">电话：{{biz.tel}}</p>',
					'{{if biz.events&&biz.events[0]}}<p param="{{biz.events[0].pk_id}}" class="hw-coupon js_coupon_item"><i class="icon"></i>{{biz.events[0].subject}}</p>{{/if}}',
				'</div>',
				'<b class="hw-act js_fav" style="left:750px;"><i class="icon fa fa-star-o"></i>收藏</b>',
				'<b class="hw-act js_reply" style="left: 850px;"><i class="icon fa fa-external-link"></i>评论</b>',
				'<b class="hw-act js_share" style="left: 950px;"><i class="icon fa fa-wechat"></i>分享</b>',
			'</div>'
		].join('');

		//briefinfo
		var T2 = [
			'<div class="c-box">',
				'<dt class="c-title"><p>简介</p></dt>',
				'<dd class="c-content hw-brief">',
					'{{biz.briefintro | htmlToText}}',
				'</dd>',
			'</div>'
		].join('');

		//dynamic field
		var T3 = [

			'<div style="margin-top: 30px;" class="c-box">',
				'<div style="width:100%;height: 300px;" class="js_map"></div>',
				'<dd class="c-content">',
					'{{each biz.dynamic_list as item}}',
					'<p class="hw-la">{{item.title}} : {{item.value}}</p>',
					'{{/each}}',
				'</dd>',
			'</div>'
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
			'{{if biz.events.length>0}}',
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title"><p>本店优惠</p></dt>',
				'<dd class="c-content js_coupon_box" style="padding: 0 15px;">',

				'</dd>',
			'</div>',
			'{{/if}}'
		].join('');

		var T6 = [
			'{{if biz.articles.length>0}}',
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title"><p>本店文章</p></dt>',
				'<dd class="c-content js_article_box" style="padding: 0 15px;">',

				'</dd>',
			'</div>',
			'{{/if}}'
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

		//comment box
		var T8 = [
			'<div id="hw-id-reply" style="margin-top: 15px;" class="c-box js_cmbox">',
				'<dt class="c-title">',
					'<p>评论</p>',
				'</dt>',
				'<dd class="c-content" style="padding: 0">',
					'<div class="db hw-wp">',
						'<a href="javascript:void(0)" class="hw-img">',
							'{{if user.isLogin}}',
								'<img src="{{user.image}}" />',
								'<p>{{user.nick}}</p>',
							'{{else}}',
								'<img src="{{user.defaultImage}}" />',
								'<p>未登录用户</p>',
							'{{/if}}',

						'</a>',
						'<div class="r hw-time">',
							'<div class="js_rank" style="margin-top:2px;" role="StarRank" data-enable="true"' +
							' data-rank="0"></div>',
						'</div>',
						'<div class="r hw-ta nodis">',
							'<textarea class="form-control" rows="2"></textarea>',
							'<button data-loading-text="发表中..." class="hw-btn hw-blue-btn">发表评论</button>',
						'</div>',

					'</div>',
					'<div class="dp"></div>',
					'<nav class="hw-loadingmore-bar"><i class="loading" style="display: none;"></i><b class="js_more">加载更多</b></nav>',
				'</dd>',
			'</div>'
		].join('');

		return [
			'<div class="hw-HWSiteStoreDetailPage">',
				T1,
				'<div class="hw-left-box">',
					T7, T5,T6,T8,
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

		rs.articles = _.map(rs.articles, function(item){
			if(!item.image){
				item.image = KG.default.articleImage;
			}
			return item;
		});

		rs.role = rs.is_owner ? 'admin' : 'user';

		return rs;
	},
	initStart : function(){
		this.bizId = KG.data.get('id');
		this.commentData = [];
		this.lastCommentId = null;
		this.rpId = null;
	},
	getData : function(box, data, next){
		var self = this;
		var id = this.bizId;
		KG.request.getStoreDetail({
			id : id
		}, function(flag, rs){
			if(flag){
				var biz = self.makeBizData(rs);

				console.log(biz);
				next({
					id : id,
					biz : biz,
					user : KG.user.get()
				});

				var bg_pic = biz.background_pic.length > 5 ? biz.background_pic : KG.default.BizBigBgPic;
				util.message.publish('HWSiteStoreBigBackgroundImage', bg_pic);

				//init comment
				self.getCommentData();
			}
		});


	},
	initEvent : function(){
		var self = this;
		this.elem.find('.hw-imglist').on('click', '.js_cimg', function(e){
			var index = $(e.target).attr('param');
			util.dialog.showFocusImage(index, self.data.biz.imagelist);
		});

		this.elem.find('.c-top').on('click', '.js_share', function(){
			var href = 'http://beta.haiwai.com/mobile/ionic/article.html?id='+self.bizId;
			util.dialog.showQrCode(href);
		}).on('click', '.js_fav', function(){
			var o = $(this);
			if(KG.user.get('isLogin')){
				KG.request.addFavForStore({
					bizId : self.data.id
				}, function(flag, rs){
					if(flag){
						o.html('<i class="icon fa fa-star"></i>已收藏').removeClass('js_fav').addClass('js_fav_on');
					}
					else{
						alert(rs);
					}
				});
			}
			else{
				util.dialog.showLoginBox();
			}
		}).on('click', '.js_fav_on', function(){
			var o = $(this);
			KG.request.deleteMyFavStore({
				id : self.data.id
			}, function(flag, rs){
				if(flag){
					o.html('<i class="icon fa fa-star-o"></i>收藏').removeClass('js_fav_on').addClass('js_fav');
				}
			});
		}).on('click', '.js_reply', function(){
			self.rpId = null;
			self.showReplyTextarea();
		});

		this.elem.find('.js_rank').click(function(){
			if(!KG.user.get('isLogin')){
				util.dialog.showLoginBox();
				return false;
			}

			self.showReplyTextarea();
		});

		this.elem.find('.js_cmbox .db .hw-ta').find('.hw-btn').click(function(){
			self.sendComment($(this));
		});

		this.elem.find('.js_cmbox').on('click', '.js_more', function(e){
			self.lastCommentId = _.last(self.commentData).id;
			self.getCommentData();
		});

		this.elem.find('.js_cmbox').on('click', '.js_rp', function(e){

			var box = $(this).closest('.hw-rpeach');
			if(box.find('.js_rpbox').length > 0){
				box.find('.js_rpbox').remove();
				return false;
			}
			self.elem.find('.js_cmbox').find('.js_rpbox').remove();

			self.rpId = $(this).attr('param');
			var h = $(self.getCommentRpHtml(self.rpId));
			h.appendTo(box).slideDown(200, function(){
				box.find('textarea').focus();
			});

		}).on('click', '.js_like', function(e){
			var id = $(e.target).attr('param');
			KG.request.addLikeToStoreComment({id : id}, function(flag, rs){
				if(flag){
					$(e.target).html('赞('+rs+')');
				}
			});
		}).on('click', '.js_jp', function(e){
			var id = $(e.target).attr('param');
			KG.request.reportStoreComment({
				id : id,
			}, function(flag, rs){
				//if(flag){
					util.toast.alert('举报成功，感谢您的参与');
				//}

			});
		});

		this.elem.find('.js_cmbox').on('click', '.js_rpbox .hw-btn', function(){
			var box = self.elem.find('.js_cmbox').find('.js_rpbox');
			var id = box.attr('param');

			self.replyComment(id, box);
		});

		this.elem.on('click', '.hw-renling', function(e){
			var h = '<div class="hw-icon"><i class="fa fa-check"></i></div>';
			util.dialog.show({
				foot : false,
				title : h+'成功提交申请，我们会在24小时内电话联系您。',
				'class' : 'hw-dialog-alert',
				body : '<p><input class="form-control" type="text" placeholder="请输入您的联系电话" /></p>'
			});
		});

		this.elem.on('click', '.js_coupon_item', function(e){
			var id = $(this).attr('param');
			util.dialog.showCouponDetail(id);
		});
	},
	showReplyTextarea : function(val){
		var box = this.elem.find('.js_cmbox .db'),
			b1 = box.find('.hw-ta');

		if(b1.hasClass('nodis')){
			util.dom.scrollTo(box.offset().top);
			b1.removeClass('nodis');
		}


		if(val){
			b1.find('textarea').val(val).focus();
		}
	},
	replyComment : function(rpId, box){
		var self = this;
		var ta = box.find('textarea'),
			val = ta.val();
		if(!val){
			util.dom.showErrorPopover(ta, '请输入评论');
			return;
		}


		KG.request.sendStoreComment({
			bizId : self.bizId,
			msg : val,
			id : rpId
		}, function(flag, rs){
			box.remove();

			if(flag){
				console.log(rs);

				var user = KG.user.get();
				var sd = {
					basecode : rs,
					dataID : self.bizId,
					dataType : '2',
					datetime : new Date().getTime(),
					fk_entityID : self.bizId,
					id : rs,
					is_report : '0',
					msg : val,
					treelevel : '0',
					userID : user.userid,
					userinfo : user
				};

				var tmp = _.find(self.commentData, {id:rpId});
				tmp.reply = sd;
				tmp.treelevel = '1';

				self.setCommentBoxHtml();

			}
		});
	},

	sendComment : function(btnObj){
		var self = this;
		var ta = this.elem.find('.js_cmbox .db .hw-ta').find('textarea'),
			val = ta.val();
		if(!val){
			util.dom.showErrorPopover(ta, '请输入评论', {
				trigger : 'focus'
			});
			ta.focus();
			return;
		}
		else{
			util.dom.showErrorPopover(ta, false);
		}
		var rank = KG.component.getObj(this.elem.find('.js_rank'));

		btnObj.button('loading');
		KG.request.sendStoreComment({
			bizId : self.bizId,
			msg : val,
			star : rank.getValue()
		}, function(flag, rs){
			btnObj.button('reset');

			if(flag){
				console.log(rs);

				var user = KG.user.get();
				var sd = {
					basecode : rs,
					dataID : self.bizId,
					dataType : '2',
					datetime : new Date().getTime(),
					fk_entityID : self.bizId,
					id : rs,
					is_report : '0',
					msg : val,
					star : rank.getValue(),
					treelevel : '0',
					userID : user.userid,
					userinfo : user
				};

				self.commentData = [sd].concat(self.commentData);
				self.setCommentBoxHtml();

				rank.setValue(0);
				ta.val('');
				self.rpId = null;
				self.elem.find('.js_cmbox .db .hw-ta').addClass('nodis');
			}
		});
	},
	initEnd : function(){
		var self = this;

		var address = template.helpers.storeFullAddress(this.data.biz);


		var startFN = KG.data.get('startFN');
		startFN && util.getLatAndLongWithAddress(address, function(geo){
			startFN(geo.lat, geo.lng, {
				name : 'Test Store',
				elem : self.elem.find('.js_map')[0]
			});
		});

		if(this.data.biz.is_booked){
			this.elem.find('.js_fav').html('<i class="icon fa fa-star"></i>已收藏').removeClass('js_fav').addClass('js_fav_on');
		}

		self.initArticleBox();
		self.initCouponBox();

		if(location.hash){
			util.delay(function(){
				location.href = location.hash;
			}, 1000);
		}
	},

	getCommentRpHtml : function(replyId){
		var h = [
			'<div param="{{replyId}}" style="display: none;" class="js_rpbox c-rp-area">',
				'<textarea class="form-control"></textarea>',
				'<button class="hw-btn hw-blue-btn">回复</button>',
			'</div>'
		].join('');

		return template.compile(h)({
			replyId : replyId || ''
		});
	},

	getCommentData : function(callback){
		callback = callback || util.noop;
		var self = this;
		var id = this.bizId,
			lastid = this.lastCommentId;
		var m = this.elem.find('.js_cmbox .hw-loadingmore-bar'),
			m1 = m.find('.loading'),
			m2 = m.find('.js_more');

		m1.show();
		m2.hide();
		KG.request.getStoreCommentData({
			bizId : id,
			lastid : lastid
		}, function(flag, rs){
			if(flag){
				console.log(rs);
				if(rs.length > 20){
					m1.hide();
					m2.show();
				}
				else{
					m.hide();
				}

				self.commentData = self.commentData.concat(rs);
				self.setCommentBoxHtml();
				callback(rs);
			}
			else{
				m.hide();
			}
		});
	},

	setCommentBoxHtml : function() {
		var h = [
			'{{each list as item}}',
			'<div class="hw-rpeach">',
			'<a href="javascript:void(0)" class="hw-img">',
				'<img src="{{item.userinfo.avatar_url | absImage}}" />',
				'<p>{{item.userinfo.nick}}</p>',
			'</a>',
			'<div class="r hw-time">',
				'<div role="StarRank" data-rank={{item.star}}></div>',
				'<span>{{item.datetime | formatDate}}</span>',
			'</div>',
			'<p class="r hw-msg">{{item.msg}}</p>',
			'<p class="r hw-action">',
				'{{if role=="admin"}}<span param="{{item.id}}" nick="{{item.userinfo.nick}}"' +
				' class="js_rp">回复</span>{{/if}}',
				'<span param="{{item.id}}" class="js_like">赞({{item.buzz}})</span>',
				'<span param="{{item.id}}" class="js_jp">举报</span>',
			'</p>',

			'{{if item.treelevel=="1"}}',
			'<div class="c-rp">',
				'<img src="{{item.reply.userinfo.avatar_url | absImage}}" />',
				'<p>{{item.reply.userinfo.nick}}回复：</p>',
				'<p>{{item.reply.msg}}</p>',
			'</div>',
			'{{/if}}',

			'</div>',
			'{{/each}}'
		].join('');

		var box = this.elem.find('.js_cmbox'),
			list = this.commentData;

		h = template.compile(h)({
			list: list,
			role : this.data.biz.role
		});
		box.find('.c-title p').html('评论（' + list.length + '）');
		box.find('.c-content .dp').html(h);

		KG.component.init(box.find('.c-content .dp'));
	},

	initArticleBox : function(){
		var self = this;
		if(!this.data.biz.articles || this.data.biz.articles.length < 1){
			return false;
		}

		var box = this.elem.find('.js_article_box').data('number', 0),
			data = this.data.biz.articles;
		var more = function(){
			var n = box.data('number'),
				f = false,
				rs = [];
			if(data.length > (n+5)){
				f = true;
				rs = data.slice(0, n+5);
			}
			else{
				rs = data.slice(0, data.length);
			}
			box.data('number', rs.length);
			self.setArticleListHtml(rs, f);
		};

		box.on('click', '.hw-more', more);
		more();
	},

	setArticleListHtml : function(list, flag){
		var box = this.elem.find('.js_article_box');
		var h = [
			'{{each list as item}}',
			'<a href="../view/article.html?id={{item.id}}" target="_blank" style="display: block;" class="hw-item hw-art">',
			'<img src="{{item.image}}" />',
			'<h4>{{item.title}}</h4>',
			'<p class="hw-lt">{{item.msgbody | htmlToText}}</p>',
			'</a>',
			'{{/each}}',
			'{{if flag}}<p class="hw-more">查看更多</p>{{/if}}'
		].join('');

		h = template.compile(h)({
			list : list,
			flag : flag
		});

		box.html(h);
	},

	initCouponBox : function(){
		var self = this;
		if(!this.data.biz.events || this.data.biz.events.length < 1){
			return false;
		}

		var box = this.elem.find('.js_coupon_box').data('number', 0),
			data = this.data.biz.events;
		var more = function(){
			var n = box.data('number'),
				f = false,
				rs = [];
			if(data.length > (n+5)){
				f = true;
				rs = data.slice(0, n+5);
			}
			else{
				rs = data.slice(0, data.length);
			}
			box.data('number', rs.length);
			self.setCouponListHtml(rs, f);
		};

		box.on('click', '.hw-more', more);
		more();
	},

	setCouponListHtml : function(list, flag){
		var box = this.elem.find('.js_coupon_box');
		var h = [
			'{{each list as item}}',
			'<div class="hw-item hw-cp js_coupon_item" param="{{item.pk_id}}" style="cursor: pointer">',
			'<img src="http://beta.haiwai.com/images_beta/eassyimg.png" />',
			'<h4>{{item.subject}}</h4>',
			'<p class="hw-lt">{{item.count}}人已领取</p>',
			'</div>',
			'{{/each}}',
			'{{if flag}}<p class="hw-more">查看更多</p>{{/if}}'
		].join('');
		h = template.compile(h)({
			list : list,
			flag : flag
		});

		box.html(h);
	}
});