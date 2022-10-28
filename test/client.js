const Auth = require('auth-now/client');

const auth = new Auth({
    clientUrl:'http://localhost:5001'
})
let obj = {}
let permission = ['ok','update-user-permissions','add new']

const show = async ()=>{
    try {
        // const data = await auth.userRegistration({email:"sihab12@gmail.com",password:"123456",firstName:"Shihab",lastName:"hossain"});
        const data = await auth.userPermissionUpdate(['ok','update-user-permissions','add new','about'])
    console.log(data);
    } catch (error) {
        console.log(error);
    }
}

// show()
console.log([...permission]);
