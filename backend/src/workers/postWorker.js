require("dotenv").config();
const { Worker } = require("bullmq");
const { connection } = require("../queues/postQueue");
const pool = require("../db/db");
const { POST_STATUS } = require("../contants/postStatus")
console.log("Worker started, waiting for jobs...");
new Worker("post-queue", async job => {
    const { postID, content } = job.data;
    console.log("Executing post: ", job.data);
    try{
        await pool.query(
            "UPDATE POSTS SET status = $1 WHERE id = $2",
            [POST_STATUS.PROCESSING, postID]
        );
        // Posting Logic
        console.log("Posting...");
        //create the logic for posting
        // Updating the Database
        await pool.query(
            "UPDATE POSTS SET status = $1 WHERE id = $2",
            [POST_STATUS.POSTED, postID]
        );
    } catch (err) {
        console.error(err);
        await pool.query(
            "UPDATE POSTS SET status = $1 WHERE id = $2",
            [POST_STATUS.FAILED, postID]
        );
        throw err;

    }
},
    { connection }
); 
