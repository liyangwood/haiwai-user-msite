'use strict';


HW.App.factory('StoreDetailFactory', [
    '$user',
    function($user){

        var ST = {
            monday : ['周一', 1],
            tuesday : ['周二', 2],
            wednesday : ['周三', 3],
            thursday : ['周四', 4],
            friday : ['周五', 5],
            saturday : ['周六', 6],
            sunday : ['周日', 7]
        };
        var XY = '休业';

        return {
            getData : function(storeId, callback, opts){
                opts = util.extend({}, opts||{});

                HW.request.getHomeStoreDetailData({
                    bizid : storeId,
                    userid : $user.get('id'),
                    token : $user.get('token')
                }, function(data){


                    var timeinfolist = [];
                    if(data.timeinfo.format){
                        //biz_time = [];
                        timeinfolist = util.map(data.timeinfo.format, function(item, key){
                            //biz_time += item.datetime1+' 到 '+item.datetime2 + '<br/>';

                            var tmp = key.split(' - '),
                                name = ST[tmp[0]][0],
                                index = ST[tmp[0]][1];

                            if(tmp[1]){
                                name += ' 至 '+ST[tmp[1]][0];
                            }

                            var str = '',
                                f = false;
                            util.each(item, function(one){
                                var sm = one.split(',');
                                if(sm[0] === XY || sm[1] === XY){
                                    f = true;
                                    return false;
                                }

                                //TODO 这步是为了兼容已经添加进去的老数据 以后可以去掉
                                else if(sm[0] === '0' || sm[1] === '0'){
                                    f = true;
                                    return false;
                                }
                                else{
                                    str += sm.join(' 到 ')+'<br/>';
                                }
                            });
                            if(f){
                                str = XY;
                            }
                            if(!str){
                                str = '营业时间未设置';
                            }

                            var rs = {
                                name : name,
                                info : str,
                                index : index
                            };

                            return rs;
                        });

                        timeinfolist.sort(function(a, b){
                            return a.index - b.index;
                        });
                    }

                    data.timeinfolist = timeinfolist;

                    if(data.logo){
                        data.logo = HW.config.APPROOT + data.logo.path;
                    }

                    data.address = data.address || '';
                    if(data.city){
                        data.address += ' , '+data.city;
                    }
                    if(data.state){
                        data.address += ' , '+data.state;
                    }

                    data.address += ' '+data.zip;

                    if(!data.address){
                        data.address = '店铺地址未设置';
                    }


                    callback(data);
                });

            }
        };
    }
]);