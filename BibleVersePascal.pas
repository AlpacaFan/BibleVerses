program BibleVersePascal;

{$I-}

var FileHandle: File;
     Size: LongInt;
     Start: LongInt;
     BufferStart: LongInt;
     Buffer: array[0..2047] of char;
     BufferSize: LongInt;
     Segment:string[80];
     SegmentIndex: integer;
     CurrentChar: integer;


function Max(a,b:longint):Longint;

begin
  if a > b then
    Max := a
  else
    Max := b;
end;


procedure DefaultVerse;

begin
  WriteLn('For God loved the world so much that he gave his only Son, so that everyone who believes in him may not die but have eternal life.');
  WriteLn;
  WriteLn('John 3:16');
end;

begin
  if paramcount <> 1 then
    begin
       DefaultVerse;
       Readln;
       exit;
    end;

  Assign(FileHandle,ParamStr(1));
  Reset(FileHandle,1);
  if IOResult <> 0 then
   begin
     WriteLn('Couldn''t open file:', ParamStr(1));
     DefaultVerse;
     Readln;
     exit;
   end;

   { Determine random position in file }
  Size := FileSize(FileHandle);
  Randomize;
  Start := Random(Size);

  { our random position is in the middle of a verse, we need to find its
    start - so we read 1024 characters before our random position }


  BufferStart := Max(0, Start - 1024);

  Seek(FileHandle,BufferStart);
  BlockRead(FileHandle,Buffer,Sizeof(buffer),BufferSize);
  Close(FileHandle);

 { In case of last couple of verses... make sure we are terminated!}
  If BufferSize <> 2048 then
    Buffer[BufferSize] := '%';

  { find our random position in the buffer -- should be 1024 except for
    first couple of verses in the file }

  Start := Start - BufferStart;

  {Find the beginning of the verse }


  while ( ( Buffer[Start] <> '%' ) and  ( Start > 0 ) ) do
    begin
     Start := Start - 1;
    end;

  { Skip the % character }
  if Buffer[Start] = '%' then
     Start := Start + 1;

  Segment := '';
  SegmentIndex := 1;
  CurrentChar := Start;

  { Write the entire verse out in segments of 80 characters }
  while CurrentChar < BufferSize do
   begin
       { Did we reach the next verse? }
       if Buffer[CurrentChar] = '%' then
         begin
           Write(Segment);
           Segment := '';
           break;
         end;

       Segment := Segment + Buffer[CurrentChar];
       SegmentIndex := SegmentIndex + 1;

       { Is our current segment full? Flush it }
       If SegmentIndex > 80 then
        begin
          Write(Segment);
          Segment := '';
          SegmentIndex := 1;
        end;

       CurrentChar := CurrentChar + 1;
   end;

   {Write Left-overs }
   WriteLn(Segment);


  Readln;


end.
