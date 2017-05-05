/*
	switch(node){
		case 'block':
			alert('symtab.openScope()');
		case 'VarDecl':
			alert('symtab.enterSymbol(node.name,node.type) var decl');
		default:
			if ( (node).search(letter) != -1){
				alert('symtab.enterSymbol(node.name,node.type) default');
			}
	
	<script type="text/javascript">
    var typesHash = new Hashtable();

    typesHash.put("A string", "string");
    typesHash.put(1, "number");

    var o = {};
    typesHash.put(o, "object");

    alert( typesHash.get(o) ); // "object"
</script>
	
		
	}
	*/
	
// code from crafting a compiler 8.1

/*
procedure BuildSymbolTable()
	call processNode(ASTroot)
end

procedure processNode(node)
	switch(KIND(node))
		case Block
			call symtab.openScope()
		case Dcl
			call symtab.enterSymbol(node.name,node.type)
		case Ref
			sym symtab.retrieveSymbol(node.name)
			if sym = null
			then call error(undeclared symbol, sym)
	foreach c in node.getchildren() do call processNode(c)
	if kind(node) = Block
	then 
		call symtab.closeScope()
end
*/

// code from 2.7 dragon
/*
package symbols
import java.util*;
public class Env{
	private hashtable table;
	protected env prev;
	
	public Env(Env p){
		table = new Hashtable(); prev = package
	}
	
	public void put (String s){
		for (Env e = thisl e != null; e = e.prev){
			Symbol found = (Symbol)(e.table.get(s));
			if ( found != null ) return found;
		}
		return null;
	}
}

*/
//symbol table

//ASTREE.root.name

