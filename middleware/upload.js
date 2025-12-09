/* Create imports */
const { cloudinary } = require("../config/cloudinary");

/* Create middleware */
const uploadToCloudinary = async (req, res, next) => {
  try {
    // Check file exists
    if (!req.file) {
      return next();
    }

    // Upload buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile-pictures",
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe buffer
      uploadStream.end(req.file.buffer);
    });

    // Attach Cloudinary data to req
    req.cloudinaryUrl = result.secure_url;
    req.cloudinaryPublicId = result.public_id;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* Create exports */
module.exports = uploadToCloudinary;
