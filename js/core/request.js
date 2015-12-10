KG.request = {
    ajax : function(opts, success, error){
        var url = KG.config.ApiRoot;

        var type = opts.method || 'get';
        delete opts.method;

        var dtd = $.Deferred();

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


    getBizCouponList : function(opts, success, error){
        var mockData = [{
            logo : '/images/165/118/upload/classifiedinfo/19/f9/05/19f905692cf998e30745e31e9f3d28e9.jpg',
            title : '全场满100元送午餐券',
            count : 100,
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

    }
};