let express = require("express");
let router = express.Router();
let sequelize = require("../db");
let User = sequelize.import("../models/users");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

//up above are called variables

/** SIGNUP ***/
router.post("/create", function (req, res) { //ok to receive a post request
    console.log('signing up')
    let email = req.body.user.email;
    let password = req.body.user.password;
<<<<<<< HEAD
    let adminStatus = req.body.user.adminStatus;
    let userRole = req.body.user.userRole;
    //console.log(req.body)
=======
    let isAdmin = req.body.user.isAdmin || false;
    console.log('email, password')
>>>>>>> 2b062aaf8313cce35a4e03790c2a447498cd4f4a
    User.create({
        email: email,
        isAdmin: isAdmin,
        passwordhash: bcrypt.hashSync(password, 10),  //this means you will do 10 rounds of bycrpt.
        adminStatus: adminStatus,
        userRole: userRole
    }).then(
        function createSuccess(user) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
            res.json({
                user: [user.id, user.email], //return so that Angular can track if someone is actually logged in
                token: token,
                message: "Hello, there!",
            })
        },
        function createError(err) {
            res.send(500, err.errors[0].message || err.message)
        }
    )
})

/*** Login *** */
router.post("/login", function (req, res) {
    User.findOne({ where: { email: req.body.user.email } })
    .then(
        function (user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.passwordhash, function (err, matches) {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
                        res.json({
                            user: user,
                            message: "",
                            token: token
                        })
                    } else {
                        res.status(403).send({ error: "Please provide valid credentials ." })
                    }
                })
            } else {
                res.status(500).send({ error: "Not found." })
            }
        },
        // .catch(err => {
        //     res.status(500).send(err);
        //     })
        function (err) {
            res.status(500).send({ err: err.message })
        }
    )
})

/********Update User to Admin   */  //can promote regular users to admin with a click of a button
router.put("/promote/:id", function (req, res) {
    let input = req.params.id;
    User.update({
        userRole: "admin"

    }, { where: { id: input }}) //look for user with provided id
    .then(
        function createSuccess(user) {
            res.json({
                updated: user,
                //message: "Hello, there!",
            })
        },
        function createError(err) {
            res.status(500).send(err.message)
        }
    )
})

/***admin can delete a user */
router.delete("/remove/:id", function (req, res) {
    let input = req.params.id;
    User.destroy({ where: { id: input }}) //delete the user
    .then(
        function createSuccess(User) {
            res.json({
                updated: User,
                //message: "Hello, there!",
            })
        },
        function createError(err) {
            res.status(500).send(err.message)
        }
    )
})

module.exports = router