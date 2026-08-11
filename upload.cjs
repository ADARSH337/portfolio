const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'ma08zkgn', 
  api_key: '946173943964115', 
  api_secret: 'K-5KhvrOmXW17tN01a06kjMnHHs' 
});

const filePath = 'C:\\Users\\ADARSH KUNCHAM\\Downloads\\editing\\edited videos\\iphone.MP4';

cloudinary.uploader.upload_large(filePath, { 
  resource_type: "video", 
  public_id: "iphone_hero_hq",
  chunk_size: 6000000 
}, function(error, result) {
  if (error) {
    console.error("Upload failed:", error);
  } else {
    console.log("Upload successful!");
    console.log("URL:", result.secure_url);
  }
});
