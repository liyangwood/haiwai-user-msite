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
		return this.elem.find('input').val();
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
	}
});