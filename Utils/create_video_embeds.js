import { parse } from "subtitle";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import Ffmpeg from "fluent-ffmpeg";

const DEEP_API_KEY = process.env.DEEP_AI_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const select_random_subtitles = (subtitles) => {
  if (subtitles.length <= 2) {
    return subtitles;
  }
  return subtitles.sort(() => 0.5 - Math.random()).slice(0, 2);
};

const get_images_from_text = async (text) => {
  console.log("text:", text);

  try {
    const data = await axios.post("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": "8222c772-e85a-469b-9b1b-13856a65fa18",
      },
      body: JSON.stringify({
        text: "YOUR_TEXT_URL",
      }),
    });
    // console.log(data);
    return;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getImageFromUnsplash = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, // Replace with your Unsplash access key
      },
    });

    const imageUrl = response.data.results[0]?.urls?.regular;
    console.log("Image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error fetching from Unsplash:", error.message);
  }
};

const get_images_from_pexels = async (query) => {
  try {
    console.log("Getting image for:", query);
    const data = await axios.get("https://api.pexels.com/v1/search", {
      params: {
        query: query,
        per_page: 1,
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const image_url =
      data?.data?.photos[0]?.src?.medium ||
      "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=320";
    console.log(image_url);
    return image_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// const create_video_embeds = async (subtitle_path, video_path_argument) => {
//   //   console.log('path location' , path_location)

//   console.log(subtitle_path);

//   const file = fs.readFileSync(subtitle_path, "utf-8");

//   const subtitles = parse(file);
//   const selected_titles = select_random_subtitles(subtitles);

//   for (let i = 0; i < selected_titles.length; i++) {
//     const image_url = await get_images_from_pexels(selected_titles[i]?.text);
//     selected_titles[i].preview_url = image_url;
//   }

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const temp_folder_path = path.join(__dirname, "..", "Temp");

//   //save to a temporary directory
//   for (let i = 0; i < selected_titles.length; i++) {
//     const item = selected_titles[i];

//     const response = await axios.get(item?.preview_url, {
//       responseType: "stream",
//     });

//     const image_path = path.join(temp_folder_path, `image-${i}.jpg`);
//     const write_stream = fs.createWriteStream(image_path);

//     await new Promise((resolve, reject) => {
//       response.data.pipe(write_stream);
//       write_stream.on("finish", resolve);
//       write_stream.on("error", reject);
//     });

//     selected_titles[i].localPath = image_path;
//   }

//   const video_path = video_path_argument;
//   const output_video_path = path.join(
//     __dirname,
//     "..",
//     "OutputVideo",
//     "final_video.mp4"
//   );

//   const safe_output_path = output_video_path.replace(/\\/g, '/');

//   let command = Ffmpeg(video_path).outputOptions("-vf");

//   const filters = [];
//   const overlay_labels = ["[0:v]"];

//   selected_titles.forEach((img, index) => {
//     filters.push(`[${index + 1}:v]scale=iw*0.2:ih*0.2[img${index}]`);

//     filters.push(
//       `
//       ${overlay_labels[index]}[img${index}]overlay=W-w-10:10:
//       enable='between(t,${img.start / 1000},${img.end / 1000})'[tmp${index}]
//     `
//         .replace(/\s+/g, " ")
//         .trim()
//     );

//     overlay_labels.push(`[tmp${index}]`);
//     command = command.input(img.localPath);
//   });

//   console.log("subtitle path:", subtitle_path);

//   command
//     .outputOptions(
//       `-filter_complex "${filters.join(";")},subtitles='${path.resolve(subtitle_path)}'"`
//     )
//     .output(safe_output_path)
//     .on("end", async () => {
//       console.log("Video processing complete.");
//     })
//     .on("error", (err) => {
//       console.error("Error:", err.message);
//     })
//     .run();

//   return;
// };

const create_video_embeds = async (
  subtitle_path,
  video_path_argument,
  raw_key
) => {
  const file = fs.readFileSync(subtitle_path, "utf-8");
  const subtitles = parse(file);
  const selected_titles = select_random_subtitles(subtitles);

  console.log("CUES :", selected_titles);

  for (let i = 0; i < selected_titles.length; i++) {
    const image_url = await get_images_from_pexels(selected_titles[i]?.text);
    selected_titles[i].preview_url = image_url;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const temp_folder_path = path.join(__dirname, "..", "Temp");

  for (let i = 0; i < selected_titles.length; i++) {
    const item = selected_titles[i];

    console.log("Downloading image from URL:", item?.preview_url);
    const response = await axios.get(item?.preview_url, {
      responseType: "stream",
    });
    const image_path = path.join(temp_folder_path, `${raw_key}-image-${i}.jpg`);
    const write_stream = fs.createWriteStream(image_path);

    await new Promise((resolve, reject) => {
      response.data.pipe(write_stream);
      write_stream.on("finish", resolve);
      write_stream.on("error", reject);
    });

    selected_titles[i].localPath = image_path;
  }

  const video_path = video_path_argument;
  const output_video_path = path.join(
    __dirname,
    "..",
    "OutputVideo",
    `${raw_key}.mp4`
  );

  const safe_output_path = output_video_path.replace(/\\/g, "/");
  const escaped_sub_path = subtitle_path
    .replace(/\\/g, "/")
    .replace(/:/g, "\\:")
    .replace(/ /g, "\\ ");

  let command = Ffmpeg(video_path);
  selected_titles.forEach((img) => {
    command = command.input(img.localPath);
  });

  const filters = [];
  const overlay_labels = ["[0:v]"];

  selected_titles.forEach((img, index) => {
    filters.push(`[${index + 1}:v]scale=320:240[img${index}]`);
    filters.push(
      `${
        overlay_labels[index]
      }[img${index}]overlay=W-w-10:10:enable='between(t,${img.start / 1000},${
        img.end / 1000
      })'[tmp${index}]`
    );
    overlay_labels.push(`[tmp${index}]`);
  });

  filters.push(
    `${
      overlay_labels[overlay_labels.length - 1]
    }subtitles='${escaped_sub_path}'`
  );

  command
    .complexFilter(filters)
    .output(safe_output_path)
    .on("start", (cmd) => console.log("FFmpeg command:\n" + cmd))
    .on("end", () => console.log("Video processing complete."))
    .on("error", (err) => console.log("FFmpeg error:", err.message))
    .run();

  return output_video_path;
};

export default create_video_embeds;
