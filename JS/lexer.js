//This script is under construction


//structure of a lex program
var tokenrecog;
var run = true;
var state;

var scannerSuccess;

var programCounter;

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
var QUOT = /["]/;

//not resereved alpha

//regular expressions and defintions
// pattern {action}

//char      ::== a|b|c ... z











//translation rules
/*





*/

//auxiliary functions
//scans through each character of input text
function lexer(){
	programCounter = 1;
	
	var inputText = document.getElementById("textInput").value;

	//document.getElementBYId("output").value =  inputText;
	console.log("scanning program " + programCounter);

	
	for (lexemeBegin=0; lexemeBegin<inputText.length;lexemeBegin++){
		
		
	//start scanning the file at the first character
	var c = inputText[lexemeBegin];
	
	
	//console.log('this is the current c:'  + c);
	isID(c,lexemeBegin,inputText);
	isSpace(c);
	isRBRACE(c);
	isLBRACE(c);
	isRPAREN(c);
	isLPAREN(c);
	isINTOP(c);
	isQuot(c);
	isEOL(c);
	}
	console.log(scannerSuccess);
	

}

function nextChar(){
	
	
}
/*
function isIForID(currentchar,forward,input){
	state = 0;
	tokeninstall = ""; //clear the token value
	run = true;
	
	while (run){
		
		switch(state){
			
			case 0: 
				if((input[forward]).search(nralpha) != -1){	
					state = 1; //go to case 1 to determine if it is an id or not
					
					tokeninstall = tokeninstall + input[forward]; //start building the token
					forward++ //move the forward counter
				
				}
				
			    if ((input[forward]).match('i') != -1){
					state = 3; 
					tokeninstall = tokeninstall + input[forward]; //start building the token
					forward++ //move the forward counter
					
					
					
				}
				
				
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions
					console.log('it broke');
					run = false;
					break;
				}
				
				
				console.log('case zero' + state);
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
				
				if ((input[forward]).match('f') != -1){
					state = 4; 
					tokeninstall = tokeninstall + input[forward]; //start building the token
					forward++ //move the forward counter
					
				}
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions
					console.log('not if');
					run = false;
					break;
				}
				
			
			
			
			
			
			
		}
		
	}
	
}
*/



// works for non reserved words currently
function isID(currentchar,forward,input){
	state = 0;
	
	tokeninstall = " "; //clear the token value
	run = true;
	//alert(run);
	
	while (run){
		
		switch(state){
		
			//entering the dfa
			case 0:
				
				
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
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++//move the forward counter
					
				}
				
				else{
					console.log('LEXER: '+ tokeninstall + '--> [ID]'); // the next character was not a letter, so we output the valid one character id
					forward = forward-1;
					lexemeBegin=forward; //move the lexemeBegin to where the forward is and continue scanning
					
					if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
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
					if (tokeninstall == ' if'){
						console.log('LEXER: '+ tokeninstall + '--> [IF]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' int'){
						console.log('LEXER: '+ tokeninstall + '--> [INT]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' print'){
						console.log('LEXER: '+ tokeninstall + '--> [PRINT]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' while'){
						console.log('LEXER: '+ tokeninstall + '--> [WHILE]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' string'){
						console.log('LEXER: '+ tokeninstall + '--> [STRING]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' boolean'){
						console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has failed
						run = false;//break the switch
						break;
						
					}else{
					
					console.log('LEXER: unrecognized token' + tokeninstall);//the next character was not a letter, so we output the unrecognized token
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					scannerSuccess = false; //the scanner has failed
					run = false;//break the switch
					break;
					}
					
				}
			
			}
		
				
			
			
		}//end of switch
		
		
		
		
		
		
		
		
		
	}//end of while
	
	/*
	if ( c.search(letter) != -1 &&  inputText[i+1].search(letter) == -1){
		alert('LEXER: '+ c +'--> [ID]');
		
		
		
		
	}
	*/
	
	
	


function isSpace(c){
	
	if ( c.search(space) != -1 ){
		
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
		}
		
	}
	
}

function isQuot(c){
	if ( c.search(QUOT) != -1){
		console.log('LEXER: '+ c +'--> [QUOTE]');
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
		}
		
	}
	
	
}

function isEOL(c){
	
	if (c.search(EOL) != -1){
		console.log('LEXER: '+ c +'--> [EOL]');
		
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					console.log('LEXER: Lex program completed with no errors');
		}
		if (scannerSuccess == false){
			console.log('LEXER: Lex program completed with errors');
			
			
			
		}
		scannerSuccess = true;
		programCounter = programCounter + 1;
		console.log("scanning program " + programCounter);
	}
	
}

function isRBRACE(c){
	if (c.search(RBRACE) != -1){
		console.log('LEXER: '+ c +'--> [RBRACE]');
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
			}
		
	}
}
	
function isLBRACE(c){
	if (c.search(LBRACE) != -1){
		console.log('LEXER: '+ c +'--> [LBRACE]');
		
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isLPAREN(c){
	if (c.search(LPAREN) != -1){
		console.log('LEXER: '+ c +'--> [LPAREN]');
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isRPAREN(c){
	if (c.search(LPAREN) != -1){
		console.log('LEXER: '+ c +'--> [RPAREN]');
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isINTOP(c){
	if (c.search(INTOP) != -1){
		console.log('LEXER: '+ c +'--> [INTOP]');
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

/*









*/