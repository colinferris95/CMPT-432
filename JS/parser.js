// Recursion in a nutshell ----- https://www.youtube.com/watch?v=N_hG70ENBkQ -----

var CST = [];
var letter = /[a-z]/; //alpha characters
var acceptableTokens = /[a-z]|[0-9]|[(]|[)]|[{]|[}]|["]/
var parseEndTokenCount; //start processing tokens at the last token, start from the right
var tokenDesc = 0;
var tokenType = 1;
var tokenLineNum = 2;
var parseCounter =0;
var lookAhead = parseCounter + 1;
var nextToken; 
var nextTokenType;
var parentCounter = 0;

// ex tokenstream[lexemeCount][0]
function initParseToken(){
	
		parseEndTokenCount = tokenstream.length - 1;
		nextToken = tokenstream[lookAhead][0];
		nextTokenType = tokenstream[lookAhead][1];
	
	
}




function matchSpecChars(token,pos,parentValue){ //matches brackets, quotes, parens etc.


console.log('character compared ' + tokenstream[pos][0] + ' with current token ' + token);
	if (token == tokenstream[pos][0]){		
		//add leaf node
		addLeafNode(token,parentValue); //finish branch with matched token
		console.log('matched token ' + token);
		console.log(CST);
		
		
	}
	else{
		console.log('ERROR: token ' + token + ' was not matched'); 
		
	}
	
}


function addBranchNode(branchName,parentValue){
	//var idtoken = new token(tokeninstall, "identifier", currLineNumber);// build token
	//tokenstream.push([idtoken.desc,idtoken.type,idtoken.line_num]);	//push token to the array	

	CST.push([branchName,parentValue,'tempChildren']);
	
	
}


function addLeafNode(leafName,parentValue){

	CST.push([leafName,parentValue,'tempChildren']);
	
}


//start parsing
function parser(){
	initParseToken();
	parse_Program();
	
}


//production Program ::== Block $

function parse_Program(){
	addBranchNode('program',null); // start tree with program branch 
	parse_Block(); 
	matchSpecChars('$',(tokenstream.length - 1),parentCounter); // match EOP symbol after
	
	
	
	
	
}


//production Block ::== { StatementList }

function parse_Block(){
	addBranchNode('block',parentCounter); //add to tree block 
	
	matchSpecChars('{',0,parentCounter);
	parseCounter = parseCounter + 1;
	parse_StatementList(); 
	parseEndTokenCount = parseEndTokenCount - 1;
	matchSpecChars('}',parseEndTokenCount,parentCounter);
	
	
	
	
}



//production StatementList ::== Statement StatementList
//					       ::== e
function parse_StatementList(){
	addBranchNode('StatementList',parentCounter);

	

	var temp = tokenstream[(parseCounter)][1]; //check type of token

	if (temp == 'keyword' || temp == 'identifier' || temp == 'type' ){ //if next token is a statment
		
		
		
		parse_Statement(); 
		parse_StatementList();
		
		
		
		
	}
	else{
		
		//e production
	}

	
	
}


//production  Statement ::== PrintStatement
//          			::== AssignmentStatement
//          			::== VarDecl
//          			::== WhileStatement
//          			::== IfStatement
//          			::== Block

function parse_Statement(){

	addBranchNode('Statement',parentCounter);
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	console.log('this is the tempType in parse_statement' + tempType);
	
	if (tempDesc == ' print'){
		parse_PrintStatement();

				
	}
	else if(tempType == 'identifier'){
		parse_AssignmentStatement();
		
	}
	else if (tempType == 'type'){
		console.log('DEBUG: parse_statement type running');
		parse_VarDecl();
		
	}
	else if (tempDesc == ' while'){
		parse_WhileStatement();
		
	}
	else if (tempDesc == ' if'){
		parse_IfStatement();
		
	}
	else if (tempDesc == ' {'){
		parse_Block();
		
	}
	
	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(){
	addBranchNode('PrintStatement',parentCounter);
	matchSpecChars(' print',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	matchSpecChars('(',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	parse_Expr(); 
	matchSpecChars (')',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(){
	
	parse_ID();
	matchSpecChars(' =',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	parse_Expr();
	
	
	
}


//Production VarDecl ::== type Id
function parse_VarDecl(){
	console.log('DEBUG: parse_VarDecl running');
	parse_type();
	parse_ID();
	
	
}

//Production WhileStatement ::== while BooleanExpr Block
function parse_WhileStatement(){
	matchSpecChars(' while',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	parse_BooleanExpr();
	parse_Block();
	
}

//production IfStatement ::== if BooleanExpr Block
function parse_IfStatement(){
	matchSpecChars(' if',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	parse_BooleanExpr();
	parse_Block();
	
	
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function parse_Expr(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if(tempType == 'digit'){
		parse_IntExpr();
		
	}
	else if (tempDesc == ' "'){
		parse_StringExpr();
	}
	else if (tempDesc == ' (' ){
		parse_BooleanExpr();
		
	}
	else if (tempType == 'identifier' ) {
		parse_ID();
		
	}
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function parse_IntExpr(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'digit'){
		matchSpecChars(tempDesc,parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
				
	}
	if (tempDesc == ' +'){
		parse_intop();
		parse_Expr();
	}
	
	
}

//production StringExpr ::== " CharList "
function parse_StringExpr(){
	matchSpecChars(' "',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	parse_CharList();
	matchSpecChars(' "',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function parse_BooleanExpr(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' ('){
		matchSpecChars('(',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
		parse_Expr();
		parse_boolop();
		parse_Expr();
		
		
	}
	else{
		parse_boolval();
		
	}
	
	
}

//production Id ::== char

function parse_ID(){
	
	parse_char();
	
	
}

//production CharList ::== char CharList
//					  ::== space CharList
//					  ::== ε

function parse_CharList(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'string' ){
		parse_char();
		parse_CharList();
	}
	/*
	else if (nextToken == space ){ //this is a problem
		parse_space();
		parse_CharList();
		
	}
	*/
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function parse_type(){
	console.log('DEBUG: parse_type running');
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' int'){
		matchSpecChars(' int',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' string'){
		matchSpecChars(' string',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	else if (nextToken == ' boolean'){
		
		matchSpecChars(' boolean',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	
	
}

//production char ::== a | b | c ... z
function parse_char(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	
	
}

//production space ::== the space character
/*
function parse_space(){
	match(space);
	
}
*/

//production digit ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
function parse_digit(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars('tempDesc',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
}

//production boolop ::== == | !=

function parse_boolop(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' =='){
		matchSpecChars('==',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' !='){
		matchSpecChars('!=',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	
}

//production boolval ::== false | true
function parse_boolval(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' false'){
		matchSpecChars('false',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == 'true'){
		matchSpecChars('true',parseCounter,parentCounter);
		parseCounter = parseCounter + 1;
	}
	
}

//production intop ::== +
function parse_intop(){
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars('+',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	
}












