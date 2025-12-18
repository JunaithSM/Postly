require("dotenv").config();
const { Worker } = require("bullmq");
const { connection } = require("../queues/postQueue");
const pool = require("../db/db");
console.log("Worker started, waiting for jobs...");
new Worker("post-queue", async job => {
    const { postID, content } = job.data;
    console.log("Executing post: ", job.data);
    try{
        await pool.query(
            "UPDATE POSTS SET status = 'progress' WHERE id = $1",
            [postID]
        );
        // Posting Logic
        console.log("Posting...");
        //create the logic for posting
        // Updating the Database
        await pool.query(
            "UPDATE POSTS SET status = 'posted' WHERE id = $1",
            [postID]
        );
    } catch (err) {
        console.error(err);
        await pool.query(
            "UPDATE POSTS SET status = 'failed' WHERE id = $1",
            [postID]
        );
        throw err;

    }
},
    { connection }
); 
