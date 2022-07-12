const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new localStrategy({
        usernameField: "email"
    }, (email, password, done) => {

        User.findOne({
            email: email
        }).then((user) => {
            if (!user) {
                return done(null, false, {
                    message: "This account doesn't exist."
                })
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "Invalid password."
                    })
                }

            })

        })
    }))

}




passport.serializeUser((user, done) => {

    done(null, user.id)
}) // Salva os dados do usuario numa sessão



passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// CONTINUE 