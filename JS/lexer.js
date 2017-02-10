//This script is under construction



function Program1(){
	document.getElementById("textInput").value = ' { print("true") \n   int a \n   a = 2 \n   boolean b = true  \n }$	'
	
	
	
}

function Program2(){
	document.getElementById("textInput").value = ' { int x = 3 \n  if x == 3 {x = 0} }$	'
	
	
	
}

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
var EOP = /[$]/;
var RBRACE =/[}]/;
var LBRACE = /[{]/;
var RPAREN = /[)]/;
var LPAREN = /[(]/;
var INTOP = /[+]/;
var QUOT = /["]/;
var ASSIGN = /[=]/;
var EXCLAM = /[!]/;


var lexemeCount = 0;
var tokenstream = [];
var tokenCheck

//not resereved alpha

//regular expressions and defintions
// pattern {action}

//char      ::== a|b|c ... z


//token constructor

var token = class{
	
	constructor(desc,type,line_num){
		this.desc = desc;
		this.type = type;
		this.line_num = line_num;
		
		
	}
	
	
	
	
	
}








//translation rules
/*





*/

//auxiliary functions
//scans through each character of input text
function lexer(){
	document.getElementById("output").value = ' ';  //clear output screen
	programCounter = 1;
	
	var inputText = document.getElementById("textInput").value;

	//document.getElementBYId("output").value =  inputText;
	console.log("scanning program " + programCounter);
	document.getElementById("output").value += "scanning program " + programCounter + '\n';

	
	for (lexemeBegin=0; lexemeBegin<inputText.length;lexemeBegin++){
		
		
	//start scanning the file at the first character
	var c = inputText[lexemeBegin];
	tokenCheck = false;
	
	//console.log('this is the current c:'  + c);
	isBOOLOP(c,lexemeBegin,inputText);
	isID(c,lexemeBegin,inputText);
	isDigit(c,lexemeBegin,inputText);
	isSpace(c);
	isRBRACE(c);
	isLBRACE(c);
	isRPAREN(c);
	isLPAREN(c);
	isINTOP(c);
	isQuot(c,lexemeBegin,inputText);
	
	isEOP(c);
	badTokenCheck(c);
	
	}
	if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					console.log('LEXER: Lex program completed with no errors');
					document.getElementById("output").value +=  'LEXER: Lex program completed with no errors' + '\n';
		}
		if (scannerSuccess == false){
			console.log('LEXER: Lex program completed with errors');
			document.getElementById("output").value +=  'LEXER: Lex program completed with errors' + '\n';
			
			
			
		}
	console.log(tokenstream);
	

}




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
						forward++; //move the forward counter
						tokenCheck = true;
					}
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions

					run = false;
					break;
				}
		
			case 1:
				
			
				
				if ((input[forward]).search(letter) != -1){ //if the character is also a letter, move on to case 2 to build an unrecognized token 
					state = 2;
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++;//move the forward counter
					tokenCheck = true;
				}
				
				else{
					//console.log('LEXER: '+ tokeninstall + '--> [ID]'); // the next character was not a letter, so we output the valid one character id
					tokenCheck = true;
					var idtoken = new token(tokeninstall, "identifier", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
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
					tokenCheck = true;
					state = 2;
					tokeninstall = tokeninstall + input[forward];;
					forward++;
					
					
				}
				else{
					forward = forward-1;
					if (tokeninstall == ' if'){
						tokenCheck = true;
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' int'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [INT]');
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' print'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [PRINT]');
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' while'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [WHILE]');
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' string'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [STRING]');
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' boolean'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "keyword", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' true'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "boolval", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' false'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "boolval", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;//break the switch
						break;
						
					}
					else{
					tokenCheck = true;
					//console.log('LEXER: unrecognized token' + tokeninstall);//the next character was not a letter, so we output the unrecognized token
					var idtoken = new token(tokeninstall, "unrecognized token", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					scannerSuccess = false; //the scanner has passed
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

function isDigit(currentchar,forward,input){
	state = 0;
	
	tokeninstall = " "; //clear the token value
	run = true;
	//alert(run);
	
	while (run){
		
		switch(state){
		
			//entering the dfa
			case 0:
				
				
				//a lowercase letter is entered
			    if((input[forward]).search(digit) != -1){		
						state = 1; //go to case 1 to determine if it is an id or not
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						tokenCheck = true;
					}
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions

					run = false;
					break;
				}
		
			case 1:
				
			
				
				if ((input[forward]).search(digit) != -1){ //if the character is also a letter, move on to case 2 to build an unrecognized token 
					state = 2;
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++;//move the forward counter
					tokenCheck = true;
				}
				
				else{
					//console.log('LEXER: '+ tokeninstall + '--> [ID]'); // the next character was not a letter, so we output the valid one character id
					tokenCheck = true;
					var idtoken = new token(tokeninstall, "digit", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
					forward = forward-1;
					lexemeBegin=forward; //move the lexemeBegin to where the forward is and continue scanning
					
					
					if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
					run = false; //break the switch
					break;
				}
				
				
			case 2:
				if ((input[forward]).search(digit) != -1){ //if each character added is also a letter, keep building the toekn
					tokenCheck = true;
					state = 2;
					tokeninstall = tokeninstall + input[forward];;
					forward++;
					
					
				}
				else{
					tokenCheck = true;
					//console.log('LEXER: unrecognized token' + tokeninstall);//the next character was not a letter, so we output the unrecognized token
					var idtoken = new token(tokeninstall, "unrecognized token", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					scannerSuccess = false; //the scanner has passed
					run = false;//break the switch
					break;
					}
					
				}
			
			}
		
				
			
			
		}
		
		
		
		
		
		
		
		
		





function isSpace(c){
	
	if ( c.search(space) != -1 ){
		tokenCheck = true;
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
		}
		
	}
	
}

function isQuot(currentchar,forward,input){
		state = 0;
	 
		tokeninstall = " "; //clear the token value
		run = true;
		//alert(run);
		
		
		while (run){
		
			switch(state){
				
				case 0: 
					//a quote is entered
					if((input[forward]).search(QUOT) != -1){		
						state = 1; //go to case 1 to determine if it is a string
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						var idtoken = new token(tokeninstall, "quotation", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						tokenCheck = true;
						tokeninstall = " ";
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
					
						
					}
					else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions

						run = false;
						break;
					}
				
				
			case 1:
				
			
				
				if ((input[forward]).search(letter) != -1){ //if the character is also a letter, move on to case 2 to build an unrecognized token 
					state = 1;
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++;//move the forward counter
					tokenCheck = true;
				}
				
				else{
					//console.log('LEXER: '+ tokeninstall + '--> [ID]'); // the next character was not a letter, so we output the valid one character id
					
					tokenCheck = true;
					var idtoken = new token(tokeninstall, "string", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
					forward = forward-1;
					lexemeBegin=forward; //move the lexemeBegin to where the forward is and continue scanning
					
					
					if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
					run = false; //break the switch
					break;
					
				}
		
				
				
		
				
				
				
					
				
			}
			
		}
	
	
	
	
}
function isEOP(c){
	
	if (c.search(EOP) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [EOP]');
		var idtoken = new token(c, "end of program symbol", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					console.log('LEXER: Lex program completed with no errors');
					document.getElementById("output").value +=  'LEXER: Lex program completed with no errors' + '\n';
		}
		if (scannerSuccess == false){
			console.log('LEXER: Lex program completed with errors');
			document.getElementById("output").value +=  'LEXER: Lex program completed with errors' + '\n';
			
			
			
		}
		scannerSuccess = true;
		programCounter = programCounter + 1;
		console.log("scanning program " + programCounter);
		document.getElementById("output").value += "scanning program " + programCounter + '\n';
	}
	
}
function badTokenCheck(c){
	
	//console.log(tokenstream[lexemeCount]);
	if (tokenCheck == false){
		console.log('LEXER: ERROR unrecognized token' + c);
		document.getElementById("output").value += 'LEXER: ERROR unrecognized token' + c   + "\n";
		
		scannerSuccess = false;
	}
	
	
}

function isRBRACE(c){
	if (c.search(RBRACE) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [RBRACE]');
		var idtoken = new token(c, "right brace", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
			}
		
	}
}
	
function isLBRACE(c){
	if (c.search(LBRACE) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [LBRACE]');
		var idtoken = new token(c, "left brace", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isLPAREN(c){
	if (c.search(LPAREN) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [LPAREN]');
		var idtoken = new token(c, "left parenthesis", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isRPAREN(c){
	if (c.search(RPAREN) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [RPAREN]');
		var idtoken = new token(c, "right parenthesis", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
	
}

function isINTOP(c){
	if (c.search(INTOP) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [INTOP]');
		var idtoken = new token(c, "intop", 7);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
		lexemeCount++; //move to the next place in the token array
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
		
	}
}




function isBOOLOP(currentchar,forward,input){ //checks for assignment or boolop
		state = 0;
	 
		tokeninstall = " "; //clear the token value
		run = true;
		//alert(run);
		
		
		while (run){
		
			switch(state){
				case 0: 
					//a quote is entered
					if((input[forward]).search(ASSIGN) != -1){
						tokenCheck = true;						
						state = 1; //go to case 1 to determine if it is an id or not
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						
						
					}
					
					else if((input[forward]).search(EXCLAM) != -1){
						tokenCheck = true;
						state = 2; //go to case 1 to determine if it is an id or not
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						
					}
					else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions

						run = false;
						break;
				}
				case 1:
					//a quote is entered
					if((input[forward]).search(ASSIGN) != -1){		
						tokenCheck = true;
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						var idtoken = new token(tokeninstall, "boolop", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;
						break;
						
					}
					else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions
						tokenCheck = true;
						var idtoken = new token(tokeninstall, "assignment statement", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;
						break;
				}
				case 1:
					if((input[forward]).search(ASSIGN) != -1){		
						tokenCheck = true;
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						var idtoken = new token(tokeninstall, "boolop", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;
						break;
						
					}
				else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions
					tokenCheck = true;
					var idtoken = new token(tokeninstall, "assignment statement", 7);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
					lexemeCount++; //move to the next place in the token array
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					scannerSuccess = true; //the scanner has passed
					run = false;
					break;
				}
		
				case 2:
					//a quote is entered
					if((input[forward]).search(ASSIGN) != -1){		
						tokenCheck = true;
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						var idtoken = new token(tokeninstall, "boolop", 7);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]   + "\n";
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						scannerSuccess = true; //the scanner has passed
						run = false;
						break;
						
					}
					else{
						
						
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false; //break the switch
						break;
						
						
					}
					
				
				
						
				
				
			}
		}
	
	
}
	


/*









*/