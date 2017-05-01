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
var CSTREE = new Tree();


	



// ex tokenstreamCOPY[lexemeCount][0]
function initParseToken(){
	
		parseEndTokenCount = tokenstreamCOPY.length - 1;
		nextToken = tokenstreamCOPY[lookAhead][0];
		nextTokenType = tokenstreamCOPY[lookAhead][1];
	
	
}



function matchSpecChars(token,pos){ //matches brackets, quotes, parens etc.


console.log('character compared from lexer array ' + tokenstreamCOPY[pos][0] + ' with current token ' + token);
	if (token == tokenstreamCOPY[pos][0]){		
		
		CSTREE.addNode(token, 'leaf');
	
	
	
		
		
	}
	else{
		document.getElementById("tree").value += 'ERROR: token ' + tokenstreamCOPY[pos][0] + ' was not matched, expecting ' + token  + '\n';
		console.log('ERROR: token ' +token  + ' was not matched, expecting ' + tokenstreamCOPY[pos][0] ); 
	
		
	}
	
}


function parseStart(){
	console.log(tokenstreamCOPY);
	document.getElementById("tree").value = ' ';
	parser();
	
}


//start parsing
function parser(){
	document.getElementById("tree").value += "PARSER: parse()"+ '\n';
	initParseToken();
	parse_Program();
	
}


//production Program ::== Block $

function parse_Program(){
	document.getElementById("tree").value += "PARSER: parse_Program()" + '\n';
	

	CSTREE.addNode('program', 'branch');

	
	
	parse_Block();
	
	
	/*
	{
	}
	$
	*/
   	
	matchSpecChars('$',parseCounter); // match EOP symbol after
	
	CSTREE.endChildren();
	
	parseCounter = parseCounter + 1;

	
	document.getElementById("tree").value += "PARSER: Parsing complete" + '\n' + '\n';
	
	
	document.getElementById("tree").value += CSTREE.toString();
	
	if (tokenstreamCOPY[parseCounter] != undefined){
		 tokenID = 0;
		 CSTREE = new Tree();
		 parser();
		
	}
	else{
		document.getElementById("tree").value += '\n';
		document.getElementById("tree").value += 'PARSER: done parsing programs';
		parseCounter =0;
		lookAhead = parseCounter + 1;
		parentCounter = 0;
		tokenID = 0;
		CSTREE = new Tree();
		ASTparseStart();
	}
	
	//print out cst
	
	
	
}


//production Block ::== { StatementList }

function parse_Block(){
	document.getElementById("tree").value += "PARSER: parse_Block()"+ '\n';
	
	

	CSTREE.addNode('block', 'branch');
	
	

	
	matchSpecChars('{',parseCounter);
	parseCounter = parseCounter + 1;
	

		
	parse_StatementList(); 
	
	
	
	if (parseCounter == 1){
			document.getElementById("tree").value += "PARSER: parse_StatementList()" + '\n';
		CSTREE.addNode('StatementList', 'branch');
		CSTREE.endChildren();
	}
	
	
	
	matchSpecChars('}',parseCounter);
	CSTREE.endChildren();
	parseCounter = parseCounter + 1;
	
	
	
	
}



