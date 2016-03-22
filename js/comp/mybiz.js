(function(){

    KG.Class.define('MybizEditStoreLeftDropdown', {
        ParentClass : 'BaseSelectInput',
        getTemplate : function(){
            return [
                '<div class="dropdown hw-comp-MybizEditStoreLeftDropdown">',
                '<button id="{{uuid}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                '<input type="text" readonly="true" class="form-control js_input" value="{{value}}">',
                '<i class="icon fa fa-caret-down"></i>',
                '</button>',
                '<ul class="dropdown-menu" aria-labelledby="{{uuid}}">',
                '{{each list as item}}',
                '<li index="{{$index}}" class="js_drop">',
                this.getEachHtml(),
                '</li>',
                '{{/each}}',
                '</ul>',
                '</div>'
            ].join('');
        },
        getData : function(box, data, next){

            //设置drop的innerHTML
            this.getEachHtml = function(){
                return '{{item}}';
            };

            var list = ['正在营业', '暂停营业', '删除店铺'];

            var prop = this.prop;
            next({
                value : list[0],
                placeholder : '',
                uuid : 'dl_'+util.getUuid(),
                list : list,
                bizId : KG.data.get('id')
            });
        },
        clickCallback : function(item){
            var self = this;
            if(item === this.data.list[1]){
                //stop
                util.dialog.confirm({
                    title : '确认要暂停营业吗？',
                    msg : '点击确认，您的店铺将会进入暂停营业的状态。暂停营业的店铺将不可以修改基本信息，但您可以在任何时候将它转为营业中的状态。',
                    YesFn : function(callback){
                        self.stopStore.call(self);

                        callback();
                    }
                });
            }
            else if(item === this.data.list[2]){
                //delete
                util.dialog.confirm({
                    title : '确认要删除这个店铺吗？',
                    msg : '点击确认，我们将为您删除这个店铺的所有信息，包括基本信息，图片，店铺评级和评论等，并且不能再找回这些信息，请谨慎操作。',
                    YesFn : function(callback){
                        self.deleteStore();

                        callback();
                    }
                });
            }
        },
        stopStore : function(){
            //alert(this.data.bizId);
            KG.request.changeStoreOpenStatus({
                bizId : this.data.bizId,
                status : false
            }, function(flag, rs){
                if(flag){
                    console.log(rs);
                }
            });
        },
        deleteStore : function(){

            KG.request.deleteStoreById({
                id : this.data.bizId
            }, function(flag){
                if(flag){
                    location.href = '../mybiz/index.html';
                }
            });
        }
    });


})();

KG.Class.define('HWMybizIndexStoreAdsBlock', {
    ParentClass : 'BaseComponent',
    getTemplate : function(){
        if(this.type === 'create'){
            return [
                '<div class="hw-HWMybizIndexStoreAdsBlock">',
                    '<h4>店铺文学城广告位</h4>',
                    '<div class="cf">',
                        '新用户可获得免费文学城首页的广告位，用于推广您的店铺，<a href="http://www.wenxuecity.com" target="_blank">去文学城首页查看已有广告</a>',
                    '</div>',
                    '<a class="hw-btn hw-blue-btn" href="#">免费创建广告</a>',
                '</div>'

            ].join('');
        }

        return [
            '<div class="hw-HWMybizIndexStoreAdsBlock">',
                '<h4>店铺文学城广告位</h4>',
                '<img src="{{image}}" />',
                '<div class="ca">{{#info}}</div>',
                '{{#btn}}',
            '</div>'
        ].join('');
    },
    getData : function(box, data, next){
        data = data || {};
        this.type = data.type || 'create';

        next({});
    }
});