const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isProfileImage = file.fieldname === 'pimage';

        return {
            folder: isProfileImage ? 'mooncart/profiles' : 'mooncart/products',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
            public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        };
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = { storage, upload };
