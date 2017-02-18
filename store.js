
store = {};

store.timer = new(function(){

     this.data = mobx.observable({
        current:0,
        targetTime:10,
        get timeUp(){
          return this.current > this.targetTime
        }
     });

      this.setCurrent = mobx.action('setCurrent',function(a) {
        this.data.current = a;
      });
   

});


store.page = {
    lists: mobx.observable({
        login:0,
        mock:0,
        count:0,
        page_wait:0,
        page_exam:0,
    }),

    showPage:mobx.observable('page_login'),

    setPage:mobx.action('setPage',
        function(p){
        store.page.showPage.set(p);
    })
};


// store.page.showPage.observe(function(change) {
//               console.log(change.oldValue, "->", change.newValue);
//           });
// var reaction2 = mobx.reaction(
//     () => todos.map(todo => todo.title),
//     titles => console.log("reaction 2:", titles.join(", "))
// );




//mobx.autorun(function(){
  //console.log('autorun',store.timer1.data.timeUp);
//});
