var nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "giangpxph34542@fpt.edu.vn", //Email gui di
        pass: "fksn kkyp vbtj ioti" // Mat khau email gui
    }
})

module.exports = transporter;