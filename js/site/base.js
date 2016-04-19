
KG.Class.define('SiteHeadingNav', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<nav class="kg-header-nav-comp kg-site-header-nav-comp">',
				'<div class="container">',

					'<a href="javascript:void(0)" class="nav js_tab">本地商家<i class="icon glyphicon glyphicon-chevron-down"></i>',



					'</a>',
					'<a href="../site/couponlist.html" class="nav js_couponList">本地优惠</a>',
					'<a href="../site/articlelist.html?category=hot" class="nav js_articleList">生活指南</a>',
					//'<a href="../site/articlelist.html?category=11" class="nav js_cat">分类信息</a>',
					//'<a href="http://www.haiwai.com" target="_blank" class="nav js_cat">分类信息</a>',


					'<div class="hw-box container">',
						'<div class="left nodis"></div>',
						//'<div class="right"></div>',

					'</div>',
				'</div>',

			'</nav>'
		].join('');
	},

	defineProperty : function(){
		return {
			leftshow : {
				defaultValue : false
			}
		};
	},

	initStart : function(){
		this.navData = [
			{
				logo : 'food.png',
				title : [['餐饮美食', 131]],
				children : [
					[
						['中国菜', 131, 135],
						['川菜', 131, 142],
						['粤菜', 131, 140],
						['火锅', 131, 148],
						['湘菜', 131, 150],
						['上海菜', 131, 138],
						['港式茶餐厅', 131, 141],
						['台湾菜', 131, 137]
					],
					[
						['日本料理', 131, 159],
						['韩国菜', 131, 166],
						['泰国菜', 131, 161],
						['越南菜', 131, 162],
						['西餐厅', 131, 165],
						['意大利菜', 131, 157],
						['法国菜', 131, 168]
					],
					[
						['奶茶店', 131, 181],
						['咖啡厅', 131, 188],
						['冰品店', 131, 182],
						['面包/蛋糕店', 131, 178]
					]

				]
			},
			{
				logo : 'sat.png',
				title : [['教育、', 214], ['托儿、', 226], ['培训', 245]],
				children : [
					[
						['课后辅导', 214, 214],
						['SAT', 214, 215],
						['数学', 214, 549],
						['英语', 214, 216],
						['中文学校', 214, 217],
						['钢琴', 214, 219],
						['小提琴', 214, 220],
						['其它乐器', 214, 221],
						['游泳', 214, 225],
						['武术', 214, 224],
						['艺术/绘画', 214, 223],
						['舞蹈', 214, 222],
						['教育咨询', 214, 610]
					],
					//[
					//	['教育咨询', 610, 610],
					//	['升学规划', 610, 251],
					//	['奖学金申请', 610, 253]
					//],
					[
						['幼儿园', 226, 226],
						['托儿所', 226, 547],
						['双语幼儿园', 226, 609],
						['蒙特梭利教育', 226, 607]
					],
					[
						['职业培训', 245, 245],
						['电脑/IT', 245, 234],
						['地产执照', 245, 233],
						['社区大学', 245, 229],
						['驾驶学校', 245, 247]
					]
				]
			},
			{
				logo : 'cleaner.png',
				title : [['家装、', 41], ['清洁、', 459], ['搬家', 450]],
				children : [
					[
						['装修', 41, 41],
						['厨卫装修', 41, 36],
						['橱柜', 41, 37],
						['地毯地板', 41, 38],
						['门窗', 41, 50],
						['屋顶', 41, 55],

						['通渠', 41, 47],
						['电工', 41, 48],
						['空调/暖气', 41, 49]
					],
					[
						['清洁服务', 459, 459],
						['地毯清洗', 459, 212]
					],
					[
						['搬家公司', 450, 450]
					]
				]
			},
			{
				logo : 'car.png',
				title : [['汽车经销、', 67], ['维修', 195]],
				children : [
					[
						['汽车经销', 67, 67],
						['宝马', 67, 75],
						['奔驰', 67, 98],
						['奥迪', 67, 73],
						['雷克萨斯', 67, 93],
						['讴歌', 67, 71],
						['丰田', 67, 107],
						['本田', 67, 85],
						['大众', 67, 108]
					],

					[
						['汽车维修', 195, 195],
						['板金/喷漆', 195, 190],
						['传动器', 195, 200],
						['轮胎', 195, 191],
						['汽车玻璃', 195, 199]
					]
				]
			},
			{
				logo : 'lawer.png',
				title : [['理财、', 369], ['保险、', 383], ['律师', 391]],
				children : [
					[
						['理财', 369, 369],
						['会计师/会计服务', 369, 366],
						['报税服务', 369, 368],
						['财务规划', 369, 367],
						['教育基金', 369, 252]
					],
					[
						['保险', 383, 383],
						['医疗保险', 383, 384],
						['汽车保险', 383, 385],
						['房屋保险', 383, 386],
						['人寿保险', 383, 387]
					],
					[
						['律师', 391, 391],
						['人体伤害诉讼', 391, 392],
						['家事法', 391, 393],
						['刑事法', 391, 394],
						['酒后驾车处理', 391, 395],
						['移民法', 391, 396],
						['民事法', 391, 397],
						['商业法', 391, 398],
						['专利/商标法', 391, 399],
						['遗产法', 391, 404],
						['房地产法', 391, 405],
						['资产规划', 391, 613]
					]
				]
			},
			{
				logo : 'loan.png',
				title : [['房产经纪、', 27], ['贷款', 27, 375]],
				children : [
					[
						['房产经纪', 27, 0],
						['贷款服务', 27, 375],
						['房地产估价', 27, 33],
						['地产管理', 27, 62]
					]
				]
			},
			{
				logo : 'doctor.png',
				title : [['中医、', 294], ['牙医、', 345], ['家庭医生', 297]],
				children : [
					[
						['中医', 294, 294],
						['针灸', 294, 295],
						['推拿', 294, 296],
						['中药参茸行', 294, 357]
					],
					[
						['牙科医生', 345, 345],
						['儿童牙科', 345, 346],
						['牙齿矫正', 345, 347],
						['人工植牙', 345, 348],
						['假牙修复', 345, 349],
						['根管治疗', 345, 351],
						['牙周病治疗', 345, 352]
					],
					[
						['家庭医生', 297, 297],
						['小儿科', 297, 298],
						['妇产科', 297, 301],
						['内科', 297, 305],
						['皮肤科', 297, 313],
						['整形外科', 297, 333]
					]
				]
			},
			{
				logo : 'relax.png',
				title : [['美容休闲、', 533], ['旅游', 479]],
				children : [
					[
						['美容休闲', 533, 533],
						['美发', 533, 531],
						['美甲', 533, 532],
						['医学美容', 533, 334],
						['足疗/脚底按摩', 533, 344],
						['KTV', 533, 498]
					],

					[
						['旅游', 479, 479],
						['旅行社', 479, 0],
						['机场接送', 479, 203],
						['旅游包车', 479, 204]
						//['旅馆/酒店', 497, 0]
					]
				]
			},
			{
				logo : 'store.png',
				title : [['个体微店', 643]],
				children : [
					[
						['私家美食', 643, 645],
						['服装饰品', 643, 650],
						['生活用品', 643, 648],
						['其他', 643, 651]
					]
				]
			}
		];
	},
	getData : function(box, data, next){
		var page = KG.data.get('page').split('-');
		page = page[1] || '';

		next({
			page : page
		});
	},

	setJqVar : function(){
		return {
			box : this.elem.find('.hw-box'),
			left : this.elem.find('.hw-box .left')
		};
	},

	initEvent : function(){
		var self = this;
		var left = this.jq.left;

		var tm = null;

		if(this.prop.leftshow){
			//set left show
			left.removeClass('nodis');

			this.elem.find('.js_tab').add(left).hover(function(){

			}, function(){
				self.isOn = false;
				if(self.removeAll){
					self.removeAll();
				}
			});
		}
		else{
			this.elem.find('.js_tab').hover(function(){
				if(tm) window.clearTimeout(tm);
				tm = window.setTimeout(function(){
					left.show();
				}, 300);
			}, function(){
				if(tm) window.clearTimeout(tm);
				left.hide();
				self.isOn = false;
				if(self.removeAll){
					self.removeAll();
				}
			});

			left.hover(function(){
				if(tm) window.clearTimeout(tm);
				left.show();


			}, function(){
				if(tm) window.clearTimeout(tm);

				left.hide();
				self.isOn = false;
				if(self.removeAll){
					self.removeAll();
				}
			});
		}



	},

	initVar : function(){
		this.isOn = false;
	},

	initEnd : function(){
		this.setLeftBox();
		var page = this.data.page;
		this.elem.find('.js_'+page).addClass('active');

		if(this.prop.leftshow){
			this.elem.find('.js_tab').addClass('active');
		}
	},

	setLeftBox : function(){
		var self = this;
		var h = '';
		_.each(this.navData, function(one, index){
			var tmp = ['<div class="hw-item">',
				'<div class="hw-one">',
					'<img class="img-'+index+'" src="../../image/site/'+one.logo+'" />',
					'<p class="cp">',
					'{{each list as item}}',

					'{{if item[2]}}',
						'<a href="../site/storelist.html?tag={{item[1]}}&subtag={{item[2]}}">{{item[0]}}</a>',
					'{{else}}',
						'<a href="../site/storelist.html?tag={{item[1]}}">{{item[0]}}</a>',
					'{{/if}}',

					'{{/each}}',
					'</p>',
				'</div>',

				self.getRightBoxHtml(one.children),
				'</div>'].join('');
			tmp = template.compile(tmp)({
				list : one.title
			});
			h += tmp;
		});

		this.jq.left.html(h);

		var allRight = this.jq.left.find('.hw-item .right');
		var tm = null, tm1 = null;
		function add(o){
			removeAll();

			o.addClass('hover');
			var next = o.next('.hw-item');
			if(next.length === 1){
				next.addClass('second');
			}

			var lm = o.find('.right');


			if(self.isOn){
				lm.show();
			}
			else{
				lm.fadeIn();
			}

			self.isOn = true;
		}
		function remove(o){
			o.removeClass('hover');
			var next = o.next('.hw-item');
			if(next.length === 1){
				next.removeClass('second');
			}
			var lm = o.find('.right');

			lm.hide();

		}
		function removeAll(){
			if(tm) window.clearTimeout(tm);
			self.jq.left.find('.hw-item').each(function(){
				remove($(this));
			});
		}
		self.removeAll = removeAll;


		this.jq.left.find('.hw-item').hover(function(){

			var o = $(this);
			if(tm) window.clearTimeout(tm);
			tm = window.setTimeout(function(){
				add(o);
			}, 300);


		}, function(){

		});

	},

	getRightBoxHtml : function(list){
		list = list || [];
		if(list.length < 1) return '';

		var h = '<div class="right nodis">';


		_.each(list, function(one){
			h += '<dl>';
			var ha = '', hb = '';

			_.each(one, function(n){

				var cls = 'cb',
					l = '../site/storelist.html?tag='+n[1];
				if(n[2] === n[1]){
					cls = 'ca';
					ha += '<a class="'+cls+'" href="'+l+'" target="_self">'+n[0]+'</a>';
				}
				else if(n[2] === 0){
					hb += '<a class="'+cls+'" href="'+l+'" target="_self">'+n[0]+'</a>';
				}
				else{
					l += '&subtag='+n[2];
					hb += '<a class="'+cls+'" href="'+l+'" target="_self">'+n[0]+'</a>';
				}
			});

			if(ha){
				h += '<dt>'+ha+'</dt>';
				h += '<dd style="width:470px;">'+hb+'</dd>';
			}
			else{
				h += '<dd>'+hb+'</dd>';
			}


			h += '</dl>';
		});


		h += '</div>';

		return h;
	}
});

