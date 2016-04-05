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
        //console.log(url);

        var dataType = 'json';
        if(opts.jsonp){
            dataType = 'jsonp';
            delete opts.jsonp;
        }

        $.ajax({
            type : type,
            url : url,
            data : opts,
            dataType : dataType,
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
            func : 'article',
            act : 'upload',
            method : 'post',
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
            method : 'post',
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
            check : md5(KG.config.MD5_KEY+KG.user.get('userid')),
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
        if(opts.is_active){
            data.is_active = '1';
        }
        if(opts.not_open){
            data.visible = '-1';
        }

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
            id : opts.id,
            entityID : opts.bizId
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
            id : opts.id,
            entityID : opts.id
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
        if(opts.is_active){
            data.is_active = '1';
        }
        if(opts.not_active){
            data.is_active = '0';
        }
        util.addUserIdToRequestData(data);

        return this.ajax(data, success, error);
    },

    /*
    * func=view&act=article_list&category_id=12
    * */
    getSiteArticleList : function(opts, success, error){
        var data = {
            func : 'view',
            act : 'article_list',
            category_id : opts.category
        };
        if(data.category_id === 'hot'){
            delete data.category_id;
        }
        if(opts.lastid){
            data.lastid = opts.lastid;
        }
        return this.ajax(data, success, error);

    },


    /*
    * func=sms&act=send_event&userid=10051&number=5735769567&biz_name=apptest&event_title=测试店铺活动&entityID=140144
    *
    * */
    sendSmsToUserPhone : function(opts, success, error){
        var data = {
            func : 'sms',
            act : 'send_event',
            number : opts.number,
            biz_name : encodeURIComponent(opts.biz_name),
            event_title : encodeURIComponent(opts.event_title),
            entityID : opts.id
            //method : 'post'
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

        if(opts.timeinfo && _.isArray(opts.timeinfo)){
            _.each(opts.timeinfo, function(item, index){
                data['timeinfo['+index+'][daytime]'] = item.daytime.join(',');
                data['timeinfo['+index+'][weektime]'] = item.weektime.join(',');
            });
        }

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=update&userid=10051&bizid=2025591&biztagid=67&name_cn=apptest&zip=95036&city=sanjose&state=ca&address=123%20No%20Way,%20Fremont,%20CA&tel=510-666-6666&sec_tags=71,72&timeinfo[1][daytime]=10:00AM,05:00PM&timeinfo[1][weektime]=1,0,1,1,1,1,1&timeinfo[2][daytime]=10:00AM,05:00PM&timeinfo[2][weektime]=1,0,1,1,1,1,1&token=
    * */
    saveStoreByStep1 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'update',
            bizid : opts.bizId,
            biztagid : opts.bizTagId,
            name_cn : opts.bizName,
            city : opts.city,
            state : opts.state,
            zip : opts.zip,
            address : opts.address,
            tel : opts.bizTel,
            sec_tags : opts.tags
        };

        if(opts.timeinfo && _.isArray(opts.timeinfo)){
            _.each(opts.timeinfo, function(item, index){
                data['timeinfo['+index+'][daytime]'] = item.daytime.join(',');
                data['timeinfo['+index+'][weektime]'] = item.weektime.join(',');
            });
        }

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
    * func=biz&act=update_field&bizid=2025591&website=www.haiwai.com&wechat=123456&briefintro=%E6%B5%8B%E8%AF%95%E5%BA%97%E9%93%BA%E6%8F%8F%E8%BF%B0&dynamic_fields[415][value]=$3000&dynamic_fields[415][type]=6&&dynamic_fields[416][value]=www.xaofeiyang.com&dynamic_fields[416][type]=1&dynamic_fields[417][value]=%E6%98%AF&dynamic_fields[417][type]=5&dynamic_fields[418][value]=%E5%90%A6&dynamic_fields[418][type]=5&dynamic_fields[419][value]=%E8%BD%BF%E8%BD%A6,%E5%8D%A1%E8%BD%A6&dynamic_fields[419][type]=7
    *
    * */
    saveStoreByStep2 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'update_field',
            //method : 'post',
            bizid : opts.bizId,
            website : opts.website,
            briefintro : opts.description,
            wechat : opts.wechat
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
    *
    * */
    getStoreDynamicField : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_biz_dynamic_fields',
            bizid : opts.bizId,
            main_tagid : opts.tagid
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
            //method : 'post',
            step : 3,
            biz_tmpid : opts.bizTmpId||'',
            background_pic : opts.bgPic
        };
        if(opts.logo){
            data.logo = opts.logo;
        }

        util.each(opts.imageList||[], function(one, i){
            data['uploadfield['+i+']'] = one;
        });

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=update_upload&bizid=2025591&background_pic=http://www.sinomedianet.com/haiwai2015.3.19/images/biz_cover/auto03.png
    * */
    updateStoreByStep3 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'update_upload',
            method : 'post',
            bizid : opts.bizId,
            background_pic : opts.bgPic
        };
        data = util.addUserIdToRequestData(data);
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
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=&bizid=2025249&logo=1
    * */
    uploadTmpBizLogo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'upload',
            method : 'post',
            logo : 1,
            'uploadfield[]' : opts.image
        };

        if(opts.type === 'tmp'){
            data.tmp = 1;
            data.biz_tmpid = opts.bizId;
        }
        else{
            data.bizid = opts.bizId;
        }

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&biz_tmpid=1&tmp=1
    * */
    uploadStoreImage : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'upload',
            method : 'post',
            'uploadfield[]' : opts.image,
            bizid : opts.bizId
        };

        if(opts.type === 'tmp'){
            data.biz_tmpid = opts.bizId;
            data.tmp = 1;
            delete data.bizid;
        }

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=post
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

        data.start_date = moment.utc(data.start_date).unix();
        data.end_date = moment.utc(data.end_date).unix();

        util.each(opts.imageList||[], function(one, i){
            data['files['+i+']'] = one;
        });

        if(opts.id){
            data.id = opts.id;
        }

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },


    /*
    * func=passport&act=get_article_event&userid=10051&token=&lastid_event=&lastid_article=
    * */
    getUserArticleAndCouponList : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'get_article_event',
            lastid_article : opts.lastid_article
        };

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },
    getUserCouponList : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'list',
            lastid : opts.lastid
        };
        if(opts.is_active){
            data.is_active = opts.is_active;
        }
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=article&act=index&lastid_article=&userid=14678&token=3aa9f8052b5e8707e7c264f5e9118fcc
    * */
    getUserArticleList : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'index',
            lastid : opts.lastid_article
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

        if(opts.id){
            data.id = opts.id;
        }

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
    },

    /*
    * func=biz&act=closed&bizid=2025591&visible=-1
    * */
    changeStoreOpenStatus : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'closed',
            bizid : opts.bizId,
            visible : opts.status ? 1 : -1
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=article&act=view&userid=10051&id=1370&token=
    * */
    getStoreArticleDetail : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'view',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=view&userid=10051&id=129400&token=
    * */
    getCouponDetail : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'view',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=login&format=jsonp
    * */
    login : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'login',
            method : 'post',
            email : opts.username,
            loginCode : md5(opts.username+opts.password+KG.config.MD5_KEY)
        };

        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=register&email=sida95678910test@gmail.com&password=user2015&confirm_password=user2015&tou_accepted=1
    * */
    register : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'register',
            email : opts.email,
            password : opts.password,
            confirm_password : opts.confirm_password,
            tou_accepted : 1
        };

        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=checkToken&token=
    * */
    checkLogin : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'checkToken',
            token : KG.user.get('token')
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=password&userid=10051&password=test12345&old_password=test12345&token=&pc=1
    * */
    changePassword : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'password',
            userid : KG.user.get('userid'),
            password : opts.password,
            old_password : opts.old,
            pc : 1
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=view&userid=10051&bizid=2025591&token=
    *
    * */
    getStoreDetail : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'view',
            bizid : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=add_bookmark&userid=10051&type=biz&entityID=2024946
    * */
    addFavForStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'add_bookmark',
            type : 'biz',
            entityID : opts.bizId
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=view&act=biz_list&tag=131&subtag=135&dyf_380_s=$
    * */
    getStoreListByTag : function(opts, success, error){
        var data = {
            func : 'view',
            act : 'biz_list',
            tag : opts.tag,
            subtag : opts.subtag,
            subregion : opts.subregion,
            page : opts.page,
            publisher_type : opts.publisher_type
        };

        if(opts.dy){
            _.extend(data, opts.dy);
        }

        return this.ajax(data, success, error);
    },

    /*
    * func=comment&act=list&bizid=2025249&token=
    *
    * */
    getStoreCommentData : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'list',
            bizid : opts.bizId,
            lastid : opts.lastid,
            dataType : 2
        };
        if(opts.has_pic){
            data.has_pic = 1;
        }
        return this.ajax(data, success, error);
    },

    /*
    * func=comment&act=post&userid=10051&bizid=2025249&msg=%E6%B5%8B%E8%AF%95%E5%8F%91%E8%A1%A8%E5%95%86%E9%93%BA%E8%AF%84%E8%AE%BA&dataType=2&dataID=2025249&star=3&token=
    * */
    sendStoreComment : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'post',
            method : 'post',
            bizid : opts.bizId,
            msgbody : opts.msg,
            dataType : 2,
            dataID : opts.bizId,
            star : opts.star
        };
        if(opts.id){
            data.replyid = opts.id;
            data.act = 'reply';
        }
        if(opts.has_pic){
            data.has_pic = '1';
        }
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=comment&act=report&id=93&type=有害信息&msgbody=菜里有蟑螂!&token=
    * */
    reportStoreComment : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'report',
            id : opts.id,
            type : opts.type,
            msgbody : opts.msgbody || '',
            method : 'post'
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=comment&act=buzz&id=93&token=
    * */
    addLikeToStoreComment : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'buzz',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=view&act=event_list&tag=114&subregion=861&page=2
    * */
    getCouponListByTag : function(opts, success, error){
        var data = {
            func : 'view',
            act : 'event_list',
            tag : opts.tag,
            subregion : opts.subregion,
            lastid : opts.lastid
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=view
    * */
    getSiteHomePageData : function(opts, success, error){
        var data = {
            func : 'view'
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=del&bizid=2025634&token=&format=json
    * */
    deleteStoreById : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'del',
            bizid : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=claim_biz&userid=10051&bizid=1
    * */
    claimStoreById : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'claim_biz',
            bizid : opts.id
        };

        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=view&act=biz_search&keyword=火锅
    * */
    searchStoreByKeyword : function(opts, success, error){
        var data = {
            func : 'view',
            act : 'biz_search',
            keyword : opts.keyword,
            page : opts.page || 1
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=reset_password&email=sida9567@gmail.com
    * */
    sendResetPasswordEmail : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'reset_password',
            email : opts.email
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=modify_password&email=sida9567@gmail.com&checkpassword=&password=pianoring
    * */
    resetPassword : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'modify_password',
            email : opts.email,
            checkpassword : opts.check,
            password : opts.password
        };

        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=delfile&fileid=702037&bizid=2025249&token=
    * */
    deleteStoreImage : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'delfile',
            fileid : opts.fileid,
            bizid : opts.bizId
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=get_region
    * */
    getHotLocationRegion : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'get_region'
        };
        return this.ajax(data, success, error);
    },
    /*
    * func=passport&act=set_region&regionID=192
    * */
    setHotLocationRegion : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'set_region',
            regionID : opts.regionID
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=passport&act=mobile_login&login_type=wechat&code=
    * */
    oauthLoginWithWeixinCode : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'mobile_login',
            login_type : 'wechat',
            code : opts.code
        };
        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=&eventID=129400&userid=10051
    * */
    uploadCouponImage : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'upload',
            method : 'post',
            'uploadfield[]' : opts.image,
            eventID : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=article&act=del&userid=10051&id=1138&token=
    * */
    deleteArticle : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'del',
            id : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=verified&bizid=2025656&tel_tmp=123456789&token=
    * */
    pcRenZhengStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'verified',
            bizid : opts.bizId,
            tel_tmp : opts.tel
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=event&act=delfile&fileid=233288&eventID=129400&token=
    * */
    deleteCouponImage : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'delfile',
            fileid : opts.fileid,
            eventID : opts.id
        };
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=ads_view&postid=1&token=3aa9f8052b5e8707e7c264f5e9118fcc
    * */
    getAdsDetail : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'ads_view',
            postid : opts.id
        };
        if(opts.bizinfo){
            data.bizinfo = 1;
        }
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    },

    /*
    * func=biz&act=ads_post&postid=1&fk_entityID=2024902&fk_main_tag_id=131&title=%E6%B2%B8%E8%85%BE%E9%B1%BC%E4%B9%A1%E5%BC%80%E5%BC%A0%E5%95%A6!&ad1=%E6%B0%B4%E7%85%AE%E9%B1%BC%2015$%20%E8%B5%B7!&ad2=%E5%8F%A3%E6%B0%B4%E8%9B%99%20%E5%8D%8A%E6%8A%98&tel=5735769567&pic=http://beta.haiwai.com/upload/classifiedinfo/28/95/13/289513236be214108254151e1dd7ecdd.jpg&type=1&share=%3Cdiv%3E%3C/div%3E&token=
    * */
    createAds : function(opts, success, error){
        var data = {
            func : 'biz',
            method : 'post',
            act : 'ads_post',
            fk_entityID : opts.bizId,
            fk_main_tag_id : opts.tag,
            title : opts.title,
            ad1 : opts.ad1,
            ad2 : opts.ad2,
            tel : opts.tel,
            pic : opts.logo,
            type : opts.type,
            share : encodeURIComponent(opts.html)
        };
        if(opts.id){
            data.postid = opts.id;
        }
        data = util.addUserIdToRequestData(data);
        return this.ajax(data, success, error);
    }
};