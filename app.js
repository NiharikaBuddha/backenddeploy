const express=require("express")
const fs = require("fs");
const path = require("path");
const cors=require("cors")
require('dotenv').config();
const bodyparser=require("body-parser")
const sequelize=require("./util/database")
const compression = require("compression");
const helmet=require('helmet');
const morgan=require('morgan');
const https=require('https');


const expenseDetails=require("./routes/expenses")
const premiumFeatureDetails = require("./routes/premium-feature-route");
const premiumDetails = require("./routes/premium-route");
const userDetails = require("./routes/user-routes");
const resetPassword = require("./routes/reset-password")


const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/orders");
const forgotPassword = require("./models/forgotpassword");
const downloadFile = require("./models/download");



const app=express();

const accessLogStream=fs.createWriteStream(
    path.join(__dirname,'access.log'),{
    flags:'a'
});

app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(bodyparser.json());

app.use(compression());

// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');

app.use(expenseDetails)
app.use(userDetails);
app.use(premiumDetails);
app.use(premiumFeatureDetails);
app.use(resetPassword);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

User.hasMany(downloadFile);
downloadFile.belongsTo(User);

console.log(process.env.NODE_ENV);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
});

console.log("updated node_modules");

sequelize.sync().then(()=>{
    //https.createServer({key:privateKey,cert:certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
})
