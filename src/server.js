const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname,'uploads')));
// Serve static files in 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Normal User Schema
const NormalUserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    flatNumber: String,
    areaLocality: String,
    pincode: String
});

// NGO User Schema
const NGOUserSchema = new mongoose.Schema({
    ngoName: String,
    email: String,
    password: String,
    phoneNumber: String,
    flatNumber: String,
    areaLocality: String,
    pincode: String
});

// Create separate models
const NormalUser = mongoose.model('User_Login', NormalUserSchema);
const NGOUser = mongoose.model('NGO_Login', NGOUserSchema);

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Schema for Item
const ItemSchema = new mongoose.Schema({
    email: { type: String, required: true },
    itemName: { type: String, required: true },
    itemDescription: { type: String, required: true },
    transactionType: { type: String, required: true },
    itemPrice: { type: Number, default: null },
    itemNegotiable: { type: String, default: null },
    itemCondition: { type: String, required: true },
    images: { type: [String], required: true },
});

const Item = mongoose.model('Item', ItemSchema);

// Route to handle form submission
app.post('/sell', upload.array('images', 3), async (req, res) => {
    const {
        email,
        itemName,
        itemDescription,
        transactionType,
        itemPrice,
        itemNegotiable,
        itemCondition,
    } = req.body;

    // Check for required fields
    if (!email || !itemName || !itemDescription || !transactionType || !itemCondition || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'All fields are required, and at least one image must be uploaded.' });
    }

    const images = req.files.map(file => file.path);

    try {
        const newItem = new Item({
            email,
            itemName,
            itemDescription,
            transactionType,
            itemPrice: transactionType === 'sell' ? itemPrice : null,
            itemNegotiable: transactionType === 'sell' ? itemNegotiable : null,
            itemCondition,
            images,
        });

        await newItem.save();
        res.status(200).json({ success: true, message: 'Item submitted successfully' });
    } catch (error) {
        console.error('Error submitting item:', error.message || error);
        res.status(500).json({ success: false, message: 'Error submitting item', error: error.message });
    }
});

// Fetch all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error.message || error);
        res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
    }
});

// Fetch single item by ID
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error.message || error);
        res.status(500).json({ success: false, message: 'Error fetching item', error: error.message });
    }
});

// Route to fetch owner details by item ID
app.get('/items/:id/owner', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Check if the owner is a Normal User or an NGO
        const ownerNormalUser = await NormalUser.findOne({ email: item.email });
        if (ownerNormalUser) {
            return res.status(200).json({
                success: true,
                name: ownerNormalUser.name,
                email: ownerNormalUser.email,
                phoneNumber: ownerNormalUser.phoneNumber,
            });
        }

        const ownerNGOUser = await NGOUser.findOne({ email: item.email });
        if (ownerNGOUser) {
            return res.status(200).json({
                success: true,
                name: ownerNGOUser.ngoName,
                email: ownerNGOUser.email,
                phoneNumber: ownerNGOUser.phoneNumber,
            });
        }

        return res.status(404).json({ success: false, message: 'Owner not found' });
    } catch (error) {
        console.error('Error fetching owner details:', error);
        return res.status(500).json({ success: false, message: 'Error fetching owner details', error: error.message });
    }
});

// Sign Up Route
app.post('/signup', async (req, res) => {
    const { name, email, password, isNGO } = req.body;

    try {
        const existingNormalUser = await NormalUser.findOne({ email });
        const existingNGOUser = await NGOUser.findOne({ email });

        if (existingNormalUser || existingNGOUser) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please use a different email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (isNGO) {
            const newNGOUser = new NGOUser({ ngoName: name, email, password: hashedPassword });
            await newNGOUser.save();
            console.log('NGO registered successfully:', email);
            res.status(200).json({ success: true, message: 'NGO registered successfully' });
        } else {
            const newNormalUser = new NormalUser({ name, email, password: hashedPassword });
            await newNormalUser.save();
            console.log('User registered successfully:', email);
            res.status(200).json({ success: true, message: 'User registered successfully' });
        }
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

// Sign In Route
app.post('/signin', async (req, res) => {
    const { email, password, isNGO } = req.body;

    try {
        let user;
        if (isNGO) {
            user = await NGOUser.findOne({ email });
        } else {
            user = await NormalUser.findOne({ email });
        }

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const userData = {
                    name: isNGO ? user.ngoName : user.name,
                    email: user.email,
                };
                return res.status(200).json({ success: true, message: 'Signed in successfully', user: userData });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid email or password' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error signing in user' });
    }
});

// Fetch user data by email
app.get('/user/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await NormalUser.findOne({ email }) || await NGOUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            phoneNumber: user.phoneNumber,
            flatNumber: user.flatNumber,
            areaLocality: user.areaLocality,
            pincode: user.pincode,
            isNGO: user.ngoName ? true : false,
            name: user.ngoName || user.name,
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
    }
});

// Update Contact Route
app.post('/update-contact', async (req, res) => {
    const { email, phoneNumber, isNGO } = req.body;

    try {
        let updatedUser;
        if (isNGO) {
            updatedUser = await NGOUser.findOneAndUpdate(
                { email },
                { phoneNumber },
                { new: true }
            );
        } else {
            updatedUser = await NormalUser.findOneAndUpdate(
                { email },
                { phoneNumber },
                { new: true }
            );
        }

        if (updatedUser) {
            return res.status(200).json({ success: true, message: 'Contact updated successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error updating contact' });
    }
});

// Update Address Route
app.post('/update-address', async (req, res) => {
    const { email, flatNumber, areaLocality, pincode, isNGO } = req.body;

    try {
        let updatedUser;
        if (isNGO) {
            updatedUser = await NGOUser.findOneAndUpdate(
                { email },
                { flatNumber, areaLocality, pincode },
                { new: true }
            );
        } else {
            updatedUser = await NormalUser.findOneAndUpdate(
                { email },
                { flatNumber, areaLocality, pincode },
                { new: true }
            );
        }

        if (updatedUser) {
            return res.status(200).json({ success: true, message: 'Address updated successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error updating address' });
    }
});

// Route to fetch items by user email
app.get('/items', async (req, res) => {
    const email = req.query.email;
    try {
        const items = await Item.find({ email });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error.message || error);
        res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
    }
});

// Route to fetch items for sale by user email
app.get('/items/user/:email', async (req, res) => {
    try {
        const items = await Item.find({ email: req.params.email });

        // Extract only the names of the items
        const itemNames = items.map(item => item.itemName);

        res.status(200).json(itemNames);
    } catch (error) {
        console.error('Error fetching items by user email:', error.message || error);
        res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
    }
});

// Route to delete an item
app.delete('/items/delete', async (req, res) => {
    const { email, itemName } = req.body;

    try {
        const result = await Item.findOneAndDelete({ email: email, itemName: itemName });

        if (result) {
            return res.status(200).json({ success: true, message: 'Item deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error.message || error);
        return res.status(500).json({ success: false, message: 'Error deleting item', error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));