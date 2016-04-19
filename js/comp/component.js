KG.Class.define('BaseForm', {
	ParentClass : 'BaseComponent',

	getTemplate : function(){
		return [
			'<div class="container hw-comp-bform">',
			this.getInsideTemplate(),
			'</div>'
		].join('');
	},
	getInsideTemplate : function(){}
});

KG.Class.define('BaseInput', {
	ParentClass : 'BaseComponent',
	defineProperty : function(){
		return {
			value : {
				defaultValue : ''
			},
			label : {},
			require : {},
			type : {
				defaultValue : 'text'
			},
			delbtn : {}
		};
	},
	getTemplate : function(){
		return [
			'<div class="form-group hw-comp-BaseInput">',
			'<label class="lab {{if require}}require{{/if}}" for="{{uuid}}">{{label}}</label>',
			'<label class="control-label hw-err"></label>',
			'<input type="{{type}}" class="form-control" id="{{uuid}}" placeholder="{{placeholder}}">',
			'</div>'
		].join('');
	},
	getData : function(box, data, next){
		var prop = this.prop;
		next({
			value : prop.value,
			label : prop.label,
			require : prop.require,
			type : prop.type,
			placeholder : box.attr('placeholder') || '',
			uuid : 'lb_'+util.getUuid()
		});
	},

	initEvent : function(){
		var self = this;
		if(this.prop.delbtn){
			var ip = this.elem.find('input');

			ip.after('<i class="fa del fa-times-circle" style="display: none;"></i>');
			this.jq.delBtn = this.elem.find('.del');

			this.jq.delBtn.click(function(){
				ip.val('');
				self.checkDeleteIcon();
				ip.focus();
			});

			ip.bind('keyup', this.checkDeleteIcon.bind(this));
			ip.bind('paste', this.checkDeleteIcon.bind(this));
		}
	},

	setBlurEvent : function(fn){
		var self = this;
		this.elem.find('input').blur(function(){
			var val = self.getValue();
			fn.call(self, val);
		});
	},

	initEnd : function(){
		if(this.prop.value){
			this.elem.find('input').val(this.prop.value);
		}
	},

	checkDeleteIcon : function(){
		var val = this.elem.find('input').val();
		if(val){
			this.jq.delBtn.show();
		}
		else{
			this.jq.delBtn.hide();
		}

	},

	focus : function(){
		this.elem.find('input').focus();
	},

	getValue : function(){
		var o = this.elem.find('input');

		return o.val();
	},
	setValue : function(v){
		this.elem.find('input').val(v);
	},
	showError : function(msg){
		if(msg){
			this.elem.addClass('has-error');
			this.elem.find('.hw-err').html(msg);
		}
		else{
			this.elem.removeClass('has-error');
			this.elem.find('.hw-err').html('');
		}
	},
	reset : function(){
		this.elem.find('input').val('');
		this.showError(false);
	}
});

KG.Class.define('BaseUploadImage', {
	ParentClass : 'BaseComponent',

	setJqVar : function(){
		return {
			img : this.elem.find('.js_img'),
			btn : this.elem.find('.js_btn'),
			fileInput : this.elem.find('input[type="file"]')
		}
	},
	defineProperty : function(){
		return {
			image : {}
		}
	},

	initEvent : function(){
		var btn = this.jq.btn,
			img = this.jq.img;

		var self = this;
		this.jq.fileInput.bind('change', function(e){
			var file = this.files[0];

			btn.button('loading');

			self.uploadImageFn(file, function(){
				btn.button('reset');
			});
		});

	},
	uploadImageFn : function(file, callback){
		var self = this;
		util.uploadImage(file, function(url){
			var url = KG.config.SiteRoot+url;

			self.jq.img.attr('src', url);

			callback();
		});
	}
});

KG.Class.define('StarRank', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-comp-star">',

			'</div>'
		].join('');
	},
	initStart : function(){
		this.rank = 0;
		this.enableClick = false;
	},
	getData : function(box, data, next){
		this.rank = parseFloat(box.data('rank')) || 0;
		if(box.data('enable')){
			this.enableClick = true;
		}
		next({});
	},

	render : function(){
		var rank = this.rank;

		var list = [];
		for(var i= 1; i<6; i++){
			if(i<rank){
				list.push('full');
			}
			else if(i === rank){
				list.push('full');
			}
			else{
				if(i === rank+0.5){
					list.push('half');
				}
				else{
					list.push('empty');
				}

			}
		}

		var h = [
			'{{each list as item index}}',
			'{{if item==="full"}}',
			'<i index="{{index}}" class="icon fa fa-star icon_full"></i>',
			'{{else if item==="half"}}',
			'<i index="{{index}}" class="icon fa fa-star-half-o icon_half"></i>',
			'{{else}}',
			'<i index="{{index}}" class="icon fa fa-star-o icon_empty"></i>',
			'{{/if}}',
			'{{/each}}'
		].join('');
		h = template.compile(h)({list : list});
		this.elem.html(h);
	},
	setValue : function(v){
		this.rank = v;
		this.render();
	},

	getValue : function(){
		return this.rank;
	},
	initEnd : function(){
		this.render();
	},
	initEvent : function(){
		var self = this;
		if(this.enableClick){
			this.elem.on('click', 'i.fa', function(e){
				var o = $(e.target);
				var i = o.attr('index');
				if(o.hasClass('icon_empty')){
					self.rank = parseFloat(i)+1;
				}
				else if(o.hasClass('icon_full')){
					self.rank = parseInt(i, 10);
				}
				//else if(o.hasClass('icon_half')){
				//	self.rank = parseInt(i, 10)+1;
				//}

				if(self.rank === 0){
					self.rank = 1;
				}

				self.render();
			}).addClass('hand');
		}
	}
});

