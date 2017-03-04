# mobx-without-react

mobx 備忘

```
autorun(fn): 當上一次執行fn時所運行的observable有改動時會執行一次fn；
		** 上一次 （不是每一次，也不是第一次）
		** 有改動  (extendObservable 不算改動)
		** 有改動  (相同內容不算改動)
```

```
var a = mobx.observable({i:{j:{k:{l:0}}}});

autorun(function(){  console.log(a.i.j) })

a = 1 		//不觸發 
a.i.j.k.l = 1 	//不觸發
a.i.j.k = 1 	//不觸發
a.i.j = 1 	//觸發
a.i = 1 	//觸發  console undefined , a.i.j 也再不存在了
a.i.j = 1 	//不觸發 , 於OBJECT中加入的 "j" 不會observable
a.i = 33	//不觸發

```	
			
			
##observable
arrays, classes 和 objects  可以直接 用 ＝ 去設定值 或取值
```
//classes 和 objects 
a = observable({
    a1: "Clive Staples",
    a2: "Lewis"
});
a.a1 = 3
var c = a.b

//array
const list = observable([1, 2, 4]);
list[2] = 3;
```

number,string 則要用 set，get 。
```
temperature = observable(20);
temperature.set(25);
```

##computed
只比對變化前及變化后的返回值有否不同而去決定 會否有 執行 autorun，以下是錯的
```
var numbers = mobx.observable([1]);
var last = mobx.computed(
  function(){
	return numbers[numbers.length-1];
        //返回最新加入的ARRAY的值。
  }
);

mobx.autorun(function(){
// 如果用 last.get(); 
// 期望每一次PUSH都會執行這個 autorun,是錯的。
//
 console.log(last.get())  //這裡 last只是mobx的OBJ，要用get才能取值。
 //do something ... 
});
```
因為只比對返回值，所以重複加入相同時不會trigger autorun， 
這情況於AUTORUN 直接用numbers.length 會比較合期望。但numbers.push(9999)一樣也不會觸發到，因為在runInAction中。
```
numbers.push(0); //will trigger 
numbers.push(1); //will trigger 
numbers.push(1); //will not trigger 
numbers.push(4); //will trigger  
mobx.runInAction(() => {
        numbers.push(9999);
        numbers.push(4);//will not trigger
    });
```

##computed smaple
```
//sample 1
 box = mobx.observable({
    length: 2,
    get squared() {
        return this.length * this.length;
    },
    set squared(value) {
        this.length = Math.sqrt(value);
    }
});

//sample 2
class Foo {
    @observable length: 2,
    @computed get squared() {
        return this.length * this.length;
    }
    set squared(value) { //this is automatically an action, no annotation necessary
        this.length = Math.sqrt(value);
    }
}

//sample 3
kk = mobx.observable({ 
	last2: mobx.computed(function(){
    return message.title+'last2'; 
  })
})

//sample 4  //use ABC.get()
var ABC = mobx.computed(
  function(){
      return message.title +'last';   
  }
);


```
##observe
```
const person = observable({
    firstName: "Maarten",
    lastName: "Luther"
});

const disposer = observe(person, (change) => {
    console.log(change.type, change.name, "from", change.oldValue, "to", change.object[change.name]);
});

// observe a single field
const disposer2 = observe(person, "lastName", (change) => {
    console.log("LastName changed to ", change.newValue);
});
```
