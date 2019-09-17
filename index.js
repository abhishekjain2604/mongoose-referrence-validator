
let mongoose = require('mongoose');

let getValidator = function (model) {
  return async function (ids) {
    if (!(ids instanceof Array))
      ids = [ids];

    let count = await model.countDocuments({ _id: { $in: ids } });
    return count == ids.length;
  };
};

let referrenceValidator = function (schema, options) {
  for (let field of Object.values(schema.paths)) {
    if (!field.options.ref) continue;

    let model;
    try {
      model = typeof field.options.ref == 'string' ? mongoose.model(field.options.ref) : field.options.ref;
    }
    catch (error) {
      if (error.name = 'MissingSchemaError')
        throw new Error(`Invalid referrence: '${field.options.ref}' for path: ${field.path}`);
      throw error;
    }

    field.validators.push({
      validator: getValidator(model),
      message: 'Invalid ID(s)'
    })
  }
};

module.exports = referrenceValidator