var letter = /[a-z]/;
var digit = /[0-9]/
var table = new symbolTable();
var QUOT = /["]/;

function symstart(){ //called from AST.js
console.log("this is the AST from AST.js " + ASTREE.getNodes());
processNode();
}

	
	



function processNode(){ //start processing the tree nodes from the AST
	
	for (i = 0; i < ASTREE.getNodes().length; i++){ //iterate through each node

	
	
	if (ASTREE.getNodes()[i] == 'block'){ //if the node is a block, open a new scope
		table.openScope();
		
	}
	else if(ASTREE.getNodes()[i] == 'leaveScope'){
		table.closeScope();
		
	}
	else if (ASTREE.getNodes()[i] == 'VarDecl'){ //if a variable is being decalred, enter the next two nodes into the symbol table
	
		i++;
	
		var type = ASTREE.getNodes()[i]; //type of variable, int string etc.
		i++;
	
		var name = ASTREE.getNodes()[i]; //name of variable
		
		table.enterSymbol(type,name); //enter the values into the table
	
	}
	else if (ASTREE.getNodes()[i] == 'AssignmentStatement'){ 
	
		var idtoId;
		var id2Type ;
		
		i++;
		var id1 = ASTREE.getNodes()[i]; //get the first half the assignment//check to make the sure the symbol is decalred
		var id1Type = table.retrieveSymbol(id1); //returns the type for type check
		//alert(id1Type); //
		i++;
		var id2 = ASTREE.getNodes()[i]; //get the second half of the assignment
		
		if (id2.search(QUOT) != -1){ //is a string
			id2Type = "string";
			//alert("assign to string");
			idtoId = false;
		}
		else if (id2 == 'boolvaltrue' || id == 'boolvalfalse'){ //is true/false
			id2Type = "boolval";
			//alert("assign to true/false");
			idtoId = false;
		}
		else if (id2.search(digit) != -1){ //is a number
			id2Type = "digit";
			//alert("assign to digit");
			idtoId = false;
			
		}
		
		else if (id2 =='isEq' ){
			
			var part1 = ASTREE.getNodes()[i+1];
			var part2 = ASTREE.getNodes()[i+2];
			//alert('part1' + part1);
			//alert('part2' + part2);
			if (part2 == 'isEq'){ //workaround for boolean hell
				var temp1 = ASTREE.getNodes()[i+2];
				var temp2 = ASTREE.getNodes()[i+3];
				table.typeCheck(temp1,temp2,idtoId);
				part2 = 'boolvaltrue';
			}
			
			table.typeCheck(part1,part2,idtoId);
			id2Type = 'boolval';
			idtoId = false;
			
			
			
			
			
		}
		else if (id2 =='notEq' ){
			
			var part1 = ASTREE.getNodes()[i+1];
			var part2 = ASTREE.getNodes()[i+2];
			//alert('part1' + part1);
			//alert('part2' + part2);
			if (part2 == 'isEq'){ //workaround for boolean hell
				var temp1 = ASTREE.getNodes()[i+2];
				var temp2 = ASTREE.getNodes()[i+3];
				table.typeCheck(temp1,temp2,idtoId);
				part2 = 'boolvaltrue';
			}
			
			table.typeCheck(part1,part2,idtoId);
			id2Type = 'boolval';
			idtoId = false;
			
			
			
			
			
		}
		else{
			//alert("assign to another id");
		    id2Type = table.retrieveSymbol(id2); //is another id
			//alert(id2Type);
			idtoId = true;
		}
		
		table.typeCheck(id1Type,id2Type,idtoId); //run the type check
	
	}
	else if ( (ASTREE.getNodes()[i]).search(letter) != -1 && ((ASTREE.getNodes()[i]).length) <= 2){ //check for 1 letter symbols, ref
		var name = ASTREE.getNodes()[i];
		
		table.retrieveSymbol(name); //make sure the symbol is in the table
	}
	else{
		
	
		
	}
	

	}
	table.outputTable(); //display the symbol table
	codeGenStart();
	table = new symbolTable(); //clear the table for the next program
}





function symbolTable(){
	var symtable = []; //initalize the symbol table
	var scopePointer = -1; //start the scope pointer (at -1 so the first scope is 0)
	var i = 0;
	var addSymbol;
	var semanticSucess = true;
	
	this.openScope = function(){
		scopePointer++; //declare a new scope
		document.getElementById("AStree").value += "entering scope" + scopePointer + "\n";
		//verbose
			
	}
	this.closeScope = function(){
		scopePointer--;
		
	}
	
	this.enterSymbol = function (type,name){
	   //alert('hey look' + type);
	   
		if (symtable.length == 0){ //for when the symbol table is empty
			 symtable.push([type,name,scopePointer]);
			 document.getElementById("AStree").value += "Adding symbol " + name + " with type " + type + " in scope " + scopePointer + "\n";
				i++
				console.log(symtable);
			
		}
		else{
	   
	   
	   for (w = 0; w < symtable.length; w++){
		
		   if (symtable[w][1] == name && symtable[w][2] == scopePointer){ //if the symbol is declared in the current scope
			   document.getElementById("AStree").value += "ERROR trying to declare a symbol used in this scope";
			   addSymbol = false;
			   semanticSucess = false;
			   
		   }
		   
		   else{
			   addSymbol = true;
		
		   }
		   
	   
	   }
	   
	   if(addSymbol){
	   symtable.push([type,name,scopePointer]); //add symbol to the symbol table
	    document.getElementById("AStree").value += "Adding symbol " + name + " with type " + type + " in scope " + scopePointer + "\n";
				i++
				console.log(symtable);
	   }
	   
	   
	}
	
	
		
}
	
	this.retrieveSymbol = function(name){
		var symbolRetrieved = false;
			if (symtable.length == 0){ //if the symbol table is empty, then the symbol is certainly not declared
			 
			 document.getElementById("AStree").value += 'symbol has not been declared, ERROR'
			 semanticSucess = false;
			
		}
		
	
		
		for (l = symtable.length - 1; l >= 0 ; l--){
			for (z = scopePointer; z >= 0; z--){
			//alert("scope " + symtable[l][2]);
			//alert("name " + symtable[l][1]);
			if (symtable[l][2] == z && symtable[l][1] == name){ //check current scope
				document.getElementById("AStree").value += 'Retrieved symbol ' + name + ' from scope ' + z + '\n';
				symbolRetrieved = true;
				var idType = symtable[l][0];
				return idType;
				break;
				
			}
			
			
				
				
			
			
			/*
			else if (symtable[l][2] == (scopePointer - 1) && symtable[l][1] == name){ //check parent scope(s)
				document.getElementById("AStree").value += 'Retrieved symbol ' + name + ' from scope ' + scopePointer;
				symbolRetrieved = true;
				break;
				
			}
			*/
			
			}
			
		}
		
		if (symbolRetrieved == false){
			document.getElementById("AStree").value += ' The symbol' + name + ' has not been declared, ERROR' + '\n';
			semanticSucess = false;
			
		}
		
	}
	
	this.outputTable = function(name){
		
		if (semanticSucess){
			document.getElementById("AStree").value +=' \n' + 'Name  Type  Scope ';
		for (x = 0; x < symtable.length; x++){
			document.getElementById("AStree").value += ' \n';
			document.getElementById("AStree").value += ' ' + symtable[x][1];
			document.getElementById("AStree").value += '        ' + symtable[x][0];
			document.getElementById("AStree").value += '        ' + symtable[x][2];
			document.getElementById("AStree").value += ' \n';
			document.getElementById("AStree").value += ' \n';
			
			
		}
		}
		else{
			document.getElementById("AStree").value += 'Errors in semantic analysis, table not produced';
		}
		
		
	}
	
	
	this.typeCheck = function(id1Type,id2Type,idtoId){
		
		document.getElementById("AStree").value += 'Checking assignment of ' + id1Type + ' and ' + id2Type + '\n';
		
		if ( idtoId){
			
			if(id1Type != id2Type){
				document.getElementById("AStree").value += "ERROR type mismatch" + '\n';
				semanticSucess = false;
				
			}
			
			else{
				
				document.getElementById("AStree").value += "types match" + '\n';
			}
			
			
		}
		else{
			
			if (id1Type == ' int' && id2Type != 'digit'){
					document.getElementById("AStree").value += ' error type mismatch int' + '\n';
					semanticSucess = false;
					
				}
				
			if (id1Type == ' string' && id2Type != 'string'){
				document.getElementById("AStree").value += ' error type mismatch string' + '\n';
				semanticSucess = false;
				}
				
			if (id1Type == ' boolean'  && id2Type != 'boolval'){
				document.getElementById("AStree").value += ' error type mismatch boolean' + '\n';
				semanticSucess = false;


					
					
				}
			if (id1Type == 'boolval'  && id2Type != 'boolval'){
				document.getElementById("AStree").value += ' error type mismatch boolean' + '\n';
				semanticSucess = false;


					
					
				}
				//alert(id1Type);
				//alert(id2Type);
				
			if (id1Type =='boolvaltrue'){
			if ( id1Type =='boolvaltrue' && id2Type == 'boolvaltrue'  ){
				

					
					
				}
			else if (id2Type == 'boolvalfalse'){
					

					
				}
				else{
					document.getElementById("AStree").value += ' error type mismatch boolval' + '\n';
				semanticSucess = false;
				}
				
			}
			if (id1Type =='boolvalfalse'){
				
			if ( id1Type =='boolvalfalse' && id2Type == 'boolvaltrue'  ){
				

					
					
				}
			else if (id2Type == 'boolvalfalse'){
					

					
				}
				else{
					document.getElementById("AStree").value += ' error type mismatch boolval' + '\n';
				semanticSucess = false;
				}
				
		
			
			
				
			}
			
			
			
		}
		
		
		/*
		for (s = 0; s < symtable.length; s++){
			if (symtable[s][1] == id1 && symtable[s][2] == scopePointer){ //looking for symbols in scope
				var id1Type = symtable[s][0];
				
				
				if (id1Type == ' int' && id2.search(digit) == -1){
					document.getElementById("AStree").value += ' error type mismatch int';
					
				}
				if (id1Type == ' string' && id2.search(letter) == -1){
					document.getElementById("AStree").value += ' error type mismatch string';
					
				}
				if (id1Type == ' boolean'  ){

					if (id2 == 'boolvalfalse'  ){
						
					}
					else if (id2 == 'boolvaltrue'  ){



					}
					else{
						document.getElementById("AStree").value += ' error type mismatch boolean';

					}


					
					
				}

			
				
			}
			else{
				//document.getElementById("AStree").value += 'error id not in scope or not declared';
			}
			
		}
		*/
		
		
		
	}
	
	
	
}
			