/**
 * GET /
 * Home page.
 */
var User = require('../models/User');
exports.index = function(req, res) {
  var matches = [];
  if(req.user) {
    User.findById(req.user.id, function(err, user) {
      User.find({
        '_id': { $in:user.profile.acceptedUsers}
      }, function(err2, users) {
        users.forEach(function(finalUser) {
          if(finalUser.profile.acceptedUsers.indexOf(req.user.id) != -1) {
            matches.push(finalUser);
          }
        })
        res.render('matches', {
          title: 'Matches',
          matches: matches
        });
      })
    });
  }
};
