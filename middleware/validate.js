//Parses entry[name] notation
function parseField(field) {
  return field.split(/\[|\]/).filter((s) => s);
}

//Looks up property based on parseField() results
function getField(req, field) {
  let val = req.body;
  field.forEach((prop) => {
    val = val[prop];
  });
  return val;
}


exports.required = (field) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.error(`${field.join(' ')} is required`);
      // res.locals.message = `${field.join(' ')} is required`;
      res.redirect(500, 'back');
    }
  };
};



exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      const fields = field.join(' ');
      // res.locals.message = `${fields} must have more than ${len} charactres`;
      res.error(`${fields} must have more than ${len} charactres`);
      res.redirect(500, 'back');
    }
  };
};