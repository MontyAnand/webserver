const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    fs.mkdir(`./uploads/${folder_name}`, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating folder:', err);
          return;
        }
        console.log('Folder created successfully');
      });
    cb(null, `uploads/${folder_name}`);
  },
  filename: function (req, file, cb) {
    console.log("file nane function");
    //cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null,file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to handle file upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.post('/upload', upload.array('files'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
