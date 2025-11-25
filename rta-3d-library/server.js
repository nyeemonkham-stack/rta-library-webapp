import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Storage for Uploads (Screenshots)
// They will be saved in an 'uploads' folder on your VPS/Local Computer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save file as: timestamp-filename
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve the built React app (static files)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle Form Submission
// We use '/' because App.tsx posts to '/' to be compatible with Netlify.
app.post('/', upload.single('screenshot'), (req, res) => {
    console.log("----- NEW SUBMISSION -----");
    console.log("Data:", req.body);
    console.log("File:", req.file);
    console.log("--------------------------");

    // In a real app, you might send an email here or save to a database.
    // For now, we log it to the console and save the image to the /uploads folder.
    
    // We redirect to the dashboard logic or send a success JSON
    res.status(200).json({ message: "Application received successfully" });
});

// Handle any other request by serving the index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`--------------------------------------------------`);
  console.log(`Server is running! Open this link in your browser:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`--------------------------------------------------`);
});