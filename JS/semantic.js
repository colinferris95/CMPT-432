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
var outputAST =true;



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
		document.getElementById("tree").value += 'ERROR: token ' + tokenstreamCOPY[pos][0] + ' was not matched, expecting ' + token  + '\n';
		console.log('ERROR: token ' +token  + ' was not matched, expecting ' + tokenstreamCOPY[pos][0] ); 
		outputAST = false;
		
	}
	
}


function ASTparseStart(){
	document.getElementById("AStree").value = ' ';
	console.log(tokenstreamCOPY);
	ASTparser();
	
}


//start parsing
function ASTparser(){
	document.getElementById("AStree").value += "PARSER: parse()"+ '\n';
	initParseToken();
	ASTparse_Program();
	
}



function ASTparse_Program(){
	document.getElementById("tree").value += "PARSER: parse_Program()" + '\n';
	

	//CSTREE.addNode('program', 'branch');

	
	
	ASTparse_Block();
	
	
   	
	ASTmatchSpecChars('$',ASTparseCounter); // match EOP symbol after
	
	ASTREE.endChildren();
	
	ASTparseCounter = ASTparseCounter + 1;

	
	document.getElementById("AStree").value += "PARSER: Parsing complete" + '\n' + '\n';
	if (outputAST == false){
		alert('parse failed, not moving on to ast');
	}
	else{
	
	document.getElementById("AStree").value += ASTREE.toString();
	console.log(tokenstreamCOPY);

	}
	
	if (tokenstreamCOPY[ASTparseCounter] != undefined){
		 ASTtokenID = 0;
		 ASTREE = new Tree();
		 ASTparser();
		
	}
	else{
		document.getElementById("AStree").value += '\n';
		document.getElementById("AStree").value += 'PARSER: done parsing programs';
		ASTparseCounter =0;
		ASTlookAhead = ASTparseCounter + 1;
		ASTparentCounter = 0;
		ASTtokenID = 0;
		ASTREE = new Tree();
	}
	
	//print out cst
	
	
	
}


//production Block ::== { StatementList }

function ASTparse_Block(){
	document.getElementById("AStree").value += "PARSER: parse_Block()"+ '\n';
	
	

	ASTREE.addNode('block', 'branch');
	
	

	
	ASTmatchSpecChars('{',ASTparseCounter);
	ASTparseCounter = ASTparseCounter + 1;
	

		
	//ASTparse_StatementList(); 
	
	
	
	if (ASTparseCounter == 1){
			document.getElementById("AStree").value += "PARSER: parse_StatementList()" + '\n';
		//ASTREE.addNode('StatementList', 'branch');
		//ASTREE.endChildren();
	}
	
	
	
	ASTmatchSpecChars('}',ASTparseCounter);
	ASTREE.endChildren();
	ASTparseCounter = ASTparseCounter + 1;
	
	
	
	
}







