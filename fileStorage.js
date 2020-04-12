const upload = require('multer');

const fileUploader = (dirName, mimeTypes) => {
    const fileStorage = upload.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dirName)
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + '-' + file.originalname)
        }
    });
    const fileFilter = (req, file, cb) => {
        const allowed = false;
        mimeTypes.forEach(mimetype => {
            if (mimetype === file.mimetype) {
                this.allowed = true;
            }
        });
        if (allowed) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    };
    return upload({storage: fileStorage, fileFilter: fileFilter});
};

module.exports = fileUploader;