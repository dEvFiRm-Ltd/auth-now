const axios = require('axios');
module.exports = class Auth {
    constructor({
        clientUrl
    }) {
        this.clientUrl = clientUrl;
        this.token = 'Please login';
        this.user = 'User not Authorize';
    }

    userRegistration(email, password, name) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await axios.post(`${this.clientUrl}/user/registration`, {
                    email,
                    password,
                    name
                })
                resolve(res.data)

            } catch (err) {
                reject(err)
            }
        })
    }

    loginWithEmailPassword(email, password) {
        return new Promise(async (resolve, reject) => {
            axios.post(`${this.clientUrl}/user/login`, {
                    email,
                    password
                })
                .then(res => {
                    localStorage.setItem('firstLogin', true);
                    document.cookie = `refreshtoken=${res.data.refreshtoken}`;
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                });

        })

    }

    userInfo() {
        // console.log('token',this.token);
        return new Promise(async (resolve, reject) => {
            let refreshToken;
            const firstLogin = localStorage.getItem('firstLogin')
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].split('=');
                if (cookie[0].trim() == 'refreshtoken') {
                    // console.log(cookie[1]);
                    refreshToken = cookie[1];
                }
            }
            //get  token
            try {
                if (firstLogin) {
                    let res = await axios.post(`${this.clientUrl}/user/refresh_token`, {
                        refreshToken: refreshToken
                    });
                    this.token = res.data.access_token;
                    if (res.data.access_token) {
                        const info = await axios.get(`${this.clientUrl}/user/info`, {
                            headers: {
                                'Authorization': res.data.access_token
                            }
                        })
                        this.user = info.data;
                        this.user.token = res.data.access_token;
                        resolve(this.user);
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }



    //login With google
    loginWithGoogle(googleData) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${this.clientUrl}/user/google_login`, {
                    tokenId: googleData.tokenId,
                });

                localStorage.setItem('firstLogin', true);
                document.cookie = `refreshtoken=${res.data.refreshtoken}`; //res or response carefully
                resolve(res.data)

            } catch (err) {
                reject(err)
            }

        })
    }

    //login with facebook 
    loginWithFacebook(facebookData) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    accessToken,
                    userID
                } = facebookData;
                const res = await axios.post('/user/facebook_login', {
                    accessToken,
                    userID,
                });
                // console.log(res.data);
                localStorage.setItem('firstLogin', true);
                document.cookie = `refreshtoken=${res.data.refreshtoken}`; //res or response carefully
                resolve(res.data)
            } catch (err) {
                // console.log(err);
                reject(err)
            }
        })
    }



    //logout

    logout() {
    
            localStorage.removeItem('firstLogin');
            document.cookie = "refreshtoken=;";
            // this.token = 'Please login';
            // this.user = 'User not Authorize';
            // return new Promise.resolve('logout successfully')
            return 'logout successfully'
        
        
    }
}