/**
 * GET /
 * Home page.
 */
var User = require('../models/User');
var nodemailer = require("nodemailer");
var secrets = require('../config/secrets.js');
var path           = require('path')
  , templatesDir   = path.resolve('templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

exports.index = function(req, res) {
  if(req.user)
    if(req.user.isNewUser) {
      req.flash('info', { msg: 'Please update your profile before proceeding' });
      res.redirect('/account');
    }
    else
      getUser(req, res);
  else
    res.redirect('/login');
};

exports.postRating = function(req, res) {
  var isApproved = req.body.isApproved;
  var userID = req.body.userID;

  console.log('vote is posted');
  console.log(req.body);

  console.log(req.user.id +  " is user id");
  console.log('isApproved:' + isApproved);

  User.findById(req.user.id, function(err, user) {
    if(isApproved === true || isApproved === "true") {
      console.log(err);
      console.log('is true');
      console.log('User is ' + user.profile.name.first)
      console.log('Accepted is ' + userID);
      user.profile.acceptedUsers.push(userID);
      user.save();
      User.findById(userID, function(err2, user2) {
      //   var mailOptions = {
      //     from: "TinderHackathon@gmail.com",
      //     to: user.email,
      //     subject: "New Match on TinderHackathon",
      //     text: "You've both been matched! HappyHac"
      //   };
      //   console.log("In arr at idx: " + user2.profile.acceptedUsers.indexOf(req.user.id))
      //   if(user2.profile.acceptedUsers.indexOf(req.user.id) != -1) {
      //     console.log("Sending email!");
      //     var fullName = user2.profile.name.first + ' ' + user2.profile.name.last + ' ';
      //     mailgun.sendText('jonahback@gmail.com', user.email, "New Match on Snippet", "You've been matched with " + fullName +
      //       '<' + user2.email + '>');
      //     fullName = user.profile.name.first + ' ' + user.profile.name.last + ' ';
      //     mailgun.sendText('jonahback@gmail.com', user2.email, "New Match on Snippet", "You've been matched with " + fullName +
      //       '<' + user.email + '>');
      //
      //   }
      emailTemplates(templatesDir, function(err, template) {

  if (err) {
    console.log(err);
  } else {

    var transportBatch = nodemailer.createTransport("SMTP", {
    host: "localhost", // hostname
    secureConnection: false, // use SSL
    port: 3333, // port for secure SMTP
    auth: {
        user: "",
        pass: ""
    }
});

    // users object
    var users = [
      {
        email: user.email,
        name: {
          first: user.profile.name.first,
          last: user.profile.name.last
        },
        matchName: user2.profile.name.first,
        matchPicture: user2.profile.picture,
        matchUniversity: user2.profile.university
      },
      {
        email: user2.email,
        name: {
          first: user2.profile.name.first,
          last: user2.profile.name.last
        },
        matchName: user.profile.name.first,
        matchPicture: user.profile.picture,
        matchUniversity: user.profile.university
      }
    ];



    // Custom function for sending emails outside the loop
    //
    var Render = function(locals) {
      this.locals = locals;
      console.log*(locals);
      this.send = function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          transportBatch.sendMail({
            from: 'Snippet <match@snippethack.com>',
            to: locals.email,
            subject: 'You Have a new Match on Snippet!',
            html: html,
            //generateTextFromHTML: true,
            text: text,
          }, function(err, responseStatus) {
            if (err) {
              console.log(err);
            } else {
              console.log(responseStatus.message);
            }
          });
        }
      };
      this.batch = function(batch) {
        batch(this.locals, templatesDir, this.send);
      };
    };

    // Load the template and send the emails
    template('snippet', true, function(err, batch) {
      for(var user in users) {
        var render = new Render(users[user]);
        render.batch(batch);
      }
    });





  }
});

    })


    }
    else {
      console.log(isApproved);
      user.profile.rejectedUsers.push(userID);
      user.save();
    }
    res.redirect('/');
  });
};

var getUser = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    User.find({
      '_id': { $nin:user.profile.acceptedUsers.concat(user.profile.rejectedUsers).concat([req.user.id])},
      'isNewUser' : false
    }, function(err, newUsers) {
      if(newUsers.length > 0) {
        var gearString = '';
        if(newUsers[0].profile.gear.glass == 'yes')
          gearString += "Google Glass,";
        if(newUsers[0].profile.gear.pebble == 'yes')
          gearString += " Pebble Smartwatch,";
        if(newUsers[0].profile.gear.oculus == 'yes')
          gearString += " Oculus Rift Dev Kit,";
        if(newUsers[0].profile.gear.ios == 'yes')
          gearString += " iOS Device,";
        if(newUsers[0].profile.gear.leap == 'yes')
          gearString += " Leap Motion Controller,";
        if(newUsers[0].profile.gear.android == 'yes')
          gearString += " Android Device,";
        gearString = gearString.substring(0, gearString.length - 1);
        res.render('home', {
          title: 'Home',
          newUser: newUsers[0],
          gearString: gearString
        });
      } else {
        res.render('home', {
          title: 'Home',
          newUser: null
        });
      }
    })
  });
}
