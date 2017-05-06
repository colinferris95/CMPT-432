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

var staticTable = [];
var tempVar =0;
var addrCounter = 0;

var rex = /\S/;




function codeGenStart(){
	
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
			
			//					//temp loc     var name             address
			staticTable.push([('T'+ tempVar),ASTREE.getNodes()[i], addrCounter ]);
			addrCounter = addrCounter + 2;
			tempVar++;
			
		}
		else if(ASTREE.getNodes()[i] == 'AssignmentStatement'){
			heapExecEnv[heapCounter] = 'A9'; //load the acc with a constant
			heapCounter++;
			
			
			
			
			
			
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
		else if(ASTREE.getNodes()[i] == 'PrintStatement'){
			heapExecEnv[heapCounter] = 'AC'; //load the y register
			heapCounter++;
			
			// need to the load the mem address if its a variable
			var printVar = ASTREE.getNodes()[i + 1] ;
			for(t = 0; t < staticTable.length; t++){
				if (staticTable[t][1] == printVar){
					//alert(heapExecEnv[heapCounter]);
					//alert(staticTable[t][0]);
					heapExecEnv[heapCounter] = staticTable[t][0]; //temp location
					heapCounter++;
					heapExecEnv[heapCounter] = '00' //temp location
					heapCounter++;
				}
				
			}
			
			heapExecEnv[heapCounter] = 'A2'; //load the x register
			heapCounter++;
			heapExecEnv[heapCounter] = '01'; //
			heapCounter++;
			heapExecEnv[heapCounter] = 'FF'; //
			heapCounter++;
			
			
			
			
			
			
		}
	
	
	
	
	}
	var hexString2;
	heapCounter++;
	// start back patching by giving the variables an address
	
	for(z = 0; z < staticTable.length; z++){
		
		hexString = heapCounter.toString(16); //convert counter to hex
		hexString = hexString.toUpperCase();
		for (p = 0; p < heapExecEnv.length; p++){
			
			if( staticTable[z][0] == heapExecEnv[p]){
				
				if (hexString.length == 1){
					hexString2 = '0' + hexString;
					heapExecEnv[p] = hexString2;
				}
				else{
					heapExecEnv[p] = hexString;
				}
				//alert(hexString2);
				
				
			}
			
		}
	
		staticTable[z][2] = hexString; // change the temp Txx value to the correct hex value
		//heapCounter++; 
		
		
		
		
		
	}
	
	
	for (x = heapCounter; x < heapExecEnv.length; x++){
		heapExecEnv[x] = '00';
		
	}
	
	document.getElementById("code").value += heapExecEnv.join(" ");
	document.getElementById("code").value += '\n';
	
	console.log(staticTable);
	
	
	
}

