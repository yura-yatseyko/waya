const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlenght: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumberCode: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlenght: 6
    },
    pinNumber: {
        type: String,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, '1111').toString();
  
    user.tokens = user.tokens.concat([{access, token}]);
  
    return user.save().then(() => {
      return token;
    });
};
  
UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
      $pull: {
        tokens: {token}
      }
    });
};

UserSchema.methods.checkPinNumber = function (pinNumber) {
    var user = this;

    return new Promise((resolve, reject) => {
        if (user.pinNumber == pinNumber) {
            resolve(user);
        } else {
            reject();
        }
    });
};

UserSchema.methods.updateUserPassword = function (password, newPassword) {
    var user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        reject();
                    } else {
                        user.password = newPassword;
                        user.save().then((doc) => {
                            resolve(doc) ;
                        }, () => {
                            reject();
                        });
                    }
                });
            } else {
                reject();
            }
        });
    });
};

UserSchema.methods.updateUserData = function (data) {
    var user = this;

    user.email = data.email;
    user.phone = data.phone;
    user.name = data.name;

    return new Promise((resolve, reject) => {
        user.save().then((doc) => {
            resolve(doc) ;
        }, () => {
            reject();
        });
    });
};
  
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
  
    try {
      decoded = jwt.verify(token, '1111')
    } catch (e) {
      return Promise.reject();
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};
  
UserSchema.statics.findByCredentials = function (emailOrPhone, password) {
    var User = this;
  
    return User.findOne({
        $or: [
            { email: emailOrPhone },
            { phone: emailOrPhone }
        ]
    }).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};
  
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
    
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};