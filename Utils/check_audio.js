import { spawn } from "child_process";

const has_audio = (video_path) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      video_path, //input and then provide the video path
      "-af",
      "volumedetect", //audio filters set to detect volume
      "-vn", // disable porcessing of the video
      "-sn", // disable subtitles
      "-f",
      "null",
      "-", // the output file , we dont care about it
    ]);

    let stderr = ""; //ffmpeg doesnt output on standard output , rather it gives volume information in standard error

    ffmpeg.stderr.on("data", (data) => {
      console.log("raw output: ", stderr);
      console.log("incoming stream: ", data);
      stderr += data.toString();
      console.log("processed incoming stream: ", data);
      console.log("processed output: ", stderr);
    });

    ffmpeg.on("close", (code) => {

      //when the result is finished yielding , we match if the output contains something like a regex such as max_volume:  
      const maxVolumeMatch = stderr.match(/max_volume:\s*(-?\d+(\.\d+)?) dB/);
      if (maxVolumeMatch) {
        const maxVolume = parseFloat(maxVolumeMatch[1]);
        console.log("Max Volume:", maxVolume);
        // if max_volume is -inf or very low, treat as silent
        if (isNaN(maxVolume) || maxVolume <= -90) {
          resolve(false); // very likely silent
        } else {
          resolve(true); // has audible sound
        }
      } else {
        resolve(false); // couldn't determine volume → assume silent
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

export default has_audio;
