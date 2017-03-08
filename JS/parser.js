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
var tokenID = 0;

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
	//CST.push({name: branchName, parentName: parentValue, children: 'tempChildren', id: tokenID});
	CST.push(['name: ' + branchName,'parent ' +parentValue,[],tokenID]);
	tokenID ++;
	
	
}


function addLeafNode(leafName,parentValue){
	//CST.push({name: leafName, parentName: parentValue, children: 'tempChildren', id: tokenID});
	CST.push(['name: ' + leafName,'parent ' + parentValue,[],tokenID]);
	tokenID ++;
	
}


//start parsing
function parser(){
	initParseToken();
	parse_Program();
	
}


//production Program ::== Block $

function parse_Program(){
	addBranchNode('program',null); // start tree with program branch 
	/*
	var branch = document.createElement("BUTTON");
	var node = document.createTextNode('program');
	branch.appendChild(node);
	var element = document.getElementById('tree');
	element.appendChild(branch);
	*/
	const program_id = tokenID - 1;
	var program_parent = CST[tokenID - 1][0];
	parse_Block(program_parent);
	CST[program_id][2].push('child name: block, id : ' + (program_id + 1));
	
   	
	matchSpecChars('$',(tokenstream.length - 1),program_parent); // match EOP symbol after
	CST[program_id][2].push('child name: $, id : ' + (tokenID - 1));
	
	
	
	
}


//production Block ::== { StatementList }

function parse_Block(parentArg){
	
	
	addBranchNode('block',parentArg); //add to tree block 
	
	
	
	var block_parent = CST[tokenID - 1][0];
	
	console.log('test var block_parent  ' + block_parent);
	
	matchSpecChars('{',0,block_parent);
	parseCounter = parseCounter + 1;
	
	parse_StatementList(block_parent); 
	
	parseEndTokenCount = parseEndTokenCount - 1;
	matchSpecChars('}',parseEndTokenCount,block_parent);
	
	
	
	
}



