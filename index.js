import http from "http";
import fs from "fs";
import formidable from "formidable";

const server = http.createServer();

server.on("request", function(req, res) {
    console.log(req);
    if(req.url === "/") {
        res.statusCode = 200;
        const readLink = `<a href="http://localhost:8000/read-message">Read Message</a>`
        const writeLink = `<a href="http://localhost:8000/write-message">Write Message</a>`
        res.end(`<h1>Hello Node!</h1> ${readLink} ${writeLink}`);
    } else if(req.url === "/read-message") {
        res.statusCode = 200;
        fs.readFile("newText.txt", 'utf-8', function(err, data) {
            if(err) {
                console.log(err);
            } else {
                const textInput = 
                `
                    <html>
                        <body>
                            <h3>${data}</h3>
                        </body>
                    </html>
                `
                res.end(textInput);
            }
        });
    } else if(req.url === "/write-message") {
        res.statusCode = 200;
        const textInput = 
        `
            <html>
                <body>
                    <form method='POST' id="content">
                        <input type="text" name="textInput">
                        <button type="submit" value="submit">Submit</button>
                    </form>
                </body>
            </html>
        `; 
        res.end(`${textInput}`);
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if(err) {
                console.log(err);
                res.statusCode = 500;
                res.end("Did not work");
                return;
            }

            const content = fields.textInput;

            // const fileStream = fs.createWriteStream('newfile.txt');
            // fileStream.write(content);
            // fileStream.end();

            fs.writeFile("newText.txt", content, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File written sucessfully");
                }
            })
        })
    }
});



server.listen(8000);