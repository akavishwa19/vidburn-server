import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const extract_audio = (video_path) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  //if video doesnt exists , throw error nnd simply return
  if (!fs.existsSync(video_path)) {
    console.log("no such file present");
    return;
  }

  const extention = path.extname(video_path);
  const basename = path.basename(video_path, extention);
  const output_path = path.join(__dirname, "..", "Audios", `${basename}.mp3`);

  const ffmpeg_command = `ffmpeg -i "${video_path}" -vn -acodec libmp3lame -q:a 2 "${output_path}"`;

  exec(ffmpeg_command, (err, stdout, stderr) => {
    if (err) {
      console.log("error extracting audio");
      return;
    }
    console.log("audio extraction complete");
  });
};

export default extract_audio;