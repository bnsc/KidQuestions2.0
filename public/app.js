(function( global, $ ){ 

  function KQ2 (){
    var self = this;
    
    this.hasResult = false;
    this.currentQuestion = null;
    
    this.$question = $('#question');
    this.$buttons = $('#buttons');
    this.$statement = $('#statement');
    this.$art = $('#art');
    this.$restart = $('#restart');
    
    this.$restart.on( 'click', function(){ 
      self.start();
    });
  }
  
  KQ2.prototype.load = function(){
    var self = this;
    
    //get json
    $.getJSON('/data', function(json){
      self.data = json; 
      if( !!self.data && !!self.data.questions && !!self.data.art ) {
        self.start();
      }
    });
  
  };
  
  KQ2.prototype.start = function(){
    console.log('starting..');
    this.toggleResult();
    
    //new set of questions to ask
    this.questionIds = [];
    this.questionIds.push( this.getRandomQuestionId() );
    this.questionIds.push( this.getRandomQuestionId() );
    this.questionIds.push( this.getRandomQuestionId() );
    
    //clear responses
    this.responses = [];

    //show a new piece of artwork
    this.nextArt();
    
    //set up the next question (first question)
    this.nextQuestion();
    
    //start the result statement
    this.$statement.empty().append( $('<span>You are a </span>'));
  };
  
  KQ2.prototype.resetArt = function(){
    console.log('resetting art');
    this.currentArt = this.data.art;
  };
  
  KQ2.prototype.getRandomQuestionId = function(){
    var num = Math.floor(Math.random() * 8);
    
    for( i=0; i<this.questionIds.length; i++){
      if(this.questionIds[i] == num){
        num = this.getRandomQuestionId();
      }
    }
    
    return num;
  };
  
  KQ2.prototype.nextQuestion = function(){
    //goto result statement if no more questions
    if( !!!this.questionIds || this.questionIds.length === 0 ){
      this.showResult();
      return;
    }
  
    //get next question and remove it from the list of questions
    this.currentQuestion = this.questionIds.pop();

    //clear the old question and add the next question to the page
    this.$question.empty().append('<p>' + this.data.questions[this.currentQuestion].Question + '</p>');
    this.addButtonsToQuestion( this.data.questions[this.currentQuestion].Answers );
  };
  
  KQ2.prototype.getAdjective = function(){
    var adj = this.data.questions[this.currentQuestion].Adjectives;
    return adj[Math.floor(Math.random() * adj.length)];
  };
  
  KQ2.prototype.addButtonsToQuestion = function( values ){
    var self = this,
        $btn,
        $nextRow;
    
    //clear out the old buttons
    this.$buttons.empty();
    
    values.forEach( function(val, i){
      //create the button
      $btn = $('<button class="btn btn-sm btn-primary">' + val + '</>');

      //add the event for the button
      $btn.on( 'click', function(){
        self.recordResponse(val);  //uses closure to track the value of the button clicked.
      });
      
      //add styling to the button
      $btn.addClass( values.length > 4 ? 'col-xs-4' : 'col-xs-10' );
      
      if( (values.length > 4 && i%2 === 0) || (values.length < 5 ) ){
        //add new row
        $nextRow = $('<div class="row"></div>');
        self.$buttons.append( $nextRow );
        
        //add opening div
        $nextRow.append( $('<div class="col-xs-1"></div>') );
      }
      
      //add the button to the buttons div
      $nextRow.append($btn);
      
      if( values.length > 4 && i%2 === 0){
        //add gutter div
        $nextRow.append( $('<div class="col-xs-2"></div>') );
      }
      
      if( values.length > 4 && i%2 == 1){
        //add closing div
        $nextRow.append( $('<div class="col-xs-1"></div>') );
      }
    });
    
  };
  
  KQ2.prototype.recordResponse = function(val){
    this.$statement.append( $('<span class="adjective">' + this.getAdjective() + '</span>'));
    if( this.questionIds.length > 0 ){
      this.$statement.append( $('<span>, </span>'))
    }
    this.nextQuestion();
  };
  
  KQ2.prototype.clearQuestion = function(){
    this.$buttons.empty();
  };
  
  KQ2.prototype.toggleResult =function(){
    if( this.hasResult ){
      this.$question.hide();
      this.$buttons.hide();
      this.$restart.show();
      this.$statement.show();
    } else {
      this.$question.show();
      this.$buttons.show();
      this.$restart.hide();
      this.$statement.hide();
    }
    this.hasResult = !this.hasResult;
  };
  
  KQ2.prototype.showResult = function(){
    this.$statement.append( $('<span> type of person.</span>'));
    this.toggleResult();
  };
  
  KQ2.prototype.nextArt = function(){
    
    if( !!!this.currentArt || this.currentArt.length === 0 ){
      this.resetArt();
    }
    
    this.$art.attr('src', this.currentArt.pop());
    
  };
  
  //kickoff:
  var kq2 = global.kq2 = new KQ2();
  kq2.load();
  
})( window, jQuery );

