import express from "express";
import cors from "cors";
import "dotenv/config";
import chalk from "chalk";
import { Worker } from "worker_threads";
import { exec } from "child_process";
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

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
