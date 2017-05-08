//  desc                      ||||  op code |||| Mnemonic
/* Load with a constant				A9				LDA
   Load from memory					AD				LDA
   Store in memory					8D 				STA
   Add with carry					6D				ADC
   Load the x register with a       A2				LDX
   constant
   
   Load the x register from 		AE				LDX
   memory
   
   Load the y register with a		A0				LDY
   constant
   
   Load the y register from			AC				LDY
   memory
   
   No operation						EA				NOP
   Break (System call) 				00				BRK
   
   Compare a byte in memory 		EC				CPX
   to x reg

   Branch n bytes if z flag = 0		D0				BNE
   
   Increment the value of a byte    EE				Inc
   
   System call						FF				SYS
	#$01 in x reg = print the integer stored in the y reg
	#$02 in x reg = print the 00-terminated string stored at the address in the y register

*/
var heapExecEnv = [];
heapExecEnv.length = 255;
var heapCounter = 0;
var memCounter = 255;

var staticTable = [];
var tempVar =0;
var addrCounter = 0;

var jumpTable = [];
var tempJumpVar =0;


var rex = /\S/;
var letter = /[a-z]/; //alpha characters
var digit = /[0-9]/; //number character
document.getElementById("code").value = ' ';



function codeGenStart(){
	
	 heapExecEnv = [];
	 heapExecEnv.length = 255;
	 heapCounter = 0;
	 memCounter = 255;

	 staticTable = [];
	 tempVar =0;
	 addrCounter = 0;

	 jumpTable = [];
	 tempJumpVar =0;
	
	
	console.log("CODE GEN::: this is the AST from AST.js " + ASTREE.getNodes());
	generation();
}

