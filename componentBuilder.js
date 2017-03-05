var rs = {};
rs.createC = function(comp){
      this.extend = function(obj,superClass){
          obj.prototype = new superClass();
          obj.prototype.constructor = obj;
          return obj;
      }
      
      this.baseComponent = function(){
        this.name = null;
        this.childs =[];
        this.parent = null;
        this.ReactionLists = {};

        this.componentDidUpdate = function(){ }
        //this.init = function(){ }
        this.addMobxReaction = function(){
            //mobx.autorun(fn);
            return mobx.autorun.apply(this, arguments);
        }

        this.append = function(){

        }
        this.displayTree = function(deep){
            deep = deep || '-';
            console.log(deep + this.name);
            deep += '-';

            _.each(this.childs,function(comp){
                comp.displayTree(deep);
            })
        }
        this.debugAction = function(actionName){



        }
        this.superInit = function(props){
           this.init(props);
        }
  
        this.add = function(ChildCompClass,props){

          var childComp = new ChildCompClass();

          childComp.parent = this;
          this.childs.push(childComp);
          childComp.superInit(props);
          //childComp.init(props);
          
          
          
        }
      }
      var Comp = this.extend(comp,this.baseComponent);
  
      return Comp;
}

rs.showStore= function(store){
    if(typeof store == 'undefined'){
        store = rs.store;
    }
    rs._storeMap(store);
}
rs._storeMap = function(os,sign,aryKey){
    

    var isObservableValue=function(obj){
        return mobx.isObservable(obj) && typeof obj.$mobx == 'undefined'; 
    }

    var isNotObservableObj=function(obj){
        return !mobx.isObservable(obj)
    }

    var isObj=function(obj){
        return typeof obj === 'object';
    }
  
    var getReactionName=function(observers,perfix){
       perfix = perfix || '';
       var reactList = [];
               $.each(observers,function(obk,obv){
                 var displayValue = obv.name;
                 
                 if(mobx.isComputed(obv)){
                   var shortName = obv.derivation.name.replace(/^.* /g, '');
                    var subReactionName = getReactionName(obv.observers,' @ '+shortName);
                    reactList = reactList.concat(subReactionName);       
                 }else{
                    reactList.push(obv.name+perfix);
                 }
               })
      return reactList
    }

    var isNotObservableObjHandler= function(os){

        $.each(os,function(obk,obv){
            
            if(isObservableValue(obv)){
                var reactList  = getReactionName(obv.observers);
                  console.debug('      '+obk+' = '+obv.value,reactList);
                  return true;
            }
            if(mobx.isAction(obv)){
                console.log(sign+'--['+obk+'@mobx action]---------');
            }else{
                console.log(sign+'--['+obk+']---------');
            }
            
            rs._storeMap(obv,'    ');
          })
    }

    var ObservableObjectHandler= function(os,aryKey,Newsign){
        $.each(os.$mobx.values,function(k,v){
          if(typeof v.value == 'undefined' && !mobx.isComputed(v) ){
            return true;
          }

          var realValue = '';

          if(!mobx.isObservable(os.k)){
                 realValue = v.value;
          }
          if(typeof v.value == 'function'){
            realValue = 'function';
          }
          if(mobx.isAction(v.value)){
            realValue = ' mobx Action';
          }
          if(mobx.isComputed(v)){
            realValue = ' mobx Computed';
          }

            var reactList  = getReactionName(v.observers);
            console.debug(Newsign+''+aryKey+'.'+k+' = ' , realValue,reactList);
        
              rs._storeMap(v.value,Newsign)
        })

    }

    var ObservableArrayHandler = function(os,sign,Newsign){
        $.each(os.$mobx.values,function(k1,v1){
           
     
            if(!mobx.isObservable(v1)|| mobx.isObservableArray(v1)){
               var reactList  = getReactionName(os.$mobx.atom.observers);
               console.debug(Newsign+'['+k1+'] = ', v1,reactList);
            }

             if(!mobx.isObservable(v1)){
              return true;
             }
             if(mobx.isObservableArray(v1)){
                sign =  Newsign.replace("X", ""); 
             }

             rs._storeMap(v1,sign,'['+k1+']');
             
        })

    }



    var main = function(os,sign,aryKey){
        if(!sign){
          var Newsign = '    ˪ X'
        }else{
          var Newsign = '   ' +sign;
        }

        if(isNotObservableObj(os) && isObj(os)){
            isNotObservableObjHandler(os);
        }

        if(mobx.isObservableObject(os)){
            ObservableObjectHandler(os,aryKey,Newsign)
        }

        if(mobx.isObservableArray(os)){
            ObservableArrayHandler(os,sign,Newsign);
            
        }

    }

    aryKey = aryKey || '';
    sign = sign ||'';

    main(os,sign,aryKey);

}