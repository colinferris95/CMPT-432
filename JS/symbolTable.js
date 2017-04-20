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

function symstart(){ //called from AST.js
console.log("this is the AST from AST.js " + ASTREE.getNodes());
processNode();
}

	
	



function processNode(){ //start processing the tree nodes from the AST
	
	for (i = 0; i < ASTREE.getNodes().length; i++){ //iterate through each node

	
	
	if (ASTREE.getNodes()[i] == 'block'){ //if the node is a block, open a new scope
		table.openScope();
	}
	else if (ASTREE.getNodes()[i] == 'VarDecl'){ //if a variable is being decalred, enter the next two nodes into the symbol table
	
		i++;
	
		var type = ASTREE.getNodes()[i]; //type of variable, int string etc.
		i++;
	
		var name = ASTREE.getNodes()[i]; //name of variable
		
		table.enterSymbol(type,name); //enter the values into the table
	
	}
	else if (ASTREE.getNodes()[i] == 'AssignmentStatement'){ 
		
		
		i++;
		var id1 = ASTREE.getNodes()[i]; //get the first half the assignment
		table.retrieveSymbol(id1); //check to make the sure the symbol is decalred
		
		i++;
		var id2 = ASTREE.getNodes()[i]; //get the second half of the assignment

		table.typeCheck(id1,id2); //run the type check
	
	}
	else if ( (ASTREE.getNodes()[i]).search(letter) != -1 && ((ASTREE.getNodes()[i]).length) <= 2){ //check for 1 letter symbols, ref
		var name = ASTREE.getNodes()[i];
		
		table.retrieveSymbol(name); //make sure the symbol is in the table
	}
	else{
		
	
		
	}
	

	}
	table.outputTable(); //display the symbol table
	table = new symbolTable(); //clear the table for the next program
}





function symbolTable(){
	var symtable = []; //initalize the symbol table
	var scopePointer = -1; //start the scope pointer (at -1 so the first scope is 0)
	var i = 0;
	var addSymbol;
	
	this.openScope = function(){
		scopePointer++; //declare a new scope
			
	}
	this.closeScope = function(){
		
	}
	
	this.enterSymbol = function (type,name){
	   //alert('hey look' + type);
	   
		if (symtable.length == 0){ //for when the symbol table is empty
			 symtable.push([type,name,scopePointer]);
				i++
				console.log(symtable);
			
		}
		else{
	   
	   
	   for (w = 0; w < symtable.length; w++){
		
		   if (symtable[w][1] == name && symtable[w][2] == scopePointer){ //if the symbol is declared in the current scope
			   document.getElementById("AStree").value += "trying to declare a symbol used in this scope";
			   addSymbol = false;
			   
		   }
		   
		   else{
			   addSymbol = true;
		
		   }
		   
	   
	   }
	   
	   if(addSymbol){
	   symtable.push([type,name,scopePointer]); //add symbol to the symbol table
				i++
				console.log(symtable);
	   }
	   
	   
	}
	
	
		
}
	
	this.retrieveSymbol = function(name){
		var symbolRetrieved = false;
			if (symtable.length == 0){ //if the symbol table is empty, then the symbol is certainly not declared
			 
			 document.getElementById("AStree").value += 'symbol has not been declared, ERROR'
			
		}
		
	
		
		for (l = 0; l < symtable.length; l++){
			
			if (symtable[l][2] == scopePointer && symtable[l][1] == name){
				symbolRetrieved = true;
				break;
				
			}
			
			
		}
		
		if (symbolRetrieved == false){
			document.getElementById("AStree").value += ' The symbol' + name + ' has not been declared, ERROR';
			
		}
		
	}
	
	this.outputTable = function(name){
		document.getElementById("AStree").value +=' \n' + 'Name  Type  Scope ';
		for (x = 0; x < symtable.length; x++){
			document.getElementById("AStree").value += ' \n';
			document.getElementById("AStree").value += ' ' + symtable[x][1];
			document.getElementById("AStree").value += '        ' + symtable[x][0];
			document.getElementById("AStree").value += '        ' + symtable[x][2];
			document.getElementById("AStree").value += ' \n';
			
			
		}
		
		
	}
	
	
	this.typeCheck = function(id1,id2){
		
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
		
		
		
	}
	
	
	
}
			