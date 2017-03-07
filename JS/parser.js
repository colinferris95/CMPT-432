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


console.log('character compared ' + tokenstream[pos][0]);
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

	console.log('nextToken ' + nextTokenType);
	console.log('parseBeingCount ' + parseCounter);
	var temp = tokenstream[(parseCounter)][1]; //check type of token
	console.log('this is the temp var' + temp);
	if (temp == 'keyword' || temp == 'identifier'  ){ //if next token is a statment
		console.log('hey');	
		
		
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
	console.log("added statment branch");
	addBranchNode('Statement',parentCounter);
	
	var tempDesc = tokenstream[lookAhead][0]; //check desc of token
	var tempType = tokenstream[lookAhead][1]; //check type of token
	console.log('this is the temp desc ' + tempDesc);
	console.log('this is the temp type' + tempType);
	
	if (tempDesc == ' print'){
		parse_PrintStatement();
		console.log('yo');
				
	}
	else if(tempType == 'identifier'){
		parse_AssignmentStatement();
		
	}
	else if (nextToken == 'type'){
		//parse_VarDecl();
		
	}
	else if (nextToken == 'while'){
		//parse_WhileStatement();
		
	}
	else if (nextToken == 'if'){
		//parse_IfStatement();
		
	}
	else if (nextToken == '{'){
		parse_Block();
		
	}
	
	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(){
	addBranchNode('PrintStatement',parentCounter);
	matchSpecChars('print',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	matchSpecChars('(',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	//parse_Expr(); test
	matchSpecChars (')',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(){
	
	parse_ID();
	matchSpecChars('=',parseCounter,parentCounter);
	parseCounter = parseCounter + 1;
	//parse_Expr();
	
	
	
}
/*

//Production VarDecl ::== type Id
function parse_VarDecl(){
	parse_type();
	parse_ID();
	
	
}

//Production WhileStatement ::== while BooleanExpr Block
function parse_WhileStatement(){
	match('while');
	parse_BooleanExpr();
	parse_Block();
	
}

//production IfStatement ::== if BooleanExpr Block
function parse_IfStatement(){
	match('if');
	parse_BooleanExpr();
	parse_Block();
	
	
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function parse_Expr(){
	if(nextToken == digit){
		parse_IntExpr();
		
	}
	else if (nextToken == "){
		parse_StringExpr();
	}
	else if (nextToken == '(' ){
		parse_BooleanExpr();
		
	}
	else if (nextToken == char ) {
		parse_ID();
		
	}
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function parse_IntExpr(){
	if (nextToken == digit){
		match(digit);
				
	}
	if (nextToken == +){
		parse_intop();
		parse_Expr();
	}
	
	
}

//production StringExpr ::== " CharList "
function parse_StringExpr(){
	match(");
	parse_CharList();
	match(");
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function parse_BooleanExpr(){
	if (nextToken == '('){
		match('(');
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
	if (nextToken == char ){
		parse_char();
		parse_CharList();
	}
	else if (nextToken == space ){
		parse_space();
		parse_CharList();
		
	}
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function parse_type(){
	if (nextToken == int){
		match(int);
	}
	else if (nextToken == string){
		match(string);
	}
	else if (nextToken == boolean){
		
		match(boolean);
	}
	
	
}

//production char ::== a | b | c ... z
function parse_char(){
	match(letter);
	
	
}

//production space ::== the space character
function parse_space(){
	match(space);
	
}

//production digit ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
function parse_digit(){
	match(digit);
}

//production boolop ::== == | !=

function parse_boolop(){
	if (nextToken == '=='){
		match ('==');
	}
	else if (nextToken == '!='){
		match('!=');
	}
	
}

//production boolval ::== false | true
function parse_boolval(){
	if (nextToken == 'false'){
		match('false');
	}
	else if (nextToken == 'true'){
		match('true');
	}
	
}

//production intop ::== +
function parse_intop(){
	match(+);
	
}
*/











