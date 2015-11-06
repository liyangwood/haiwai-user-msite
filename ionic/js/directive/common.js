'use strict';

HW.App.directive('hwLoginBox', function($user){

    return {
        restrict : 'E',
        replace : true,
        templateUrl : HW.config.ROOT + 'tpl/login.html',
        scope : {
            loginSuccessCallback : '=',
            regSuccessCallback : '='
        },
        controller : function($scope){
            HW.helper.checkWeixinInstall(function(rs){
                $scope.isWeixinInstall = rs;
            });

            $scope.isRegBox = false;
            $scope.showRegBox = function(){
                $scope.isRegBox = true;
            };
            $scope.showLoginBox = function(){
                $scope.isRegBox = false;
            };
        },
        link : function($scope){

            $scope.username = $user.get('username') || '';
            $scope.password = $user.get('password') || '';

            util.extend($scope, {
                login : function(){
                    var email = $scope.username,
                        pwd = $scope.password;


                    $user.login({
                        username : email,
                        password : pwd
                    }, function(user){
                        $scope.loginSuccessCallback && $scope.loginSuccessCallback(user);
                    }, function(){});
                },
                reg : function(){
                    var email = $scope.username,
                        pwd = $scope.password,
                        pwd2 = $scope.password2;

                    $user.reg({
                        username : email,
                        password : pwd,
                        password2 : pwd2
                    }, function(user){
                        $scope.login();
                    });
                },

                weixinLogin : function(){
                    HW.helper.loginWithWeixin(function(data){
                        //HW.helper.alert(JSON.stringify(data));

                        $user.setWithWeixinLogin(data);

                        HW.helper.reload();
                    });
                }
            });


        }
    };
});

HW.App.directive('hwStarNum', [
    function(){
        return {
            restrict : 'E',
            replace : true,
            template : function(element, attr){
                var h = '<label class="hw-star-num">';

                var len = attr['starNum'] || 0;
                for(var i= 0; i<5; i++){
                    if(i<len){
                        h += '<i style="font-size: 16px;color: #f66228;margin:0;" class="icon ion-ios-star"></i>';
                    }
                    else{
                        h += '<i style="font-size: 16px;color: #9c9c9c;margin:0;" class="icon ion-ios-star-outline"></i>';
                    }


                }

                return h+'</label>';
            }
        };
    }
]);

HW.App.directive('hwCommonReplyBox', [
    function(){
        var F = {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/common-reply-box.html',
            scope : {
                replyData : '='
            },
            controller : function($scope, $element){

            },
            link : function($scope, $element, $attr){
                $scope.hideReplyBox = $attr['hideReplyBox']==='true';
            }
        };

        return F;
    }
]);

//HW.App.directive('hwPublishArticle', [
//    function(){
//        var F = {
//            restrict : 'E',
//            replace : true,
//            templateUrl : HW.config.ROOT + 'tpl/pub-article.html',
//            scope : {
//                publishButtonCallback : '='
//            },
//            controller : function($scope){
//                util.extend($scope, {
//                    publish : function(){
//
//                        $scope.publishButtonCallback();
//                    },
//
//                    getPhoto : function(e){
//                        console.log('get picture');
//                        HW.helper.camera.getPicture({}, function(){}, function(){});
//
//                        e.stopPropagation();
//                    }
//                });
//
//            },
//            link : function($scope){
//
//            }
//        };
//        return F;
//    }
//]);