KG.Class.define('HWSiteCouponDetailComp', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWSiteCouponDetailComp">',
				'<div class="ca js_sbox nodis">',
				'</div>',
				'<div class="cb js_box nodis"></div>',
				'<div class="cc js_acbox nodis"></div>',
				'<div class="js_loading" style="display: none;">Loading ...</div>',
			'</div>'
		].join('');
	},
	defineProperty : function(){
		return {
			coupon : {}
		};
	},
	loading : function(f){
		var loading = this.elem.find('.js_loading');
		if(f){
			loading.css({
				'text-align' : 'center',
				'font-size' : '17px'
			}).show();
		}
		else{
			loading.hide();
		}
	},
	getData : function(box, data, next){
		this.id = this.prop.coupon;
		this.couponData = {};
		next({});
	},
	initEnd : function(){
		var self = this;
		this.loading(true);
		KG.request.getCouponDetail({id : this.id}, function(flag, rs){
			if(flag){
				console.log(rs);
				self.couponData = rs;
				self.loading(false);

				self.setStoreBoxHtml(rs);
				self.setCouponBoxHtml(rs);
				self.setActionBoxHtml(rs);
			}
		});
	},

	setJqVar : function(){
		return {
			storeBox : this.elem.find('.js_sbox'),
			box : this.elem.find('.js_box'),
			actionBox : this.elem.find('.js_acbox')
		};

	},

	setStoreBoxHtml : function(data){
		if(!data.bizinfo.entityID){
			this.jq.storeBox.hide();
			return;
		}

		var h = [
			'<div class="">',
				'<img src="{{biz.logo[0].path | absImage}}" />',
				'<a href="{{biz.entityID | toStorePath}}" class="h4">{{biz.name_cn || biz.name_en}}</a>',
				'<p>{{biz | storeFullAddress}}</p>',
			'</div>'
		].join('');
		h = template.compile(h)({
			biz : data.bizinfo
		});
		this.jq.storeBox.html(h).show();

	},
	setCouponBoxHtml : function(data){
		var h = [
			'<h4>{{data.subject}}</h4>',
			'{{#dyHtml}}',
			'<label>活动详情</label>',
			'<p>{{#data.description | decode}}</p>',
			'{{if data.files}}',
			'{{each data.files as img}}',
			'<div class="hw-img"><img src="{{img.path | absImage}}" /></div>',
			'{{/each}}',
			'{{/if}}'
		].join('');

		var dy = '';
		_.each(data.dynamic_field||[], function(item){
			dy += '<label>'+item.field_name+'</label><p>'+item.value+'</p>';
		});
		console.log(!data.top_start_time || parseInt(data.top_start_time)<1 || !data.top_end_time || parseInt(data.top_end_time)<1 || data.top_end_time.indexOf('unlimit')!==-1)
		if(!data.top_start_time || parseInt(data.top_start_time)<1 || !data.top_end_time || parseInt(data.top_end_time)<1 || data.top_end_time.indexOf('unlimit')!==-1){
			dy += '<label>活动时间</label><p>不限时间</p>';
		}
		else{


			dy += '<label>活动时间</label><p>'+moment.unix(data.top_start_time).utc().format('MM/DD/YYYY')+' &nbsp;&nbsp;到&nbsp;&nbsp; '+moment.unix(data.top_end_time).utc().format('MM/DD/YYYY')+'</p>';
		}

		h = template.compile(h)({
			data : data,
			dyHtml : template.compile(dy)({data : data})
		});


		this.jq.box.html(h);
		this.jq.box.removeClass('nodis');

		if(data.bizinfo.entityID){
			this.jq.box.css({
				'margin-top' : '60px'
			});
		}
	},
	setActionBoxHtml : function(data){
		var h = [
			'<p style="margin:0;font-size;14px;color:#7d7d7d;">输入手机号，我们会将优惠发至您的手机，兑现时请出示该条优惠短信。</p>',
			'<div style="width:400px;margin: 0 auto;" class="js_tel" role="BaseInput" placeholder="请输入手机号"></div>',
			//TODO verify code
			'<button class="hw-btn hw-blue-btn js_getCoupon">领取优惠</button>'
		].join('');

		h = template.compile(h)({
			data : data
		});

		this.jq.actionBox.html(h).removeClass('nodis');
		KG.component.init(this.jq.actionBox);
	},
	initEvent : function(){
		var self = this;
		this.elem.on('click', '.js_getCoupon', function(){
			var jq = KG.component.getObj(self.elem.find('.js_tel')),
				tel = jq.getValue();

			if(!tel || !util.validate.AmericanPhone(tel)){
				jq.showError('电话格式不正确');
				jq.focus();
				return;
			}
			else{
				jq.showError();
			}

			KG.request.sendSmsToUserPhone({
				number : tel,
				biz_name : self.couponData.bizinfo.name_cn || self.couponData.bizinfo.name_en,
				event_title : self.couponData.subject,
				id : self.couponData.pk_id
			}, function(flag, rs){
				if(flag){
					util.toast.alert('短信已成功发送至 '+tel, '出示短信内容给商家，就可以享受优惠！');
				}
				else{
					util.toast.showError(rs);
				}
			});
		});
	}
});

