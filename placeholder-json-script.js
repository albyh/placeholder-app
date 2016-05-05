$( document ).ready(function( ) {

/************************************************************
	http://jsonplaceholder.typicode.com/posts
	http://jsonplaceholder.typicode.com/posts/1/comments
*************************************************************/
	var postData = [], commentData = []; 	

	var init = function(){
		var postURL = 'http://jsonplaceholder.typicode.com/posts';
		waitMsg( false, 'Collecting Data... Please wait!' );
		// Retrieve post data object
		$.getJSON( postURL, function( JSONPostData ){
			//postData = JSONPostData; 
			console.log( 'getJSON reports \'success\'!' );
			postData = JSONPostData;
			postData.unshift( {} )// add an element to make the index match the ids
			displayIndex( )
		})
		.done(function(){ 
			console.log('getJSON reports \'done\'.');
		})
		.fail(function(){
			console.log( '$getJSON reports \'FAIL\'!');
			waitMsg( false, 'Collection Failed. Please try later.' );
		})
	}

	var addClickIndexHandler = function( event ){

		//$('.index').off		
		$('.index-head').on('click', function( event ){
			event.preventDefault();		
			$('.index-body').hide();
			//console.log( "#"+this.id + ' click');
			//display 'body' of post
			var current = this.id.replace( '-head' , '' )
			$( "#"+current+'-body' ).show();
		    //$( "#"+this.id+'-body' ).show();
		});
	}

	var addDblClickIndexHandler = function( event ){

		//$('.index').off		
		$('.index-head, .index-body').on('dblclick', function( event ){
			event.preventDefault();		
			$('.index-body').hide();
			var current = this.id.replace( '-head' , '' );
				current = current.replace( '-body' , '' )
			//console.log( "#"+this.id + ' dblClick');
			showDetails( current )
		});
	}

	var showDetails = function( postId ){
		waitMsg( true );
		var i = postId; 
		console.log( 'Show details of: ' +postData[postId].id );

			$('<div />' , { 'id'   : postData[i].id , 
							'text' : 'Detail for post #' +  postData[i].id, 
							'class': 'wrapper' }).appendTo( '#data-container' ) ;	
			$('<div />' , { 'text' : postData[i].title ,
							'id' : postData[i].id + '-head' , 
						    'class' : 'index-head' }).appendTo( '#'+postData[i].id )  ;
			$('<div />' , { 'text' : postData[i].body ,
							'id' : postData[i].id + '-body' , 
						    'class' : 'index-body' }).appendTo( '#'+postData[i].id )  ;

			$('<div />' , { 'text' : 'Retrieving Comments...' ,
							'id' : postData[i].id + '-comments' , 
						    'class' : 'index-comments' }).appendTo( '#'+postData[i].id )  ;

			retrieveComments( postId );
	}

	var retrieveComments = function( postId ){
		//check to see if already downloaded
		if ( haveComments( postId ) ){
			console.log( 'Use cached comments!' );
			showComments( postId )
		} else {
			//download new comments
			var commentURL = 'http://jsonplaceholder.typicode.com/posts/'+postId+'/comments';
			$.getJSON( commentURL, function( JSONCommentData ){
				console.log( 'getJSON Comments reports: \'success\'!' );
				showComments( postId, JSONCommentData )
			})
			.done(function(){ 
				console.log('getJSON Comments reports: \'done\'.');
			})
			.fail(function(){
				console.log( '$getJSON reports \'FAIL\'!');
				$('.'+postId+'-comments').text = "COMMENTS UNAVAILABLE";
				//waitMsg( false, 'Comment Collection Failed. Please try later.' );
			})		
		}
	}

	var haveComments = function( postId ){
		var found = false; 
		for( i = 0 ; i < commentData.length; i++){
			//console.log( 'commentData = ' +commentData );
			if( postId == commentData[i].postId ){
				found = true; 
				break;
			}
		}
		return found;
	}

	var saveComments = function( postId, returnedJson ){

		var found = haveComments( postId );

		if (!found){
			console.log( 'NEW comments added to commentData' );
			//add comments to commentData
			$.merge( commentData, returnedJson )
		} else { 
			console.log( 'FOUND COMMENTS' ); 
		}
	}

	var showComments = function( postId, returnedJson ){
		
		saveComments( postId, returnedJson );
		
		$('#'+postId+'-comments').text( "COMMENTS" ) ;

		for ( var i = 0 ; i < commentData.length ; i++ ){
			
			if ( commentData[i].postId == postId ){
				//comment
				$('<div />' , { 'text' : 'Comment #' +  commentData[i].id + " - " + commentData[i].body, 
								'id'   : commentData[i].id+'-comment-text',
								'class': 'comment-text' }).appendTo( '#'+postId+'-comments' ) ;	
				//name
				$('<div />' , { 'text' : 'Name: ' + commentData[i].name ,
								'id' : commentData[i].id + '-comment-name' , 
							    'class' : 'comment-name' }).appendTo( '#'+commentData[i].id+'-comment-text' )  ;
				//email
				$('<div />' , { 'text' : 'Email: ' + commentData[i].email ,
								'id' : commentData[i].id + '-comment-email' , 
							    'class' : 'comment-email' }).appendTo( '#'+commentData[i].id+'-comment-text' )  ;
			}
		}

		$('#data-container').append('<button id="btnDisplayIndex" class="btn btn-primary center-block">Back</button>');
		  $('#btnDisplayIndex').on('click', function() {
		  		$('#btnDisplayIndex').remove();
    			displayIndex()
  		});
	}

	var displayIndex = function( ){

		waitMsg( true ); 

		for ( var i = 1 ; i < postData.length ; i++ ){

			$('<div />' , { 'id'   : postData[i].id , 
							'class': 'wrapper' }).appendTo( '#data-container' ) ;	
			$('<div />' , { 'text' : postData[i].title ,
							'id' : postData[i].id + '-head' , 
						    'class' : 'index-head' }).appendTo( '#'+postData[i].id )  ;


			$('<div />' , { 'text' : postData[i].body ,
							'id' : postData[i].id + '-body' , 
						    'class' : 'index-body' }).appendTo( '#'+postData[i].id )  ;

			$('.index-body').hide();

		}

		 addClickIndexHandler();
		 addDblClickIndexHandler();

	}

	var waitMsg = function( clear , msg ) {
		//waitMsg( true ) clears the #data-container of .wrappers
		if( clear ){
			$('.wrapper').remove();
		} else {
			$('<div />' , { 'id'   : 'wait-wrapper' , 
							'class': 'wrapper' }).appendTo( '#data-container' ) ;	
			$('<div />' , { 'text' : msg ,
						   'class' : 'wait-msg' }).appendTo( '#wait-wrapper' )  ;
		}
	}

	init();
});