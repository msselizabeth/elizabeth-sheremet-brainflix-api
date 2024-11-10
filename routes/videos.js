import express from "express";
import fs from "fs";
import { v4 as uuid } from "uuid";
import multer from "multer";
import { channel } from "diagnostics_channel";
const router = express.Router();

// Configure multer to store uploaded images in 'public/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

//  get all videos
router.get("/", (req, res) => {
    const videosData = JSON.parse(fs.readFileSync("./data/videos.json"));
    const result = videosData.map(video => {
        return {
            channel: video.channel,
            image: video.image,
            title: video.title
        }
    })
    res.json(videosData);
});

// post new video + upload thimbnail with multer
router.post("/", upload.single("thumbnail"), (req, res) => {
    const videosData = JSON.parse(fs.readFileSync("./data/videos.json"));
    const image = req.file && req.file.filename ? req.file.filename : "default-thumbnail.jpg";


    const { title, description } = req.body;
    if (!title.trim()) {
        res.status(400).send("Title is required");
        return;
    }
    if (!description.trim()) {
        res.status(400).send("Description is required");
        return;
    }

    const newVideo = {
        id: uuid(),
        title,
        channel: "Elizabeth Sheremet",
        image: `./images/${image}`,
        description,
        views: "0",
        likes: "0",
        duration: "00:20",
        video: "./videos/brainstation-sample-video.mp4",
        timestamp: Date.now(),
        comments: [],
    };

    videosData.push(newVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

    res.status(201).json(newVideo);
});

// get video by ID
router.get("/:id", ((req, res) => {
    const { id } = req.params;
    const videosData = JSON.parse(fs.readFileSync("./data/videos.json"));

    const video = videosData.find((video) => video.id === id);

    if (!video) {
        res.status(404).send(`Error could not find product with id: ${id}`);
        return;
    }

    res.json(video);
}));

export default router;
