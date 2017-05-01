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
			heapExecEnv[heapCounter] = 'XX'; 
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
					heapExecEnv[heapCounter] = 'XX'; 
					heapCounter++;
					
				}
							
			}
			
			
		}
	
	
	
	
	}
	// start back patching by giving the variables an address
	for(z = 0; z < staticTable.length; z++){
		//alert(heapCounter);
		hexString = heapCounter.toString(16);
		staticTable[z][2] = hexString;
		heapCounter++;
		
	}
	
	for (x = heapCounter; x < heapExecEnv.length; x++){
		heapExecEnv[x] = '00';
		
	}
	
	document.getElementById("code").value += heapExecEnv.join(" ");
	document.getElementById("code").value += '\n';
	
	console.log(staticTable);
	
	
	
}

