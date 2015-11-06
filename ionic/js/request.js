

HW.App.factory('$request', [
    '$http',
    function($http){


    var REQUEST_TIMEOUT = 10000;


var request = {

    init : function(){


        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        util.log('HW.request is ok');
    },

    jsonp : function(data, success, error, config){
        error = error || function(){
                //HW.helper.alert(arguments);
            };

        var url = HW.config.API_PATH;

        util.extend(data, {
            format : 'json',
            callback : 'JSON_CALLBACK'
        });

        var done = function(rs, status){
            console.log(rs, status);
            if(status >= 200){
                if(rs.status > 0){
                    success(rs.return, true);
                }
                else{
                    success(rs.return, false);
                }
            }
        };

        var errorFn = function(err, status){
            if(false === error(err, status)) return false;

            if(status > 400){
                //HW.helper.alert('服务器出现错误，请返回重试');

            }
            else if(status === 0){
                util.error(arguments);

                HW.helper.alert('请求超时，请检查网络', function(){
                    //$window.location.reload(true)
                });
            }

            try{
                HW.helper.loading.hide();
            }catch(e){}

        };

        config = config || {};
        config.params = data;
        config.timeout = REQUEST_TIMEOUT;

console.log('--request-->', config.params);
        $http.jsonp(url, config).success(done).error(errorFn);
    },

    post : function(data, success, error, config){

        //if(!util.inDevice()){
        //    this.jsonp(data, success, error, config);
        //    return;
        //}



        var url = HW.config.API_PATH+'?format=json';
        if(data.func){
            url += '&func='+data.func;
            delete data.func;
        }
        if(data.act){
            url += '&act='+data.act;
            delete data.act;
        }
        util.extend(data, {
            format : 'json'
            //callback : 'JSON_CALLBACK'
        });

        var done = function(rs, status){
            console.log(rs, status);
            if(status >= 200){
                if(rs.status > 0){
                    success(rs.return, true);
                }
                else{
                    success(rs.return, false);
                }
            }
        };

        var errorFn = function(err, status){
            if(false === error(err, status)) return false;

            if(status > 400){
                //HW.helper.alert('服务器出现错误，请返回重试');

            }
            else if(status === 0){
                console.log(arguments);

                HW.helper.alert('请求超时，请检查网络', function(){
                    //$window.location.reload(true)
                });
            }

            try{
                HW.helper.loading.hide();
            }catch(e){}

        };

        var tmp = '';
        util.each(data, function(v, k){
            tmp += k+'='+encodeURIComponent(v)+'&';
        });
        tmp = tmp.replace(/&$/, '');

        //var tmp = new FormData();
        //util.each(data, function(v, k){
        //    tmp.append(k, v);
        //});

        config = config || {};
        //config.data = tmp;
        config.method = 'POST';
        if(config['ContentType']){
            //config.headers = {'Content-Type': config['ContentType']};
            //config.transformRequest = angular.identity;
            config.headers = {'Content-Type': undefined};
            delete config['ContentType']
        }

        //config.url = url;

        console.log(url, JSON.stringify(config));
        $http.post(url, tmp, config).success(done).error(error);
        //$http(config).success(done).error(error);
    },


    /*
    * func=passport&act=login&email=sida9567@gmail.com&loginCode=613257d9a1e054f714d7314c34d4cd29&format=jsonp
    *
    * */
    login : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'login',
            email : opts.username,
            loginCode : md5(opts.username+opts.password+HW.config.MD5_KEY)
        };


        this.jsonp(data, success, error);
    },


    /*
    * func=biz&userid=10051&detail=1&token=
    *
    * */
    getHomeStoreListData : function(opts, success, error){

        var data = {
            func : 'biz',
            userid : opts.userid,
            detail : 1,
            token : opts.token
        };


        this.jsonp(data, function(rs, flag){
            if(flag){
                var list = util.map(rs, function(item){
                    item['biz_id'] = item['entityID'];
                    item.logo = HW.config.APPROOT+item.logo;
                    return item;
                });
                success(list);
            }
            else{
                success([]);
            }

        }, error);
    },

    /*
    * func=biz&act=view&userid=10051&bizid=2025249&token=
    *
    * */
    getHomeStoreDetailData : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'view',
            userid : opts.userid,
            bizid : opts.bizid,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },



    /*
    * func=biz&act=tags
    *
    * */
    getStoreServiceCategoryList : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'tags'
        };

        this.jsonp(data, success, error);
    },


    /*
    * func=passport&act=getuser&userid=12139&check=
    *
    * */
    getUserDetailInfo : function(opts, success, error){
        var data = {
            act : 'getuser',
            func : 'passport',
            userid : opts.userid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=logout&token=
    *
    * */
    logout : function(opts, success, error){
        var data = {
            act : 'logout',
            func : 'passport',
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=checkToken&token=
    *
    * */
    checkLogin : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'checkToken',
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=register&email=sida95678910test@gmail.com&password=user2015&confirm_password=user2015&tou_accepted=1
    *
    * */
    register : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'register',
            email : opts.email,
            password : opts.password,
            confirm_password : opts.password2,
            tou_accepted : 1
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=qqh&act=list&userid=10051&classifiedid=2025211&lastdate=&token=
    *
    *
    * */
    getMessageList : function(opts, success, error){
        var data = {
            func : 'qqh',
            act : 'list',
            userid : opts.userid,
            classifiedid : opts.bizid,
            lastdate : 0,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=qqh&act=view&userid=10051&classifiedid=2025249&basecode=1&lastid=&token=
    *
    *
    * */
    getMessageDetail : function(opts, success, error){
        var data = {
            func : 'qqh',
            act : 'view',
            userid : opts.userid,
            classifiedid : opts.bizid,
            basecode : opts.basecode,
            lastid : 0,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=qqh&act=send&title=bbb&msgbody=&userid=10051&email=&touserid=12139&classifiedid=2025249&token=
    *
    *
    * */
    sendMessage : function(opts, success, error){
        var data = {
            func : 'qqh',
            act : 'send',
            title : 'title',
            msgbody : opts.text,
            userid : opts.userid,
            email : opts.email,
            classifiedid : opts.bizid,
            token : opts.token,
            touserid : opts.touserid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=comment&act=list&userid=10051&bizid=2025249
    *
    *
    * */
    getAllReplyListByBiz : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'list',
            userid : opts.userid,
            bizid : opts.bizid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=add&step=1&bizname=app_test&biztel=123456789&biztagid=67
    *
    *
    * */
    createStoreByStep1 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'add',
            step : 1,
            bizname : opts.bizname,
            biztel : opts.biztel,
            biztagid : opts.biztagid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=add&step=2&biz_tmpid=1
    *
    * */
    findStoreByStep2 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'add',
            step : 2,
            biz_tmpid : opts.tmp_bizid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=add&step=3&biz_tmpid=1&biztagid=67&bizname=apptest&
    * address=123%20No%20Way,%20Fremont,%20CA&tel=510-666-6666&
    * description=%E5%B9%BF%E5%A4%A7%E5%90%83%E8%B4%A7%E7%BE%A4%E4%BD%93&
    * sec_tags=71,72&daytime=10:00AM,5:00PM&weektime=1,0,1,1,1,1,1
    *
    * */
    createNewOrModifyStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'add',
            step : 3,
            biz_tmpid : opts.tmp_bizid,
            biztagid : opts.biztagid,
            bizname : opts.bizname,
            address : opts.address || '',
            tel : opts.tel,
            description : opts.description,
            sec_tags : opts.taglist.join(','),
            zip : opts.zipcode,
            state : opts.state || '',
            city : opts.city || '',
            wechat : opts.wechat || '',
            website : opts.website || ''

        };

        util.each(opts.timeInfo, function(item, index){
            data['timeinfo['+index+'][daytime]'] = item.daytime.join(',');
            data['timeinfo['+index+'][weektime]'] = item.weektime.join(',');
        });

        this.post(data, success, error);
    },

    /*
    * func=biz&act=update&userid=10051&bizid=2025249&
    * biztagid=67&name_cn=&address=&tel=&briefintro=&
    * sec_tags=71&daytime=10:00AM,5:00PM&
    * weektime=1,0,1,1,1,1,1&token=
    *
    * timeinfo[1][daytime]=10:00AM,5:00PM&
    * timeinfo[1][weektime]=1,0,1,1,1,1,1&
    * timeinfo[1][id]=&
    * timeinfo[2][daytime]=10:00AM,5:00PM&
    * timeinfo[2][weektime]=1,0,1,1,1,1,1&
    * timeinfo[2][id]=&token=
    *
    * */
    modifyStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'update',
            userid : opts.userid,
            bizid : opts.bizid,
            biztagid : opts.biztagid,
            name_cn : opts.name,
            address : opts.address || '',
            tel : opts.tel,
            briefintro : opts.briefintro,
            sec_tags : opts.taglist.join(','),
            //daytime : opts.daytime,
            //weektime : opts.weektime.join(','),
            token : opts.token,
            zip : opts.zipcode,
            state : opts.state || '',
            city : opts.city || '',
            wechat : opts.wechat || '',
            website : opts.website || ''
        };
        util.each(opts.timeInfo, function(item, index){
            data['timeinfo['+index+'][daytime]'] = item.daytime.join(',');
            data['timeinfo['+index+'][weektime]'] = item.weektime.join(',');
        });


        this.post(data, success, error);
    },

    /*
    * func=biz&act=add&step=4&biz_tmpid=1&userid=10051
    *
    * */
    createStoreByStep4 : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'add',
            step : 4,
            biz_tmpid : opts.tmp_bizid,
            userid : opts.userid,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=get_biz_tmp&step=2&biz_tmpid=1
    *
    * */
    getTempBizInfo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_biz_tmp',
            step : 2,
            biz_tmpid : opts.tmp_bizid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=taglist&biztagid=40
    *
    * */
    getStoreTagDetail : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'taglist',
            biztagid : opts.biztagid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=claim_biz&userid=10051&bizid=1
    *
    * */
    makeSureStore : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'claim_biz',
            userid : opts.userid,
            bizid : opts.bizid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&biz_tmpid=1&tmp=1
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&bizid=2025249
    *
    * */
    uploadStoreImage : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'upload',
            'uploadfield[0]' : opts.image,
            biz_tmpid : opts.tmp_bizid,
            tmp : 1
        };

        if(opts.bizid){
            data.bizid = opts.bizid;
            delete data.biz_tmpid;
            delete data.tmp;
        }

        this.post(data, success, error);
    },

    /*
    * func=biz&act=delfile&fileid=702037&bizid=2025249&token=
    * func=biz&act=delfile_tmp&filename=/upload/uploadfield/aa/a0/3b/pic0.png&bizid=34&token=
    *
    * */
    deleteUploadStoreImage : function(opts, success, error){
        var data = {
            func : 'biz',
            bizid : opts.bizid
        };
        if(opts.isStore){
            util.extend(data, {
                act : 'delfile',
                fileid : opts.fileid
            });
        }
        else{
            util.extend(data, {
                act : 'delfile_tmp',
                filename : opts.fileid
            });
        }


        this.jsonp(data, success, error);
    },

    /*
    * func=sms&act=send&number=5735769567
    *
    * */
    sendSmsCode : function(opts, success, error){
        var data = {
            func : 'sms',
            act : 'send',
            number : opts.number
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=sms&act=check&number=5735769567&code=269080
    *
    * */
    verifySmsCode : function(opts, success, error){
        var data = {
            func : 'sms',
            act : 'check',
            number : opts.number,
            code : opts.code
        };
        this.jsonp(data, success, error);
    },


    /*
    * func=event&act=post&userid=10051&bizid=2025249&
    * subject=&description=&
    * fk_entityID=2025265,2024981&
    * start_date=2015/10/30&
    * end_date=2015/12/30&id=129400&token=
    *
    * */
    publishAction : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'post',
            userid : opts.userid,
            //bizid : opts.bizid,
            subject : opts.title,
            description : encodeURIComponent(opts.description),
            fk_entityID : opts.bizlist.join(','),
            start_date : opts.startDate,
            end_date : opts.endDate,
            token : opts.token
        };

        if(opts.imgList){
            util.each(opts.imgList, function(src, index){
                data['uploadfield['+index+']'] = src;
            });
        }

        this.post(data, success, error);
    },

    /*
    * func=event&act=view&userid=10051&id=129400&token=
    *
    * */
    getActionDetail : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'view',
            userid : opts.userid,
            bizid : opts.bizid,
            id : opts.actionId,
            token : opts.token
        };
        this.jsonp(data, success, error);
    },

    /*
    * func=article&act=post&userid=10051&bizid=2025249&
    * category_id=6&title=&msgbody=&
    * entity=2025249,2024946&token=
    *
    *
    * */
    publishArticle : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'post',
            userid : opts.userid,
            //bizid : opts.bizlist[0],
            category_id : opts.category_id,
            title : opts.title,
            msgbody : encodeURIComponent(opts.msgbody),
            fk_entityID : opts.bizlist.join(','),
            token : opts.token

        };
        if(opts.imgList){
            util.each(opts.imgList, function(src, index){
                data['uploadfield['+index+']'] = src;
            });
        }
        this.post(data, success, error);
    },

    /*
    * func=article&act=tags
    *
    * */
    getArticleCategoryList : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'tags'
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=article&act=view&userid=10051&bizid=2025249&id=1138&token=
    *
    * */
    getArticleDetail : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'view',
            userid : opts.userid,
            bizid : opts.bizid,
            id : opts.articleId,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=comment&act=post&userid=10051&bizid=2025249&
    * msg=%&dataType=2&dataID=2025249&token=
    *
    * */
    sendComment : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'post',
            userid : opts.userid,
            bizid : opts.bizid,
            msg : opts.msg,
            dataID : opts.entity,
            token : opts.token
        };

        data.dataType = {
            store : 2,
            article : 1,
            action : 3
        }[opts.type];

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=get_article_event&userid=10051&bizid=2025249&token=
    *
    * */
    getDetailListByBiz : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_article_event',
            userid : opts.userid,
            bizid : opts.bizid
        };
        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=get_article_event&userid=10051&token=&lastid_event=&lastid_article=
    *
    * */
    getDetailList : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'get_article_event',
            userid : opts.userid,
            token : opts.token,
            lastid_event : '',
            lastid_article : ''
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&biz_tmpid=1&tmp=1&logo=1
    *
    *
    * */
    uploadStoreTmpLogo : function(opts, success, error){
        var data = {
            act : 'upload',
            func : 'biz',
            'uploadfield[0]' : opts.logo,
            biz_tmpid : opts.bizid,
            tmp : 1,
            logo : 1
        };

        this.post(data, success, error);
    },

    /*
    * func=biz&act=upload&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=&bizid=2025249&logo=1
    *
    * */
    uploadStoreLogo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'upload',
            'uploadfield[0]' : opts.logo,
            token : opts.token,
            userid : opts.userid,
            bizid : opts.bizid,
            logo : 1
        };

        this.post(data, success, error);
    },

    /*
    * func=article&act=upload&userid=10051&type=image&uploadfield[]=&token=
    *
    * */
    uploadImage : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'upload',
            userid : opts.userid,
            token : opts.token,
            type : 'image',
            'uploadfield[]' : opts.image
        };

        this.post(data, success, error);
    },

    /*
    * func=comment&act=report&id=39&token=
    *
    * */
    sendReplyReport : function(opts, success, error){
        var data = {
            func : 'comment',
            act : 'report',
            id : opts.replyId,
            bizid : opts.bizid,
            token : opts.token,
            userid : opts.userid
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=article&act=del&userid=10051&id=1138&token=
    *
    * */
    deleteArticle : function(opts, success, error){
        var data = {
            func : 'article',
            act : 'del',
            userid : opts.userid,
            id : opts.id,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=event&act=del&userid=10051&id=129400&token=
    *
    * */
    deleteAction : function(opts, success, error){
        var data = {
            func : 'event',
            act : 'del',
            userid : opts.userid,
            id : opts.id,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=biz&act=get_allregion
    *
    * */
    getAllAddressAreaInfo : function(opts, success, error){
        var data = {
            func : 'biz',
            act : 'get_allregion'
        };
        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=update&userid=10051&nick=test&region=929&contact_email=test@gmail.com&tel=1234567890&token=
    *
    * */
    modifyUserInfo : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'update',
            userid : opts.userid,
            nick : opts.nickname,
            region : opts.region,
            contact_email : opts.email,
            tel : opts.phone,
            token : opts.token
        };

        this.jsonp(data, success, error);
    },

    /*
    * func=passport&act=upload&userid=10051&uploadfield[]=data:image/png;base64,iVBORw0KGgoAAAAN&token=
    * */
    uploadUserImage : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'upload',
            userid : opts.userid,
            'uploadfield[]' : opts.image,
            token : opts.token
        };

        this.post(data, success, error);
    },

    /*
    * func=passport&act=password&userid=10051&password=test12345&token=
    *
    * */
    changePassword : function(opts, success, error){
        var data = {
            func : 'passport',
            act : 'password',
            userid : opts.userid,
            token : opts.token,
            password : opts.password
        };

        this.jsonp(data, success, error);
    },

    end : ''
};


    HW.request = request;

    return request;

}]);