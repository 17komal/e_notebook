const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const fetchUser = require('../middleware/fetchUser');
const jwtSecrectKey = "1e5a289dd9c6442c8f2a75aaabdddf67";///process.env.JWT_SECRET_KEY;

//Create user /SIGN UP
router.post('/sign_up',
    [
        body('name').isLength(3).withMessage('Enter a Valid name'),
        body('email').isEmail().withMessage('Enter a Valid E-mail address'),
        body('password').isLength(8).withMessage('Password must atleast 8 charecter'),
    ], async (req, res) => {
        //check user input.. validate and send error if not valid
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({"status":false, errors: result.array() });
        }
        try {
            //check if user exists or not
            let user = await User.findOne({ "email": req.body.email });
            if (user) {
                return res.status(400).json({ "status":false,"error": "Sorry user with this email id already exists..!" });
            }
            //create encrypted password using bcryptJS
            var salt = await bcrypt.genSalt(10);
            var securePass = await bcrypt.hash(req.body.password, salt);


            //create user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePass,
            });
            const data = {
                user: {
                    id: user.id
                }
            }
            const userName = user.name;
            const authToken = jwt.sign(data, jwtSecrectKey);
            res.json({"status":true, authToken ,userName});
        }
        catch (error) {
            console.error('error', error.message);
            return res.status(500).json({"status":false, "error": "Something went wrong..!" + error.message });
        }
    });



//Login Route

router.post('/login',
    [
        body('email').isEmail().withMessage('Enter a Valid E-mail address'),
        body('password').isLength(8).withMessage('Enter a Valid Password'),
    ], async (req, res) => {
        //check user input.. validate and send error if not valid
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({"status":false, errors: result.array() });
        }
        const { email, password } = req.body;
        try {
            //check if user exists or not
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ "status":false, "error": "Please enter valid credentails.!" });
            }

            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(400).json({"status":false, "error": "Please enter valid credentails..!" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const userName = user.name;
            const authToken = jwt.sign(data, jwtSecrectKey);;
            res.json({ "status":true, authToken ,userName});
        }
        catch (error) {
            console.error('error', error.message);
            return res.status(500).json({"status":false, "error": "Something went wrong..!" + error.message });
        }
    });


//get user details 

router.post('/getUser', fetchUser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send({"status":false,"user":user});
    } catch (error) {
        console.error('error', error.message);
        return res.status(500).json({"status":false, "error": "Something went wrong..!" + error.message });
    }
})



module.exports = router