const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          let user = await User.findByEmail(email);
          let role = "user";
          if (!user) {
            user = await Admin.findByEmail(email);
            role = "admin";
          }
          if (!user) {
            return done(null, false, {
              message: "No account found with that email",
            });
          }

          // const match = await bcrypt.compare(password, user.password);
          console.log(password, user.password);
          if (password != user.password) {
            return done(null, false, { message: "Password incorrect" });
          }
          return done(null, { ...user, role });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
  });

  passport.deserializeUser(async (obj, done) => {
    try {
      const data =
        obj.role === "admin"
          ? await Admin.findById(obj.id)
          : await User.findById(obj.id);
      if (data) {
        done(null, { ...data, role: obj.role });
      } else {
        done(new Error("User not found"), null);
      }
    } catch (error) {
      done(error, null);
    }
  });
};
