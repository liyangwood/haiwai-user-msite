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
                    success.call(null, json.status>0, json.return);
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
            id : 123,
            logo : '/images/165/118/upload/classifiedinfo/19/f9/05/19f905692cf998e30745e31e9f3d28e9.jpg',
            title : '全场满100元送午餐券',
            count : 100,
            bizInfo : {
                name : '小肥羊Fremont店',
                address : 'Fremont, CA 98765'
            },
            stop : true,
            startTime : 1449772731230,
            endTime : 1449772831230
        },{
            id : 234,
            logo : '/images/165/118/upload/classifiedinfo/19/f9/05/19f905692cf998e30745e31e9f3d28e9.jpg',
            title : '全场满100元送午餐券',
            count : 100,
            bizInfo : {
                name : '小肥羊Fremont店',
                address : 'Fremont, CA 98765'
            },
            startTime : 1449772731230,
            endTime : 1449772831230
        }];

        return this.mockData(mockData, success, error);

    },

    getStoreBigBgImageList : function(opts, success, error){
        var mockData = [
            {
                url : 'http://www.sinomedianet.com/haiwai2015.3.19/images/city-pic/sf.jpg'
            },
            {
                url : 'http://www.sinomedianet.com/haiwai2015.3.19/images/city-pic/sf.jpg',
            },
            {
                url : 'http://www.sinomedianet.com/haiwai2015.3.19/images/city-pic/sf.jpg'
            }
        ];

        return this.mockData(mockData, success, error);
    },


    /*
    * func=sysmsg&userid=10051
    * 首页系统消息
    * */
    getSystemMessageList : function(opts, success, error){
        var data = {
            func : 'sysmsg'
        };
        util.addUserIdToRequestData(data);
        console.log(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=sysmsg&act=view&id=12&userid=10051
    *
    * */
    getSystemMessageDetail : function(opts, success, error){
        var data = {
            func : 'sysmsg',
            act : 'view',
            id : opts.id
        };

        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=sysmsg&act=delete&id[1]=1&id[2]=2&userid=10051
    *
    * */
    deleteSystemMessageById : function(opts, success, error){
        var data = {
            func : 'sysmsg',
            act : 'delete'
        };

        if(opts.id){
            data['id[1]'] = opts.id;
        }
        else if(opts.ids){
            util.each(opts.ids, function(d, i){
                data['id['+(i+1)+']'] = d;
            });
        }

        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
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
    },

    /*
    * func=biz&act=bookmark&userid=10051
    *
    * */
    getMyfavStoreList : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'bookmark'
        };


        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=delete_bookmark&userid=10051&type=biz&id=1
    *
    * */
    deleteMyFavStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'delete_bookmark',
            type : 'biz',
            id : opts.id
        };
        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=bookmark&userid=10051
    * 我的优惠
    * */
    getMycouponList : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'bookmark'
        };
        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    getSiteArticleList : function(opts, success, error){
        var data = {

        };

        var mockData = [
            {
                id : 1,
                title : '盘点旧金山里那些文艺范儿的店',
                image : 'http://www.haiwai.com/images/750/438/upload/classifiedinfo/e3/53/03/e35303ef3c6a5477ef7dcd6f6698554c.jpg',
                description : '盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文',
                dateline : Date.now(),
                bizInfo : {
                    name : '沸腾渔乡',
                    address : '290 Barber Ct, Milpitas, CA 95035',
                    logo : 'http://www.haiwai.com/upload/biz/9d/10/5f/9d105fef7bb81eb57103915d800b7bf7.jpg'
                },
                view : 3002212
            },
            {
                id : 1,
                title : '盘点旧金山里那些文艺范儿的店',
                image : 'http://www.haiwai.com/images/750/438/upload/classifiedinfo/e3/53/03/e35303ef3c6a5477ef7dcd6f6698554c.jpg',
                description : '盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文盘点旧金山里那些文艺范儿的店正文',
                dateline : Date.now(),
                bizInfo : {
                    name : '沸腾渔乡',
                    address : '290 Barber Ct, Milpitas, CA 95035',
                    logo : 'http://www.haiwai.com/upload/biz/9d/10/5f/9d105fef7bb81eb57103915d800b7bf7.jpg'
                },
                view : 3002212
            },
            {
                id : 1,
                title : '盘点旧金山里那些文艺范儿的店盘点旧金山里那些文艺范盘点旧金山里那些文艺范盘点旧金山里那些文艺范盘点旧金山里那些文艺范',
                image : 'http://www.haiwai.com/images/750/438/upload/classifiedinfo/e3/53/03/e35303ef3c6a5477ef7dcd6f6698554c.jpg',
                description : '盘点旧金山里那些文艺范',
                bizInfo : {
                    name : '沸腾渔乡',
                    address : '290 Barber Ct, Milpitas, CA 95035',
                    logo : 'http://www.haiwai.com/upload/biz/9d/10/5f/9d105fef7bb81eb57103915d800b7bf7.jpg'
                },
                dateline : Date.now(),
                view : 3002212
            }
        ];

        return this.mockData(mockData, success, error);
    },

    getSiteArticleDetail : function(opts, success, error){
        var mockData = {
            id : 1,
            title : '盘点旧金山里那些文艺范儿的店盘点旧金山里那些文艺范盘点旧金山里那些文艺范盘点旧金山里那些文艺范盘点旧金山里那些文艺范',
            bizInfo : {
                name : '沸腾渔乡',
                address : '290 Barber Ct, Milpitas, CA 95035',
                logo : 'http://www.haiwai.com/upload/biz/9d/10/5f/9d105fef7bb81eb57103915d800b7bf7.jpg'
            },
            msgbody : '<p>田肥美，国殷富，战车万乘，奋击百万，沃野千里，蓄积饶多，地势形便，此所谓天府，天下之雄国也。川菜讲究色、香、味、形，在“味”字上下功夫，以味的多、广、厚著称。</p><img src="http://www.haiwai.com/upload/biz/9d/10/5f/9d105fef7bb81eb57103915d800b7bf7.jpg"/><p>川菜口味的组成，主要有“麻、辣、咸、甜酸、苦、香”7种味道，巧妙搭配，灵活多变，创制出麻辣、酸辣、红油、白油等几十种各具特色的符合味，味别之多，调制之妙，堪称中外菜肴之首，从而赢得了“一菜一格，百菜百味”的称誉。</p><img src="http://www.haiwai.com/upload/biz/4d/4e/2b/4d4e2b5204381465f411cfa32ea6666c.jpg"/>"/><p>川菜作为中国八大菜系之一，在烹饪史上占有极其重要的地位。它取材广泛，调味多变，菜式多样，口味清鲜醇浓并重，以善用麻辣著称，并以其别具一格的烹调方法和浓郁的地方味享誉中外，成为中华民族饮食文化中一颗璀璨的明珠。</p>',
            dateline : Date.now(),
            view : '1,211,311',
            tag : '精选内容 | 美食Tips'
        };
        return this.mockData(mockData, success, error);
    },

    /*
    * func=sms&act=send_event&userid=10051&number=5735769567&biz_name=apptest&event_title=测试店铺活动
    *
    * */
    sendSmsToUserPhone : function(opts, success, error){
        var data = {
            func : 'sms',
            act : 'send_event',
            number : opts.number,
            biz_name : opts.biz_name,
            event_title : opts.event_title
        };

        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=passport&
    * act=update&userid=10051&nick=test&
    * region=929&contact_email=test@gmail.com&email=test@gmail.com&
    * tel=1234567890&wechat=123456&signature=signature%20test&token=
    *
    * */
    modifyUserInfo : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'update',
            nick : opts.nickname,
            region : opts.region,
            contact_email : opts.contact_email||'',
            email : opts.email,
            tel : opts.tel,
            wechat : opts.wechat,
            signature : opts.description

        };
        data = util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    }
};