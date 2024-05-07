const express = require("express");
const path = require("path");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const fs = require('node:fs');
var folder;
const app = express();
const server = http.createServer(app);
const conf_folder = path.resolve('./conf_files');
const io = new Server(server , {
    cors: {
        methods: ["GET", "POST"],
      },
});

function createConfigurationFile(filePath,webserverName){
    const fileContent = `location /${webserverName} {\nroot ${path.resolve('./upload')};\ntry_files $uri $uri/= 404;\n}`;
    try {
        fs.writeFileSync(filePath,fileContent);
        console.log("File created successfully");
    } catch (error) {
        console.log(error);
    }
}


io.on('connection', (socket)=>{
    socket.on('server-name', (data)=>{
        folder = `./upload/${data}`;
        try{
            fs.mkdirSync(folder, {recursive:true});
        }catch(err){
            socket.emit('name-error',err);
        };
        const conf_path = path.join(conf_folder,`${data}.conf`);
        createConfigurationFile(conf_path,data);
        console.log(`received data is ${data}`);
        socket.emit('confirm', "confirmed");
    });
});
// Storage configuration

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,folder);
    },
    filename: function(req,file,cb){
        cb(null,'index.html');
    }
});

const upload = multer({
    storage: storage
}).single('file');


app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res,next)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});
app.post('/upload', (req,res,next)=>{
    upload(req,res, (err)=>{
        res.send(err);
    });
    res.send("File received");
});

server.listen(3000, ()=>{
    console.log("Server is running on port 3000...");
})