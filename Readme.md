# Auth-Now
### The world easiest authentication package


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
const app = require('express')();
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


# [Forntend ]

again install the packag in forntend
> Note: again install the packag in fornten.
### `configuration`
```js
import Auth from 'auth-sdk/client'

const auth = new Auth({
    clientUrl:'http://exampole.com'
})

export default auth;
```
### All function:
1.userRegistration(email,password,name)
2.loginWithEmailPassword(email,password)
3.userInfo()
4.loginWithGoogle(response)
5.loginWithFacebook(response)
6.logout()

### some veriable:
1.`clientUrl`
2.`token`
3.`user`
### 1.userRegistration(email,password,name)
This function for user create or registration .
```js
  const registerUser = async()=>{
        try {
          let res = await auth.userRegistration(email,password)
        console.log(res);
        } catch (err) {
          console.log(err.response.data);
          
        }
    }
```

### 2.loginWithEmailPassword(email,password)
```js
 const customLogin = async()=>{
      try {
        let res = await auth.loginWithEmailPassword(email,password)
        console.log(res);
      } catch (err) {
        console.log(err.response.data);
        }
    }
```
### 3.userInfo()
```js
 const getUserData = async()=>{
      try {
        let res = await auth.userInfo();
        console.log('user',res);
        console.log('all',auth);
      } catch (err) {
        console.log(err.response.data);
        }
    }
```
### 4.loginWithGoogle(response)
```js
const responseGoogle = async(response)=>{
      try {
        let res = await auth.loginWithGoogle(response)
        console.log(res);
        
      } catch (error) {
        console.log(error.response.data);
      }
    }
```
### 5.loginWithFacebook(response)
```js
const responseFacebook = async(response)=>{
      try {
        let res = await auth.loginWithFacebook(response)
        console.log(res);
        
      } catch (error) {
        console.log(error.response.data);
     
```
### 6.logout()
```js
const logout =async ()=>{
   auth.logout();
}
```








