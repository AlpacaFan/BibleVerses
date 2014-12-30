 /*
  A not very efficient synchronous javascript/node.js implementation of the Bible verse application. A asynchronous one listening on a port accessible through a web-browser would be good.
  
  To run "node bibleversenodesync.js <pathtoverses>

 */
   
 var fs = require('fs');
 
 var http = require('http');
 
 function getDefaultVerse()
 { 
  return "For God loved the world so much that he gave his only Son, so that everyone who believes in him may not die but have eternal life.-- John 3:16";
 }
 
 function getVerse()
 {
   if(process.argv.length < 3)
     return getDefaultVerse();
	 
	var seperator = "%".charCodeAt(0);
	var length =  fs.statSync(process.argv[2]).size;
	var start = Math.floor( Math.random() * length );
	var bufferStart = Math.max( 0, start - 1024 );
	var file = fs.openSync(process.argv[2],"r");
	var bufferBytes = new Buffer(2048);	
	var bufferSize = fs.readSync(file,bufferBytes,0,2048,bufferStart);	
	fs.closeSync(file);	
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
	return bufferBytes.toString('ascii',start,end);	
	
 }
 
 console.log(getVerse());
 
 
 /*
 var server = http.createServer(function (request, response) {
   
    response.writeHeader(200, {"Content-Type": "text/plain"});  
    response.write(getVerse());  
    response.end();  
   
 });
 


 server.listen(8000);
 
 */