# mobx-without-react

mobx 備忘

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
