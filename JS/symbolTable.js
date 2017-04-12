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

function start(){
console.log("this is the AST from AST.js " + ASTREE.getNodes());
buildSymbolTable();
}
function buildSymbolTable(){
	for (i = 0; i < ASTREE.getNodes().length; i++){
		processNode(ASTREE.getNodes()[i]);
		
		
	}
	
	
}


function processNode(node){
	alert(node);
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
	

	
		
	}
	*/
	
	if (node == 'block'){
		alert('symtab.openScope()');
	}
	else if (node == 'VarDecl'){
		alert('symtab.enterSymbol(node.name,node.type) var decl');
		
	}
	else if ( (node).search(letter) != -1){
		alert('symtab.enterSymbol(node.name,node.type) default');
	}
	

	
}
			