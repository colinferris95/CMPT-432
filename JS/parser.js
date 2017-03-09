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
		document.getElementById("tree").innerHTML = CST;
	
		
		
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
	var program_id = tokenID - 1;
	var program_parent = CST[tokenID - 1][0];
	parse_Block(program_parent);
	CST[program_id][2].push('child name: block, id : ' + (program_id + 1));
	
   	
	matchSpecChars('$',(tokenstream.length - 1),program_parent); // match EOP symbol after
	CST[program_id][2].push('child name: $, id : ' + (tokenID - 1));
	
	
	
	
}


//production Block ::== { StatementList }

function parse_Block(parentArg){
	
	
	addBranchNode('block',parentArg); //add to tree block 
	
	
	var block_id = tokenID - 1;
	var block_parent = CST[tokenID - 1][0];
	
	console.log('test var block_parent  ' + block_parent);
	
	matchSpecChars('{',0,block_parent);
	CST[block_id][2].push('child name: {, id : ' + (block_id + 1));
	parseCounter = parseCounter + 1;
	
	parse_StatementList(block_parent); 
	CST[block_id][2].push('child name: StatementList, id : ' + (block_id + 2));
	
	parseEndTokenCount = parseEndTokenCount - 1;
	matchSpecChars('}',parseEndTokenCount,block_parent);
	CST[block_id][2].push('child name: }, id : ' + (tokenID - 1));
	
	
	
	
}



