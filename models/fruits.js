const mongoose = require('mongoose')
const Scheme = mongoose.Schema;

const Fruits = new Scheme({
    name: {type: String},
    quantity: {type: Number},
    price: {type: Number},
    status: {type: Number}, // status =1 => con hang, =0 => het hang, =-1 => Ngung kinh doanh,
    image: {type: Array},   // Kieu du lieu danh sach
    description: {type: String},
    id_distributor: {type: Scheme.Types.ObjectId, ref: 'distributor'},

},{
    timestamps: true
})

module.exports = mongoose.model('fruit', Fruits)

/*
    type: Scheme.Types.ObjectId => Kieu du lieu id cua mongdb
    ref: khoa ngoai
*/