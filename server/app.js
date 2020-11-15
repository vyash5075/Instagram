const express=require('express');
const app=express();  //invoke
const mongoose=require('mongoose')
const {MONGOURI}=require('./keys');
const auth=require('./routes/auth');
const post=require('./routes/post')
const bodyParser=require('body-parser');
mongoose.connect(MONGOURI,{useNewUrlParser: true,useUnifiedTopology: true})
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


mongoose.connection.on('connected',()=>{
    console.log('coonected to mongo');
})
mongoose.connection.on('error',()=>{
    console.log('coonected to mongo');
})
app.use('/',auth);
app.use('/post',post);



app.listen(4000,()=>{console.log('server is running')})