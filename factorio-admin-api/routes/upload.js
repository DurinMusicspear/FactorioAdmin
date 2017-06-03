var express = require('express');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

module.exports = function (app) {

    app.post('/upload-save-files', upload.array('files'), (req, res, next) => {
        if (req.files) {
            const uploaded = [];
            let errors = [];
            for (let i = 0; i < req.files.length; i++) {
                let file = req.files[i];
                if (file.mimetype !== 'application/x-zip-compressed') {
                    fs.unlink(file.path);
                    console.log(`Wrong filetype: ${file.originalname}`);
                    errors.push({ message: `Wrong filetype for ${file.originalname}, only .zip are accepted`});
                } else {
                    var newPath = path.join(process.env.SAVE_FOLDER, file.originalname);
                    if (fs.existsSync(newPath)) {
                        fs.unlink(file.path);
                        console.log(`File already exists: ${newPath}`);
                        errors.push({ message: `Save file already exists on the server: ${file.originalname}`});
                    } else {
                        try {
                            fs.renameSync(file.path, newPath);
                            uploaded.push(file.originalname);
                            console.log(`File uploaded: ${newPath}`);
                        }
                        catch (err) {
                            fs.unlink(file.path);
                            console.log(`Failed to rename file: ${newPath}`);
                            errors.push({ message: `Failed to rename uploaded file: ${file.originalname}` });
                        }
                    }
                }
            }

            if (errors.length > 0)
                return res.json({ message: 'Errors occured', errors: errors, error: true });

            return res.json({ message: 'Files uploaded successfully', files: uploaded, error: false });
        }

        return res.json({ message: 'Missing files', error: true });
    });

}