# VidBurn

VidBurn is an AI-powered Node.js application that enhances your videos by automatically generating subtitles using OpenAI's Whisper and syncing relevant static images from Pexels. The final output is a video with burned-in subtitles and imagery that visually complements your content.

---

## 🎓 Features

* Automatic audio transcription via Whisper (Python)
* Subtitle generation in SRT format
* Smart image fetching based on transcript keywords using the Pexels API
* FFmpeg-powered video processing
* Seamless integration between Node.js and Python
* Outputs a ready-to-share enhanced video

---

## 📁 Folder Structure

```
VidBurn/
├── app.js                  # Main Node.js server
├── uploads/               # User-uploaded audio/video files
├── subtitles/             # Generated .srt subtitle files
├── visuals/               # Static images fetched from Pexels
├── public/                # Final processed videos
├── scripts/               # Python helper scripts
│   ├── transcribe.py      # Uses Whisper to generate subtitles
│   ├── image_map.py       # Extracts keywords and fetches images
│   └── burn_video.py      # Calls FFmpeg to overlay subtitles/images
├── image_map.json         # Stores subtitle-to-image mappings
├── .env                   # Environment variables
├── package.json
└── README.md              # This file
```

---

## ⚖️ Requirements

* Node.js (v16+ recommended)
* Python (v3.7+)
* FFmpeg installed and added to PATH
* OpenAI Whisper
* Pexels API Key

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vidburn.git
cd vidburn
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Setup Python Environment

Ensure you have Python 3.7+ and pip installed.

```bash
pip install openai-whisper pysrt requests
```

You may also need `ffmpeg-python`:

```bash
pip install ffmpeg-python
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

1. User uploads an audio or video file via the `/process?audio=uploads/xyz.mp3` endpoint.
2. Node.js spawns a child process to run `transcribe.py`, which:

   * Calls OpenAI Whisper to transcribe the audio
   * Saves a `.srt` file in `subtitles/`
3. Node.js then runs `image_map.py`, which:

   * Parses the subtitles
   * Extracts keywords
   * Uses the Pexels API to fetch a relevant image per timestamp
   * Saves the mapping in `image_map.json`
4. Finally, `burn_video.py` is executed to:

   * Generate a base video from the audio
   * Overlay the subtitles and the mapped images using FFmpeg
   * Output the result to `public/`

---

## 🌐 API Endpoint

### `GET /process`

Processes the audio or video file and returns the final result path.

**Query Parameters:**

* `audio`: Path to uploaded audio/video file

**Example:**

```bash
GET http://localhost:3000/process?audio=uploads/myvoice.mp3
```

**Response:**

```json
{
  "video": "public/myvoice.mp4"
}
```

---

## ⚙️ Scripts Overview

### `transcribe.py`

Uses Whisper to generate `.srt` subtitle files from audio.

### `image_map.py`

Parses subtitles and queries Pexels for images per time segment.

### `burn_video.py`

Combines the base video, subtitles, and overlayed images using FFmpeg.

---

## 🚧 Known Limitations

* Currently designed for short videos (< 10 min)
* Image keyword extraction is simple and may return generic images
* FFmpeg filter complexity may grow with long subtitle/image sequences

---

## 🏆 Roadmap

* Support for multiple languages
* UI/UX for drag-and-drop uploads
* Image customization & filtering
* Deployment to cloud platforms (Vercel, Render, etc.)

---

## 🙏 Contributing

PRs and suggestions are welcome! Please fork the repo and create a pull request.

---

## ✉️ License

MIT License © YourName
