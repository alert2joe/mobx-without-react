var createC = function(comp){
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
        this.addMobxReaction = function(fn){
            mobx.autorun(fn);
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
