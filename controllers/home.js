/**
 * GET /
 * Home page.
 */
var User = require('../models/User');
var nodemailer = require("nodemailer");
var secrets = require('../config/secrets.js');
var path = require('path');
var templatesDir = path.resolve('templates');
var emailTemplates = require('email-templates');
var Keen = require('keen.io');

var Keen = Keen.configure(
    {
      projectId: secrets.keen.projectId,
      writeKey: secrets.keen.writeKey
    }
);


exports.index = function(req, res) {
  if(req.user)
    if(req.user.isNewUser) {
      req.flash('info', { msg: 'Please update your profile before proceeding' });
      res.redirect('/account');
    }
    else if(req.user.matchRemove=='yes'){
      req.flash('info', { msg: 'You have removed yourself from the match queue. You can enable searching for new matches from the Profile section, or view your successful Matches here.' });
      res.redirect('/matches');
    }
    else
      getUser(req, res);
  else
    res.redirect('/login');
};

exports.postRating = function(req, res) {
  var isApproved = req.body.isApproved;
  var userID = req.body.userID;

  var voteEvent = {
    vote: isApproved,
    user: userID
  };

    Keen.addEvent("Matches", {"Vote": voteEvent}, function(err, res) {
        if (err) {
          console.log("Oh no, an error!");
        } else {
          console.log("Hooray, it worked!");
        }
      });


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
        emailTemplates(templatesDir, function(err, template) {

        if (err2) {
          console.log(err);
        } else if(user2.profile.acceptedUsers.indexOf(req.user.id) != -1) {

          var transportBatch = nodemailer.createTransport("SMTP", {
            service: "Mandrill",
            auth: {
                user: secrets.mandrill.user,
                pass: secrets.mandrill.password
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
              matchUniversity: user2.profile.university,
              matchEmail: user2.email
            },
            {
              email: user2.email,
              name: {
                first: user2.profile.name.first,
                last: user2.profile.name.last
              },
              matchName: user.profile.name.first,
              matchPicture: user.profile.picture,
              matchUniversity: user.profile.university,
              matchEmail: user.email
            }
          ];

      Keen.addEvent("Matches", {"SuccessfulMatch": users}, function(err, res) {
    if (err) {
        console.log("Oh no, an error!");
    } else {
        console.log("Hooray, it worked!");
    }
});

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
                reply_to: locals.matchEmail,
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
