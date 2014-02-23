/**
 * GET /
 * Home page.
 */
var User = require('../models/User');

exports.index = function(req, res) {
  if(req.user)
    getUser(req, res);
  else
    res.redirect('/login');
};

exports.postRating = function(req, res) {
  var isApproved = req.body.isApproved;
  var userID = req.body.userID;
  res.send(200);

  console.log('vote is posted');
  console.log(req.body);

  console.log(req.user.id +  " is user id");

  User.findById(req.user.id, function(err, user) {
    if(isApproved) {
      console.log(err);
      console.log('is true');
      console.log('User is ' + user.profile.name.first)
      console.log('Accepted is ' + userID);
      user.profile.acceptedUsers.push(userID);
      user.save();
    }
    else {
      console.log(isApproved);
      user.profile.rejectedUsers.push(userID);
      user.save();
    }
  });
};

var getUser = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    User.find({
      '_id': { $nin:user.profile.acceptedUsers.concat(user.profile.rejectedUsers).concat([req.user.id])}
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
        res.render('login');
      }
    })
  });
}