HW.App.directive('hwPublishStore', [
    '$ionicActionSheet',
    '$q',
    function($ionicActionSheet, $q){
        var F = {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/pub-store.html',
            scope : {
                publishButtonCallback : '=',
                storeData : '='
            },
            controller : function($scope, $element){

                var file_icon = util.jq($element[0].querySelector('#hw-file-icon')),
                    file_image = util.jq($element[0].querySelector('#hw-file-image')),
                    image_box = util.jq($element[0].querySelector('#js_image_box'));
                var weekbox = util.jq($element[0].querySelector('#js_week_box'));

                file_icon.bind('change', function(){
                    var file = this.files[0];

                    if(!file) return false;

                    var fr = new FileReader();
                    fr.onload = function(e){
                        var binary = e.target.result;

                        HW.helper.loading.show('正在上传');
                        if($scope.store.isStore){
                            HW.request.uploadStoreLogo({
                                logo : binary,
                                bizid : $scope.store.bizid,
                                userid : HW.user.get('id'),
                                token : HW.user.get('token')
                            }, function(rs){
                                HW.helper.loading.hide();
                                if(rs.files){
                                    $scope.store.logo = HW.config.APPROOT + rs.files[0];

                                    HW.helper.toast('上传成功');
                                }
                            });
                        }
                        else{
                            HW.request.uploadStoreTmpLogo({
                                logo : binary,
                                bizid : $scope.store.bizid
                            }, function(rs){
                                HW.helper.loading.hide();
                                if(rs.files){
                                    $scope.store.logo = HW.config.APPROOT + rs.files[0];

                                    HW.helper.toast('上传成功');
                                }
                            });
                        }


                    };
                    fr.readAsDataURL(file);

                });



                file_image.bind('change', function(){
                    var deferList = [];

                    var files = this.files;
                    util.each(files, function(one){

                        var defer = $q.defer();

                        var item = {};
                        var fr = new FileReader();
                        fr.onload = function(e){
                            var binary = e.target.result;

                            var data = {};

                            if($scope.store.isStore){
                                data = {
                                    bizid : $scope.store.bizid,
                                    image : binary
                                };
                            }
                            else{
                                data = {
                                    image : binary,
                                    tmp_bizid : $scope.store.bizid
                                };
                            }


                            HW.request.uploadStoreImage(data, function(rs){
                                if(rs.files){

                                    if($scope.store.isStore){
                                        item = {
                                            url : HW.config.APPROOT + rs.files[0],
                                            id : rs.fileid
                                        }
                                    }
                                    else{
                                        item = {
                                            url : HW.config.APPROOT + rs.files[0],
                                            id : rs.files[0]
                                        }
                                    }

                                    $scope.store.imgList.push(item);
                                    defer.resolve();
                                }
                            }, function(){
                                defer.reject();
                            });

                            //img.src = binary;
                        };
                        fr.readAsDataURL(one);

                        deferList.push(defer);
                    });

                    HW.helper.loading.show('正在上传图片');
                    $q.all(deferList).then(function(){
                        HW.helper.loading.hide();
                        HW.helper.toast('上传成功');

                    }, function(){
                        HW.helper.loading.hide();
                    });
                });




                util.extend($scope, {
                    publish : function(){

                        if(!$scope.store.name){
                            HW.helper.toast('请输入店铺名称');
                            return;
                        }

                        if(!$scope.store.phone || $scope.store.phone.toString().length !== 10){
                            HW.helper.toast('电话号码格式错误，应该是10位数字');
                            return;
                        }

                        //if(!$scope.store.address){
                        //    HW.helper.toast('请输入店铺街道地址');
                        //    return;
                        //}

                        if(!$scope.store.zipcode || $scope.store.zipcode.length<5 || $scope.store.zipcode.length>7){
                            HW.helper.toast('邮编格式错误，长度为5-7位');
                            return;
                        }

                        var link = $scope.store.website;
                        if(link){
                            link = link.toLowerCase();

                            if(!/^http/.test(link)){
                                link = 'http://'+link;
                            }

                            $scope.store.website = link;
                        }



                        //taglist
                        var arr = [];
                        util.each($scope.store.taglist, function(item){
                            if(item.active){
                                arr.push(item.id);
                            }
                        });
                        $scope.store.tagid_list = arr;

                        //weektime
                        var arr1 = [];
                        util.each(weekbox.find('input'), function(item){

                            if(util.jq(item).attr('checked')){
                                arr1.push(1)
                            }
                            else{
                                arr1.push(0);
                            }
                        });
                        $scope.store.weektime = arr1;

                        //daytime
                        $scope.store.daytime = $scope.store.startTime+','+$scope.store.endTime;


                        $scope.publishButtonCallback($scope.store);
                    },
                    clickTagInfo : function(info, e){
                        var jq = util.jq(e.target);
                        if(jq.hasClass('active')){
                            jq.removeClass('active');
                            info.active = false;
                        }
                        else{
                            jq.addClass('active');
                            info.active = true;
                        }

                    },
                    deleteImage : function(item){
                        var hide = $ionicActionSheet.show({
                            buttons: [
                                {
                                    text : '删除图片'
                                }
                            ],
                            //titleText: '',
                            cancelText: '关闭',
                            cancel: function(){
                                // add cancel code..
                            },
                            buttonClicked : function(index){
                                if(index===0){
                                    HW.request.deleteUploadStoreImage({
                                        isStore : $scope.store.isStore,
                                        fileid : item.id,
                                        bizid : $scope.store.bizid
                                    }, function(rs, flag){
                                        hide();

                                        if(flag){
                                            HW.helper.toast('删图成功');

                                            var n = util.findIndex($scope.store.imgList, {
                                                id : item.id
                                            });
                                            $scope.store.imgList.splice(n, 1);
                                        }
                                    })
                                }
                            }
                        });
                    }
                });




            },
            link : function($scope, $element){
                var un = $scope.$watch('storeData', function(val, old){
                    if(val){
                        $scope.store = val;
                        initData();
                        un();
                    }
                });

                function initData(){
                    if(!$scope.store.startTime){
                        $scope.store.startTime = '10:00AM';
                    }
                    if(!$scope.store.endTime){
                        $scope.store.endTime = '08:00PM';
                    }

                    var weektime = $scope.store.weektime || [0, 0, 0, 0, 0, 0, 0];
                    var weekbox = util.jq($element[0].querySelector('#js_week_box'));
                    util.each(weekbox.find('input'), function(item, index){

                        if(weektime[index] === '1'){
                            util.jq(item).attr('checked', true);
                        }

                    });

                    if(!$scope.store.imgList){
                        $scope.store.imgList = [];
                    }

                    $scope.$on('StoreInfo.Puhlish', function(){
                        $scope.publish();
                    });

                }

            }
        };
        return F;
    }
]);

