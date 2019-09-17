# Mongoose Referrence Validator
This is a plugin for mongoose meant to validate the referrences that are defined in the schema

## Install

```bash
$ npm install mongoose-referrence-validator
```

## How To use

```javascript
const referrenceValidator = require('mongoose-referrence-validator');

const companySchema = new mongoose.Schema({
  name: String
});

let modelCompany = mongoose.model('company', companySchema);

const employeeSchema = new mongoose.Schema({
  name: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
  },
});
employeeSchema.plugin(referrenceValidator)
let modelEmployee = mongoose.model('employee', employeeSchema);
```

Now if an employee is created with an invalid companyId, it will throw an error

```javascript
let companyObj = new modelCompany({ name: 'MongoDB' });
companyObj = await companyObj.save();

let employeeObj = new modelEmployee({ name: 'Mark', companyId: '5d7c70918a680e1bc7cf31bf' });// Some random MongoDB ID
employeeObj = await employeeObj.save(); //throws error
/*
  Error [ValidationError]: employee validation failed: companyId: Invalid ID(s)
*/

let employeeObj = new modelEmployee({ name: 'Mark', companyId: companyObj._id });
employeeObj = await employeeObj.save(); // Works fine with a valid id
```

It works equally well with an array of referrence ids as well
```javascript
const schema = new mongoose.Schema({
  name: String,
  ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'referrence'
  }
});
schema.plugin(referrenceValidator)
let modelSchema = mongoose.model('schema', schema);

let obj = new modelSchema({name: 'Mark', ids: ['5d7c70918a680e1bc7cf31bf', '5d7c70918a680e1bc7cf31bf']})// Some random MongoDB IDs
obj.save() //throws an error
```

Using same referrence ID in an array will also throw an error
```javascript
let obj = new modelSchema({name: 'Mark', ids: ['5d7c70918a680e1bc7cf31bf', '5d7c70918a680e1bc7cf31bf']})
obj.save() //throws an error
```

It will also check for a valid `ref` value
```javascript
const employeeSchema = new mongoose.Schema({
  name: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'compan',
  },
});
employeeSchema.plugin(referrenceValidator) //throws an error
/*
  Error: Invalid referrence: 'compan' for path: companyId
*/
```
