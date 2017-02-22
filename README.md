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
