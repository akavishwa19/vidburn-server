import { exec } from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

const create_subtitles = (audio_path) =>{
    const __filename=fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    return new Promise((resolve,reject)=>{
        const python_script_path=path.join(__dirname,'..','Scripts','generate_subtitles.py');

        const command=`python "${python_script_path}" "${audio_path}"`;

        exec(command,(error,stderr,stdout)=>{
            if(error){
                return reject(error)
            }

            const subtitle_path=stdout.trim();
            resolve(subtitle_path);
        })

    })

}

export default create_subtitles;