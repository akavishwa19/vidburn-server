import { Router } from "express";
import { check_audio } from "../Controllers/video.controller.js";

const router=Router()

router.get("/check-audio/:name", check_audio);

export default router;