function generation(){
	
	for (i = 0; i < ASTREE.getNodes().length; i++){ //iterate through each node
	
		if (ASTREE.getNodes()[i] == 'VarDecl'){ 
			heapExecEnv[heapCounter] = 'A9'; //load the acc with a constant
			heapCounter++;
			heapExecEnv[heapCounter] = '00'; //init with 0 constant
			heapCounter++;
			heapExecEnv[heapCounter] = '8D'; //Store the acc in memory
			heapCounter++;
			heapExecEnv[heapCounter] = 'T'+ tempVar; //temp location
			heapCounter++;
			heapExecEnv[heapCounter] = '00'; 
			heapCounter++;
			
			i = i + 2
			
			//					//temp loc     var name             address maybe add type for print statment
			staticTable.push([('T'+ tempVar),ASTREE.getNodes()[i], addrCounter, ASTREE.getNodes()[i-1]  ]);
			addrCounter = addrCounter + 2;
			tempVar++;
			
		}
		else if(ASTREE.getNodes()[i] == 'AssignmentStatement'){
			heapExecEnv[heapCounter] = 'A9'; //load the acc with a constant
			heapCounter++;
			
			
			if ((ASTREE.getNodes()[i + 2]).search(QUOT) != -1){
				var string = (ASTREE.getNodes()[i + 2]).replace(/\s/g, '');
				string = string.split("").reverse().join("");
				
				for (s = 0; s < string.length; s++){
					if(string[s].search(QUOT) != -1){
						s++
					}
					if(string[s] == undefined){
						
					}
					else{
					//alert(string[s]);
					hexStringVar = string[s].hexEncode(); //convert counter to hex
					hexStringVar = hexStringVar.toUpperCase();
					//alert(hexStringVar);
					heapExecEnv[memCounter] = hexStringVar; //store the string at the bottom
					memCounter--;
					}
					
				}
				heapExecEnv[memCounter] = '00'
				memCounter--;
				
				hexStringLoc = memCounter.toString(16); //convert counter to hex
				hexStringLoc = hexStringLoc.toUpperCase();
			
				heapExecEnv[heapCounter] = hexStringLoc //location of the string THIS NEEDS TO BE DIFFERENT
				heapCounter++;

				heapExecEnv[heapCounter] = '8D'; //Store the acc in memory
				heapCounter++;
				
				for (f = 0; f < staticTable.length; f++){
				
				
				if (staticTable[f][1] == ASTREE.getNodes()[i + 1]){
					heapExecEnv[heapCounter] = staticTable[f][0];
					heapCounter++;
					heapExecEnv[heapCounter] = '00'; 
					heapCounter++;
					
				}
							
			}
				
				
				
				
				
			}
			
			else{
			
			
			
			heapExecEnv[heapCounter] = '0' + ASTREE.getNodes()[i + 2].trim();		
			heapCounter++;
			
			heapExecEnv[heapCounter] = '8D'; //Store the acc in memory
			heapCounter++;
			
			for (j = 0; j < staticTable.length; j++){
				
				
				if (staticTable[j][1] == ASTREE.getNodes()[i + 1]){
					heapExecEnv[heapCounter] = staticTable[j][0];
					heapCounter++;
					heapExecEnv[heapCounter] = '00'; 
					heapCounter++;
					
				}
							
			}
			
			
			}
		}
		else if(ASTREE.getNodes()[i] == 'PrintStatement'){
			var printType;
			
			
			
			// need to the load the mem address if its a variable
			var printVar = ASTREE.getNodes()[i + 1] ;
			if (printVar.length <= 2 && printVar.search(letter) != -1){ //if we are printing the value of a variable
			heapExecEnv[heapCounter] = 'AC'; //load the y register
			heapCounter++;
			for(t = 0; t < staticTable.length; t++){
				if (staticTable[t][1] == printVar){
					//alert(heapExecEnv[heapCounter]);
					//alert(staticTable[t][0]);
					heapExecEnv[heapCounter] = staticTable[t][0]; //temp location
					heapCounter++;
					heapExecEnv[heapCounter] = '00' //temp location
					heapCounter++;
					
					printType = staticTable[t][3];

				}
				
			}
				heapExecEnv[heapCounter] = 'A2'; //load the x register
				heapCounter++;
				alert(printType);
				if (printType == " int"){
					heapExecEnv[heapCounter] = '01'; //
					heapCounter++;
				}
				else{
					heapExecEnv[heapCounter] = '02'; //
					heapCounter++;
				}
			
				heapExecEnv[heapCounter] = 'FF'; //
				heapCounter++;
			
			
			}
			else if(printVar.search(digit) != -1){
			
				heapExecEnv[heapCounter] = 'A9'; //load the acc with a constant
				heapCounter++;
				heapExecEnv[heapCounter] = '0'+printVar.trim();
				heapCounter++;
				heapExecEnv[heapCounter] = 'A2'; //load the x register
				heapCounter++;
				heapExecEnv[heapCounter] = '01'; //
				heapCounter++;
				
				heapExecEnv[heapCounter] = '8D'; //Store the acc in memory
				heapCounter++;
				heapExecEnv[heapCounter] = 'T'+ tempVar; //temp location
				heapCounter++;
				heapExecEnv[heapCounter] = '00'; 
				heapCounter++;
				
				heapExecEnv[heapCounter] = 'AC'; //Store the acc in memory
				heapCounter++;
				heapExecEnv[heapCounter] = 'T'+ tempVar; //temp location
				heapCounter++;
				heapExecEnv[heapCounter] = '00'; 
				heapCounter++;
				heapExecEnv[heapCounter] = 'FF'; //
				heapCounter++;
				
				staticTable.push([('T'+ tempVar),printVar,'x','x' ]);
				tempVar++;
				
			}
			
			
			
			
			
			
			
		}
		else if(ASTREE.getNodes()[i] == 'IfStatement'){
			//(input[forward]).search(letter)
			if ( ((ASTREE.getNodes()[i +2]).length <= 2) && (ASTREE.getNodes()[i +2]).search(letter) != -1 ) { //if the first part of the iseq is a variable
				heapExecEnv[heapCounter] = 'AE'; //load the x register with the first variable
				heapCounter++;
				var iseqVar1 = ASTREE.getNodes()[i + 2] ;
				for(y = 0; y < staticTable.length; y++){
				if (staticTable[y][1] == iseqVar1){
					//alert(heapExecEnv[heapCounter]);
					//alert(staticTable[t][0]);
					heapExecEnv[heapCounter] = staticTable[y][0]; //temp location
					heapCounter++;
					heapExecEnv[heapCounter] = '00' //temp location
					heapCounter++;
				}
				
			}
				
			}
			
			if ( ((ASTREE.getNodes()[i +3]).length <= 2) && (ASTREE.getNodes()[i +2]).search(letter) != -1 ) { //if the first part of the iseq is a variable
				heapExecEnv[heapCounter] = 'EC'; //compare x register with contents of second var
				heapCounter++;
				var iseqVar2 = ASTREE.getNodes()[i + 3] ;
				for(q = 0; q < staticTable.length; q++){
				if (staticTable[q][1] == iseqVar2){
					//alert(heapExecEnv[heapCounter]);
					//alert(staticTable[t][0]);
					heapExecEnv[heapCounter] = staticTable[q][0]; //temp location
					heapCounter++;
					heapExecEnv[heapCounter] = '00' //temp location
					heapCounter++;
				}
				
			}
				
			}
			
			heapExecEnv[heapCounter] = 'D0'; //branch on not equal
			heapCounter++;
			heapExecEnv[heapCounter] = 'J'+ tempJumpVar; //temp location
			heapCounter++;
			
			
			//					//temp loc     var name             address maybe add type for print statment
			jumpTable.push([('J'+ tempJumpVar),heapCounter ]);
			tempJumpVar++;
			
		}
		
		else if(ASTREE.getNodes()[i] == 'leaveScope'){
			var hexDigit;
			
			for(r = 0; r < jumpTable.length; r++){
		
			
				for (m = 0; m < heapExecEnv.length; m++){
			
					if( jumpTable[r][0] == heapExecEnv[m]){
						alert('jump table value ' + jumpTable[r][1]);
						alert(heapCounter);
						var jumpValue = heapCounter - jumpTable[r][1] ;
						alert(jumpValue);
						
						hexDigit = jumpValue.toString(16); //convert counter to hex
						hexDigit = hexDigit.toUpperCase();
						
						if (hexDigit.length == 1){
							hexDigit = '0' +hexDigit;
						}
							
				
						heapExecEnv[m] = hexDigit;
				
						//alert(hexString2);
						
				
				
				}
			
			}
	
			jumpTable[r][0]  = "replaced";
			//heapCounter++; 
		
		
		
		
		
			}
			
			
		}
	
	
	
	}
	var hexString2;
	heapCounter++;
	
	//change the values in the static table
	for(e = 0; e < staticTable.length; e++){
		hexString = heapCounter.toString(16); //convert counter to hex
		hexString = hexString.toUpperCase();
		
		if (hexString.length == 1){
			hexString2 = '0' + hexString;
			staticTable[e][2] = hexString2;
		}
		else{
		staticTable[e][2] = hexString;
		}
		heapCounter++
		
	}
	
	
	// start back patching by giving the variables an address
	
	for(z = 0; z < staticTable.length; z++){
		
		
		for (p = 0; p < heapExecEnv.length; p++){
			
			if( staticTable[z][0] == heapExecEnv[p]){
				
				
					heapExecEnv[p] = staticTable[z][2];
				
				//alert(hexString2);
				
				
			}
			
		}
	
		staticTable[z][2] = hexString; // change the temp Txx value to the correct hex value
		//heapCounter++; 
		
		
		
		
		
	}
	
	
	
	
	for (x = heapCounter; x < memCounter; x++){
		heapExecEnv[x] = '00';
		
	}
	
	document.getElementById("code").value += heapExecEnv.join(" ");
	document.getElementById("code").value += '\n';
	document.getElementById("code").value += '\n';
	
	console.log(staticTable);
	console.log(jumpTable);
	
	
	
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += (hex).slice(-4);
    }

    return result
}