KG.Class.define('HWBaseAdsBanner', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWBaseAdsBanner">',
				'<div class="hw-border"></div>',
				'<div class="cb">',
					'<a href="../site/landing.html" class="hw-btn hw-blue-btn">商家免费入驻</a>',
					//'<p class="h4">赠送文学城首页广告30天</p>',
				'</div>',
				'<div class="cc">',
					'<p class="pb1">建店就送30天</p>',
					'<p class="pb1 pb2"><a class="pb1 pb2" href="http://www.wenxuecity.com"' +
					' target="_blank">文学城首页</a>广告</p>',
					'<img src="../../image/adsprofile.png" />',
					'<p class="pb">1. 免费创建店铺<br/>2. 选择广告模板，3分钟自制广告<br/>3. 广告发布到文学城首页30天</p>',
				'</div>',
			'</div>'
		].join('');
	}
});
KG.Class.define('HWBaseAdsBanner1', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWBaseAdsBanner hw-HWBaseAdsBanner1">',
				'<div class="hw-border"></div>',
				'<div class="cb">',
					'<a href="../site/landing.html" class="hw-btn hw-blue-btn">商家免费入驻</a>',
				'</div>',
				'<div class="cc">',
					'<p class="h4">赠送文学城首页广告30天</p>',
					'<img src="../../image/adsprofile.png" />',
				'</div>',
			'</div>'
		].join('');
	}
});