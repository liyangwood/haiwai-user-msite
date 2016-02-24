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

        if(type === 'post'){
            url += '&func='+opts.func;
            url += '&act='+opts.act;
        }
        console.log(url);

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
            type : 'image',
            'uploadfield[]' : opts.image
        };

        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=upload&userid=10051&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=
    * */
    uploadUserImage : function(opts, success, error){
        var data = {
            func : 'passport',
            //method : 'post',
            act : 'upload',
            'uploadfield[]' : opts.image
        };

        data = util.addUserIdToRequestData(data);
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
            check : KG.user.get('token'),
            func : 'passport',
            userid : KG.user.get('userid')
        };

        return this.ajax(data, function(flag, rs){
            success(true, rs[data.userid]);
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


        data = util.addUserIdToRequestData(data);

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
        data = util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=delete_bookmark&userid=10051&type=classifiedinfo&id=1
    * */
    deleteMyFavCoupon : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'delete_bookmark',
            type : 'classifiedinfo',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);

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
    },


    /*
    * func=biz&act=pc_add&step=1&bizname=app_test&biztel=123456789&biztagid=67&sec_tags=71,72&address=3442%20Mackenzie%20Dr&city=fremont&state=CA&zip=95035&timeinfo[1][daytime]=10:00AM,05:00PM&timeinfo[1][weektime]=1,0,1,1,1,1,1&timeinfo[2][daytime]=10:00AM,05:00PM&timeinfo[2][weektime]=1,0,1,1,1,1,1
    *
    * */
    createStoreByStep1 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'pc_add',
            step : 1,
            bizname : opts.bizName,
            biztel : opts.bizTel,
            biztagid : opts.bizTagId,
            sec_tags : opts.tags,
            address : opts.address,
            city : opts.city,
            state : opts.state,
            zip : opts.zip

        };

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },


    /*
    * func=biz&act=pc_add&step=2&biz_tmpid=272&wechat=123456&description=%E6%B5%8B%E8%AF%95%E5%BA%97%E9%93%BA%E6%8F%8F%E8%BF%B0&dynamic_fields[415][value]=$3000&dynamic_fields[415][type]=6&&dynamic_fields[416][value]=www.xaofeiyang.com&dynamic_fields[416][type]=1&dynamic_fields[417][value]=%E6%98%AF&dynamic_fields[417][type]=5&dynamic_fields[418][value]=%E5%90%A6&dynamic_fields[418][type]=5&dynamic_fields[419][value]=%E8%BD%BF%E8%BD%A6,%E5%8D%A1%E8%BD%A6&dynamic_fields[419][type]=7
    *
    * */
    createStoreByStep2 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'pc_add',
            step : 2,
            biz_tmpid : opts.bizTmpId,
            wechat : opts.wechat,
            description : opts.description
        };

        util.extend(data, opts.dynamic || {});

        data = util.addUserIdToRequestData(data);
        console.log(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=get_dynamic_fields&main_tagid=69
    *
    * */
    getTmpStoreDynamicField : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_dynamic_fields',
            main_tagid : opts.mainTagId
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=get_biz_dynamic_fields&bizid=2025591
    * */
    getStoreDynamicField : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_biz_dynamic_fields',
            bizid : opts.bizId
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=pc_add&step=3&biz_tmpid=272&background_pic=http://www.sinomedianet.com/haiwai2015.3.19/images/biz_cover/auto03.png&uploadfield[]=http://www.sinomedianet.com/haiwai2015.3.19/images/biz_cover/auto03.png&uploadfield[]=http://www.sinomedianet.com/haiwai2015.3.19/images/biz_cover/auto03.png&logo=http://www.sinomedianet.com/haiwai2015.3.19/images/biz_cover/auto03.png
    *
    * */
    createStoreByStep3 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'pc_add',
            step : 3,
            biz_tmpid : opts.bizTmpId,
            background_pic : opts.bgPic
        };

        util.each(opts.imageList||[], function(one, i){
            data['uploadfield['+i+']'] = one;
        });

        data = util.addUserIdToRequestData(data);
        console.log(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=get_background_pic&main_tagid=69
    * */
    getStoreBigBackgroundPic : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_background_pic',
            main_tagid : opts.mainTagId
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&biz_tmpid=1&tmp=1&logo=1
    * */
    uploadTmpBizLogo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'upload',
            tmp : 1,
            logo : 1,
            biz_tmpid : opts.bizTmpId,
            'uploadfield[]' : opts.image
        };
        console.log(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=post&userid=10051&subject=%E6%B5%8B%E8%AF%95%E5%BA%97%E9%93%BA%E6%B4%BB%E5%8A%A8&description=%E6%B5%8B%E8%AF%95%E5%BA%97%E9%93%BA%E6%B4%BB%E5%8A%A8%E6%8F%8F%E8%BF%B0&fk_entityID=2025265,2024981&start_date=2015/10/30&end_date=2015/12/30&id=129400&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=
    *
    * */
    createStoreCouponEvent : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'post',
            method : 'post',
            subject : opts.subject,
            description : opts.description,
            fk_entityID : opts.biz,
            start_date : opts.startDate,
            end_date : opts.endDate
        };

        util.each(opts.imageList||[], function(one, i){
            data['uploadfield['+i+']'] = one;
        });

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=get_article_event&userid=10051&bizid=2025249&token=&lastid_event=&lastid_article=
    * */
    getStoreArticleAndCouponList : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_article_event',
            bizid : opts.bizId
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=get_article_event&userid=10051&token=&lastid_event=&lastid_article=
    * */
    getUserArticleAndCouponList : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'get_article_event'
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=article&act=tags
    * */
    getArticleCategoryList : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'tags'
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=article&act=post&userid=10051&category_id=6&title=%E6%B5%8B%E8%AF%95%E5%8F%91%E8%A1%A8%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98&msgbody=%E6%B5%8B%E8%AF%95%E5%8F%91%E8%A1%A8%E6%96%87%E7%AB%A0%E5%86%85%E5%AE%B9&fk_entityID=2025249&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=
    * */
    createStoreArticle : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'post',
            method : 'post',
            category_id : opts.category,
            title : opts.title,
            msgbody : (opts.msgbody),
            fk_entityID : opts.bizId
        };

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=del&userid=10051&id=129400&token=
    * */
    deleteCouponById : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'del',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    }
};