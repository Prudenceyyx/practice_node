const User = require('../models/user')

exports.form = (req, res) => {
  res.render('register', { title: 'Register' });
}

exports.submit = (req, res, next) => {
  const data = req.body.user;
  User.getByName(data.name, (err, user) => { //checks whether username is unique
    if (err) return next(err); //Defers database errors and other errors
    //redis will default it
    if (user.id) { //If username is already taken
      res.error('Username already taken!')
      res.redirect('back');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });
      user.save((err) => {
        if (err) return next(err);
        req.session.uid = user.id; //Stores uid for autentication
        res.redirect('/')
      })
    }
  })

}