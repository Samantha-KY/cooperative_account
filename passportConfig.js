const LocalStrategy = require('passport-local').Strategy;
const  pool  = require('./dbConfig');
const bcrypt = require('bcrypt');
const { passport } = require('passport');
const { render } = require('ejs');

function initialize(passport){
const authenticateUser = (email, password, done) =>{
        pool.query(
        `SELECT * FROM members WHERE email = $1`, [email], 
        (err, results) => {
            if(err) {
                throw err;
            }
            // console.log(results.rows);
            if (results.rows.length > 0){
                const user = results.rows[0];

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err){
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    }
                    else{
                        return done(null, false, {messsage: "password is not correct or you are not an admin"});
                    }
                });
            }else{
                return done(null, false, {message: "email not registered"});
            }
        }
    )
    };

    passport.use(
        new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        authenticateUser
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.member_id);
    });

    passport.deserializeUser((id, done) => {
        pool.query(
            `SELECT * FROM members WHERE member_id = $1`, [id], (err, result) => {
                // console.log(id, "can't find a thing");
                if(err) {
                    throw err;   
                }
                return done(null, result.rows[0]);
            }
        );
    });
}

module.exports = initialize;