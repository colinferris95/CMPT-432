//This script is under construction


//structure of a lex program
var tokenrecog;
var run = true;

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


	
	for (var i=0; i<inputText.length;i++){
		
		
	//start scanning the file at the first character
	var c = inputText[i];
	
	
	console.log('this is the current c:'  + c);
	isID(c,i,inputText);
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



function isID(currentchar,counter,input){
	var state = 0;
	tokeninstall = " ";
	run = true;
	
	while (run){
		
		switch(state){
		
			case 0:
				if ((input[counter]).search(letter) != -1){
					state = 1;
					tokeninstall = tokeninstall + input[counter];
					counter++
				
				}
				else{
					
					run = false;
					break;
				}
		
			case 1:
				if ((input[counter]).search(letter) != -1){
					state = 2;
					tokeninstall = tokeninstall + input[counter];;
					counter++
				
				}
				else{
					console.log('LEXER: '+ tokeninstall + '--> [ID]');
					run = false;
					break;
				}
				
			case 2:
				if ((input[counter]).search(letter) != -1){
					state = 2;
					tokeninstall = tokeninstall + input[counter];;
					counter++
				}
				else{
				console.log('unrecognized token ' + tokeninstall);
				run = false;
				break;
				
				}
		}
		
		
		
		
		
		
	}
	
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