// Recursion in a nutshell ----- https://www.youtube.com/watch?v=N_hG70ENBkQ -----

var AST = [];
var letter = /[a-z]/; //alpha characters
var acceptableTokens = /[a-z]|[0-9]|[(]|[)]|[{]|[}]|["]/
var ASTparseEndTokenCount; //start processing tokens at the last token, start from the right
var ASTtokenDesc = 0;
var ASTtokenType = 1;
var ASTtokenLineNum = 2;
var ASTparseCounter =0;
var ASTlookAhead = ASTparseCounter + 1;
var ASTnextToken; 
var nextASTtokenType;
var ASTparentCounter = 0;
var ASTtokenID = 0;
var ASTREE = new Tree();


	



// ex tokenstreamCOPY[lexemeCount][0]
function ASTinitParseToken(){
	
		ASTparseEndTokenCount = tokenstreamCOPY.length - 1;
		ASTnextToken = tokenstreamCOPY[ASTlookAhead][0];
		nextASTtokenType = tokenstreamCOPY[ASTlookAhead][1];
	
	
}



function ASTmatchSpecChars(token,pos){ //matches brackets, quotes, parens etc.


console.log('character compared from lexer array ' + tokenstreamCOPY[pos][0] + ' with current token ' + token);
	if (token == tokenstreamCOPY[pos][0]){		
		
		ASTREE.addNode(token, 'leaf');
	
	
	
		
		
	}
	else{
		document.getElementById("AStree").value += 'ERROR: token ' + tokenstreamCOPY[pos][0] + ' was not matched, expecting ' + token  + '\n';
		console.log('ERROR: token ' +token  + ' was not matched, expecting ' + tokenstreamCOPY[pos][0] ); 
	
		
	}
	
}


function ASTparseStart(){
	document.getElementById("AStree").value = ' ';
	ASTparser();
	
}


//start parsing
function ASTparser(){
	document.getElementById("AStree").value += "ASTparser: parse()"+ '\n';
	ASTinitParseToken();
	ASTparse_Program();
	
}


//production Program ::== Block $

function ASTparse_Program(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_Program()" + '\n';
	

	//ASTREE.addNode('program', 'branch');

	
	
	ASTparse_Block();
	
	
   	
	//ASTmatchSpecChars('$',ASTparseCounter); // match EOP symbol after
	
	ASTREE.endChildren();
	
	ASTparseCounter = ASTparseCounter + 1;

	
	document.getElementById("AStree").value += "ASTparser: Parsing complete" + '\n' + '\n';
	
	
	document.getElementById("AStree").value += ASTREE.toString();
	
	if (tokenstreamCOPY[ASTparseCounter] != undefined){
		symstart();
		 ASTtokenID = 0;
		 ASTREE = new Tree();
		 ASTparser();
		
	}
	else{
		document.getElementById("AStree").value += '\n';
		document.getElementById("AStree").value += 'ASTparser: done parsing programs';
		symstart();
		ASTparseCounter =0;
		ASTlookAhead = ASTparseCounter + 1;
		ASTparentCounter = 0;
		ASTtokenID = 0;
		ASTREE = new Tree();
		
	}
	
	//print out AST
	
	
	
}


//production Block ::== { StatementList }

function ASTparse_Block(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_Block()"+ '\n';
	
	

	ASTREE.addNode('block', 'branch');
	
	

	
	//ASTmatchSpecChars('{',ASTparseCounter);
	ASTparseCounter = ASTparseCounter + 1;
	

		
	ASTparse_StatementList(); 
	
	
	
	if (ASTparseCounter == 1){
			document.getElementById("AStree").value += "ASTparser: ASTASTparse_StatementList()" + '\n';
		//ASTREE.addNode('StatementList', 'branch');
		//ASTREE.endChildren();
	}
	
	
	
	//ASTmatchSpecChars('}',ASTparseCounter);
	ASTREE.endChildren();
	ASTparseCounter = ASTparseCounter + 1;
	
	
	
	
}



//production StatementList ::== Statement StatementList
//					       ::== e
function ASTparse_StatementList(){
	

	

	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token

	if (ASTtempDesc == ' print' || ASTtempType == 'identifier' || ASTtempType == 'type' || ASTtempDesc == ' while' || ASTtempDesc == ' if' || ASTtempDesc == '{' ){ //if next token is a statment
		document.getElementById("AStree").value += "ASTparser: ASTASTparse_StatementList()" + '\n';
		//ASTREE.addNode('StatementList', 'branch');
		
		
		ASTparse_Statement(); 
	
		ASTparse_StatementList();
		
		ASTREE.endChildren();
	
		
		
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

function ASTparse_Statement(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_Statement()" + '\n';

	//ASTREE.addNode('Statement', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	
	
	if (ASTtempDesc == ' print'){
		ASTparse_PrintStatement();
	

				
	}
	else if(ASTtempType == 'identifier'){
		ASTparseCounter = ASTparseCounter + 1;
		
		var ASTdesc = tokenstreamCOPY[ASTparseCounter][0];
		
		if (ASTdesc == ' ='){
			
		ASTparseCounter = ASTparseCounter - 1;
		
		ASTparse_AssignmentStatement();
		}
	
		
	}
	else if (ASTtempType == 'type'){
		
		ASTparse_VarDecl();

		
	}
	else if (ASTtempDesc == ' while'){
		ASTparse_WhileStatement();

		
	}
	else if (ASTtempDesc == ' if'){
		ASTparse_IfStatement();

		
	}
	else if (ASTtempDesc == '{'){
		ASTparse_Block();

		
	}
	//ASTREE.endChildren();

	
	
}

//Production PrintStatement ::== print ( Expr ) 
function ASTparse_PrintStatement(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_PrintStatement()" + '\n';
	ASTREE.addNode('PrintStatment', 'branch');

	
	//ASTmatchSpecChars(' print',ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	
	//ASTmatchSpecChars('(',ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	
	ASTparse_Expr(); 
	
	
	
	//ASTmatchSpecChars (')',ASTparseCounter);
	
	ASTREE.endChildren();

	ASTparseCounter = ASTparseCounter + 1;
	
	
}


//Production AssignmentStatement ::== Id = Expr
function ASTparse_AssignmentStatement(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_AssignmentStatement()" + '\n';
	ASTREE.addNode('AssignmentStatement', 'branch');

	
	ASTparse_ID();
	//ASTREE.endChildren();
	//ASTREE.endChildren();

	
	//ASTmatchSpecChars(' =',ASTparseCounter);

	ASTparseCounter = ASTparseCounter + 1;
	
	ASTparse_Expr();

	ASTREE.endChildren();
	
	
}


//Production VarDecl ::== type Id
function ASTparse_VarDecl(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_VarDecl()" + '\n';
	ASTREE.addNode('VarDecl', 'branch');

	
	ASTparse_type();
	//ASTREE.endChildren();


	
	ASTparse_ID();
	ASTREE.endChildren();
	ASTREE.endChildren();
	ASTREE.endChildren();
	
}

//Production WhileStatement ::== while BooleanExpr Block
function ASTparse_WhileStatement(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_WhileStatement()" + '\n';
	ASTREE.addNode('WhileStatement', 'branch');

	
	//ASTmatchSpecChars(' while',ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	ASTparse_BooleanExpr();
	ASTREE.endChildren();

	
	ASTparse_Block();
	
	ASTREE.endChildren();
}

//production IfStatement ::== if BooleanExpr Block
function ASTparse_IfStatement(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_IfStatement()" + '\n';
	ASTREE.addNode('IfStatement', 'branch');

	
	//ASTmatchSpecChars(' if',ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	ASTparse_BooleanExpr();
	ASTREE.endChildren();
	
	ASTparse_Block();

	
	ASTREE.endChildren();
}

//Expr ::== IntExpr
//     ::== StringExpr
//	   ::== BooleanExpr
//     ::== Id

function ASTparse_Expr(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_Expr()" + '\n';
	//ASTREE.addNode('Expr', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if(ASTtempType == 'digit'){
		ASTparse_IntExpr();
		ASTREE.endChildren();
		
		
	
		
	}
	else if (ASTtempDesc == ' "'){
		ASTparse_StringExpr();
		ASTREE.endChildren();
	}
	else if (ASTtempDesc == ' (' || ASTtempType == 'boolval'){
		ASTparse_BooleanExpr();
		ASTREE.endChildren();
	
		
	}
	else if (ASTtempType == 'identifier' ) {
		ASTparse_ID();
		//ASTREE.endChildren();
		//ASTREE.endChildren();
		
	
		
	}
	
		
	//ASTREE.endChildren();	
	
	
}

//production IntExpr ::== digit intop Expr
//					 ::== digit
function ASTparse_IntExpr(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_IntExpr()" + '\n';
	//ASTREE.addNode('IntExpr', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempType == 'digit'){
		ASTmatchSpecChars(ASTtempDesc,ASTparseCounter);
		
		ASTparseCounter = ASTparseCounter + 1;
		
			if (tokenstreamCOPY[ASTparseCounter][0] == '+'){
			document.getElementById("AStree").value +=  '\n';
			ASTparse_intop();
	
			ASTparse_Expr();
	
		}
				
	}
	
	
	
}

//production StringExpr ::== " CharList "
function ASTparse_StringExpr(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_StringExpr()" + '\n';
	//ASTREE.addNode('StringExpr', 'branch');
	
	//ASTmatchSpecChars(' "',ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	ASTASTparse_charList();

	
	//ASTmatchSpecChars(' "',ASTparseCounter);
	
	
	
	ASTparseCounter = ASTparseCounter + 1;
	
}

//production BooleanExpr ::== ( Expr boolop Expr )
//						 ::== boolval

function ASTparse_BooleanExpr(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_BooleanExpr()" + '\n';
	

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempDesc == '('){
		//ASTmatchSpecChars('(',ASTparseCounter);
		
		//ASTREE.addNode('BooleanExpr', 'branch');
		
		ASTparseCounter = ASTparseCounter + 2;
		
		ASTparse_boolop();
		
		ASTparseCounter = ASTparseCounter - 2;
		
		ASTparse_Expr();
	
		
		
		ASTparseCounter = ASTparseCounter + 1;
		
		ASTparse_Expr();
	
		//ASTmatchSpecChars(')',ASTparseCounter);
		ASTparseCounter = ASTparseCounter + 1;
		
	}
	else{
		ASTparse_boolval();
	
	}

	
}