//production StatementList ::== Statement StatementList
//					       ::== e
function parse_StatementList(parentArg){
	addBranchNode('StatementList',parentArg);
	var statementlist_id = tokenID - 1;
	var statementList_parent = CST[tokenID - 1][0];
	

	var temp = tokenstream[(parseCounter)][1]; //check type of token

	if (temp == 'keyword' || temp == 'identifier' || temp == 'type' ){ //if next token is a statment
		
		
		
		parse_Statement(statementList_parent); 
		CST[statementlist_id][2].push('child name: Statement, id : ' + (statementlist_id + 1));
		parse_StatementList(statementList_parent);
		CST[statementlist_id][2].push('child name: StatementList, id : ' + (statementlist_id + 2));
		
		
		
		
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
	var statement_id = tokenID - 1;
	var statement_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	
	
	if (tempDesc == ' print'){
		parse_PrintStatement(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));

				
	}
	else if(tempType == 'identifier'){
		parse_AssignmentStatement(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));
		
	}
	else if (tempType == 'type'){
		
		parse_VarDecl(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));
		
	}
	else if (tempDesc == ' while'){
		parse_WhileStatement(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));
		
	}
	else if (tempDesc == ' if'){
		parse_IfStatement(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));
		
	}
	else if (tempDesc == ' {'){
		parse_Block(statement_parent);
		CST[statement_id][2].push('child name: Statement, id : ' + (statement_id + 1));
		
	}
	
	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(parentArg){
	addBranchNode('PrintStatement',parentArg);
	var print_id = tokenID - 1;
	var print_parent = CST[tokenID - 1][0];
	
	matchSpecChars(' print',parseCounter,print_parent);
	CST[print_id][2].push('child name: print, id : ' + (print_id + 1));
	parseCounter = parseCounter + 1;
	
	matchSpecChars('(',parseCounter,print_parent);
	CST[print_id][2].push('child name: (, id : ' + (print_id + 2));
	parseCounter = parseCounter + 1;
	
	parse_Expr(print_parent); 
	CST[print_id][2].push('child name: Expr, id : ' + (print_id + 3));
	matchSpecChars (')',parseCounter,print_parent);
	CST[print_id][2].push('child name: ), id : ' + (print_id + 4));
	parseCounter = parseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(parentArg){
	addBranchNode('AssignmentStatement',parentArg);
	var assign_id = tokenID - 1;
	var assign_parent = CST[tokenID - 1][0];
	
	parse_ID(assign_parent);
	CST[assign_id][2].push('child name: ID, id : ' + (assign_id + 1));
	
	matchSpecChars(' =',parseCounter,assign_parent);
	CST[assign_id][2].push('child name: =, id : ' + (assign_id + 2));
	parseCounter = parseCounter + 1;
	
	parse_Expr(assign_parent);
	CST[assign_id][2].push('child name: Expr, id : ' + (assign_id + 3));
	
	
	
}


//Production VarDecl ::== type Id
function parse_VarDecl(parentArg){
	addBranchNode('VarDecl',parentArg);
	var VarDecl_id = tokenID - 1;
	var VarDecl_parent = CST[tokenID - 1][0];
	
	
	parse_type(VarDecl_parent);
	CST[VarDecl_id][2].push('child name: type, id : ' + (VarDecl_id + 1));
	
	parse_ID(VarDecl_parent);
	CST[VarDecl_id][2].push('child name: ID, id : ' + (VarDecl_id + 2));
	
	
}

//Production WhileStatement ::== while BooleanExpr Block
function parse_WhileStatement(parentArg){
	addBranchNode('WhileStatement',parentArg);
	var WhileStatement_id = tokenID - 1;
	var WhileStatement_parent = CST[tokenID - 1][0];
	
	matchSpecChars(' while',parseCounter,WhileStatement_parent);
	CST[WhileStatement_id][2].push('child name: while, id : ' + (WhileStatement_id + 1));
	parseCounter = parseCounter + 1;
	
	parse_BooleanExpr(WhileStatement_parent);
	CST[WhileStatement_id][2].push('child name: BooleanExpr, id : ' + (WhileStatement_id + 2));
	
	parse_Block(WhileStatement_parent);
	CST[WhileStatement_id][2].push('child name: Block, id : ' + (WhileStatement_id + 3));
	
}

//production IfStatement ::== if BooleanExpr Block
function parse_IfStatement(parentArg){
	addBranchNode('IfStatment',parentArg);
	var IfStatement_id = tokenID - 1;
	var IfStatment_parent = CST[tokenID - 1][0];
	
	matchSpecChars(' if',parseCounter,IfStatment_parent);
	CST[IfStatement_id][2].push('child name: if, id : ' + (IfStatement_id + 1));
	parseCounter = parseCounter + 1;
	
	parse_BooleanExpr(IfStatment_parent);
	CST[IfStatement_id][2].push('child name: BooleanExpr, id : ' + (IfStatement_id + 2));
	
	parse_Block(IfStatment_parent);
	CST[IfStatement_id][2].push('child name: Block, id : ' + (IfStatement_id + 3));
	
	
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function parse_Expr(parentArg){
	addBranchNode('Expr',parentArg);
	var Expr_id = tokenID - 1;
	var Expr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if(tempType == 'digit'){
		parse_IntExpr(Expr_parent);
		CST[Expr_id][2].push('child name: IntExpr, id : ' + (Expr_id + 1));
		
	}
	else if (tempDesc == ' "'){
		parse_StringExpr(Expr_parent);
		CST[Expr_id][2].push('child name: StringExpr, id : ' + (Expr_id + 1));
	}
	else if (tempDesc == ' (' || tempType == 'boolval'){
		parse_BooleanExpr(Expr_parent);
		CST[Expr_id][2].push('child name: BooleanExpr, id : ' + (Expr_id + 1));
		
	}
	else if (tempType == 'identifier' ) {
		parse_ID(Expr_parent);
		CST[Expr_id][2].push('child name: ID, id : ' + (Expr_id + 1));
		
	}
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function parse_IntExpr(parentArg){
	addBranchNode('IntExpr',parentArg);
	var IntExpr_id = tokenID - 1;
	var IntExpr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'digit'){
		matchSpecChars(tempDesc,parseCounter,IntExpr_parent);
		CST[IntExpr_id][2].push('child name: ' + tempDesc + ', id : ' + (IntExpr_id + 1));
		parseCounter = parseCounter + 1;
				
	}
	if (tempDesc == ' +'){
		parse_intop(IntExpr_parent);
		CST[IntExpr_id][2].push('child name: intop, id : ' + (IntExpr_id + 2));
		parse_Expr(IntExpr_parent);
		CST[IntExpr_id][2].push('child name: Expr, id : ' + (IntExpr_id + 3));
	}
	
	
}

//production StringExpr ::== " CharList "
function parse_StringExpr(parentArg){
	addBranchNode('StringExpr',parentArg);
	var StringExpr_id = tokenID - 1;
	var StringExpr_parent = CST[tokenID - 1][0];
	
	matchSpecChars(' "',parseCounter,StringExpr_parent);
	CST[StringExpr_id][2].push('child name: StringExpr, id : ' + (StringExpr_id + 1));
	parseCounter = parseCounter + 1;
	
	parse_CharList(StringExpr_parent);
	CST[StringExpr_id][2].push('child name: CharList, id : ' + (StringExpr_id + 2));
	
	matchSpecChars(' "',parseCounter,StringExpr_parent);
	CST[StringExpr_id][2].push('child name: ", id : ' + (StringExpr_id + 3));
	parseCounter = parseCounter + 1;
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function parse_BooleanExpr(parentArg){
	addBranchNode('BooleanExpr',parentArg);
	var BooleanExpr_id = tokenID - 1;
	var BooleanExpr_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' ('){
		matchSpecChars('(',parseCounter,BooleanExpr_parent);
		CST[BooleanExpr_id][2].push('child name: (, id : ' + (BooleanExpr_id + 1));
		parseCounter = parseCounter + 1;
		
		parse_Expr(BooleanExpr_parent);
		CST[BooleanExpr_id][2].push('child name: Expr, id : ' + (BooleanExpr_id + 2));
		
		parse_boolop(BooleanExpr_parent);
		CST[BooleanExpr_id][2].push('child name: BooleanExpr, id : ' + (BooleanExpr_id + 3));
		
		parse_Expr(BooleanExpr_parent);
		CST[BooleanExpr_id][2].push('child name: BooleanExpr, id : ' + (BooleanExpr_id + 4));
		
		
	}
	else{
		parse_boolval(BooleanExpr_parent);
		CST[BooleanExpr_id][2].push('child name: BoolVal, id : ' + (BooleanExpr_id + 1));
		
	}
	
	
}

//production Id ::== char

function parse_ID(parentArg){
	addBranchNode('ID',parentArg);
	var ID_id = tokenID - 1;
	var ID_parent = CST[tokenID - 1][0];
	
	parse_char(ID_parent);
	CST[ID_id][2].push('child name: char, id : ' + (ID_id + 1));
	
	
}

//production CharList ::== char CharList
//					  ::== space CharList
//					  ::== ε

function parse_CharList(parentArg){
	addBranchNode('CharList',parentArg);
	var CharList_id = tokenID - 1;
	var CharList_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempType == 'string' ){
		//parse_char(CharList_parent);
		//parse_CharList(CharList_parent);
	
		matchSpecChars(tempDesc,parseCounter,CharList_parent);
		CST[CharList_id][2].push('child name: ' + tempDesc + ', id : ' + (CharList_id + 1));
		parseCounter = parseCounter + 1;
	}
	
	
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function parse_type(parentArg){
	addBranchNode('type',parentArg);
	var type_id = tokenID - 1;
	var type_parent = CST[tokenID - 1][0];

	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' int'){
		matchSpecChars(' int',parseCounter,type_parent);
		CST[type_id][2].push('child name: type, id : ' + (type_id + 1));
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' string'){
		matchSpecChars(' string',parseCounter,type_parent);
		CST[type_id][2].push('child name: string, id : ' + (type_id + 1));
		parseCounter = parseCounter + 1;
	}
	else if (nextToken == ' boolean'){
		
		matchSpecChars(' boolean',parseCounter,type_parent);
		CST[type_id][2].push('child name: boolean, id : ' + (type_id + 1));
		parseCounter = parseCounter + 1;
	}
	
	
}

//production char ::== a | b | c ... z
function parse_char(parentArg){
	addBranchNode('char',parentArg);
	var char_id = tokenID - 1;
	var char_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter,char_parent);
	CST[char_id][2].push('child name: char, id : ' + (char_id + 1));
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
	var digit_id = tokenID - 1;
	var digit_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter,digit_parent);
	CST[digit_id][2].push('child name: ' + tempDesc + ', id : ' + (digit_id + 1));
	parseCounter = parseCounter + 1;
}

