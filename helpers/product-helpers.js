var db=require('../config/connection')
var collection=require('../config/collections')
const { ObjectId } = require('mongodb')
const { response } = require('../app')
// objectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve, reject) => {
            let products=db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).deleteOne({_id:ObjectId(proId)}).then(()=>{
                resolve(true)
            })
        })
    },
    getProductDetails:(proId)=>{
       return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:ObjectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({_id:ObjectId(proId)},
            {$set:{name:proDetails.name,
                category:proDetails.category,
                price:proDetails.price,
                description:proDetails.description}
            }).then(()=>{
                resolve()
            })
        })
    }
}