//production StatementList ::== Statement StatementList
//					       ::== e
function parse_StatementList(){
	

	

	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token

	if (tempDesc == ' print' || tempType == 'identifier' || tempType == 'type' || tempDesc == ' while' || tempDesc == ' if' || tempDesc == '{' ){ //if next token is a statment
		document.getElementById("tree").value += "PARSER: parse_StatementList()" + '\n';
		CSTREE.addNode('StatementList', 'branch');
		
		
		parse_Statement(); 
	
		parse_StatementList();
		
		CSTREE.endChildren();
	
		
		
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
	document.getElementById("tree").value += "PARSER: parse_Statement()" + '\n';

	CSTREE.addNode('Statement', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	
	
	if (tempDesc == ' print'){
		parse_PrintStatement();
	

				
	}
	else if(tempType == 'identifier'){
		parseCounter = parseCounter + 1;
		
		var desc = tokenstreamCOPY[parseCounter][0];
		
		if (desc == ' ='){
			
		parseCounter = parseCounter - 1;
		
		parse_AssignmentStatement();
		}
	
		
	}
	else if (tempType == 'type'){
		
		parse_VarDecl();

		
	}
	else if (tempDesc == ' while'){
		parse_WhileStatement();

		
	}
	else if (tempDesc == ' if'){
		parse_IfStatement();

		
	}
	else if (tempDesc == '{'){
		parse_Block();

		
	}
	CSTREE.endChildren();

	
	
}

//Production PrintStatement ::== print ( Expr ) 
function parse_PrintStatement(){
	document.getElementById("tree").value += "PARSER: parse_PrintStatement()" + '\n';
	CSTREE.addNode('PrintStatment', 'branch');

	
	matchSpecChars(' print',parseCounter);
	
	parseCounter = parseCounter + 1;
	
	
	matchSpecChars('(',parseCounter);
	
	parseCounter = parseCounter + 1;
	
	
	parse_Expr(); 
	
	
	
	matchSpecChars (')',parseCounter);
	
	CSTREE.endChildren();

	parseCounter = parseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function parse_AssignmentStatement(){
	document.getElementById("tree").value += "PARSER: parse_AssignmentStatement()" + '\n';
	CSTREE.addNode('AssignmentStatement', 'branch');

	
	parse_ID();
	CSTREE.endChildren();
	CSTREE.endChildren();

	
	matchSpecChars(' =',parseCounter);

	parseCounter = parseCounter + 1;
	
	parse_Expr();

	CSTREE.endChildren();
	
	
}


//Production VarDecl ::== type Id
function parse_VarDecl(){
	document.getElementById("tree").value += "PARSER: parse_VarDecl()" + '\n';
	CSTREE.addNode('VarDecl', 'branch');

	
	parse_type();
	CSTREE.endChildren();


	
	parse_ID();
	CSTREE.endChildren();
	CSTREE.endChildren();
	CSTREE.endChildren();
	
}

//Production WhileStatement ::== while BooleanExpr Block
function parse_WhileStatement(){
	document.getElementById("tree").value += "PARSER: parse_WhileStatement()" + '\n';
	CSTREE.addNode('WhileStatement', 'branch');

	
	matchSpecChars(' while',parseCounter);
	
	parseCounter = parseCounter + 1;
	
	parse_BooleanExpr();
	CSTREE.endChildren();

	
	parse_Block();
	
	CSTREE.endChildren();
}

//production IfStatement ::== if BooleanExpr Block
function parse_IfStatement(){
	document.getElementById("tree").value += "PARSER: parse_IfStatement()" + '\n';
	CSTREE.addNode('IfStatement', 'branch');

	
	matchSpecChars(' if',parseCounter);
	
	parseCounter = parseCounter + 1;
	
	parse_BooleanExpr();
	CSTREE.endChildren();
	
	parse_Block();

	
	CSTREE.endChildren();
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function parse_Expr(){
	document.getElementById("tree").value += "PARSER: parse_Expr()" + '\n';
	CSTREE.addNode('Expr', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if(tempType == 'digit'){
		parse_IntExpr();
		CSTREE.endChildren();
		
		
	
		
	}
	else if (tempDesc == ' "'){
		parse_StringExpr();
		CSTREE.endChildren();
	}
	else if (tempDesc == '(' || tempType == 'boolval'){
		parse_BooleanExpr();
		CSTREE.endChildren();
	
		
	}
	else if (tempType == 'identifier' ) {
		parse_ID();
		CSTREE.endChildren();
		CSTREE.endChildren();
		
	
		
	}
	
		
	CSTREE.endChildren();	
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function parse_IntExpr(){
	document.getElementById("tree").value += "PARSER: parse_IntExpr()" + '\n';
	CSTREE.addNode('IntExpr', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempType == 'digit'){
		matchSpecChars(tempDesc,parseCounter);
		
		parseCounter = parseCounter + 1;
		
			if (tokenstreamCOPY[parseCounter][0] == '+'){
			document.getElementById("tree").value +=  '\n';
			parse_intop();
	
			parse_Expr();
	
		}
				
	}
	
	
	
}

//production StringExpr ::== " CharList "
function parse_StringExpr(){
	document.getElementById("tree").value += "PARSER: parse_StringExpr()" + '\n';
	CSTREE.addNode('StringExpr', 'branch');
	
	matchSpecChars(' "',parseCounter);
	
	parseCounter = parseCounter + 1;
	
	parse_CharList();

	
	matchSpecChars(' "',parseCounter);
	
	
	
	parseCounter = parseCounter + 1;
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function parse_BooleanExpr(){
	alert('booleanexpr');
	document.getElementById("tree").value += "PARSER: parse_BooleanExpr()" + '\n';
	

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempDesc == '('){
		matchSpecChars('(',parseCounter);
		
		CSTREE.addNode('BooleanExpr', 'branch');
		
		parseCounter = parseCounter + 1;
		
		parse_Expr();
	
		
		parse_boolop();
	
		
		parse_Expr();
	
		matchSpecChars(')',parseCounter);
		parseCounter = parseCounter + 1;
		
	}
	else{
		parse_boolval();
	
	}

	
}

//production Id ::== char

function parse_ID(){
	document.getElementById("tree").value += "PARSER: parse_ID()" + '\n';
	CSTREE.addNode('Id', 'branch');

	
	parse_char();
	
	
	
}

//production CharList ::== char CharList
//					  ::== space CharList
//					  ::== ε

function parse_CharList(){
	document.getElementById("tree").value += "PARSER: parse_CharList()" + '\n';
	CSTREE.addNode('CharList', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempType == 'string' ){
		//parse_char(CharList_parent);
		//parse_CharList(CharList_parent);
	
		matchSpecChars(tempDesc,parseCounter);
		CSTREE.endChildren();
		parseCounter = parseCounter + 1;
	}
	
	
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function parse_type(){
	document.getElementById("tree").value += "PARSER: parse_type()" + '\n';
	CSTREE.addNode('Type', 'branch');;


	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempDesc == ' int'){
		matchSpecChars(' int',parseCounter);
	
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' string'){
		matchSpecChars(' string',parseCounter);

		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' boolean'){
		
		matchSpecChars(' boolean',parseCounter);
	
		parseCounter = parseCounter + 1;
	}
	
	
}

//production char ::== a | b | c ... z
function parse_char(){
	document.getElementById("tree").value += "PARSER: parse_char()" + '\n';
	CSTREE.addNode('char', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter);
	
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
	document.getElementById("tree").value += "PARSER: parse_digit()" + '\n';
	CSTREE.addNode('digit', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	matchSpecChars(tempDesc,parseCounter);
	CSTREE.endChildren();
	parseCounter = parseCounter + 1;
}

//production boolop ::== == | !=

function parse_boolop(){
	document.getElementById("tree").value += "PARSER: parse_boolop()" + '\n';
	CSTREE.addNode('boolop', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempDesc == ' =='){
		matchSpecChars(' ==',parseCounter);
		
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' !='){
		matchSpecChars(' !=',parseCounter);
		
		parseCounter = parseCounter + 1;
	}
	CSTREE.endChildren();
}

//production boolval ::== false | true
function parse_boolval(){
	document.getElementById("tree").value += "PARSER: parse_boolval()" + '\n';
	CSTREE.addNode('boolval', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	if (tempDesc == ' false'){
		matchSpecChars(' false',parseCounter);
		CSTREE.endChildren();
		parseCounter = parseCounter + 1;
	}
	else if (tempDesc == ' true'){
		matchSpecChars(' true',parseCounter);
		CSTREE.endChildren();
		parseCounter = parseCounter + 1;
	}
	CSTREE.endChildren();
}

//production intop ::== +
function parse_intop(){
	document.getElementById("tree").value += "PARSER: parse_intop()" + '\n';
	CSTREE.addNode('intop', 'branch');

	
	var tempDesc = tokenstreamCOPY[parseCounter][0]; //check desc of token
	var tempType = tokenstreamCOPY[parseCounter][1]; //check type of token
	matchSpecChars('+',parseCounter);
	CSTREE.endChildren();
	parseCounter = parseCounter + 1;
	
}


//-----------------------------------------
// treeDemo.js
//
// By Alan G. Labouseur, based on the 2009
// work by Michael Ardizzone and Tim Smith.
//-----------------------------------------

function Tree() {
    // ----------
    // Attributes
    // ----------
    
    this.root = null;  // Note the NULL root node of this tree.
    this.cur = {};     // Note the EMPTY current node of the tree we're building.


    // -- ------- --
    // -- Methods --
    // -- ------- --

    // Add a node: kind in {branch, leaf}.
    this.addNode = function(name, kind) {
        // Construct the node object.
        var node = { name: name,
                     children: [],
                     parent: {}
                   };

        // Check to see if it needs to be the root node.
        if ( (this.root == null) || (!this.root) )
        {
            // We are the root node.
            this.root = node;
        }
        else
        {
            // We are the children.
            // Make our parent the CURrent node...
            node.parent = this.cur;
            // ... and add ourselves (via the unfrotunately-named
            // "push" function) to the children array of the current node.
            this.cur.children.push(node);
        }
        // If we are an interior/branch node, then...
        if (kind == "branch")
        {
            // ... update the CURrent node pointer to ourselves.
            this.cur = node;
        }
    };

    // Note that we're done with this branch of the tree...
    this.endChildren = function() {
        // ... by moving "up" to our parent node (if possible).
        if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
        {
            this.cur = this.cur.parent;
        }
        else
        {
            // TODO: Some sort of error logging.
            // This really should not happen, but it will, of course.
        }
    };

    // Return a string representation of the tree.
    this.toString = function() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
                traversalResult += "<" + node.name + "> \n";
                // .. recursively expand them.
                for (var i = 0; i < node.children.length; i++)
                {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    };
	
	
}