KG.Class.define('BaseSelectInput', {
	ParentClass : 'BaseInput',
	getTemplate : function(){
		return [
			'<div class="form-group hw-comp-BaseSelectInput">',
			'<label class="lab {{if require}}require{{/if}}">{{label}}</label>',
			'<label class="control-label hw-err"></label>',
			'<div class="dropdown hw-drop">',
			'<button id="{{uuid}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
			'<input type="text" readonly="true" class="form-control js_input" placeholder="{{placeholder}}">',
			'<i class="icon fa fa-caret-down"></i>',
			'</button>',
			'<ul class="dropdown-menu" aria-labelledby="{{uuid}}">',
			'{{each list as item}}',
			'<li index="{{$index}}" class="js_drop">',
			this.getEachHtml(),
			'</li>',
			'{{/each}}',
			'</ul>',
			'</div>',
			'</div>'
		].join('');
	},
	initVar : function(){
		this.index = -1;
	},
	getData : function(box, data, next){
		//点击drop的回调
		this.clickCallback = data.clickCallback;

		//设置drop的innerHTML
		this.getEachHtml = data.getEachHtml || function(){
				return '{{item}}';
			};

		var prop = this.prop;
		next({
			value : prop.value,
			label : prop.label,
			require : prop.require,
			placeholder : box.attr('placeholder') || '',
			uuid : 'dl_'+util.getUuid(),
			list : data.list
		});
	},
	initEvent : function(){
		var self = this;
		var input = this.elem.find('.js_input');
		this.elem.find('.js_drop').click(function(){
			input.val($(this).text());

			var index = $(this).attr('index');
			self.index = index;
			self.clickCallback(self.data.list[index]);
		});
	},
	initEnd : function(){

	},
	getValue : function(){
		if(this.index < 0){
			return {};
		}
		return this.data.list[this.index];
	},
	setValue : function(index){
		this.elem.find('.js_drop').filter('[index="'+index+'"]').trigger('click');
	},
	setOnlyValue : function(val){
		this.elem.find('.js_input').val(val);
	},
	disable : function(f){
		f = f || false;
		if(f){
			this.elem.find('button').attr('disabled', f);
			this.elem.find('.js_input').attr('disabled', f);
		}
		else{
			this.elem.find('button').removeAttr('disabled');
			this.elem.find('.js_input').removeAttr('disabled');
		}

	}
});

KG.Class.define('BaseLoadingImageBox', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-comp-BaseLoadingImageBox hw-center-image">',
				'<i class="icon icon-loading"></i>',
			'</div>'
		].join('');
	},
	defineProperty : function(){
		return {
			url : {}
		};
	},
	initEnd : function(){
		var self = this;
		var url = this.prop.url;
		console.log(url);
		if(url){
			this.setUrl(url);
		}
		else{
			this.elem.html('');
		}
	},
	setUrl : function(url){
		var self = this;
		var img = new Image();
		img.src = url;
		console.log(url);
		this.elem.html('<i class="icon icon-loading"></i>');
		$(img).load(function(e){
			var o = $(this);

			self.renderImage(o[0], url);
		});
	},
	renderImage : function(img, url){
		var sy = 'position:absolute;',
			f = 'width';
		var w = this.elem.width(),
			h = this.elem.height();
		var ww,hh;
		if(img.width/img.height >= w/h){
			ww = Math.ceil(img.width*h/img.height);
			sy += 'width:'+ww+'px;height:100%;top:0;left:'+((w-ww)/2)+'px';

		}
		else{
			sy += 'width:100%;height:auto;left:0;top:0;';
			f = 'height';
		}
		this.elem.empty();
		var hh = '<img style="'+sy+'" src="'+url+'" />';
		this.elem.html(hh);

		//if(f === 'width'){
		//	this.elem.html(h);
		//}
		//else{
		//	this.elem.html(h).addClass('hw-flex-start-image');
		//}
	}
});

KG.Class.define('BaseLoadingMoreStatusBar', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<nav class="hw-comp-BaseLoadingMoreStatusBar">',
				'<i class="loading" style="display: none;"></i>',
				'<b class="js_more">加载更多</b>',
			'</nav>'
		].join('');
	},
	setJqVar : function(){
		return {
			loading : this.elem.find('.loading'),
			b : this.elem.find('.js_more')
		}
	},

	setState : function(status){
		if(status === 'loading'){
			this.jq.loading.show();
			this.jq.b.hide();
		}
		else if(status === 'loaded'){
			this.jq.loading.hide();
			this.jq.b.show();
		}
		else if('hide' === status){
			this.elem.hide();
		}
	},

	setEvent : function(callback){
		var self = this;
		this.jq.b.unbind('click').bind('click', function(e){

			self.setState('loading');
			callback(function(){
				self.setState('loaded');
			}, self);
		});
	},
	trigger : function(){
		this.jq.b.trigger('click');
	}
});

KG.Class.define('HWNoContentDiv', {
	ParentClass : 'BaseComponent',
	getTemplate : function(){
		return [
			'<div class="hw-HWNoContentDiv hw-center-image">',
				'<p class="hw-text">{{text}}<p>',
			'</div>'
		].join('');
	},
	defineProperty : function(){
		return {
			text : {}
		};
	},
	getData : function(box, data, next){
		next({
			text : this.prop.text
		});
	}
});