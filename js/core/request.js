KG.request = {
    ajax : function(opts, success, error){
        error = error || function(){};
        var url = KG.config.ApiRoot;

        var type = opts.method || 'get';
        delete opts.method;

        $.ajax({
            type : type,
            url : url,
            data : opts,
            dataType : 'json',
            success : function(json){
                success.call(null, !!json.status, json.return);
            },
            error : function(err){
                error(err);
            }
        })
    },


    //func=biz&userid=10051&detail=1&token=
    getBizList : function(opts, success, error){
        var data = {
            func : 'biz',
            userid : KG.user.get('userid'),
            detail : 1,
            token : KG.user.get('token')
        };

        this.ajax(data, success, error);
    }
};