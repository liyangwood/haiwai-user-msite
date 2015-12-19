KG.request = {
    ajax : function(opts, success, error){
        var url = KG.config.ApiRoot+'?format=json';

        var type = opts.method || 'get';
        delete opts.method;

        var dtd = $.Deferred();

        if(opts.url){
            url += '&'+opts.url;
            delete opts.url;
        }

        $.ajax({
            type : type,
            url : url,
            data : opts,
            dataType : 'json',
            success : function(json){
                if(success){
                    success.call(null, !!json.status, json.return);
                }

                dtd.resolve(json.return);

            },
            error : function(err){
                if(error){
                    error(err);
                }

                dtd.reject(err);

            }
        });


        return dtd;

    },

    defer : function(requestOptionList, success, error){

        var list = [];
        util.each(requestOptionList, function(fn){
            list.push(fn());
        });
        $.when.apply($, list).then(success, error);
    },

    mockData : function(data, success, error){
        var dtd = $.Deferred();

        util.delay(function(){
            if(success){
                success(true, data);
            }

            dtd.resolve(data);

        }, 500);

        return dtd;
    },


    //func=biz&userid=10051&detail=1&token=
    getBizList : function(opts, success, error){
        var data = {
            func : 'biz',
            userid : KG.user.get('userid'),
            detail : 1,
            token : KG.user.get('token')
        };

        return this.ajax(data, success, error);
    },

    getBizDetailById : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'view',
            bizid : opts.bizId,
            userid : KG.user.get('userid'),
            token : KG.user.get('token')
        };

        return this.ajax(data, success, error);
    },


    getBizCouponList : function(opts, success, error){
        var mockData = [{
            logo : '/images/165/118/upload/classifiedinfo/19/f9/05/19f905692cf998e30745e31e9f3d28e9.jpg',
            title : '全场满100元送午餐券',
            count : 100,
            stop : true,
            startTime : 1449772731230,
            endTime : 1449772831230
        },{
            logo : '/images/165/118/upload/classifiedinfo/19/f9/05/19f905692cf998e30745e31e9f3d28e9.jpg',
            title : '全场满100元送午餐券',
            count : 100,
            startTime : 1449772731230,
            endTime : 1449772831230
        }];

        return this.mockData(mockData, success, error);

    },


    getSystemMessageList : function(opts, success, error){
        var mockData = [
            {
                id : 1,
                title : '欢迎加入海外同城',
                msgbody : '欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城',
                createTime : Date.now(),
                fromUser : '海外管理员'
            },
            {
                id : 2,
                title : '欢迎加入海外同城11111',
                msgbody : '欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城',
                createTime : Date.now(),
                fromUser : '海外管理员22'
            }
        ];

        return this.mockData(mockData, success, error);
    },
    getSystemMessageDetail : function(opts, success, error){
        var mockData = {
            id : opts.id,
            title : '欢迎加入海外同城',
            msgbody : '欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城欢迎加入海外同城',
            createTime : Date.now(),
            fromUser : '海外管理员'
        };

        return this.mockData(mockData, success, error);
    },

    uploadImage : function(opts, success, error){
        var data = {
            url : 'func=article&act=upload',
            method : 'post',
            type : 'image',
            'uploadfield[]' : opts.image
        };

        return this.ajax(data, success, error);
    },

    getAllAddressAreaInfo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_allregion'
        };
        return this.ajax(data, success, error);
    },

    getUserDetailInfo : function(opts, success, error){
        var data = {
            act : 'getuser',
            check : '0aedbf673e0c9bd37540b75a46af5a12',
            func : 'passport',
            userid : 15623
        };

        return this.ajax(data, function(flag, rs){
            success(true, rs['15623']);
        }, error);
    },

    getAllStoreCategoryList : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'tags'
        };

        return this.ajax(data, success, error);
    },

    getAllStoreTagByCategory : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'taglist',
            biztagid : opts.catId
        };
        return this.ajax(data, success, error);
    }
};