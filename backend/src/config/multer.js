const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
    directory: uploadFolder,
    storage: multer.diskStorage({
        destination: uploadFolder,
        filename(req, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;
            return callback(null, fileName);
        }
    })
};