HW.App.directive('hwInputReplyBox', [
    function(){
        var F = {
            restrict : 'E',
            replace : true,
            template : ['<div style="border-top: 1px solid #b2b2b2; background: #e3e3e3;" class="bar bar-footer">',
                    '<input placeholder="{{::placeHolder}}" ng-model="text" style="border-radius4px; padding-left:5px;margin-left: 5px;width: 100%; padding-right: 0px;" type="text" />',
                    '<button ng-click="clickBtn()" class="hw-light-button" style="width: 100px;margin-left: 10px;border-radius: 4px;font-size: 14px;">回复</button>',
                '</div>'].join(''),
            scope : {
                clickPublishButton : '='
            },
            link : function($scope, $element, $attr){
                $scope.placeHolder = $attr['placeHolder'];

                var btn = $element.find('button'),
                    disabled = 'hw-disabled';

                $scope.clickBtn = function(){
                    if(btn.hasClass(disabled)) return false;
                    btn.addClass(disabled);

                    var val = $scope.text;
                    $scope.clickPublishButton(val, function(){
                        $scope.text = '';
                        btn.removeClass(disabled);
                    });
                };
            }
        };


        return F;
    }
]);

HW.App.directive('hwInputTimePicker', [
    '$timeout',
    '$q',
    function($timeout, $q){
        var F = {};

        return {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/InputTimePicker.html',
            scope : {
                timeInfo : '='
            },
            controller : function($scope, $element){


                var timelist = [
                    '休业',
                    '01:00AM','01:30AM','02:00AM','02:30AM','03:00AM','03:30AM','04:00AM','04:30AM',
                    '05:00AM','05:30AM','06:00AM','06:30AM','07:00AM','07:30AM','08:00AM','08:30AM',
                    '09:00AM','09:30AM','10:00AM','10:30AM','11:00AM','11:30AM','12:00AM','12:30AM',
                    '01:00PM','01:30PM','02:00PM','02:30PM','03:00PM','03:30PM','04:00PM','04:30PM',
                    '05:00PM','05:30PM','06:00PM','06:30PM','07:00PM','07:30PM','08:00PM','08:30PM',
                    '09:00PM','09:30PM','10:00PM','10:30PM','11:00PM','11:30PM','12:00PM','12:30PM'
                ];
                $scope.timelist = timelist;

                var DAY = ['周一','周二','周三','周四','周五','周六','周日'];


                util.extend($scope, {
                    okFn : function(){
                        var daytime = [$scope.data.startTime, $scope.data.endTime],
                            weektime = util.map($scope.daylist, function(item){
                                return item.active ? '1' : '0';
                            });
                        console.log(daytime, weektime);


                        if(!F.checkDayTime(daytime)){
                            HW.helper.toast('开始时间不能晚于结束时间');
                            return false;
                        }
                        if(!F.dealWeektime(weektime)){
                            HW.helper.toast('请选择每周时间');
                            return false;
                        }


                        if(!$scope.timeInfo){
                            $scope.timeInfo = [];
                        }
                        $scope.timeInfo.push({
                            daytimeData : F.dealDaytime(daytime),
                            weektimeData : F.dealWeektime(weektime),
                            daytime : daytime,
                            weektime : weektime

                        });
                        F.reset();

                        $scope.isShown = false;

                    },

                    clickDate : function(item, e){
                        //var o = util.jq(e.target);
                        item.active  = !item.active;
                    },
                    deleteDate : function(index){

                        $scope.timeInfo.splice(index, 1);
                    },
                    editDate : function(item, index){

                        function done(){
                            //使item消失，展开编辑器
                            $scope.isShown = true;
                            $scope.deleteDate(index);
                            $timeout(function(){
                                $scope.daylist = util.map(item.weektime, function(one, n){
                                    return {
                                        name : DAY[n],
                                        active : one==='1'
                                    }
                                });
                                $scope.data.startTime = item.daytime[0];
                                $scope.data.endTime = item.daytime[1];
                            }, 0);
                        }

                        if($scope.isShown){
                            HW.helper.popup.showConfirm({
                                text : '已经有再编辑的条目，是否覆盖？',
                                Yes : function(){
                                    done();
                                }
                            });
                            return false;
                        }

                        done();

                    },

                    showBox : function(){
                        $scope.isShown = true;
                    },
                    changeStartTime : function(){
                        if($scope.data.startTime === timelist[0]){
                            $scope.data.endTime = timelist[0];
                        }
                    },
                    changeEndTime : function(){
                        if($scope.data.endTime === timelist[0]){
                            $scope.data.startTime = timelist[0];
                        }
                    }
                });

                $scope.data = {};
                F = {
                    dealWeektime : function(wt){
                        var arr = [];
                        util.each(wt, function(val, index){
                            if(val=='1'){
                                arr.push(DAY[index]);
                            }
                        });

                        return arr.join('  ');
                    },
                    dealDaytime : function(dt){
                        if(util.indexOf(dt, timelist[0]) !== -1){
                            return timelist[0];
                        }

                        if(dt[0] === '0' || dt[1] === '0'){
                            return timelist[0];
                        }
                        return dt.join(' - ')
                    },
                    checkDayTime : function(dt){
                        if(util.indexOf(dt, timelist[0]) !== -1) return true;

                        var st = dt[0],
                            et = dt[1];
                        st = {
                            x : parseInt(st.substr(0, 2), 10),
                            y : st.substr(5, 2)
                        };
                        et = {
                            x : parseInt(et.substr(0, 2), 10),
                            y : et.substr(5, 2)
                        };

                        if(et.y === st.y){
                            if(et.x > st.x){
                                return true;
                            }
                        }
                        else if(et.y === 'PM'){
                            return true;
                        }


                        return false;
                    },
                    reset : function(){

                        $timeout(function(){
                            $scope.daylist = [
                                {name : '周一', active : false},
                                {name : '周二', active : false},
                                {name : '周三', active : false},
                                {name : '周四', active : false},
                                {name : '周五', active : false},
                                {name : '周六', active : false},
                                {name : '周日', active : false}
                            ];
                            $scope.data.startTime = '08:00AM';
                            $scope.data.endTime = '09:00PM';
                        }, 0);

                    }
                };





            },
            link : function($scope, $elem, $attr){

                var un = $scope.$watch('timeInfo', function(val){
                    if(val){
                        console.log(val);
                        $scope.timeInfo = util.map(val, function(item){
                            var daytime = [item.datetime1, item.datetime2],
                                weektime = [
                                    item.monday,
                                    item.tuesday,
                                    item.wednesday,
                                    item.thursday,
                                    item.friday,
                                    item.saturday,
                                    item.sunday
                                ];
                            var rs = {
                                daytime : daytime,
                                weektime : weektime,
                                daytimeData : F.dealDaytime(daytime),
                                weektimeData : F.dealWeektime(weektime)
                            };
                            console.log(rs);

                            return rs;
                        });

                        un();
                    }
                });


                $scope.isShown = false;
                F.reset();



            }
        };

    }

]);

