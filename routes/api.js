
var express = require('express');
var router = express.Router();
const Upload = require('../config/common/upload')
const Transporter = require('../config/common/mail')
const Users = require('../models/users')
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC"

// Them model 
const Distributors = require('../models/distributors')
const Fruits = require('../models/fruits')

// Api them distributor
router.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body //Lay du lieu tu body
        const newDistributors = new Distributors({
            name: data.name
        }) // Tao 1 doi tuong moi
        const result = await newDistributors.save(); // them vao database
        if (result) {
            // Neu them thanh cong result !null tra ve du lieu
            res.json({
                "status": 200,
                "messenger": "added success",
                "data": result
            })

        } else {
            // Neu them khong thanh cong result null, thong bao ko thanh cong
            res.json({
                "status": 400,
                "messenger": "Error, add failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

// Api them fruits
router.post('/add-fruit', async (req, res) => {
    try {
        const data = req.body // lay du lieu tu body
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        }) // tao 1 doi tuong moi
        const result = await newfruit.save() // them vao database
        if (result) {
            // them thanh cong va tra ve du lieu
            res.json({
                "status": 200,
                "messenger": 'added success',
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Error, add failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Get danh sach Fruits
router.get('/get-list-fruit', async (req, res) => {
    const authHeader = req.headers['authorization']
    //Authorization thêm từ khóa "Bearer token"
    //nên sẽ xử lý cắt chuỗi
    const token = authHeader && authHeader.split(' ')[1]
    //Nếu ko có token sẽ trả về 401
    if (token == null) return res.sendStatus(401)
    let payload;
    JWT.verify(token, SECRETKEY, (err, _payload) => {
        //Kiểm tra token, nếu token không đúng, hoặc hết hạn
        // Trả status code 403
        // Trả status hết hạn 401 khi token hết hạn
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401)
        if (err) return res.sendStatus(403)
        //Nếu đúng sẽ log ra dữ liệu
        payload = _payload
    })
    console.log(payload)

    try {
        const data = await Fruits.find().populate('id_distributor')
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error)
    }
})

// Get chi tiet Fruits (truyen param id)
router.get('/get-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params // Lay du lieu thong qua :id tren url goi la param
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error)
    }
})


//Get danh sach Fruits (***)
router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const { price_start, price_end } = req.query //Lay du lieu thong qua :id tren url goi la param

        const query = { price: { $gte: price_start, $lte: price_end } }
        //$gte lon hon hoac bang, $ge lon hon
        //$lte nho hon hoac bang, $le nho hon
        //Truyen cau dieu kien, va chi lay cac truong mong muon
        const data = await Fruits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor')
            .sort({ quantity: -1 }) //giam dan = -1, tang dan = 1
            .skip(0) // bo qua so luong row
            .limit(2) // lay 2 san pham

        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error)
    }
})


// Get danh sach Fruits (danh sach tra ve gom: name, quantity, price , id_distributor) co chu cai bat dau la A hoac X
router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    try {
        const query = {
            $or: [
                { name: { $regex: 'A' } },
                { name: { $regex: 'X' } }
            ]
        }

        //truyen cau dieu kien, va chi lay cac truong mong muon
        const data = await Fruits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor')

        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error)
    }
})


