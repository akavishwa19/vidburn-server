import has_audio from "../Utils/check_audio.js";
import extract_audio from "../Utils/extract_audio.js";
import create_subtitles from "../Utils/create_subtitles.js";
import create_video_embeds from "../Utils/create_video_embeds.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirnmae = path.dirname(__filename);

const check_audio = async (req, res) => {
  try {
    const video_path = path.join(
      __dirnmae,
      "..",
      "Uploads",
      `${req?.params?.name}.mp4`
    );
    const audio_path = path.join(
      __dirnmae,
      "..",
      "Audios",
      `${req?.params?.name}.mp3`
    );
    const subtitle_path = path.join(
      __dirnmae,
      "..",
      "Subtitles",
      `${req?.params?.name}.srt`
    );

    const raw_key = req?.params?.name;

    const extract = extract_audio(video_path);

    const subtitles = await create_subtitles(audio_path);

    const processVideo = await create_video_embeds(
      subtitle_path,
      video_path,
      raw_key
    );
    console.log("\n PROCESSED VIDEO: ", processVideo);

    return res.status(200).json({ audio_available: "audio" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error?.message);
  }
};

export { check_audio };
