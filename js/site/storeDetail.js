
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

KG.Class.define('UploadStoreCommentImage', {
	ParentClass : 'BaseUploadImage',
	getTemplate : function(){
		return [
			'<div class="hw-UploadStoreCommentImage">',
			'<div class="hw-add js_add">',
			'<i style="width:50px;height:50px;position: relative;top:5px;" class="icon hw-icon-plus"></i>',
			'<p>上传图片</p>',
			'<input class="js_input" type="file" />',
			'</div>',
			'</div>'
		].join('');
	},
	defineProperty : function(){
		return {
			image : {}
		};
	},
	getData : function(box, data, next){
		next({
			image : this.prop.image
		});
	},

	setAddStatus : function(f){
		var r;
		if(f){
			r = '上传中...';
		}
		else{
			r = '上传图片';
		}
		this.jq.add.find('p').html(r);
	},

	setJqVar : function(){
		return {
			add : this.elem.find('.js_add'),
			fileInput : this.elem.find('input[type="file"]')
		};
	},
	initEvent : function(){
		var self = this;

		this.jq.fileInput.change(function(){
			var file = this.files[0];

			self.setAddStatus(true);
			self.uploadImageFn(file, function(url, json){
				self.addNewImage(url);

				self.check();
				self.setAddStatus(false);
			});

			$(this).val('');

		});

		this.elem.on('click', '.js_del', function(){
			var o = $(this);
			util.dialog.confirm1({
				YesText : '删除',
				msg : '您确定要删除这张照片吗？',
				YesFn : function(callback){

					o.parent('.js_img').remove();
					self.check();

					callback();
				}
			});
			return false;
		});

	},

	check : function(){
		var list = this.getValue();
		if(list.length > 4){
			this.jq.add.hide();
		}
		else{
			this.jq.add.show();
		}
	},

	getValue : function(){
		var list = this.elem.find('.js_img');
		return _.map(list, function(elem){
			return $(elem).find('img').attr('src');
		});
	},

	getEachHtml : function(url){
		var h = [
			'<div class="hw-one js_img">',
			'<img src="{{url}}" />',
			'<b class="js_del">删除</b>',
			'</div>'
		].join('');
		return template.compile(h)({url : url});
	},
	addNewImage : function(src){
		var h = this.getEachHtml(src);
		this.jq.add.after(h);
	},
	uploadImageFn : function(file, callback){
		var self = this;
		util.uploadImage(file, function(url){
			var url = KG.config.SiteRoot+url;


			callback(url);
		});
	},
	reset : function(){
		this.elem.find('.js_img').remove();
		this.check();
	}
});

