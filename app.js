
rs.comp = {};


rs.comp.rootClass = rs.createC(function(){
      this.name = 'root';
      this.init = function(){
        this.add(rs.comp.layout);
        this.add(rs.comp.timer);
        this.add(rs.comp.htmlDom);
      }
    
});

rs.comp.htmlDom = rs.createC(function(){
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
           if( rs.store.timer.data.current == 5){
              this.state.bg = '#eee';
          } 
        } 

        this.changeBg=function(){
          if(!this.state.bg){return false;}
          $('body').css('background',this.state.bg);
        }

});



rs.comp.layout = rs.createC(function(){
      this.name = 'layout';
      this.init = function(){
        this.add(rs.comp.page_mock);
        this.add(rs.comp.page_wait);
        this.add(rs.comp.page_count);
        this.add(rs.comp.page_login);

        this.addMobxReaction('layout.changePage',this.changePage.bind(this));
      }
      this.changePage=function(){
        var pageId = rs.store.page.showPage;
        $('.page').hide();
        $('#'+pageId).show();
      }
});


rs.comp.page_mock =  rs.createC(function(){
      this.name = 'page_mock';
      this.init=function(){
        this.addMobxReaction('page_mock.gotoWait',this.gotoWait.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#mockSubmit').click(function(){
            rs.store.page.setPage('page_count')
        });
      }

      this.gotoWait = function(){
          if(rs.store.timer.data.timeUp && rs.store.page.showPage=='page_mock'){
            rs.store.page.setPage('page_wait');
          }
      }

 
      
  });

rs.comp.page_wait = rs.createC(function(){
      this.name = 'page_wait';
      this.init=function(){
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#waitSubmit').click(function(){
              
              rs.store.page.setPage('page_exam');
        });
      }
    
      
  });


rs.comp.page_count = rs.createC(function(){
      this.name = 'page_count';
      this.init=function(){
        this.addMobxReaction('page_count.gotoWait',this.gotoWait.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#backBtn').click(function(){
              rs.store.page.setPage('page_login');
        });
      }
      
      this.gotoWait = function(){
          if(rs.store.timer.data.timeUp && rs.store.page.showPage=='page_count'){
            rs.store.page.setPage('page_wait');
          }
      }

     
      
  });


rs.comp.page_login = rs.createC(function(){
      this.name = 'page_login';
      this.init=function(){
        this.addMobxReaction('page_login.hideMockBtn',this.hideMockBtn.bind(this));
        this.addMobxReaction('page_login.defindExamBtnLink',this.defindExamBtnLink.bind(this));
        this.btnAct();
      }
      
      this.btnAct = function(){
        $('#mock').click(function(){
              rs.store.page.setPage('page_mock');
        });
        $('#exam').click(function(){
              rs.store.page.setPage($(this).attr('linkTo'));
              
        });
      }
      
      this.hideMockBtn = function(){
          if(rs.store.timer.data.timeUp){
            $('#mock').hide();
          }else{
            $('#mock').show();
          }
      }

      this.defindExamBtnLink = function(){
          var linkTo = 'page_count';
          if(rs.store.timer.data.timeUp){
            linkTo = 'page_wait';
            }
          $('#exam').attr('linkTo',linkTo)
            
      }
      
      
  });
  
  rs.comp.timer = rs.createC(function(){
      this.name = 'timer';
      this.init = function(){

      setInterval(function(){
            rs.store.timer.setCurrent(rs.store.timer.data.current + 1) 
          }, 800);

        this.addMobxReaction('updateTimerDisplay',this.updateTimerDisplay.bind(this));
      }

      this.updateTimerDisplay = function(){
        $('span').text(rs.store.timer.data.current);
        
      }
 
  });


 var app = new rs.comp.rootClass();
 app.superInit();
 app.displayTree();


 