//production Id ::== char

function ASTparse_ID(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_ID()" + '\n';
	//ASTREE.addNode('Id', 'branch');

	
	ASTparse_char();
	
	
	
}

//production CharList ::== char CharList
//					  ::== space CharList
//					  ::== ε

function ASTASTparse_charList(){
	document.getElementById("AStree").value += "ASTparser: ASTASTparse_charList()" + '\n';
	//ASTREE.addNode('CharList', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempType == 'string' ){
		//ASTparse_char(CharList_parent);
		//ASTASTparse_charList(CharList_parent);
	
		ASTmatchSpecChars(ASTtempDesc,ASTparseCounter);
		ASTREE.endChildren();
		ASTparseCounter = ASTparseCounter + 1;
	}
	
	
	
	else{
		// e production
	}
	
	
}

//production type ::== int | string | boolean

function ASTparse_type(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_type()" + '\n';
	//ASTREE.addNode('Type', 'branch');;


	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempDesc == ' int'){
		ASTmatchSpecChars(' int',ASTparseCounter);
	
		ASTparseCounter = ASTparseCounter + 1;
	}
	else if (ASTtempDesc == ' string'){
		ASTmatchSpecChars(' string',ASTparseCounter);

		ASTparseCounter = ASTparseCounter + 1;
	}
	else if (ASTnextToken == ' boolean'){
		
		ASTmatchSpecChars(' boolean',ASTparseCounter);
	
		ASTparseCounter = ASTparseCounter + 1;
	}
	
	
}

