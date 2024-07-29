export interface Req{
    body:{
        username?:string,
        phone_number:string,
        password:string,
        lastLogin?:string,
        userPlatform?:string,
        access_token?:string
    },
    params:{
        phone_number:string,
    }
}

