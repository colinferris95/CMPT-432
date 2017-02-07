//This script is under construction


//structure of a lex program



 
//declarations


//regular expressions and defintions
// pattern {action}

//char      ::== a|b|c ... z











//translation rules
/*





*/

//auxiliary functions
//scans through each character of input text
function lexer(){
	
	var letter = /[a-z]/;
var digit = /[0-9]/;
var space = /\s/;
var ws = /[space]+/;
var id = /[letter]/;
var intexpr = /[digit]+/;
	var inputText = document.getElementById("textInput").value;

	//document.getElementBYId("output").value =  inputText;


	
	for (var i=0; i<inputText.length;i++){
		alert(i);
		alert('this is the length of the text: ' + inputText.length);
	//start scanning the file at the first character
	var c = inputText[i];
	
	if ( c.search(letter) != -1 ){
		alert('LEXER: '+ c +'--> [CHAR]');
	
		
	}
	
	
	alert('this is the current c:'  + c);
	
	
	}

}

/*







*/