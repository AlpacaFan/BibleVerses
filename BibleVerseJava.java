import java.io.*;
import java.util.*;
import java.text.*;


class BibleVerseJava
{
	
  public static void printDefaultVerse()
  {
    System.out.println("For God loved the world so much that he gave his only Son, so that everyone who believes in him may not die but have eternal life.\n-- John 3:16");   
  }
  
  public static void main(String[] args)
  {
	RandomAccessFile file;
	Random random = new Random();
	byte[] buffer = new byte[2048];
	int start;
	int bufferStart;
	int bufferSize;
	StringBuilder verseBuilder;
	
    try
    {
    	if(args.length < 1)
    	{
    	  System.out.println("No Bible Verses Supplied!");
    	  printDefaultVerse();
    	  return;
    	}
    	
    	file = new RandomAccessFile(args[0],"r");
    	
    	// find random position in file
    	random = new Random();
    	start = random.nextInt( (int) file.length() );
    	
    	// read 1024 bytes before and 1024 bytes after
       	bufferStart = Math.max(0, start - 1024 );
    	file.seek(bufferStart);
    	bufferSize = file.read(buffer);
    	file.close();

    	// set starting point to start point in buffer
    	start = start - bufferStart;
    	
    	// find the beginning of the current version
    	while(start > 0)
    	{ 
    	  if(buffer[start] == (byte)'%')
    		  break;
    	  start--;
    	}
    	
    	if(buffer[start]== (byte)'%')
    		start++;
    	
    	// build the verse character by character
    	verseBuilder = new StringBuilder();
    	
    	while( (start<bufferSize) && ( buffer[start]!=(byte)'%') )
    	{
    	  verseBuilder.append((char)buffer[start]);
    	  start++;
    	}
    	
    	System.out.print(verseBuilder.toString());
    	
    }
    catch(Exception e)
    {
    	System.out.format("Exception:%s\n",e);
    	printDefaultVerse();    	
    }
  }
}