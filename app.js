import express from "express";
import cors from "cors";
import "dotenv/config";
import chalk from "chalk";
import { Worker } from "worker_threads";
import { exec } from "child_process";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename=fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/public', express.static(path.join(__dirname, 'Uploads')));
app.use('/output', express.static(path.join(__dirname, 'OutputVideo')));


//UNUSED CODE below
app.get("/public/:filename", (req, res) => {
  const filePath = path.join(__dirname, "Uploads", req.params.filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  try {
    // Read the entire file into memory
    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Set headers for the response
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "none", // Explicitly disable range requests
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      "Last-Modified": stat.mtime.toUTCString(),
      "ETag": `"${fileSize}-${stat.mtime.getTime()}"`,
    };

    // Send the entire buffer in one response
    res.writeHead(200, head);
    res.send(fileBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error serving video" });
  }
});

// Route to serve videos from OutputVideo/
app.get("/output/:filename", (req, res) => {
  const filePath = path.join(__dirname, "OutputVideo", req.params.filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Video not found" });
  }

  try {
    // Read the entire file into memory
    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Set headers for the response
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
      "Accept-Ranges": "none", // Explicitly disable range requests
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      "Last-Modified": stat.mtime.toUTCString(),
      "ETag": `"${fileSize}-${stat.mtime.getTime()}"`,
    };

    // Send the entire buffer in one response
    res.writeHead(200, head);
    res.send(fileBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error serving video" });
  }
});

//unused code above

// app.get('/public/:filename', (req, res) => {
//   if (!req.params.filename.endsWith('.mp4')) {
//     return res.status(404).send('Not found');
//   }
  
//   const videoPath = path.join(__dirname, 'Uploads', req.params.filename);
  
//   if (!fs.existsSync(videoPath)) {
//     return res.status(404).send('Video not found');
//   }

//   // Read entire file into memory and send as one chunk
//   const videoBuffer = fs.readFileSync(videoPath);
  
//   res.set({
//     'Content-Type': 'video/mp4',
//     'Content-Length': videoBuffer.length,
//     'Accept-Ranges': 'none',
//   });
  
//   res.end(videoBuffer);
// });

// app.get('/output/:filename', (req, res) => {
//    if (!req.params.filename.endsWith('.mp4')) {
//     return res.status(404).send('Not found');
//   }
  
//   const videoPath = path.join(__dirname, 'OutputVideo', req.params.filename);
  
//   if (!fs.existsSync(videoPath)) {
//     return res.status(404).send('Video not found');
//   }

//   // Read entire file into memory and send as one chunk
//   const videoBuffer = fs.readFileSync(videoPath);
  
//   res.set({
//     'Content-Type': 'video/mp4',
//     'Content-Length': videoBuffer.length,
//     'Accept-Ranges': 'none',
//   });
  
//   res.end(videoBuffer);
// });

const PORT = process.env.PORT || 3000;


app.get("/", async (req, res) => {
  try {
    const fibValue = 44;

    const worker = new Worker("./worker.js", {
      workerData: fibValue,
    });

    worker.on("error", (err) => {
      console.log(err);
      if (!res.headersSent) {
        res.status(500).json(err);
      }
    });

    worker.on("exit", (code) => {
      console.log(code);
      if (!res.headersSent) {
        res.status(500).json(code);
      }
    });

    worker.on("message", (data) => {
      if (!res.headersSent) {
        return res.send(data);
      }
    });
  } catch (error) {
    console.log(error);
    return;
  }
});

app.get("/get-info", async (req, res) => {
  try {
    exec("dir", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json(error);
      }
      console.log(stdout);
      res.status(200).send(stdout);
    });
  } catch (error) {}
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//route imports
import uploadRoutes from "./Routes/upload.route.js";
import videoRoutes from './Routes/video.routes.js';

app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/video",videoRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log(err)
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(
    "app is running on " + chalk.blue.bold("http://localhost:" + PORT)
  );
});

//CODE FOR MY

// copy the contents of a file and paste it into another file in  an optimal way
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import readline from 'readline';

// const __filename=fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const readablestream = fs.createReadStream(path.join(__dirname,'hello.txt'));

// const outputfile=path.join(__dirname,'output.txt');

// const writableStream=fs.createWriteStream(outputfile)

// const rl=readline.createInterface(
//     {
//         input:readablestream,
//         crlfDelay:Infinity
//     }
// )

// let count=1;

// rl.on('line',(line)=>{
//     writableStream.write(`${count} : ${line}\n`);
//     count++;
// })

// rl.on('close',()=>{
//     console.log('total number of lines ; '+count)
// })

// import {Worker } from 'worker_threads';

// const worker=new Worker('./worker.js',{
//     workerData:{
//         message:'hello from main thread'
//     }
// })

// worker.on('message',(msg)=>{
//     console.log('main thread recieved : ',msg)
// })
