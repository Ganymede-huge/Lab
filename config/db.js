const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
// Doi voi database dung compass
const local = "mongodb://127.0.0.1:27017/MyDatabase"
// Doi voi database dung atlas(cloud)
// const atlat = "mongodb+srv://giangpxph34542:giang11092004@cluster1.ixvoloo.mongodb.net/?retryWrites=true&w=majority";
const atlat = "mongodb+srv://Ganymede_huge:giang11092004@cluster0.zotmusy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connect = async () => {
  try {
    await mongoose.connect(local, /*truyen bien database muon connect*/
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('connect success')
  } catch (error) {
      console.log(error)
      console.log('connect fail')
  }
}
module.exports = {connect}