//production char ::== a | b | c ... z
function ASTparse_char(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_char()" + '\n';
	//ASTREE.addNode('char', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	ASTmatchSpecChars(ASTtempDesc,ASTparseCounter);
	
	ASTparseCounter = ASTparseCounter + 1;
	
	
}

//production space ::== the space character
/*
function parse_space(){
	match(space);
	
}
*/

//production digit ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
function ASTparse_digit(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_digit()" + '\n';
	ASTREE.addNode('digit', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	ASTmatchSpecChars(ASTtempDesc,ASTparseCounter);
	ASTREE.endChildren();
	ASTparseCounter = ASTparseCounter + 1;
}

//production boolop ::== == | !=

function ASTparse_boolop(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_boolop()" + '\n';
	//ASTREE.addNode('boolop', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempDesc == ' =='){
		//ASTmatchSpecChars(' ==',ASTparseCounter);
		ASTREE.addNode('isEq', 'branch');
		
		ASTparseCounter = ASTparseCounter + 1;
	}
	else if (ASTtempDesc == ' !='){
		//ASTmatchSpecChars(' !=',ASTparseCounter);
		ASTREE.addNode('notEq', 'branch');
		
		ASTparseCounter = ASTparseCounter + 1;
	}
	//ASTREE.endChildren();
}

//production boolval ::== false | true
function ASTparse_boolval(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_boolval()" + '\n';
	//ASTREE.addNode('boolval', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	if (ASTtempDesc == ' false'){
		ASTREE.addNode('boolvalfalse','leaf');
		ASTREE.endChildren();
		ASTparseCounter = ASTparseCounter + 1;
	}
	else if (ASTtempDesc == ' true'){
		ASTREE.addNode('boolvaltrue','leaf');
		ASTREE.endChildren();
		ASTparseCounter = ASTparseCounter + 1;
	}
	//ASTREE.endChildren();
}

//production intop ::== +
function ASTparse_intop(){
	document.getElementById("AStree").value += "ASTparser: ASTparse_intop()" + '\n';
	ASTREE.addNode('intop', 'branch');

	
	var ASTtempDesc = tokenstreamCOPY[ASTparseCounter][0]; //check desc of token
	var ASTtempType = tokenstreamCOPY[ASTparseCounter][1]; //check type of token
	ASTmatchSpecChars('+',ASTparseCounter);
	//ASTREE.endChildren();
	ASTparseCounter = ASTparseCounter + 1;
	
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
	
	this.getNodes = function() {
        // Initialize the result string.
        var traversalResult = [];
		x = 0

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
           

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ... note the leaf node.
                traversalResult[x] = node.name ;
				x++;
               // traversalResult += "\n";
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
                traversalResult[x] = node.name ;
				x++;
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













