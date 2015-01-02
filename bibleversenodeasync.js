 /*

  
  To run "node bibleversenodeasync.js <pathtoverses>
  
  View verse with http://localhost:8000/

 */
   
 var fs = require('fs');
 
 var http = require('http');
 
 // console.log('Hello1!');
  
 function getDefaultVerse()
 { 
  return "For God loved the world so much that he gave his only Son, so that everyone who believes in him may not die but have eternal life.-- John 3:16";
 }
 
 function writeVerse(response)
 {
 
 
   response.writeHeader(200, {"Content-Type": "text/plain"});  
	  
   if(process.argv.length < 3)
   {
	 response.write(getDefaultVerse());  
    response.end(); 
	return;
   }

	 
	var seperator = "%".charCodeAt(0);
	var length =  fs.statSync(process.argv[2]).size;
	var start = Math.floor( Math.random() * length );
	var bufferStart = Math.max( 0, start - 1024 );
	fs.open(process.argv[2],"r",function(err,file) {
		if(err)
		{ 
		  	response.write(getDefaultVerse());  
			response.end(); 
			return;
		} 
			
		var bufferBytes = new Buffer(2048);	
		fs.read(file,bufferBytes,0,2048,bufferStart,function(err,bufferSize,bufferBytes) 
			{	
				fs.close(file,function() {});	
				
				if(err)
				{ 
				    console.log(err);
					response.write(getDefaultVerse());  
					response.end(); 
					return;
				} 
		
				start = start - bufferStart;
				
				while(start > 0)
				{
				  if(bufferBytes[start] == seperator)
				   break;
				   start--;
				}
				
				if(bufferBytes[start] ==seperator)
				 start++;
				
				var end = start;
				
				while(end<bufferSize)
				{
				 if(bufferBytes[end] == seperator)
				   break;
				  end++;
				}
				if(bufferBytes[end] == seperator)
				  end--;
				  response.write(bufferBytes.toString('ascii',start,end));
				  response.end();
			
			}); // read
    }); // open
 }


 var server = http.createServer(function (request, response) {
   
  writeVerse(response);
   
 });
 
server.listen(8000);
 
 