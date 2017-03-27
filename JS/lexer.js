//I lied leaving an open quote without a close quote still doesnt work


//test program 1 passes the lexer with no errors
function Program1(){
	document.getElementById("textInput").value = ' { print("true") \n   int a \n   a = 2 \n }$	'
	
	
	
}
//test program 2 passes the lexer with no errors
function Program2(){
	document.getElementById("textInput").value = ' {{{{{{}}}}}}$	'
	
	
	
}

//variables needed for lexer function
//for the switch cases
var run = true; 
var state;

//flag to show if the program has lexed with or without errors
var scannerSuccess;

var moveToParse;

//keeps track of which program is being scanned
var programCounter;

//the first pointer in creating a lexeme, the other being the forward pointer
var lexemeBegin;

//variable for building up tokens
var tokeninstall = "";

//variable to keep track of the current line number
var currLineNumber;

//used for the 2d array tokenstream, increases for every lexeme token added to array tokenstream
var lexemeCount = 0;

var finalCount;

//initalize the array to keep the tokens
var tokenstream = [];
var tokenstreamCOPY = [];

//boolean used for checking unrecognized character the other functions dont catch
var tokenCheck;

 
// regex declarations
var letter = /[a-z]/; //alpha characters
var digit = /[0-9]/; //number character
var space = /\s/; //find space
var ws = /[space]+/; //whitespace
var id = /[letter]/; //id is made up of single letters
var EOP = /[$]/; //finds the EOP symbol
var RBRACE =/[}]/; //finds the rbrace symbol
var LBRACE = /[{]/; //finds the lbrace symbol
var RPAREN = /[)]/; //finds the rparen symbol
var LPAREN = /[(]/; //finds the lparen symbol
var INTOP = /[+]/; //finds the addition symbol
var QUOT = /["]/; //finds the quotation mark
var ASSIGN = /[=]/; //finds the equals sign
var EXCLAM = /[!]/; //finds the exclamation point
var newLine = /\n/; //finds new line






//token constructor

var token = class{
	
	constructor(desc,type,line_num){
		this.desc = desc; //the character entered 
		this.type = type; //the type of character ie. keyword, identifier etc.
		this.line_num = line_num; //line number the character is at
		
		
	}
	
	
	
	
	
}











//scans through each character of input text, main function
function lexer(){
	
	
	document.getElementById("output").value = ' ';  //clear output screen
	programCounter = 1; //start the program counter
	currLineNumber = 1; //start the line number
	
	var inputText = document.getElementById("textInput").value; //inputText holds the value of the entered program

	//document.getElementBYId("output").value =  inputText;
	console.log("scanning program " + programCounter);
	document.getElementById("output").value += "scanning program " + programCounter + '\n'; //output that scanning has begun

	//scan each character in the text
	
	for (lexemeBegin=0; lexemeBegin<inputText.length;lexemeBegin++){
		
		
	//start scanning the file at the first character
	var c = inputText[lexemeBegin];
	tokenCheck = false; //baseline, the auxillary functions must make this true to pass the scanner, or it is caught by badtokenCheck
	tokenstreamCOPY = tokenstream;
	
	//auxiallary functions to check each character one at a time
	findLineNumber(c); //gets the current line number
	isBOOLOP(c,lexemeBegin,inputText); //identifies assignment statement and boolops
	isID(c,lexemeBegin,inputText); //identifies keywords,types, and ids
	isDigit(c,lexemeBegin,inputText); //identifies single digit numbers
	isSpace(c); //identifies space, to be ignored
	isRBRACE(c); //identifies right bracket
	isLBRACE(c); //identifies left bracket
	isRPAREN(c); //identifies right parenthesis
	isLPAREN(c); //identifies left parenthesis
	isINTOP(c); //identifies intop
	isQuot(c,lexemeBegin,inputText); //identifies quotes and strings
	
	isEOP(c); //identifies the end of program symbol
	badTokenCheck(c); //catches bad/unrecognized tokens
	
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
	tokenstreamCOPY = tokenstream;
	console.log(tokenstreamCOPY);
	tokenstream = [];
	lexemeCount = 0;
	

	

}

function findLineNumber(c){
	if (c.search(newLine) != -1){ //if new line is detected, increase line number
		
		currLineNumber++;
		
		tokenCheck = true;
		if (scannerSuccess != false){
					scannerSuccess = true; //in this function the scanner passes
					}
	}
	
	
	
}





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
					var idtoken = new token(tokeninstall, "identifier", currLineNumber);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
				else{ //if the stream of letters has stopped
					forward = forward-1;
					if (tokeninstall == ' if'){ //token matches if
						tokenCheck = true;
						var idtoken = new token(tokeninstall, "keyword", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n'; //output
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' int'){ //token matches int
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [INT]');
						var idtoken = new token(tokeninstall, "type", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' print'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [PRINT]');
						var idtoken = new token(tokeninstall, "keyword", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' while'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [WHILE]');
						var idtoken = new token(tokeninstall, "keyword", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' string'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [STRING]');
						var idtoken = new token(tokeninstall, "type", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' boolean'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "type", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' true'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "boolval", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else if (tokeninstall == ' false'){
						tokenCheck = true;
						//console.log('LEXER: '+ tokeninstall + '--> [BOOLEAN]');
						var idtoken = new token(tokeninstall, "boolval", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;//break the switch
						break;
						
					}
					else{
					tokenCheck = true;
					//console.log('LEXER: unrecognized token' + tokeninstall);//the next character was not a letter, so we output the unrecognized token
					var idtoken = new token(tokeninstall, "unrecognized token", currLineNumber);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
					lexemeCount++; //move to the next place in the token array
					lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
					scannerSuccess = false; //the scanner has 
					run = false;//break the switch
					break;
					}
					
				}
			
			}
		
				
			
			
		}//end of switch
		
		
		
		
		
		
		
		
		
	}

function isDigit(currentchar,forward,input){
	state = 0;
	
	tokeninstall = " "; //clear the token value
	run = true;
	//alert(run);
	
	while (run){
		
		switch(state){
		
			//entering the dfa
			case 0:
				
				
				//a number letter is entered
			    if((input[forward]).search(digit) != -1){		
						state = 1; //go to case 1 to determine if its a single digit or not
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						tokenCheck = true;
					}
				else{ //a character other than a digit is entered

					run = false;
					break;
				}
		
			case 1:
				
			
				
				if ((input[forward]).search(digit) != -1){ //if the character is also a digit, move on to case 2 to build an unrecognized token 
					state = 2;
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++;//move the forward counter
					tokenCheck = true;
				}
				
				else{
					 // the next character was not a digit, so we output the valid one character digit
					tokenCheck = true;
					var idtoken = new token(tokeninstall, "digit", currLineNumber);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n'; //output
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
				if ((input[forward]).search(digit) != -1){ //if each character added is also a digit, keep building the toekn
					tokenCheck = true;
					state = 2;
					tokeninstall = tokeninstall + input[forward];;
					forward++;
					
					
				}
				else{
					tokenCheck = true;
					//console.log('LEXER: unrecognized token' + tokeninstall);//the next character was not a digit, so we output the unrecognized token
					var idtoken = new token(tokeninstall, "unrecognized token", currLineNumber);// build token
					tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
					console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
					document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
		var invalidString = false;
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
						
						var idtoken = new token(tokeninstall, "open double quote", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						
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
				try{
					var x = (input[forward]).search(QUOT);
			
				}
				catch (error){
					
					document.getElementById("output").value += 'LEXER: found open quote without closing quote \n' ;
					document.getElementById("output").value += 'LEXER: Lex program completed with errors \n' ;
					scannerSuccess = false; 
					
				}
			
				if ((input[forward]).search(QUOT) == -1){ //if the character is also a letter, move on to case 2 to build an unrecognized token 
					if ((input[forward]).search(letter) != -1){
					state = 1;
					tokeninstall = tokeninstall + input[forward];; //continue building the token
					forward++;//move the forward counter
					tokenCheck = true;
					}
					else if ((input[forward]).search(letter) == -1){		
						invalidString = true;
						state = 1;
						tokeninstall = tokeninstall + input[forward];; //continue building the token
						forward++;//move the forward counter
						tokenCheck = true;
						
					}
				
					
					
				}
				
				
				else if((input[forward]).search(QUOT) != -1){
					
					
						if(invalidString == false){
						var idtoken = new token(tokeninstall, "string", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						
						tokenCheck = true;
						tokeninstall = " ";
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						}
						if(invalidString){
						var idtoken = new token(tokeninstall, "unrecognized token", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						
						tokenCheck = true;
						tokeninstall = " ";
						
						scannerSuccess = false; //in this function the scanner false
						
							
							
						}
						
						//forward++;//move the forward counter
						
						var idtoken = new token(' "', "close double quote", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						
						tokenCheck = true;
						tokeninstall = " ";

						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						
						
						
						run = false;
						break;
						
					
					
					
				}
				else{
					document.getElementById("output").value += 'broken string';
					run = false;
					break;
					
				}
				
				
			
				
				
		
				
				
				
					
				
			}
			
		}
	
	
	
	
}
function isEOP(c){
	
	if (c.search(EOP) != -1){
		tokenCheck = true;
		//console.log('LEXER: '+ c +'--> [EOP]');
		var idtoken = new token(c, "end of program symbol", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
		lexemeCount++; //move to the next place in the token array
		
		if (scannerSuccess != false){
				if(moveToParse != false){
					parseStart();
				}
					
					scannerSuccess = true; //in this function the scanner passes
					console.log('LEXER: Lex program completed with no errors');
					document.getElementById("output").value +=  'LEXER: Lex program completed with no errors' + '\n';
		}
		if (scannerSuccess == false){
			alert('not moving to parse');
			moveToParse = false;
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
		var idtoken = new token(c, "right brace", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
		var idtoken = new token(c, "left brace", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
		var idtoken = new token(c, "left parenthesis", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
		var idtoken = new token(c, "right parenthesis", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
		var idtoken = new token(c, "intop", currLineNumber);// build token
		tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
		console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
		document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
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
						state = 1; //go to case 1 to determine if it is assignment or boolop
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						
						
					}
					
					else if((input[forward]).search(EXCLAM) != -1){
						tokenCheck = true;
						state = 2; //go to case 2 to determine if it is a boolop
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
						
						var idtoken = new token(tokeninstall, "boolop", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
						run = false;
						break;
						
					}
					else{ //a character other than a lowercase letter is entered, break the switch and move on to the other lex functions
						tokenCheck = true;
						var idtoken = new token(tokeninstall, "assignment statement", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
					}
						run = false;
						break;
				}
				
		
				case 2:
					//a quote is entered
					if((input[forward]).search(ASSIGN) != -1){		
						tokenCheck = true;
						tokeninstall = tokeninstall + input[forward]; //start building the token
						forward++; //move the forward counter
						
						var idtoken = new token(tokeninstall, "boolop", currLineNumber);// build token
						tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array			
						console.log ('LEXER: ' + tokenstream[lexemeCount][1] + ' '+ tokenstream[lexemeCount][0]); //log the token (verbose mode)
						document.getElementById("output").value += 'LEXER: Token found at line number '+ tokenstream[lexemeCount][2]+' "' + tokenstream[lexemeCount][0] + '" ----> '+ tokenstream[lexemeCount][1]   + '\n';
						lexemeCount++; //move to the next place in the token array
						lexemeBegin = forward;//move the lexemeBegin to where the forward is and continue scanning
						if (scannerSuccess != false){
							scannerSuccess = true; //in this function the scanner passes
						}
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
	

