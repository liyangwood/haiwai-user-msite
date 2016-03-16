
KG.Class.define('SiteHeadingNav', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<nav class="kg-header-nav-comp kg-site-header-nav-comp">',
				'<div class="container">',

					'<a href="javascript:void(0)" class="nav js_tab">本地商家<i class="icon glyphicon glyphicon-chevron-down"></i></a>',
					'<a href="../site/couponlist.html" class="nav js_couponList">本地优惠</a>',
					'<a href="../site/articlelist.html?category=hot" class="nav js_articleList">生活指南</a>',
					//'<a href="../site/articlelist.html?category=11" class="nav js_cat">分类信息</a>',
					'<a href="http://www.haiwai.com" target="_blank" class="nav js_cat">分类信息</a>',

				'</div>',
				'<div class="hw-box container">',
					'<div class="left nodis"></div>',
					//'<div class="right"></div>',

				'</div>',
			'</nav>'
		].join('');
	},
	initStart : function(){
		this.navData = [
			{
				logo : 'food.png',
				title : [['餐饮美食', 131]],
				children : [
					[
						['中餐', 131, 135],
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
				title : [['课后辅导、', 214], ['SAT、', 215], ['才艺', 218]],
				children : [
					[
						['课后辅导', 214, 214],
						['SAT', 214, 215],
						['数学', 214, 549],
						['英语', 214, 216],
						['中文学校', 214, 217]
					],
					[
						['才艺班', 218, 218],
						['钢琴', 218, 219],
						['小提琴', 218, 220],
						['乐器', 218, 221],
						['游泳', 218, 225],
						['武术', 218, 224],
						['艺术/绘画', 218, 223]
					],
					[
						['教育咨询', 610, 610],
						['升学规划', 610, 251],
						['奖学金申请', 610, 253]
					],
					[
						['幼儿园', 226, 226],
						['英语幼儿园', 226, 608],
						['双语幼儿园', 226, 609],
						['蒙特梭利教育', 226, 607]
					],
					[
						['职业培训', 245, 245],
						['电脑/IT', 245, 234],
						['地产执照', 245, 233],
						['社区大学', 245, 229]
					]
				]
			},
			{
				logo : 'cleaner.png',
				title : [['家庭装修、', 41], ['清洁、', 459], ['搬家', 450]],
				children : [
					[
						['家装维修', 41, 41],
						['装修工', 41, 42],
						['厨房/卫浴', 41, 36],
						['橱柜', 41, 37],
						['地毯地板', 41, 38],
						['通渠', 41, 47],
						['电工', 41, 48],
						['空调/暖气', 41, 49],
						['门窗', 41, 50],
						['屋顶', 41, 55],
						['庭院', 41, 56],
						['油漆/壁纸', 41, 57],
						['游泳池', 41, 58],
						['车库门', 41, 35],
						['栅栏', 41, 59],
						['锁匠', 41, 54]
					],
					[
						['清洁服务', 459, 459],
						['清洁服务', 459, 212],
						['清洁服务', 459, 51],
						['清洁服务', 459, 463]
					],
					[
						['搬家公司', 450, 450],
						['仓储服务', 450, 451],
						['货车出租', 450, 454]
					]
				]
			},
			{
				logo : 'car.png',
				title : [['汽车经销、', 67], ['维修', 195]],
				children : [
					[
						['汽车经销', 67, 0],
						['二手车经销', 67, 66],
						['租车服务', 284, 0]
					],
					[
						['Acura 讴歌', 67, 71],
						['Audi 奥迪', 67, 73],
						['BMW 宝马', 67, 75],
						['Buick 别克', 67, 76],
						['Chevrolet 雪佛兰', 67, 78],
						['Ford 福特', 67, 83],
						['Honda 本田', 67, 85],
						['Hyundai 现代', 67, 86]
					],
					[
						['Infiniti 英菲尼迪', 67, 87],
						['Kia 起亚', 67, 90],
						['Lexus 雷克萨斯', 67, 93],
						['Mercedez-Benz 奔驰', 67, 98],
						['Mini 迷你', 67, 99],
						['Nissan 日产', 67, 101],
						['Toyota 丰田', 67, 107],
						['Volkswagon 大众', 67, 108]
					],
					[
						['汽车维修', 195, 0],
						['板金/喷漆', 195, 190],
						['传动器 transmission', 195, 200],
						['轮胎', 195, 191],
						['汽车玻璃', 195, 199],
						['水箱/空调', 195, 193],
						['汽车改装', 195, 612],
						['零件/配件', 195, 198]
					],
					[
						['拖车服务', 196, 0],
						['洗车打蜡', 196, 197],
						['排烟检查 smog test', 196, 192],
						['驾驶学校', 196, 247]
					]
				]
			},
			{
				logo : 'lawer.png',
				title : [['会计、', 366], ['保险、', 383], ['律师', 391]],
				children : [
					[
						['投资理财', 369, 369],
						['会计师/会计服务', 369, 366],
						['报税服务', 369, 368],
						['投资服务/咨询', 369, 0],
						['教育基金', 252, 0]
					],
					[
						['保险经纪', 383, 383],
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
						['资产规划', 391, 613],
						['移民服务', 627, 0]

					]
				]
			},
			{
				logo : 'loan.png',
				title : [['房产经纪、', 27], ['贷款', 375]],
				children : [
					[
						['房产经纪', 27, 27],
						['房地产估价', 27, 33],
						['房屋检查', 27, 61],
						['地产管理', 27, 62],
						['贷款服务', 27, 375]

					]
				]
			},
			{
				logo : 'doctor.png',
				title : [['中医、', 294], ['牙医', 345]],
				children : [
					[
						['中医', 294, 294],
						['针灸', 294, 295],
						['推拿', 294, 296],
						['中药参茸行', 357, 0]
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
						['妇产科', 301, 0],
						['内科', 297, 305],
						['皮肤科', 313, 0],
						['整形外科', 333, 0]
					]
				]
			},
			{
				logo : 'relax.png',
				title : [['休闲、', 498], ['旅游、', 479], ['美容', 533]],
				children : [
					[
						['KTV', 498, 0],
						['保龄球馆', 502, 0],
						['高尔夫球场', 504, 0],
						['足疗/脚底按摩', 344, 0],
						['桑拿/三温暖', 506, 0]
					],
					[
						['旅行社', 479, 0],
						['机场接送', 479, 203],
						['旅游包车', 479, 204],
						['旅馆/酒店', 497, 0]
					],
					[
						['美容/SP', 533, 0],
						['美发', 531, 0],
						['美甲', 532, 0],
						['医学美容', 334, 0]
					],
					[
						['购物中心', 500, 0],
						['超市', 487, 0]
					]
				]
			},
			{
				logo : 'sat.png',
				title : [['私家小店', 645]],
				children : [
					[
						['私家美食', 645, 0],
						['服装', 637, 0],
						['生活用品', 635, 0],
						['其他', 617, 0]
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
			left : this.elem.find('.hw-box .left')
		};
	},

	initEvent : function(){
		var left = this.jq.left;
		this.elem.find('.js_tab').add(left).hover(function(){
			left.show();
		}, function(){
			left.hide();
		});


	},

	initEnd : function(){
		this.setLeftBox();
		var page = this.data.page;
		this.elem.find('.js_'+page).addClass('active');
	},

	setLeftBox : function(){
		var self = this;
		var h = '';
		_.each(this.navData, function(one){
			var tmp = ['<div class="hw-item">',
				'<div class="hw-one">',
					'<img src="../../image/site/'+one.logo+'" />',
					'<p class="cp">',
					'{{each list as item}}',
					'<a href="../site/storelist.html?tag={{item[1]}}" target="_blank">{{item[0]}}</a>',
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
		this.jq.left.find('.hw-item').hover(function(){
			$(this).addClass('hover');
			var next = $(this).next('.hw-item');
			if(next.length === 1){
				next.addClass('second');
			}

			var lm = $(this).find('.right');
			lm.show();

		}, function(){
			$(this).removeClass('hover');
			var next = $(this).next('.hw-item');
			if(next.length === 1){
				next.removeClass('second');
			}

			var lm = $(this).find('.right');
			lm.hide();
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
					ha += '<a class="'+cls+'" href="'+l+'" target="_blank">'+n[0]+'</a>';
				}
				else if(n[2] === 0){
					hb += '<a class="'+cls+'" href="'+l+'" target="_blank">'+n[0]+'</a>';
				}
				else{
					l += '&subtag='+n[2];
					hb += '<a class="'+cls+'" href="'+l+'" target="_blank">'+n[0]+'</a>';
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

	},
	setCouponBoxHtml : function(data){
		var h = [
			'<h4>{{data.subject}}</h4>',
			'{{#dyHtml}}',
			'<label>活动详情</label>',
			'<p>{{#data.description | decode}}</p>',
			'{{if data.files[0]}}',
			'<div class="hw-img"><img src="{{data.files[0].path | absImage}}" /></div>',
			'{{/if}}'
		].join('');

		var dy = '';
		_.each(data.dynamic_field||[], function(item){
			dy += '<label>'+item.field_name+'</label><p>'+item.value+'</p>';
		});

		h = template.compile(h)({
			data : data,
			dyHtml : dy
		});

		this.jq.box.html(h);
		this.jq.box.removeClass('nodis');
	},
	setActionBoxHtml : function(data){
		var h = [
			'<input class="form-control js_tel" type="text" placeholder="请输入手机号" />',
			//TODO verify code
			'<button class="hw-btn hw-blue-btn js_getCoupon">获取优惠</button>'
		].join('');

		h = template.compile(h)({
			data : data
		});

		this.jq.actionBox.html(h).removeClass('nodis');
	},
	initEvent : function(){
		var self = this;
		this.elem.on('click', '.js_getCoupon', function(){
			var tel = self.elem.find('.js_tel').val();
			if(!tel){
				util.toast.showError('tel number is require');
				return;
			}

			KG.request.sendSmsToUserPhone({
				number : tel,
				biz_name : self.couponData.bizinfo.name_cn || self.couponData.bizinfo.name_en,
				event_title : self.couponData.subject
			}, function(flag, rs){
				if(flag){
					util.toast.alert(rs);
				}
				else{
					util.toast.showError(rs);
				}
			});
		});
	}
});