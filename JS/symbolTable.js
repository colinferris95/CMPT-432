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

function start(){
console.log("this is the AST from AST.js " + ASTREE.root.name);
}
function buildSymbolTable(){
	processNode(ASTREE.root);
	
	
}


function processNode(node){
	switch(node.name){
		case block:
			alert('symtab.openScope()');
	//	case 
		
	}
	

	
}
			