HW.App.directive('hwImage', function(){

    var F = {
        restrict : 'E',
        replace : true,
        template : function(){
            return '<div class="hw-dt-image"><ion-spinner></ion-spinner></div>';
        },
        //scope : {
        //    src : '=imgSrc'
        //},
        controller : function($scope, $element, $attrs){
            $attrs.$observe('imgSrc', function(val){
                var img = new Image();
                img.src = val;
                util.jq(img).bind('load', function(){
                    $element.empty().append(img);
                });

            });
        }
    };


    return F;
});

HW.App.directive('contenteditable', ['$timeout', function($timeout) { return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
        // don't do anything unless this is actually bound to a model
        if (!ngModel) {
            return
        }

        // options
        var opts = {};
        angular.forEach([
            'stripBr',
            'noLineBreaks',
            'selectNonEditable',
            'moveCaretToEndOnChange',
            'stripTags'
        ], function(opt){
            var o = attrs[opt];
            opts[opt] = o && o !== 'false';
        });

        // view -> model
        element.bind('input paste', function(e){
            scope.$apply(function(){
                var html, html2, rerender;
                html = element.html();
                rerender = false;
                if(opts.stripBr){
                    html = html.replace(/<br>$/, '');
                }
                if(opts.noLineBreaks){
                    html2 = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');
                    if (html2 !== html){
                        rerender = true;
                        html = html2;
                    }
                }
                if(opts.stripTags){
                    rerender = true;
                    html = html.replace(/<\S[^><]*>/g, '');
                }
                ngModel.$setViewValue(html);
                if(rerender){
                    ngModel.$render();
                }
                if(html === ''){
                    // the cursor disappears if the contents is empty
                    // so we need to refocus
                    $timeout(function(){
                        element[0].blur();
                        element[0].focus();
                    });
                }

            })
        });

        // model -> view
        var oldRender = ngModel.$render;
        ngModel.$render = function(){
            var el, el2, range, sel;
            if(!!oldRender){
                oldRender();
            }
            var html = ngModel.$viewValue || '';
            if(opts.stripTags){
                html = html.replace(/<\S[^><]*>/g, '');
            }

            element.html(html);
            if(opts.moveCaretToEndOnChange){
                el = element[0];
                range = document.createRange();
                sel = window.getSelection();
                if(el.childNodes.length > 0){
                    el2 = el.childNodes[el.childNodes.length - 1];
                    range.setStartAfter(el2);
                }else{
                    range.setStartAfter(el);
                }
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        };
        if(opts.selectNonEditable){
            element.bind('click', function(e){
                var range, sel, target;
                target = e.toElement;
                if (target !== this && angular.element(target).attr('contenteditable') === 'false'){
                    range = document.createRange();
                    sel = window.getSelection();
                    range.setStartBefore(target);
                    range.setEndAfter(target);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        }
    }
}}]);

HW.App.directive('hwEditbox', [
    '$window',
    function(win){
        return {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/InputEditBox.html',
            scope : {
                html : '=hwHtml'
            },
            controller : function($scope, $element){

                var box = $element[0].querySelector('#js_box');


                util.extend($scope, {
                    getPhoto : function(self){

                        var file = self.files[0];
                        if(!file) return false;

                        var fr = new FileReader();
                        fr.onload = function(e){
                            var binary = e.target.result;

                            if(!$scope.html) $scope.html = '';
                            $scope.$apply(function(){

                                //uploadImage
                                HW.helper.loading.show('正在上传图片');
                                HW.request.uploadImage({
                                    image : binary,
                                    userid : HW.user.get('id'),
                                    token : HW.user.get('token')
                                }, function(rs, flag){
                                    HW.helper.loading.hide();
                                    if(flag){

                                        var sel = win.getSelection(),
                                            range = null;
                                        try{
                                            range = self.getRangeAt(0);
                                        }catch(e){
                                            range = document.createRange();
                                        }

                                        var node = document.createElement('img');
                                        node.src = HW.config.APPROOT+rs.files[0];

                                        if(range.intersectsNode(box) && document.activeElement === box){
                                            range.insertNode(node);

                                            $scope.html = box.innerHTML;

                                            range.setStartAfter(node);
                                            range.setEndAfter(node);

                                            //TODO 固定焦点光标



                                            sel.removeAllRanges();
                                            sel.addRange(range);
                                        }
                                        else{
                                            //$scope.html += '<br/><img src="'+HW.config.APPROOT+rs.files[0]+'" /><br />';
                                            box.appendChild(node);
                                            //var br = document.createElement('br');
                                            //box.appendChild(br);
                                            //range.setStartAfter(br);
                                            //range.setEndAfter(br);
                                            //sel.removeAllRanges();
                                            //sel.addRange(range);
                                            $scope.html = box.innerHTML;
                                        }



                                    }
                                    else{
                                        HW.helper.toast('上传失败');
                                    }
                                });

                            });


                            //console.log($scope.html);

                        };
                        fr.readAsDataURL(file);


                    }
                });


            },
            link : function($scope, elem, attrs){
                $scope.title = attrs['hwTitle'];
            }
        };
    }
]);

HW.App.directive('hwAddressSelect', [
    '$timeout',
    function($timeout){
        var list = [];
        return {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/AddressSelect.html',
            scope : {
                regionTree : '=hwRegionTree',
                region : '=hwRegion'
            },
            controller : function($scope, $element){
                $scope.data = {};

                var F = {
                    change : function(mlist, id){
                        if(id==='-1') return [];

                        var tmp = util.find(mlist, function(item){
                            return item.id === id;
                        });

                        var child = tmp?tmp.child:[];

                        return util.map(child, function(item){
                            item.id = item.pk_id;
                            return item;
                        });
                    },
                    checkRegion : function(){
                        var tmp = [
                            $scope.data.country,
                            $scope.data.state,
                            $scope.data.city,
                            $scope.data.area
                        ];
                        util.each(tmp, function(val){
                            if(val && val!=='-1'){
                                $scope.region = val;
                            }
                        });
                    }
                };

                var un = $scope.$watch('regionTree', function(val){
                    if(util.isArray(val)){
                        HW.request.getAllAddressAreaInfo({}, function(rs, flag){
                            list = rs;
                            $scope.data.countryList = util.map(rs, function(item){
                                item.id = item.pk_id;
                                return item;
                            });



                            util.each($scope.regionTree, function(item, index){
                                $timeout(function(){
                                    if(0===index){
                                        $scope.data.country = item.id;
                                        $scope.changeCountry();
                                    }
                                    else if(1===index){
                                        $scope.data.state = item.id;
                                        $scope.changeState();
                                    }
                                    else if(2===index){
                                        $scope.data.city = item.id;
                                        $scope.changeCity();
                                    }
                                    else if(3===index){
                                        $scope.data.area = item.id;
                                    }
                                }, 10);
                            });

                            if(!$scope.regionTree || $scope.regionTree.length < 1){
                                $scope.data.country = $scope.data.countryList[0].id;
                                $scope.changeCountry('-1');
                            }


                            util.delay(F.checkRegion, 1000);
                        });

                        un();
                    }
                });





                util.extend($scope, {
                    changeCountry : function(id){

                        $scope.data.stateList = F.change($scope.data.countryList, $scope.data.country);

                        if(id){
                            $scope.data.state = id;
                            $scope.changeState(id);

                            F.checkRegion();
                        }

                    },
                    changeState : function(id){

                        $scope.data.cityList = F.change($scope.data.stateList, $scope.data.state);


                        if(id){
                            $scope.data.city = id;
                            $scope.changeCity(id);

                            F.checkRegion();
                        }

                    },

                    changeCity : function(id){
                        $scope.data.areaList = F.change($scope.data.cityList, $scope.data.city);

                        if(id){
                            $scope.data.area = id;

                            F.checkRegion(id);
                        }

                    },
                    changeArea : function(id){
                        if(id){
                            F.checkRegion();
                        }
                    }
                });


            }
        };
    }
]);


HW.App.directive('hwNoListInfo', [
    function(){
        return {
            restrict : 'E',
            replace : true,
            templateUrl : HW.config.ROOT + 'tpl/NoListInfo.html',
            scope : {},
            link : function($scope, $elem, $attr){
                $scope.info = $attr['hwInfo'];
            }
        }
    }
]);
