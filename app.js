
var comp = {};


comp.rootClass = createC(function(){
      this.name = 'root';
      this.init = function(){
        this.add(comp.layout);
        this.add(comp.timer);
        this.add(comp.htmlDom);
      }
    
});

comp.htmlDom = createC(function(){
      this.name = 'htmlDom';
      
      this.init = function(){
        //local state
        this.state = mobx.observable({
            bg:'',
        });

        this.addMobxReaction(this.changeBg.bind(this));
        this.addMobxReaction(this.changeA.bind(this));
      }
      
       this.changeA=function(){
           if( store.timer.data.current == 5){
              this.state.bg = '#eee';
          } 
        } 

        this.changeBg=function(){
          if(!this.state.bg){return false;}
          $('body').css('background',this.state.bg);
        }

});



comp.layout = createC(function(){
      this.name = 'layout';
      this.init = function(){
        this.add(comp.page_mock);
        this.add(comp.page_wait);
        this.add(comp.page_count);
        this.add(comp.page_login);

        this.addMobxReaction(this.changePage.bind(this));
      }
      this.changePage=function(){
        var pageId = store.page.showPage;
        $('.page').hide();
        $('#'+pageId).show();
      }
});


comp.page_mock =  createC(function(){
      this.name = 'page_mock';
      this.init=function(){
      	this.addMobxReaction(this.gotoWait.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#mockSubmit').click(function(){
            store.page.setPage('page_count')
        });
      }

      this.gotoWait = function(){
      	  if(store.timer.data.timeUp && store.page.showPage=='page_mock'){
            store.page.setPage('page_wait');
          }
      }

 
      
  });

comp.page_wait = createC(function(){
      this.name = 'page_wait';
      this.init=function(){
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#waitSubmit').click(function(){
              
              store.page.setPage('page_exam');
        });
      }
    
      
  });


comp.page_count = createC(function(){
      this.name = 'page_count';
      this.init=function(){
        this.addMobxReaction(this.gotoWait.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#backBtn').click(function(){
              store.page.setPage('page_login');
        });
      }
      
      this.gotoWait = function(){
      	  if(store.timer.data.timeUp && store.page.showPage=='page_count'){
            store.page.setPage('page_wait');
          }
      }

     
      
  });


comp.page_login = createC(function(){
      this.name = 'page_login';
      this.init=function(){
        this.addMobxReaction(this.hideMockBtn.bind(this));
        this.addMobxReaction(this.defindExamBtnLink.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#mock').click(function(){
              store.page.setPage('page_mock');
        });
        $('#exam').click(function(){
              store.page.setPage($(this).attr('linkTo'));
              
        });
      }
      
      this.hideMockBtn = function(){
      	  if(store.timer.data.timeUp){
          	$('#mock').hide();
          }else{
          	$('#mock').show();
          }
      }

      this.defindExamBtnLink = function(){
      		var linkTo = 'page_count';
      		if(store.timer.data.timeUp){
      			linkTo = 'page_wait';
            }
          $('#exam').attr('linkTo',linkTo)
            
      }
      
      
  });
  
  comp.timer = createC(function(){
      this.name = 'timer';
      this.init = function(){

      setInterval(function(){
            store.timer.setCurrent(store.timer.data.current + 1) 
          }, 800);

        this.addMobxReaction(this.updateTimerDisplay.bind(this));
      }

      this.updateTimerDisplay = function(){
        $('span').text(store.timer.data.current);
        
      }
 
  });


 var app = new comp.rootClass();
 app.superInit();
 app.displayTree();


 

