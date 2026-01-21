const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
    },
    {
        timestamps: true,
    }
);

// Has password before saving if modified or new
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
    } catch (err) {
        nect(err);
    }
});

userSchema.methods.isCorrectPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
  