//production StatementList ::== Statement StatementList
//					       ::== e
function parse_StatementList(parentArg){
	addBranchNode('StatementList',parentArg);
	var statementList_parent = CST[tokenID - 1][0];
	

	var temp = tokenstream[(parseCounter)][1]; //check type of token

	if (temp == 'keyword' || temp == 'identifier' || temp == 'type' ){ //if next token is a statment
		
		
		
		parse_Statement(statementList_parent); 
		parse_StatementList(statementList_parent);
		
		
		
		
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

function parse_Statement(parentArg){

	addBranchNode('Statement',parentArg);
	var statement_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	
	
	if (tempDesc == ' print'){
		parse_PrintStatement(statement_parent);

				
	}
	else if(tempType == 'identifier'){
		parse_AssignmentStatement(statement_parent);
		
	}
	else if (tempType == 'type'){
		
		parse_VarDecl(statement_parent);
		
	}
	else if (tempDesc == ' while'){
		parse_WhileStatement(statement_parent);
		
	}
	else if (tempDesc == ' if'){
		parse_IfStatement(statement_parent);
		
	}
	else if (tempDesc == ' {'){
		parse_Block(statement_parent);
		
	}
	
	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(parentArg){
	addBranchNode('PrintStatement',parentArg);
	var print_parent = CST[tokenID - 1][0];
	matchSpecChars(' print',parseCounter,print_parent);
	parseCounter = parseCounter + 1;
	matchSpecChars('(',parseCounter,print_parent);
	parseCounter = parseCounter + 1;
	parse_Expr(print_parent); 
	matchSpecChars (')',parseCounter,print_parent);
	parseCounter = parseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(parentArg){
	addBranchNode('AssignmentStatement',parentArg);
	var assign_parent = CST[tokenID - 1][0];
	parse_ID(assign_parent);
	matchSpecChars(' =',parseCounter,assign_parent);
	parseCounter = parseCounter + 1;
	parse_Expr(assign_parent);
	
	
	
}


//Production VarDecl ::== type Id
function parse_VarDecl(parentArg){
	addBranchNode('VarDecl',parentArg);
	var VarDecl_parent = CST[tokenID - 1][0];
	parse_type(VarDecl_parent);
	parse_ID(VarDecl_parent);
	
	
}

//Production WhileStatement ::== while BooleanExpr Block
function parse_WhileStatement(parentArg){
	addBranchNode('WhileStatement',parentArg);
	var WhileStatement_parent = CST[tokenID - 1][0];
	matchSpecChars(' while',parseCounter,WhileStatement_parent);
	parseCounter = parseCounter + 1;
	parse_BooleanExpr(WhileStatement_parent);
	parse_Block(WhileStatement_parent);
	
}

//production IfStatement ::== if BooleanExpr Block
function parse_IfStatement(parentArg){
	addBranchNode('IfStatment',parentArg);
	var IfStatment_parent = CST[tokenID - 1][0];
	matchSpecChars(' if',parseCounter,IfStatment_parent);
	parseCounter = parseCounter + 1;
	parse_BooleanExpr(IfStatment_parent);
	parse_Block(IfStatment_parent);
	
	
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function parse_Expr(parentArg){
	addBranchNode('Expr',parentArg);
	var Expr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if(tempType == 'digit'){
		parse_IntExpr(Expr_parent);
		
	}
	else if (tempDesc == ' "'){
		parse_StringExpr(Expr_parent);
	}
	else if (tempDesc == ' (' || tempType == 'boolval'){
		parse_BooleanExpr(Expr_parent);
		
	}
	else if (tempType == 'identifier' ) {
		parse_ID(Expr_parent);
		
	}
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function parse_IntExpr(parentArg){
	addBranchNode('IntExpr',parentArg);
	var IntExpr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'digit'){
		matchSpecChars(tempDesc,parseCounter,IntExpr_parent);
		parseCounter = parseCounter + 1;
				
	}
	if (tempDesc == ' +'){
		parse_intop(IntExpr_parent);
		parse_Expr(IntExpr_parent);
	}
	
	
}

//production StringExpr ::== " CharList "
function parse_StringExpr(parentArg){
	addBranchNode('StringExpr',parentArg);
	var StringExpr_parent = CST[tokenID - 1][0];
	
	matchSpecChars(' "',parseCounter,StringExpr_parent);
	parseCounter = parseCounter + 1;
	parse_CharList(StringExpr_parent);
	matchSpecChars(' "',parseCounter,StringExpr_parent);
	parseCounter = parseCounter + 1;
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function parse_BooleanExpr(parentArg){
	addBranchNode('BooleanExpr',parentArg);
	var BooleanExpr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' ('){
		matchSpecChars('(',parseCounter,BooleanExpr_parent);
		parseCounter = parseCounter + 1;
		parse_Expr(BooleanExpr_parent);
		parse_boolop(BooleanExpr_parent);
		parse_Expr(BooleanExpr_parent);
		
		
	}
	else{
		parse_boolval(BooleanExpr_parent);
		
	}
	
	
}

//production Id ::== char

function parse_ID(parentArg){
	addBranchNode('ID',parentArg);
	var ID_parent = CST[tokenID - 1][0];
	parse_char(ID_parent);
	
	
}

//production CharList ::== char CharList
//					  ::== space CharList
//					  ::== ε

function parse_CharList(parentArg){
	addBranchNode('CharList',parentArg);
	var CharList_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'string' ){
		//parse_char(CharList_parent);
		//parse_CharList(CharList_parent);
	
		matchSpecChars(tempDesc,parseCounter,CharList_parent);
		parseCounter = parseCounter + 1;
	}
	
	
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function parse_type(parentArg){
	addBranchNode('type',parentArg);
	var type_parent = CST[tokenID - 1][0];

	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' int'){
		matchSpecChars(' int',parseCounter,type_parent);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' string'){
		matchSpecChars(' string',parseCounter,type_parent);
		parseCounter = parseCounter + 1;
	}
	else if (nextToken == ' boolean'){
		
		matchSpecChars(' boolean',parseCounter,type_parent);
		parseCounter = parseCounter + 1;
	}
	
	
}

//production char ::== a | b | c ... z
function parse_char(parentArg){
	addBranchNode('char',parentArg);
	var char_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter,char_parent);
	parseCounter = parseCounter + 1;
	
	
}

//production space ::== the space character
/*
function parse_space(){
	match(space);
	
}
*/

//production digit ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
function parse_digit(parentArg){
	addBranchNode('digit',parentArg);
	var digit_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars('tempDesc',parseCounter,digit_parent);
	parseCounter = parseCounter + 1;
}

//production boolop ::== == | !=

function parse_boolop(parentArg){
	addBranchNode('boolop',parentArg);
	var boolop_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' =='){
		matchSpecChars('==',parseCounter,boolop_parent);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' !='){
		matchSpecChars('!=',parseCounter,boolop_parent);
		parseCounter = parseCounter + 1;
	}
	
}

//production boolval ::== false | true
function parse_boolval(parentArg){
	addBranchNode('boolval',parentArg);
	var boolval_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' false'){
		matchSpecChars('false',parseCounter,boolval_parent);
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == 'true'){
		matchSpecChars('true',parseCounter,boolval_parent);
		parseCounter = parseCounter + 1;
	}
	
}

//production intop ::== +
function parse_intop(parentArg){
	addBranchNode('intop',parentArg);
	var intop_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars('+',parseCounter,intop_parent);
	parseCounter = parseCounter + 1;
	
}












