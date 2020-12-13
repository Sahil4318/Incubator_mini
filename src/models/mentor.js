const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mentorSchema =mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    Field:{
        type: String,
        required: true,
        trim: true
    },
    linkedinProfile: {
        type:String,
        required: true,
        trim:true,
        validate(value)
        {
            const regex=/(https?)?:?(\/\/)?(([w]{3}||\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if(!regex.test(value))
            {
                throw new Error('Invalid profile link');  
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

const mentor = mongoose.model('mentor', mentorSchema);

module.exports = mentor;