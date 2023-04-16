const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  const requestedPath = path.join(__dirname, 'public', req.path);

  fs.readdir(requestedPath, (err, files) => {
    if (err) {
			res.status(404).send('Not Found');
    } else {
      let html = `<head>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,800&family=Raleway:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">

                    <link rel="stylesheet" type="text/css" href="/css/main.css">
                  </head>
                  <div class="header">
                    <div class="left">Banner Preview Server</div>
                    <div class="right">v1.01</div>
                  </div>
                  <div class="container wrapper">`;
        
      if(req.path !== "/"){
        html += `<div class="item button-holder">
          <a class="button back" href="${req.path}../">back</a>
        </div>`
      }
      // Loop through twice, to keep folders at the top.
      files.forEach(file => {
        const filePath = path.join(requestedPath, file);
        const isDirectory = fs.lstatSync(filePath).isDirectory();
        if (isDirectory) {
          const isBanner = file.match(/(\d+)x(\d+)/);
          if (!isBanner) {
            html += `<div class="item button-holder">
              <a class="button folder" href="${req.path}${file}">${file}</a>
            </div>`;
          }
        } 
      });
      files.forEach(file => {
        const filePath = path.join(requestedPath, file);
        const isDirectory = fs.lstatSync(filePath).isDirectory();
        if (isDirectory) {
          const isBanner = file.match(/(\d+)x(\d+)/);
          if (isBanner) {
            let width = isBanner[1];
            let height = isBanner[2];
            html += `<div class="item banner">
                      <div class="label">${file}</div>
                      <iframe width="${width}" height="${height}" src="${req.path}${file}/index.html"></iframe>
                      <div>
                        <button>REPLAY</button>
                      </div>
                    </div>`;
          } 
        } else {
          const fileExt = path.extname(filePath);
          if (fileExt === '.jpg' || fileExt === '.png' || fileExt === '.gif') {
            html += `<div class="item media image">
              <div class="label">${file}</div>
              <img src="${req.path}${file}"/>
            </div>`
          } else if(fileExt === '.mp4'){
            html += `<div class="item media video">
              <div class="label">${file}</div>
              <div class="video-container">
                <video width="100%" height="600" loop mute autoplay>
                  <source src="${req.path}${file}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>`
          }
        }
      });

      // close "wrapper"
      html += `</div>`
      res.send(html);
    }
  });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