// Api cap nhat fruit
router.put('/update-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body // lay du lieu tu body
        const updatefruit = await Fruits.findById(id)
        let result = null;
        if (updatefruit) {
            updatefruit.name = data.name ?? updatefruit.name
            updatefruit.quantity = data.quantity ?? updatefruit.quantity
            updatefruit.price = data.price ?? updatefruit.price
            updatefruit.status = data.status ?? updatefruit.status
            updatefruit.image = data.image ?? updatefruit.image
            updatefruit.description = data.description ?? updatefruit.description
            updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor
            result = await updatefruit.save();
        }
        //Tao 1 doi tuong moi
        // Them vao database
        if (result) {
            //Them thanh cong va tra ve du lieu
            res.json({
                "status": 200,
                "messenger": "Updated success",
                "data": result
            })
        } else {
            //Them ko thanh cong , thong bao 
            res.json({
                "status": 400,
                "messenger": "Error, Update failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Api xoa fruit
router.delete('/destroy-fruit-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await Fruits.findByIdAndDelete(id)
        if (result) {
            // Neu xoa thanh cong se tra ve thong tin item da xoa
            res.json({
                "status": 200,
                "messenger": "Deleted success",
                "data": result
            })

        } else {
            res.json({
                "status": 400,
                "messenger": "Error, Delete Failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Api them moi 1 collection co hinh anh duoc upload
router.post('/add-fruit-with-file-image', Upload.array('image', 5), async (req, res) => {
    // Upload.array('image',5) => up nhieu file toi da la 5 
    // upload.single('image') => up load 1 file
    try {
        const data = req.body // Lay du lieu tu body
        const { files } = req   // Lay file neu upload nhieu, file neu 1
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)
        const newfruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,  //Them ca url hinh
            description: data.description,
            id_distributor: data.id_distributor
        }) // tao 1 doi tuong moi
        const result = await newfruit.save() // them vao database
        if (result) {
            // Neu them thanh cong result !null tra ve du lieu
            res.json({
                "status": 200,
                "messenger": "Added success",
                "data": result
            })
        } else {
            // Neu them that bai result null, thong bao that bai
            res.json({
                "status": 400,
                "messenger": "Error, Add failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Api dang dy user ket hop gui mail
router.post('/register-send-email', Upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body
        const { file } = req
        const newUser = Users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
            //url avatar http://localhost:3000/uploads/filename
        })
        const result = await newUser.save()
        if (result) {
            //Gui mail
            const mailOptions = {
                from: "giangpxph34542@fpt.edu.vn", //email gui di
                to: result.email, // email nhan
                subject: "Register Successfully", // subject
                text: "Thank you for register" // noi dung mail
            };
            // Neu them thanh cong result !null tra ve du lieu
            await Transporter.sendMail(mailOptions);
            res.json({
                "status": 200,
                "messenger": "Added success",
                "data": result
            })
        } else {
            // Neu that bai, thong bao loi
            res.json({
                "status": 400,
                "messenger": "Error, Add failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// API gui email
//import thu vien 
const mailer = require('nodemailer')

router.post('/send-mail', Upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body
        const { file } = req
        const newUser = Users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
            //url avatar http://localhost:3000/uploads/filename
        })
        const result = await newUser.save()
        if (result) {
            // Chuan bi thong tin
            const mailOption = {
                from: 'giangpxph34542@fpt.edu.vn',
                to: 'phungxuangiang.hanoi@gmail.com',
                subject: 'test email',
                text: 'Day la email test'
            }
             // Neu them thanh cong result !null tra ve du lieu
             await Transporter.sendMail(mailOption);
             res.json({
                 "status": 200,
                 "messenger": "Added success",
                 "data": result
             })

        } else {
            // Neu that bai, thong bao loi
            res.json({
                "status": 400,
                "messenger": "Error, Add failed",
                "data": []
            })
        }
    } catch (error) { 
        console.log(error)
    }


})


// API login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await Users.findOne({ username, password })
        if (user) {
            //Token nguoi dung se su dung gui len tren header moi lan muon goi api
            const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' })
            // Khi token het han, nguoi dung se call 1 api khac de lay token moi
            // Lúc ngày người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token, refreshToken mới
            // Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại
            const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' })
            // expiresIn thời gian token
            res.json({
                "status": 200,
                "messenger": "Login succesfully",
                "data": user,
                "token": token,
                "refreshToken": refreshToken
            })
        } else {
            // Them that bai , thong bao loi
            res.json({
                "status": 400,
                "messenger": "Error, Login failed",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//Api lấy danh sách distributor
router.get('/get-list-distributor', async (req, res) => {
    try{
        //Lấy danh sách theo thứ tự distributors mới nhất
        const data = await Distributors.find().sort({createAt: -1})
        if(data) {
            //trả về danh sách
            res.json({
                "status": 200,
                "messenger": "Thành công",
                "data": data
            })
        }else {
            //Nếu thêm không thành công result null, thông báo không thành công
            res.json({
                "status": 400,
                "messenger": "Lỗi, không thành công",
                "data": []
            })
        }
    }catch(error){
        console.log(error)
    }
});

module.exports = router