//production boolop ::== == | !=

function parse_boolop(parentArg){
	addBranchNode('boolop',parentArg);
	var boolop_id = tokenID - 1;
	var boolop_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' =='){
		matchSpecChars('==',parseCounter,boolop_parent);
		CST[boolop_id][2].push('child name:  ==, id : ' + (boolop_id + 1));
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' !='){
		matchSpecChars('!=',parseCounter,boolop_parent);
		CST[boolop_id][2].push('child name:  !=, id : ' + (boolop_id + 1));
		parseCounter = parseCounter + 1;
	}
	
}

//production boolval ::== false | true
function parse_boolval(parentArg){
	addBranchNode('boolval',parentArg);
	var boolval_id = tokenID - 1;
	var boolval_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	if (tempDesc == ' false'){
		matchSpecChars('false',parseCounter,boolval_parent);
		CST[boolval_id][2].push('child name:  false, id : ' + (boolval_id + 1));
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == 'true'){
		matchSpecChars('true',parseCounter,boolval_parent);
		CST[boolval_id][2].push('child name:  true, id : ' + (boolval_id + 1));
		parseCounter = parseCounter + 1;
	}
	
}

//production intop ::== +
function parse_intop(parentArg){
	addBranchNode('intop',parentArg);
	var intop_id = tokenID - 1;
	var intop_parent = CST[tokenID - 1][0];
	
	var tempDesc = tokenstream[parseCounter][0]; //check desc of token
	var tempType = tokenstream[parseCounter][1]; //check type of token
	matchSpecChars('+',parseCounter,intop_parent);
	CST[intop_id][2].push('child name:  +, id : ' + (intop_id + 1));
	parseCounter = parseCounter + 1;
	
}












