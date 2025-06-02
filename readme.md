# VidBurn

VidBurn is an AI-powered Node.js application that enhances your videos by automatically generating subtitles using OpenAI's Whisper and syncing relevant static images from Pexels. The final output is a video with burned-in subtitles and imagery that visually complements your content.

---

## 🎓 Features

* Automatic audio transcription via Whisper (Python)
* Subtitle generation in SRT format
* Smart image fetching based on transcripted text using the Pexels API
* FFmpeg-powered video processing
* Seamless integration between Node.js and Python
* Outputs a ready-to-share enhanced video

---

## Demo

Link to video demo : https://www.loom.com/share/1ad153ff588f4403927912dddcf6a1f1?sid=3fc96156-b192-4696-956f-9ac97fa8e0bc

videos used for the demo: https://drive.google.com/drive/folders/1KNP0pniyRIBysC9dCWPsXDAAgXIS1kSv?usp=sharing


---

## Screenshots

![image](https://github.com/user-attachments/assets/ab674a86-38f1-4fba-b0f3-1b78e66c1bc0)

![image](https://github.com/user-attachments/assets/431b5aed-8502-4ff1-9d37-f7af5055c115)

---

## ⚖️ Requirements

* Node.js (v16+ recommended)
* Python (v3.7+)
* FFmpeg installed and added to PATH
* OpenAI Whisper
* Pexels API Key
* pip
* npm

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/akavishwa19/vidburn-server
cd vidburn
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Setup Python Environment

Ensure you have Python 3.3+ and pip installed.

```bash
pip install openai-whisper torch
```


### 4. Install FFmpeg

* Download from: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
* Add to system PATH.

To test:

```bash
ffmpeg -version
```

### 5. Setup Environment Variables

Create a `.env` file:

```env
PEXELS_API_KEY=your_pexels_api_key_here
```

Get your key from [https://www.pexels.com/api/](https://www.pexels.com/api/)

---

## 🔄 How It Works

### Step-by-step

1. User uploads an audio or video file via the `/api/v1/uploads/upload-file` endpoint , and the video is processed to generate an audio file from the uploaded video and is saved on the server in `Audios/`.
2. Node.js executes a child process to run `generate_subtitles.py`, which:

   * Calls OpenAI Whisper to transcribe the audio
   * Saves a `.srt` file in `Subtitles/`
3. Node.js then runs `create_video_embeds.js`, which:

   * Parses the subtitles
   * Extracts text
   * Uses the Pexels API to fetch a relevant image per timestamp
   * Transforms the original video with subtitles and maps images using ffmpeg
   * Output the result to `OutputVideo/`

---

## 🏆 Roadmap

* Support for multiple languages
* UI/UX for drag-and-drop uploads
* Image customization & filtering
* Upgradation to better AI models
* User management along with all the features to give a personalised touch.

---

## 🙏 Contributing

PRs and suggestions are welcome! Please fork the repo and create a pull request.

