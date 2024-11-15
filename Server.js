const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const port = 8000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Form')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema for Sales
const SalesSchema = new mongoose.Schema({
    company_name: { type: String, required: true },               // Company Name
    mobile_number: { type: String, required: true },              // Mobile Number
    transaction_amount: { type: Number, required: true },         // Transaction Amount
    date_of_transaction: { type: Date, required: true },          // Date of Transaction
    contribution_to_BCN: { type: String, enum: ['Select','yes', 'no'], required: true },  // Willing to contribute to BCN (yes, no)
    product_service_sold: { type: String, required: true },       // Product/Service Sold
    city: { type: String, required: true },                      // City
    buyer_name: { type: String, required: true },                // Buyer Name
    buyer_mobile_number: { type: String, required: true },       // Buyer Mobile Number
    remarks: { type: String, default: '' } 
});

// Schema for Buyer
const BuyerSchema = new mongoose.Schema({
        name: { type: String, required: true },
        mobile_number: { type: String, required: true },
        city: { type: String, required: true }, 
        service_product_description: { type: String, required: true }, 
        transaction_date: { type: Date, required: true }, 
        seller_name: { type: String, required: true }, 
        seller_mobile: { type: String, required: true }, 
        product_service_feedback: { type: String }, 
        recommendation: { type: String, enum: ['yes', 'no'] } 
});

// Schema for Requirement
const RequirementSchema = new mongoose.Schema({
    mobile_number: { 
        type: String, 
        required: true, 
        trim: true 
    },
    name: {  // Name of individual or company
        type: String, 
        required: true, 
        trim: true 
    },
    description: {  // Description of the requirement
        type: String, 
        required: true, 
        trim: true 
    },
    city: {  // City or district of the requirement
        type: String, 
        required: true, 
        trim: true 
    },
    urgency: {  // Urgency (1 day, 1 week, 1 month)
        type: String, 
        required: true, 
        enum: ['1 day', '1 week', '1 month']  // Limit allowed values to these options
    },
    specialMention: {  // Any special mention or additional comments
        type: String, 
        trim: true 
    }

//     // Job opening form 
//     company_name: { type: String, required: true, trim: true },
//     job_title: { type: String, required: true, trim: true },
//     job_description: { type: String, required: true, trim: true },
//     required_skills: { type: String, required: true, trim: true },
//     salary: { type: String, required: true, trim: true },
//     job_type: { type: String, enum: ['full_time', 'part_time', 'contract'], required: true },
//     location: { type: String, required: true, trim: true },
//     application_deadline: { type: Date, required: true },
//     created_at: { type: Date, default: Date.now },

//     // Job Seeking Fields
//     title: { type: String, required: true, trim: true },
//     candidate_name: { type: String, required: true, trim: true },
//     skills: { type: String, required: true, trim: true },
//     experience: { type: String, required: true, trim: true },
//     location_preference: { type: String, required: true, trim: true },
//     availability: { type: String, required: true, trim: true },
//     contact_information: { type: String, required: true, trim: true },

//     // Matrimonial Match Fields
//     profile_name: { type: String, required: true, trim: true },
//     age: { type: Date, required: true },
//     religion_caste: { type: String, required: true, trim: true },
//     education: { type: String, required: true, trim: true },
//     occupation: { type: String, required: true, trim: true },
//     interests: { type: String, required: true, trim: true },
//     preferences: { type: String, required: true, trim: true }
// }, { timestamps: true }

});

// Model Definitions with Custom Collection Names
const Sales = mongoose.model('Sales', SalesSchema, 'form.sales'); // Collection for Sales
const Buyer = mongoose.model('Buyer', BuyerSchema, 'form.buyer'); // Collection for Buyer
const Requirement = mongoose.model('Requirement', RequirementSchema, 'form.requirement'); // Collection for Requirement

// Schema for Job Opening Form
const JobOpeningFormSchema = new mongoose.Schema({
    company_name: { type: String, required: true, trim: true },
    job_title: { type: String, required: true, trim: true },
    job_description: { type: String, required: true, trim: true },
    required_skills: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    job_type: { type: String, enum: ['full_time', 'part_time', 'contract'], required: true },
    location: { type: String, required: true, trim: true },
    application_deadline: { type: Date, required: true },
    created_at: { type: Date, default: Date.now }
});

// Model Definition for Job Opening Form
const JobOpeningForm = mongoose.model('JobOpeningForm', JobOpeningFormSchema, 'form.jobopeningform'); // Collection for Job Opening Form

// Routes

// Sales Route
app.post('/api/sales', async (req, res) => {
    console.log('Received data:', req.body); // Log incoming data for debugging
    try {
        const transactionDate = new Date(req.body.date_of_transaction);
        if (isNaN(transactionDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date_of_transaction' });
        }

        const salesData = new Sales({ ...req.body, date_of_transaction: transactionDate });
        await salesData.save();
        res.status(201).json(salesData); // Respond with the saved data
    } catch (error) {
        console.error('Error saving sales data:', error);
        res.status(500).json({ message: 'Error saving sales data', error });
    }
});

app.get('/',(req,res)=>{
    res.send('Hello World!')
})
// Buyer Route
app.post('/api/buyer', async (req, res) => {
    try {
        const newBuyer = new Buyer(req.body);
        await newBuyer.save();
        res.status(201).json({ message: 'Buyer data saved successfully', data: newBuyer });
    } catch (error) {
        console.error('Error saving buyer data:', error);
        res.status(400).json({ message: 'Error saving buyer data', error: error.message });
    }
});

// Requirement Route
app.post('/api/requirement', async (req, res) => {
    try {
        const newRequirement = new Requirement(req.body);
        await newRequirement.save();
        res.status(201).json({ message: 'Requirement data saved successfully', data: newRequirement });
    } catch (error) {
        console.error('Error saving requirement data:', error);
        res.status(400).json({ message: 'Error saving requirement data', error: error.message });
    }
});

// JobOpeningForm Route
app.post('/api/jobopeningform', async (req, res) => {
    try {
        const newJobOpeningForm = new JobOpeningForm(req.body);
        await newJobOpeningForm.save();
        res.status(201).json({ message: 'Job opening form data saved successfully', data: newJobOpeningForm });
    } catch (error) {
        console.error('Error saving job opening form data:', error);
        res.status(400).json({ message: 'Error saving job opening form data', error: error.message });
    }
});

// Start the server
app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});
