const express = require("express");
const router = express.Router();
const { postQueue } = require("../queues/postQueue");
const pool = require("../db/db");
router.post("/schedule", async ( req, res ) => {
    const { content, runAt } = req.body;
    const delay = new Date(runAt) - new Date();
    if( delay <= 0)
            return res.status(400).json({ error: "Invaild time"})

    // Adding to the data base
    const result = await pool.query(
        "INSERT INTO POSTS (content, run_at) VALUES ($1 , $2) RETURNING id",
        [content, runAt]
    );

    //Sent to Queue 
    const postID = result.rows[0].id;
    await postQueue.add(
        "post",
        { postID, content },
        { 
            delay,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            }
        }
    );
    res.json({ status: "schedule"});
});

// To Display the all scheduled posts   
router.get("/", async (req, res) => {
    try{
        const result = await pool.query(
            "SELECT id, content, run_at, status, created_at FROM POSTS ORDER BY created_at DESC"  
        )
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try{
        const result = await pool.query(
            "DELETE FROM POSTS WHERE id = $1 AND status = 'scheduled' RETURNING id",
            [id]
        );
        if(result.rowCount === 0){
            return res.status(400).json({
                error: "Cannot delete post (already processing/posted or not found)"
            });
        }

        res.json({ status: "Deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Delete failed" });
    }
});
module.exports = router; 

