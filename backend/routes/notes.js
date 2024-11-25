const express = require('express');
const router = express.Router();
const Notes = require("../models/Notes");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require('express-validator');

//fetch all note of logged in user
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error('error', error.message);
        return res.status(500).json({ "error": "Something went wrong..!" + error.message });
    }

});


//add/save notes in db
router.post('/saveNotes', fetchUser,
    [
        body('title').isLength(1).withMessage('Please add title'),
        body('description').isLength(1).withMessage('Please add description'),
    ], async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            //check user input.. validate and send error if not valid
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({ errors: result.array() });
            }
            const notes = new Notes({
                title, description, tag, user: req.user.id
            })
            const saveNotes = await notes.save();
            res.send(saveNotes);
        } catch (error) {
            console.error('error', error.message);
            return res.status(500).json({ "error": "Something went wrong..!" + error.message });
        }

    })


//update existing note
router.put('/editNote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const editNote = {};
        if (title) { editNote.title = title };
        if (description) { editNote.description = description };
        if (tag) { editNote.tag = tag };

        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(400).json({"status":"Note not Found."});
        }

        if (note.user && note.user.toString() !== req.user.id) {
            return res.status(400).json({"status":"You are not allowed to edit this note."});
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: editNote }, { new: true })
        res.json({"status":"Your note updated successfully." , note:note});
    } catch (error) {
        console.error('error', error.message);
        return res.status(500).json({ "error": "Something went wrong..!" + error.message });
    }
})



//delete Note
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(400).json({"status":"Note not Found."});
        }

        if (note.user && note.user.toString() !== req.user.id) {
            return res.status(400).json({"status":"You are not allowed to delete this note."});
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"status":"Your note deleted successfully."});
    } catch (error) {
        console.error('error', error.message);
        return res.status(500).json({ "error": "Something went wrong..!" + error.message });
    }

})
module.exports = router