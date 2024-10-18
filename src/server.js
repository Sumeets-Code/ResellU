const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
    phoneNumber: String, // Add this field
    flatNumber: String,   // Add this field
    areaLocality: String, // Add this field
    pincode: String
});

// NGO User Schema
const NGOUserSchema = new mongoose.Schema({
    ngoName: String,
    email: String,
    password: String
});

// Create separate models
const NormalUser = mongoose.model('User_Login', NormalUserSchema);
const NGOUser = mongoose.model('NGO_Login', NGOUserSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
    const { name, email, password, isNGO } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (isNGO) {
            const newNGOUser = new NGOUser({ ngoName: name, email, password: hashedPassword });
            await newNGOUser.save();
            res.status(200).json({ success: true, message: 'NGO registered successfully' });
        } else {
            const newNormalUser = new NormalUser({ name, email, password: hashedPassword });
            await newNormalUser.save();
            res.status(200).json({ success: true, message: 'User registered successfully' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
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
                    name: isNGO ? user.ngoName : user.name, // Adjust according to your schema
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

// Update Contact Route
app.post('/update-contact', async (req, res) => {
    const { email, phoneNumber } = req.body;

    try {
        const updatedUser = await NormalUser.findOneAndUpdate(
            { email },
            { phoneNumber }, // Make sure to add phoneNumber to the schema if you haven't already
            { new: true }
        );

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
    const { email, flatNumber, areaLocality, pincode } = req.body;

    try {
        const updatedUser = await NormalUser.findOneAndUpdate(
            { email },
            { flatNumber, areaLocality, pincode }, // Make sure to add these fields to the schema
            { new: true }
        );

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));