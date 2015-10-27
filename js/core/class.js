(function(){

    if(typeof(Object.create) !== 'function'){
        Object.create = function(proto){
            var Fn = function(){};
            Fn.prototype = proto;
            return new Fn();
        };
    }

    var Base = {
        extend : function(prop, dep){
            dep = dep || false;
            $.extend(dep, this, prop);
            return this;
        },

        proxy : function(fn, args){
            if(!$.isArray(args)){
                args = Array.prototype.slice.call(arguments, 1);
            }
            return fn.apply(this, args);
        },

        call : function(context, fn, args){
            if(!$.isArray(args)){
                args = Array.prototype.slice.call(arguments, 2);
            }
            return fn.apply(context, args);
        },

        getParent : function(name){
            var parent = this.__base,
                type = this.__name;
            if(!name && !type){
                return parent;
            }

            while(parent){
                if(name && parent.__name === name){
                    return parent;
                }
                else if(type !== parent.__name){
                    return parent;
                }

                parent = parent.__base;
            }

            return parent;
        },

        callParent : function(fnName, parentName, args){
            if(typeof(parentName) !== 'string'){
                args = parentName;
                parentName = null;
            }

            var parent, fn, rs = null;
            parent = parentName ? this.getParent(parentName) : (this.__base || this);
            if(parent){
                fn = parent.fn[fnName];
                rs = fn.apply(this, args);
            }

            return rs;
        }
    };

    var inherit = function(obj, prop){
        $.extend(obj.fn || obj.prototype, prop.prototype || prop);
    };

    var ClassManager = {};
    function getClass(name){
        return ClassManager[name] || null;
    }
    var _id = 0;
    function getRandomClassName(){
        return 'IObject.random-'+_id++;
    }

    var IObject = function(name, option){
        var args = arguments;
        if(typeof(name) !== 'string'){
            option = args[0];
            name = getRandomClassName();
        }
        else{
            if(getClass(name)){
                alert(name + ' is already exist');
            }
        }

        var parent = null;

        if(option.ParentClass){
            parent = option.ParentClass;
            delete option.ParentClass;
        }
        if(parent && typeof(parent) === 'string'){
            parent = getClass(parent);
            if(!parent){
                throw parent + ' is not exist';
                return;
            }
        }

        var obj = function(){

            this._init && this._init.apply(this, arguments);
        };

        if(option['Static']){
            obj._static = option['Static'];
            delete option.Static;
        }

        if(parent){
            obj.prototype = Object.create(parent.prototype || parent);
            obj.prototype.__base = parent.prototype || parent;
            obj.prototype.constructor = obj;
            obj.prototype.__static = obj._static;
        }
        else{
            obj.prototype.fn = option;
        }

        obj.fn = obj.prototype;

        $.extend(obj.fn, Base);

        option && inherit(obj, option);

        obj.fn.__type = 'IObject';
        obj.fn.__name = name;
        ClassManager[name] = obj;

        return obj;
    };

    var Class = {
        define : IObject,
        getByName : getClass,
        getAll : function(){
            return ClassManager;
        }
    };

    KG.Class = Class;

})();