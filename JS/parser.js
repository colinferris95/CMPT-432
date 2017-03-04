// psuedo code of the parser
// Recursion in a nutshell ----- https://www.youtube.com/watch?v=N_hG70ENBkQ -----

//start parsing
function parser(){
	
	parse_Program();
	
}


//production Program ::== Block $

function parse_Program(){
	parse_Block();
	match('$');
	
}

//production Block ::== { StatementList }

function parse_Block(){
	match('{');
	parse_StatementList();
	match('}');
	
	
	
}


//production StatementList ::== Statement StatementList
//					       ::== e
function parse_StatementList(){
	if (nextToken == Statement){
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
	if (nextToken == print){
		parse_PrintStatement();
				
	}
	else if(nextToken == id){
		parse_AssignmentStatement();
		
	}
	else if (nextToken == type){
		parse_VarDecl();
		
	}
	else if (nextToken == while){
		parse_WhileStatement();
		
	}
	else if (nextToken == if){
		parse_IfStatement();
		
	}
	else if (nextToken == {){
		parse_Block();
		
	}
	
	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(){
	match('print');
	match('(');
	parse_Expr();
	match (')');
	
	
}

//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(){
	
	parse_ID();
	match('=');
	parse_Expr();
	
	
	
}

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












