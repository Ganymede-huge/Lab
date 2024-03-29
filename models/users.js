const mongoose = require('mongoose')
const Scheme = mongoose.Schema;

const Users = new Scheme({
    username: {type: String, unique: true, maxLength: 255},
    password: {type: String, maxLength: 255},
    email: {type: String, unique: true},
    name: {type: String},
    avatar: {type: String},
    available: {type: Boolean, default: false},

},{
    timestamps: true
})

module.exports = mongoose.model('user', Users)

/*
    mongoose.model('user', User)
    dat ten collection, dat o dang so it
    thu vien mongoose se tu dong tao ra ten collection 
    so nhieu (user => users)
*/

/*
    Type: String, Boolean => kieu du lieu
    unique: true => khong duoc trung
    maxLength: 255 => toi da ky tu dc nhap
    default: false => gia tri mac dinh la false
    timestamps => Tao ra 2 truong creatAt va updateAt
*/