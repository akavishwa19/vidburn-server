import sys;
import whisper;
import os;

def main(audio_path):
    model=whisper.load_model("base.en");
    result=model.transcribe(audio_path,language="en");

    def write_srt(transcript , output_path):
        with open(output_path,"w",encoding="utf-8") as f:
            for i, segment in enumerate(transcript["segments"],start=1):
                start=segment['start']
                end=segment['end']
                text=segment['text'].strip()

                def to_srt_time(t):
                    hrs=int(t//3600)
                    mins=int((t%3600)//60)
                    secs=int(t%60)
                    millis=int((t-int(t))*1000)
                    return f"{hrs:02}:{mins:02}:{secs:02},{millis:03}"
                
                f.write(f"{i}\n")
                f.write(f"{to_srt_time(start)} --> {to_srt_time(end)}\n")
                f.write(f"{text}\n\n")

    base_name=os.path.splitext(os.path.basename(audio_path))[0]
    output_dir=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","Subtitles")
    output_path=os.path.join(output_dir,base_name+".srt")            

    write_srt(result,output_path)
    print(output_path)

if __name__ == "__main__":
    if len(sys.argv)<2:
        print("pass the audio file path please")
        sys.exit(1) 
    main(sys.argv[1])      