KG.Class.define('HWSiteStoreDetailPage', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		var T1 = [
			'<div class="c-top">',
				'<div role="BaseLoadingImageBox" class="hw-logo" data-url="{{biz | logoPath}}"></div>',
				'{{if biz.verified=="unverified"}}<p class="hw-renling">申请认领</p>{{/if}}',
				'<div class="c-r">',
					'<h4>{{biz.name_cn||biz.name_en}}',
						'{{if biz.visible==="-1"}}（暂停营业）{{/if}}',
					'</h4>',
			//{{if biz.verified=="yes"}}<i class="icon icon-v">v</i>{{/if}}

					'<div class="hw-star" role="StarRank" data-rank="{{biz.star}}"></div>',
					'<a href="#hw-id-reply" class="hw-rp">{{biz.commentnum}}条评论</a>',
					'<p class="hw-p">地址：{{biz | storeFullAddress}}</p>',
					'<p class="hw-p">特色：{{biz.tag_name}}</p>',
					'<p class="hw-p">电话：{{biz.tel | formatPhone}}</p>',

					'{{if biz.wechat}}',
					'<p class="hw-p">微信号 : {{biz.wechat}}</p>',
					'{{/if}}',

					'{{if biz.events&&biz.events[0]}}<p param="{{biz.events[0].pk_id}}" class="hw-coupon js_coupon_item"><i class="icon"></i><span>{{biz.events[0].subject}}</span></p>{{/if}}',
				'</div>',
				'<b class="hw-act js_fav" style="left:750px;"><i class="icon fa fa-heart-o"></i>收藏</b>',
				'<b class="hw-act js_reply" style="left: 850px;"><i class="icon fa fa-pencil-square-o"></i>评论</b>',
				'<b class="hw-act js_share" style="left: 950px;"><i class="icon fa fa-wechat"></i>分享</b>',
			'</div>'
		].join('');

		//briefinfo
		var T2 = [
			'<div style="margin-top: 16px;" class="c-box">',
				'<dt class="c-title"><p>简介</p></dt>',
				'<dd class="c-content hw-brief js_desc">',
					'{{#biz.briefintro | htmlToText}}',
				'</dd>',
			'</div>'
		].join('');

		//dynamic field
		var T3 = [

			'<div style="margin-top: 16px;" class="c-box">',
				'<div role="BaseLoadingImageBox" style="width:100%;height: 190px;" class="js_map"></div>',
				'<dd class="c-content" style="padding-top:0;">',
					'{{each biz.dynamic_list as item}}',
					'{{if item.value}}',
					'<p class="hw-la">{{item.title}} : {{item.value}}</p>',
					'{{/if}}',

					'{{/each}}',

					'{{if biz.website}}',
					'<p class="hw-la">网址 : <a target="_blank" href="{{biz.website | siteUrl}}">{{biz.website}}</a></p>',
					'{{/if}}',

				'</dd>',
			'</div>'
		].join('');

		//timeinfo
		var T4 = [
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title"><p>营业时间</p></dt>',
				'<dd class="c-content" style="padding-top:10px;padding-bottom:10px;">',
					'{{each biz.timeinfo_list as item}}',
					'<p style="border-bottom:none;height:28px;line-height: 28px;" class="hw-la">{{item.day}} : {{item.time}}</p>',
					'{{/each}}',

					'{{if biz.timeinfo_list.length < 1}}',
					'<p style="border-bottom:none;height:28px;line-height: 28px;" class="hw-la">还没有设置营业时间</p>',
					'{{/if}}',

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
			'{{if biz.files.length > 0}}',
			'<div style="margin-top: 15px;" class="c-box">',
				'<dt class="c-title">',
					'<p>图片 ({{biz.files.length}})</p>',
					'<b class="js_showimg hand">全部图片</b>',
				'</dt>',
				'<dd class="c-content hw-imglist" style="padding: 0 15px;">',
					'{{if biz.files.length>0}}',
					'<div id="carousel-11" class="carousel slide" data-ride="carousel">',


						'<div class="carousel-inner" init-self="true" role="listbox">',
							'{{each biz.image_list as item}}',
							'<div class="item{{if $index<1}} active{{/if}}">',
								'{{each item as one}}',
									//'<div class="img-item"><img class="js_cimg" param={{one.index}} src="{{one.path | absImage}}" /></div>',
			'<div class="img-item js_cimg" param="{{one.index}}" data-url="{{one.path | absImage}}" role="BaseLoadingImageBox"></div>',
								'{{/each}}',
							'</div>',
							'{{/each}}',
						'</div>',

						'<a class="left carousel-control" href="#carousel-11" init-self="true" role="button"' +
						' data-slide="prev">',
							'<span style="left:-5px;" class="icon fa fa-angle-left" aria-hidden="true"></span>',

						'</a>',
						'<a class="right carousel-control" href="#carousel-11" init-self="true" role="button"' +
						' data-slide="next">',
							'<span style="left:5px;" class="icon fa fa-angle-right" aria-hidden="true"></span>',
						'</a>',
					'</div>',
					'{{/if}}',
				'</dd>',
			'</div>',
			'{{/if}}'
		].join('');

		//comment box
		var T8 = [
			'<div id="hw-id-reply" style="margin-top: 15px;" class="c-box js_cmbox">',
				'<dt class="c-title">',
					'<p>评论</p>',
					'<b class="hw-blue hand js_wreply"><i class="icon fa fa-pencil-square-o"></i>写评论</b>',
				'</dt>',
				'<dd class="c-content" style="padding: 0">',
					'<div class="db hw-wp">',
						'<div class="hw-img">',
							'{{if user.isLogin}}',
								'<img src="{{user.image}}" />',
								'<p>{{user.nick}}</p>',
							'{{else}}',
								'<img src="{{user.defaultImage}}" />',
								'<p>未登录用户</p>',
							'{{/if}}',

						'</div>',
						'<div class="r hw-time">',
							'<div class="js_rank" style="margin-top:2px;" role="StarRank" data-enable="true"' +
							' data-rank="0"></div>',
						'</div>',
						'<div class="r hw-ta nodis">',
							'<textarea class="form-control" placeholder="请写下您的评论~"></textarea>',
							'<div class="js_comment_img" role="UploadStoreCommentImage"></div>',
							'<button data-loading-text="发表中..." class="hw-btn hw-blue-btn">发表评论</button>',
						'</div>',

					'</div>',
					'<div class="df js_rpcat">',
						'<b class="">全部评论</b>',
						'<b>图片评论</b>',
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
					T4, T3, T2,
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
				value : _.isArray(one.value) ? one.value.join('，') : one.value
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
		if(rs.timeinfo){
			_.each(rs.timeinfo.format, function(v, k){
				if(!v || !_.isArray(v)) return true;
				_.each(v, function(x, i){
					x = x.split(',');
					var l;
					if(_.contains(x, '休业')){
						l = '休息';
					}
					else{
						l = x.join(' - ');
					}


					var t='', tk='';
					if(true || i<1){
						t = k.split(' - ');
						tk = xc[t[0]];
						if(t[1]){
							tk += ' - '+xc[t[1]];
						}
					}
					h.push({
						day : tk,
						time : l
					});
				});

			});
		}

		rs.timeinfo_list = h;


		//image list
		h = [];
		rs.files = rs.files.reverse();
		_.each(rs.files, function(v, i){
			if(i%4===0){
				h[Math.floor(i/4)] = [];
			}
			v.index = i;
			h[Math.floor(i/4)][i%4] = v;
		});
		rs.image_list = h;
		rs.imagelist = _.map(rs.files, function(item){
			if(/^http/.test(item.path)){
				return item.path
			}
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
		this.commentData_pic = [];
		this.lastCommentId_pic = null;
		this.lastCommentId = null;
		this.commentType = 'all';  //all, pic
		this.rpId = null;

		this.commentImage = null;
	},
	getData : function(box, data, next){
		var self = this;
		var id = this.bizId;
		KG.request.getStoreDetail({
			id : id
		}, function(flag, rs){
			if(flag){
				var biz = self.makeBizData(rs);

				next({
					id : id,
					biz : biz,
					user : KG.user.get()
				});

				var bg_pic = biz.background_pic.length > 5 ? biz.background_pic : KG.default.BizBigBgPic;
				util.message.publish('HWSiteStoreBigBackgroundImage', bg_pic);

				//init comment
				//self.getCommentData();
			}
			else{
				util.toast.showError(rs);
			}
		});

	},

	showFocusImage : function(index){
		var self = this;
		var obj = util.dialog.showFocusImage(index, self.data.biz.imagelist);
		var hh = '<div style="position: relative;font-size: 16px;line-height: 25px;top:-10px;" class="hand"><i' +
			' style="margin-right:10px;font-size:18px;position:relative;top:2px;"' +
			' class="icon glyphicon glyphicon-th"></i>返回相册</div>';
		hh = $(hh);
		hh.click(function(){
			util.dialog.showImageList(self.data.biz.imagelist, function(n){
				self.showFocusImage(n);
			});
		});
		obj.find('.carousel').before(hh);
	},
	initEvent : function(){
		var self = this;
		this.elem.find('.hw-imglist').on('click', '.js_cimg', function(e){
			var index = $(this).attr('param');
			self.showFocusImage(index);
		});
		this.elem.on('click', '.js_showimg', function(){
			util.dialog.showImageList(self.data.biz.imagelist, function(n){
				self.showFocusImage(n);
			});
		});

		this.elem.find('.c-top').on('click', '.js_share', function(){
			var href = util.path.toMSiteStore(self.bizId);
			util.dialog.showQrCode(href);
		}).on('click', '.js_fav', function(){
			var o = $(this);
			if(KG.user.get('isLogin')){
				KG.request.addFavForStore({
					bizId : self.data.id
				}, function(flag, rs){
					if(flag){
						o.html('<i class="icon fa fa-heart"></i>已收藏').removeClass('js_fav').addClass('js_fav_on');
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
				bizId : self.data.id
			}, function(flag, rs){
				if(flag){
					o.html('<i class="icon fa fa-heart-o"></i>收藏').removeClass('js_fav_on').addClass('js_fav');
				}
			});
		}).on('click', '.js_reply', function(){

			if(KG.user.get('isLogin')){
				self.rpId = null;
				self.showReplyTextarea();
			}
			else{
				util.dialog.showLoginBox()
			}
		});

		this.elem.find('.js_rank').click(function(){
			if(!KG.user.get('isLogin')){
				util.dialog.showLoginBox();
				return false;
			}

			var rank = KG.component.getObj(self.elem.find('.js_rank'));
			console.log(rank.getValue());
			if(parseFloat(rank.getValue()) > 0){
				self.showReplyTextarea();
			}
		});
		this.elem.on('click', '.js_wreply', function(){

			if(KG.user.get('isLogin')){
				self.showReplyTextarea();
			}
			else{
				util.dialog.showLoginBox()
			}
		});

		this.elem.find('.js_cmbox .db .hw-ta').find('.hw-btn').click(function(){
			self.sendComment($(this));
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

			var param1 = $(this).attr('param1');
			h.appendTo(box).slideDown(200, function(){
				if(param1){
					box.find('textarea').val(param1);
				}
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
			var o = $(this),
				name = o.parents('.hw-rpeach').find('.hw-img').find('p[title]').text(),
				id = o.attr('param');

			self.showJuBaoReplyDialog({
				toName : name,
				id : id
			});
		});

		this.elem.find('.js_cmbox').on('click', '.js_rpbox .hw-btn', function(){
			var box = self.elem.find('.js_cmbox').find('.js_rpbox');
			var id = box.attr('param');

			self.replyComment(id, box);
		});

		this.elem.on('click', '.hw-renling', function(e){
			if(!KG.user.get('isLogin')){
				util.dialog.showLoginBox();
				return false;
			}


			var h = '<div class="hw-icon"><i class="fa fa-check"></i></div>';
			util.dialog.show({
				foot : true,
				title : h+'成功提交申请，我们会在24小时内电话联系您。',
				'class' : 'hw-confirm',
				body : '<div style="text-align:center;"><div style="width:400px;margin:0 auto;" class="js_tel" role="BaseInput" data-label="请输入您的联系电话" data-require="true" placeholder="e.g. 5107687776"></div></div>',
				YesFn : function(callback){
					var obj = util.dialog.get(),
						jq = KG.component.getObj(obj.find('.js_tel')),
						val = jq.getValue();
					if(!val){
						jq.showError('请输入您的联系电话');
						jq.focus();
						return false;
					}
					else if(!util.validate.AmericanPhone(val)){
						jq.showError('电话格式错误');
						jq.focus();
						return false;
					}
					else{
						jq.showError();
					}

					KG.request.pcRenZhengStore({
						tel : val,
						bizId : self.bizId
					}, function(flag, rs){
						if(flag){
							util.toast.alert('提交成功， 请留意您的电话');
						}
						else{
							util.toast.showError(rs);
						}
					});


				},
				beforeShowFn : function(){
					var obj = this;
					KG.component.init(obj.find('.hw-body'));
				}
			});
		});

		this.elem.on('click', '.js_coupon_item', function(e){
			var id = $(this).attr('param');
			util.dialog.showCouponDetail(id);
		});

		this.elem.on('click', '.js_showCommentBidImage', function(e){
			var o = $(this);
			var list = o.parents('.hw-rpimgbox').find('img');
			list = _.map(list, function(one){
				var src=$(one).attr('src');
				if(src.indexOf('s_pic0')>0){
					src = src.replace('s_pic0', 'pic0');
				}
				return src;
			});

			util.dialog.showFocusImage(o.attr('param'), list);
		});

		//TODO
		var catb = this.elem.find('.js_rpcat').find('b');
		catb.eq(0).click(function(){
			var o = $(this);
			if(o.hasClass('active')){
				return false;
			}
			o.addClass('active');
			catb.eq(1).removeClass('active');

			self.commentType = 'all';
			self.commentData = [];
			self.getCommentData(function(json){
				catb.eq(0).html('全部评论('+json.all+')');
				catb.eq(1).html('图片评论('+json.has_pic+')');
			});
		});
		catb.eq(1).click(function(){
			var o = $(this);
			if(o.hasClass('active')){
				return false;
			}
			o.addClass('active');
			catb.eq(0).removeClass('active');

			self.commentType = 'pic';
			self.commentData_pic = [];
			self.getCommentData(function(json){
				catb.eq(0).html('全部评论('+json.all+')');
				catb.eq(1).html('图片评论('+json.has_pic+')');
			});
		});

		this.elem.find('.js_cmbox').on('click', '.js_more', function(e){
			if(self.commentType === 'pic'){
				self.lastCommentId_pic = _.last(self.commentData_pic).id;
			}
			else{
				self.lastCommentId = _.last(self.commentData).id;
			}
			self.getCommentData();
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

		rpId = rpId.split('_');
		var comment_userid = rpId[1];
		rpId = rpId[0];

		KG.request.sendStoreComment({
			bizId : self.bizId,
			bizName : self.data.biz.name_cn||self.data.biz.name_en,
			comment_userid :comment_userid,
			msg : val,
			id : rpId
		}, function(flag, rs){
			box.remove();

			if(flag){
				console.log(rs);

				var user = KG.user.get();
				var sd = {
					basecode : rpId,
					dataID : self.bizId,
					dataType : '2',
					datetime : new Date().getTime(),
					fk_entityID : self.bizId,
					id : rs,
					is_report : '0',
					msgbody : val,
					treelevel : '0',
					userID : user.userid,
					userinfo : user
				};

				var tmp = _.find(self.commentData, {id:rpId.toString()});
				tmp.reply = sd;
				tmp.treelevel = '0';

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

		if(rank.getValue()===0){
			util.dom.showErrorPopover(rank.elem, '请选择评星', {
				trigger : 'hover'
			});
			return;
		}
		else{
			util.dom.showErrorPopover(rank.elem, false);
		}

		var commentImageList = this.commentImage.getValue();
		var param = {
			bizId : self.bizId,
			star : rank.getValue(),
			bizName : self.data.biz.name_cn||self.data.biz.name_en,
			ownerID : self.data.biz.ownerID
		};
		if(commentImageList.length > 0){
			param.has_pic = true;
		}
		val += _.map(commentImageList, function(url){
			return '<img src="'+url+'" />';
		}).join('');
		param.msg = val;

		btnObj.button('loading');
		KG.request.sendStoreComment(param, function(flag, rs){
			btnObj.button('reset');

			if(flag){
				console.log(rs);

				var user = KG.user.get();
				var sd = {
					basecode : rs.toString(),
					dataID : self.bizId,
					dataType : '2',
					datetime : new Date().getTime(),
					fk_entityID : self.bizId,
					id : rs.toString(),
					is_report : '0',
					msgbody : util.removeHtmlTag(val),
					star : rank.getValue(),
					treelevel : '0',
					userID : user.userid,
					userinfo : user,
					buzz : 0,
					pic : commentImageList
				};

				if(self.commentType === 'pic' && param.has_pic){
					self.commentData_pic = [sd].concat(self.commentData_pic);
					self.setCommentBoxHtml();
				}
				else if(self.commentType === 'all'){
					self.commentData = [sd].concat(self.commentData);
					self.setCommentBoxHtml();
				}

				self.setCommentBoxHtml();

				rank.setValue(0);
				ta.val('');
				self.commentImage.reset();
				self.rpId = null;
				self.elem.find('.js_cmbox .db .hw-ta').addClass('nodis');
			}
		});
	},
	initEnd : function(){
		var self = this;

		var address = template.helpers.storeFullAddress(this.data.biz);


		//var startFN = KG.data.get('startFN');
		//startFN && util.getLatAndLongWithAddress(address, function(geo){
		//	startFN(geo.lat, geo.lng, {
		//		name : 'Test Store',
		//		elem : self.elem.find('.js_map')[0]
		//	});
		//});
		var map = KG.component.getObj(this.elem.find('.js_map'));
		util.getLatAndLongWithAddress(address, function(geo){
			var url = KG.data.get('getStaticMap')(geo.lat, geo.lng);
			map.setUrl(url);

			map.elem.addClass('hand').click(function(){
				console.log(geo);
				var id = util.getUuid();
				var param = {
					body : '<div id="'+id+'" style="width:100%;height:100%;" class="hw-center-image"><i class="icon icon-loading"></i></div>',
					foot : false,
					'class' : 'hw-dialog-gmap',
					title : self.data.biz.name_cn+'<br/>'+template.helpers.storeFullAddress(self.data.biz),
					beforeShowFn : function(){

						_.delay(function(){

							KG.data.get('getGoogleMap')(geo.lat, geo.lng, {
								elem : $('#'+id)[0]
							});
						}, 500);

					}
				};

				util.dialog.show(param);
			});
		});

		if(this.data.biz.is_booked){
			this.elem.find('.js_fav').html('<i class="icon fa fa-heart"></i>已收藏').removeClass('js_fav').addClass('js_fav_on');
		}

		self.initArticleBox();
		self.initCouponBox();

		if(location.hash){
			util.delay(function(){
				location.href = location.hash;
			}, 1000);
		}

		this.elem.find('.js_rpcat').find('b').eq(0).trigger('click');

		this.commentImage = KG.component.getObj(this.elem.find('.js_comment_img'));

		this.showAdsBanner();
		this.showManagerStoreBlockIfRoleAdmin();

		util.setPageTitle(this.data.biz.name_cn || this.data.biz.name_en);

		this.initDescriptionBox();
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

		this.elem.find('.js_cmbox').find('.c-content .dp').html('');
		var m = this.elem.find('.js_cmbox .hw-loadingmore-bar'),
			m1 = m.find('.loading'),
			m2 = m.find('.js_more');

		m1.show();
		m2.hide();
		m.show();

		var param = {
			bizId : this.bizId
		};
		if(this.commentType === 'all'){
			param.lastid = this.lastCommentId;
		}
		else if(this.commentType === 'pic'){
			param.has_pic = true;
			param.lastid = this.lastCommentId_pic;
		}


		KG.request.getStoreCommentData(param, function(flag, rs){
			if(flag){
				console.log(rs);
				var count = rs.count;
				rs = rs.list;
				if(rs.length > 20){
					m1.hide();
					m2.show();
				}
				else{
					m.hide();
				}

				if(self.commentType === 'all'){
					self.commentData = self.commentData.concat(rs);
				}
				else if(self.commentType === 'pic'){
					self.commentData_pic = self.commentData_pic.concat(rs);
				}

				self.setCommentBoxHtml();
				callback(count);
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
			'<div class="hw-img">',
				'<img src="{{item.userinfo.avatar_url | absImage}}" />',
				'<p title="{{item.userinfo.nick}}">{{item.userinfo.nick}}</p>',
			'</div>',
			'<div class="r hw-time">',
				'<div role="StarRank" data-rank={{item.star}}></div>',
				'<span>{{item.datetime | formatDate:"mm/dd/yy"}}</span>',
			'</div>',
			'<p class="r hw-msg">{{item.msgbody}}</p>',

			'{{if item.pic}}',
			'<div style="margin-top: 10px;" class="hw-rpimgbox">',
				'{{each item.pic as url index}}',
				'<div class="hw-center-image"><img class="js_showCommentBidImage hand" param="{{index}}"' +
				' src="{{url}}" /></div>',
				'{{/each}}',
			'</div>',
			'{{/if}}',

			'<p style="margin-top:10px;" class="r hw-action">',
				'{{if role=="admin"}}<span param="{{item.id}}_{{item.userID}}" {{if item.reply}}param1="{{item.reply.msgbody}}"{{/if}} nick="{{item.userinfo.nick}}"' +
				' class="js_rp">',
				'{{if item.reply}}修改回复{{else}}回复{{/if}}',

				'</span>{{/if}}',
				'<span param="{{item.id}}" class="js_like">赞({{item.buzz}})</span>',
				'<span param="{{item.id}}" class="js_jp">举报</span>',
			'</p>',

			'{{if item.reply}}',
			'<div class="c-rp">',
				//'<img src="{{item.reply.userinfo.avatar_url | absImage}}" />',
				'<img src="{{biz | logoPath}}" />',
				'<p>店主回复：</p>',
				'<p>{{item.reply.msgbody}}</p>',
			'</div>',
			'{{/if}}',

			'</div>',
			'{{/each}}'
		].join('');

		var box = this.elem.find('.js_cmbox'),
			list = this.commentData;

		if(this.commentType === 'pic'){
			list = this.commentData_pic;
		}

		h = template.compile(h)({
			list: list,
			role : this.data.biz.role,
			biz : this.data.biz
		});
		box.find('.c-title p').html('评论（' + this.commentData.length + '）');

		if(list.length < 1){
			h = '<div role="HWNoContentDiv" style="height:220px;" data-text="本店暂无评论"></div>';
		}

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
			'<div class="hw-img" data-url="{{item | logoPath}}" role="BaseLoadingImageBox"></div>',
			'<h4>{{item.title}}</h4>',
			'<p class="hw-time">{{item.dateline | formatDate:"mm/dd/yy"}}</p>',
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
		KG.component.init(box);
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
			'<div class="hw-img" data-url="{{item | logoPath}}" role="BaseLoadingImageBox"></div>',
			'<h4>{{item.subject}}</h4>',
			'<p class="hw-lt">{{item.count}}人已领取</p>',
			'<button class="hw-btn hw-blue-btn">立即领取</button>',

			'</div>',
			'{{/each}}',
			'{{if flag}}<p class="hw-more">查看更多</p>{{/if}}'
		].join('');
		h = template.compile(h)({
			list : list,
			flag : flag
		});

		box.html(h);
		KG.component.init(box);
	},


	showJuBaoReplyDialog : function(opts){
		var id = opts.id;
		var h = [
			'<div class="hw-jubao-box">',
				'<p>请选择举报类型</p>',
				'<label class="left"><input value="有害信息" name="jubao" type="radio" /> 有害信息</label>',
				'<label class="right"><input value="色情暴力" name="jubao" type="radio" /> 色情暴力</label>',
				'<label style="top:70px;" class="left"><input value="垃圾广告" name="jubao" type="radio" /> 垃圾广告</label>',
				'<label style="top:70px;" class="right"><input value="无关内容" name="jubao" type="radio" /> 无关内容</label>',
				'<label style="top:110px;" class="left"><input value="其他" name="jubao" type="radio" /> 其他（请写下举报原因）</label>',
				'<textarea class="form-control" row="3"></textarea>',
			'</div>'
		].join('');

		var param = {
			foot : true,
			'class' : 'hw-660-dialog',
			title : '举报<b>'+opts.toName+'</b>的评论',
			body : h,
			YesText : '举报',
			YesFn : function(){
				var obj = util.dialog.get(),
					box = obj.find('.hw-jubao-box');
				var type = _.filter(box.find('input'), function(one){
					return $(one).prop('checked');
				});
				type = $(type).val();

				KG.request.reportStoreComment({
					id : id,
					type : type,
					msgbody : box.find('textarea').val()
				}, function(flag, rs){
					if(flag){
						util.toast.alert('举报成功，感谢您的参与！');
					}
					else{
						util.toast.showError(rs);
					}
				});
			},
			beforeShowFn : function(){
				var obj = $(this),
					box = obj.find('.hw-jubao-box');
				_.delay(function(){
					box.find('input').eq(0).prop('checked', true);
				}, 100);

			}
		};

		util.dialog.show(param);
	},

	showAdsBanner : function(){
		if(this.data.biz.role !== 'admin'){
			return false;
		}
		var user = KG.user.get();
		if(!user || user.ads_postid){
			return false;
		}

		var h = [
			'<div style="display: none;" class="hw-store-bottom-ads">',
				'<b class="hw-close js_close"><i class="icon fa fa-times-circle"></i></b>',
				'<dd>',
					'<span>3分钟创建广告，免费发布到<a target="_blank" href="http://www.wenxuecity.com">文学城</a>首页30天</span>',
					'<a href="../mybiz/createAds.html?store='+this.data.id+'" target="_blank" class="hw-btn' +
					' hw-blue-btn">马上创建</a>',
				'</dd>',
			'</div>'
		].join('');

		h = $(h);

		h.on('click', '.js_close', function(){
			h.slideUp(200, function(){
				h.remove();
			});
		});

		util.delay(function(){
			h.appendTo('body').slideDown();
		}, 2000);
	},

	showManagerStoreBlockIfRoleAdmin : function(){
		if(this.data.biz.role !== 'admin'){
			return false;
		}

		var h = '<a class="hw-btn hw-mgstore" href="../mybiz/index.html"><i class="icon fa fa-pencil"></i>管理店铺</a>';
		$(h).appendTo('div.c-top');
	},

	initDescriptionBox : function(){
		var box = this.elem.find('.js_desc');
		console.log(box.height());

		var h = '<div class="hand js_down" style="height:32px;text-align: center;"><i style="font-size:32px;color:#9b9b9b;"' +
			' class="icon fa' +
			' fa-angle-down"></i></div>';
		var tmp = box.height();
		if(tmp > 170){
			box.css({
				height : '170px',
				'overflow' : 'hidden',
				'padding-bottom' : '0'
			});

			h = $(h);
			box.after(h);

			h.bind('click', function(){
				box.animate({
					height : (tmp+20)+'px',
					'padding-bottom' : '12px'
				});

				h.remove();
			});
		}
	}
});