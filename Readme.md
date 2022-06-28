# Auth-Now
### The world Easist authentication package

```js

```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm i auth-now
```
## Features

 - backend authentication just 3 stape
 - Custom create user(email and password)
 - Custom login
 - Login with Google 
 - Login with Facebook
 - Admin check
 - Get user info
 - Logout funtionality

> Note: `mongoose cors ` is required for useing `auth-now`.

## Crate a user mode
### User.js(mongoose model)

```js
const {Schema,model} = require('mongoose');

const userSchema = new Schema({
    name:{
        type: 'string',
        // require:[true,'Please Enter your Name '],
        trim:true
    },
    email: {
        type: 'string',
        require:[true,'Please Enter your Email '],
        trim: true
    },
    password: {
        type: 'string',
    },
    role:{
        type: Number,
        default:0  // user:0,admin:1
    },
    avatar: {
        type: String,
        default: "" //you can add a default image
    },
    googleID:String,
    facebookID:String,
    provider:{
        type:String,
        default:'custom',
        enum : ["custom", "google", "facebook"]
    }

},{
    timeStamp: true
})

module.exports = model('User',userSchema);
```

## Backend Configaration
```js
npm i mongoose  // must install it
```
```js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Auth = require('auth-now');

const auth = new Auth({
    model:require('./models/user'),//add your model file location
    googleClientID:process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:process.env.GOOGLE_CLIENT_SECRET,
    facebookAppID:process.env.FACEBOOK_APP_ID,
    facebookAppSecret:process.env.FACEBOOK_APP_SECRET ,
    // accessTokenSecret,
    // refreshTokenSecret,
})

app.use('/user',auth.router(app)); // This route name must be '/user'

//connect your database

app.listen(3000,()=>{
    console.log(`server is running on port : 3000);
});
```


# Forntend 








