var db=require('../config/connection')
var collection=require('../config/collections')
var bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
            userData.password=await bcrypt.hash(userData.password,10)

            let re=await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
            if (re) {
                resolve(false)
            }else{
            db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((req,res)=>{
                resolve(true)
            }) 
        } 
        })
    },
    doLogin:(userData)=>{
        return new Promise(async (resolve, reject) => {
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
            if (user) {
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if (status) {
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                    }
                })
            }else{
                resolve({status:false})
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve, reject) => {
            let users=db.get().collection(collection.USER_COLLECTIONS).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(proId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTIONS).deleteOne({_id:ObjectId(proId)}).then(()=>{
                resolve(true)
            })
        })
    },
    getUsers:(user)=>{
        return new Promise(async (resolve, reject) => {
        console.log(user);
        //    let users= await db.get().collection(collection.USER_COLLECTIONS).find({$or:[{$text:{$search: user}},{$match:{name:'0'}}]}).toArray()
           let users= await db.get().collection(collection.USER_COLLECTIONS).find({name:{$regex:`^${user}`}}).toArray()
           console.log(users);
           resolve(users)
        })
    },
    getProducts:(user)=>{
        return new Promise(async (resolve, reject) => {
        console.log(user);
        //    let users= await db.get().collection(collection.USER_COLLECTIONS).find({$or:[{$text:{$search: user}},{$match:{name:'0'}}]}).toArray()
           let users= await db.get().collection(collection.PRODUCT_COLLECTIONS).find({$text:{$search: user}}).toArray()
        //    let users= await db.get().collection(collection.PRODUCT_COLLECTIONS).find({name: /^user/}).toArray()
           console.log(users);
           resolve(users)
        })
    }
}