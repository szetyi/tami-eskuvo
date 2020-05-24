const http = require('http');
const path = require('path');
const fs = require('fs');
const $ = require('jquery');

const server = http.createServer((req, res) => {
    
    // Build filepath

    let filePath = path.join(
        __dirname, 'public',
        //  req.url === '/' ? 'index.html' : req.url);
        processReqUrl(req.url))

    let img_regex = /\/get\/[a-z]*\/imgs/;

    if(req.url.match(img_regex)) {

        let requested_imgs = req.url.slice(5,7);
        let requested_dir = "";

        switch (requested_imgs) {
            case "gr":
                requested_dir = __dirname + "/public/gallery/grafika/"; 
                break;
        
            case "fo":
                requested_dir = __dirname + "/public/img/fo_cover/"; 
                break;
    
            case "vj":
                requested_dir = __dirname + "/public/img/vj_cover/"; 
                break;
                                
            default:
                break;
        }

        fs.readdir((requested_dir), function(err, files) {
            if(err) {
                console.log(err);
                
                res.writeHead(404);
                res.end({
                    success : false,
                    msg : requested_dir + " directory missing."
                });

            } else {

                let imgs = [];
                let img_count = 0;
                files.forEach(file => {
                    if(path.extname(file) == ".jpg") {
                        imgs[img_count++] = file;
                    }
                    
                })

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(imgs));

            }

        });

    } else if( req.url === "/get/dekor/") {
        
        let requested_dir = __dirname + "/public/gallery/eskuvok/";

        fs.readdir((requested_dir), function(err, files) {
            if(err) {
                console.log(err);
                
                res.writeHead(404);
                res.end({
                    success : false,
                    msg : requested_dir + " directory missing."
                });

            } else {

                let dirs = [];
                let dir_count = 0;
                files.forEach(file => {
                    dirs[dir_count++] = file;
                })

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(dirs));

            }

        });

    }


    // Extension of file
    let extName = path.extname(filePath);

    // Initial content type
    let concentType = 'text/html';

    
    switch(extName) {
        case '.js':
            concentType = 'text/javascript';
            break;
        case '.css':
            concentType = 'text/css';
            break;
        case '.png':
            concentType = 'image/png';
            break;
        case '.svg':
            concentType = 'image/svg+xml';
            break;
        case '.jpg':
            concentType = 'image/jpeg';
            break;
        case '.jpeg':
            concentType = 'image/jpeg';
            break;
        case '.json':
            concentType = 'application/json';
            break;
    }

    // Read File
    fs.readFile(filePath, (err, content) => {

        if(err) {
            if(err.code == 'ENOENT' || 'EISDIR') {
                // Page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                });
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, {'Content-Type': concentType});
            res.end(content);
        }

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

let gallery_regex = /\/gallery\?[a-z]*-[a-z]*/;
//  req.url === '/' ? 'index.html' : req.url);
function processReqUrl(requrl) {
    let newurl;
    
    if(requrl === '/') {
        newurl = 'index.html';
        console.log("Requested index");
    } else if( requrl.match(gallery_regex)) {
        newurl = 'gallery.html'
        console.log("Requested a gallery");
    } else {
        newurl = requrl;
    }

    return newurl;
}