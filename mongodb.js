import mongoose from "mongoose";

// Connect to MongoDB with options
mongoose.connect('mongodb://localhost:27017/test')
.then(() => {
    console.log("Database is connected");
})
.catch((err) => {
    console.log(err);
});

// Define the login schema
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    category: {
        type: String,
        required: true
    }
});

const ngoLoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    contact: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        required: true
    }

});

// Create the model
const ldata = mongoose.model("loginData", loginSchema);

const ndata = mongoose.model("ngoLogin", ngoLoginSchema);

// Export the model
// Use this for ES6 modules
// .eg. export default ldata;
export {ldata, ndata};
// or
// module.exports = ldata; // Use this for CommonJS
