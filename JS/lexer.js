//This script is under construction


//structure of a lex program
var tokenrecog;
var run = true;
var state;

var lexemeBegin;

var tokeninstall = "";

 
//declarations
var letter = /[a-z]/;
var digit = /[0-9]/;
var space = /\s/;
var ws = /[space]+/;
var id = /[letter]/;
var intexpr = /[digit]+/;
var EOL = /[$]/;
var RBRACE =/[}]/;
var LBRACE = /[{]/;
var RPAREN = /[)]/;
var LPAREN = /[(]/;
var INTOP = /[+]/;


//regular expressions and defintions
// pattern {action}

//char      ::== a|b|c ... z











//translation rules
/*





*/

//auxiliary functions
//scans through each character of input text
function lexer(){
	
	
	var inputText = document.getElementById("textInput").value;

	//document.getElementBYId("output").value =  inputText;


	
	for (lexemeBegin=0; lexemeBegin<inputText.length;lexemeBegin++){
		
		
	//start scanning the file at the first character
	var c = inputText[lexemeBegin];
	
	
	//console.log('this is the current c:'  + c);
	isID(c,lexemeBegin,inputText);
	isSpace(c);
	isEOL(c);
	isRBRACE(c);
	isLBRACE(c);
	isRPAREN(c);
	isLPAREN(c);
	isINTOP(c);
	}

}

function nextChar(){
	
	
}


// works for non reserved words currently
function isID(currentchar,forward,input){
	state = 0;
	console.log('current state instance' + state);
	tokeninstall = " "; //clear the token value
	run = true;
	//alert(run);
	
	while (run){
		
		switch(state){
		
			//entering the dfa
			case 0:
				/*
				if ((input[forward]).match('i') != -1){
					
					 //character other than i
						state = 3;  //go to the IF keyword  dfa
						console.log('case 0 state change ' +state);
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++ //move the forward counter
					
				
				}
				*/
				
				//a lowercase letter is entered
			    if((input[forward]).search(letter) != -1){		
						state = 1; //go to case 1 to determine if it is an id or not
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++ //move the forward counter
						
					}
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions

					run = false;
					break;
				}
		
			case 1:
				
			
			
				if ((input[forward]).search(letter) != -1){ //if the character is also a letter, move on to case 2 to build an unrecognized token 
					state = 2;
					console.log('case 1 change state ' + state);
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++//move the forward counter
				
				}
				
				else{
					console.log('LEXER: '+ tokeninstall + '--> [ID]'); // the next character was not a letter, so we output the valid one character id
					lexemeBegin=forward; //move the lexemeBegin to where the forward is and continue scanning
					run = false; //break the switch
					break;
				}
				
				
			case 2:
				if ((input[forward]).search(letter) != -1){ //if each character added is also a letter, keep building the toekn
					state = 2;
					tokeninstall = tokeninstall + input[forward];;
					forward++
				}
				else{
				console.log('unrecognized token ' + tokeninstall);//the next character was not a letter, so we output the unrecognized token
				lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
				run = false;//break the switch
				break;
				
				}
			case 3:
			console.log('case 3');
				if ((input[forward]).match('f') != -1){ //if the next character after i is f, build the IF keyword
					
					tokeninstall = tokeninstall + input[forward];
					console.log('LEXER: '+ tokeninstall + '--> [IF]');
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					run = false;//break the switch
					break;
					
			}
			else{
				console.log('case 3');
				state = 2;
				
			}
		
				
			
			
		}//end of switch
		
		
		
		
		
		
		
		
		
	}//end of while
	
	/*
	if ( c.search(letter) != -1 &&  inputText[i+1].search(letter) == -1){
		alert('LEXER: '+ c +'--> [ID]');
		
		
		
		
	}
	*/
	
	
	
}

function isSpace(c){
	
	if ( c.search(space) != -1 ){
		console.log('THIS IS A SPACE IGNORE');
	
		
	}
	
}

function isEOL(c){
	
	if (c.search(EOL) != -1){
		console.log('LEXER: '+ c +'--> [EOL]');
		
	}
	
}

function isRBRACE(c){
	if (c.search(RBRACE) != -1){
		console.log('LEXER: '+ c +'--> [RBRACE]');
		
	}
}
	
function isLBRACE(c){
	if (c.search(LBRACE) != -1){
		console.log('LEXER: '+ c +'--> [LBRACE]');
		
	}
	
}

function isLPAREN(c){
	if (c.search(LPAREN) != -1){
		console.log('LEXER: '+ c +'--> [LPAREN]');
		
	}
	
}

function isRPAREN(c){
	if (c.search(LPAREN) != -1){
		console.log('LEXER: '+ c +'--> [RPAREN]');
		
	}
	
}

function isINTOP(c){
	if (c.search(INTOP) != -1){
		console.log('LEXER: '+ c +'--> [INTOP]');
		
	}
	
}

/*









*/