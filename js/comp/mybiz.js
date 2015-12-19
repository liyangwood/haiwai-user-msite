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
            alert(this.data.bizId);
        },
        deleteStore : function(){
            alert(this.data.bizId);
        }
    });

})();