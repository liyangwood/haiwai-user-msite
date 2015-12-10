

'use strict';

(function(){
    var util = {};

    //merge underscore
    _.extend(util, _);

    util.extend(util, {
        formatDate : function(date, format){
            if(date.toString().length === 10){
                date = parseInt(date)*1000;
            }

            var d = new Date(date);
            var year = d.getFullYear(),
                month = addZero(d.getMonth() + 1),
                day = addZero(d.getDate()),
                hour = addZero(d.getHours()),
                min = addZero(d.getMinutes()),
                sec = addZero(d.getSeconds());

            function addZero(x){
                if(x<10) return '0'+x;
                return x;
            }

            return format.replace('yy', year).replace('mm', month).replace('dd', day).replace('h', hour).replace('m', min).replace('s', sec);
        }
    });


    window.util = KG.util = util;
})();






(function(){
    template.helper('formatDate', function(date, format){
        return util.formatDate(date, format||'yy年mm月dd日 h:m:s');
    });

    template.helper('storeFullAddress', function(item){
        return item.address+', '+item.city+', '+item.state+' '+item.zip;
    });
})();