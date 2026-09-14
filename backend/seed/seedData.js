// COMPREHENSIVE DATABASE SEED SCRIPT
// Populates MongoDB with realistic initial hospital data:
// 1. Hospital Departments (Specializations)
// 2. Doctors with user accounts, medical profiles, and 7-day availability
// 3. Patients with accounts and clinical demographics
// 4. Sample Appointments across all statuses (Booked, Completed, Cancelled)
// 5. Sample Treatment records with clinical diagnoses and prescriptions
//
// Can be run standalone via: npm run seed
// Or called automatically on backend startup if the database is empty.

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const dns = require("dns");
const bcrypt = require("bcryptjs");

dns.setServers(["1.1.1.1"]);

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");
const Specialization = require("../models/Specialization");

// Standard 7-day schedule template
const createWeeklySchedule = () => [
    { day: "Monday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Tuesday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Wednesday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Thursday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Friday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Saturday", isAvailable: true, slots: ["10:00 AM - 01:00 PM"] },
    { day: "Sunday", isAvailable: false, slots: [] }
];

const seedInitialData = async () => {
    try {
        console.log("Checking database initialization...");

        // If data already exists, don't overwrite
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log(`Database already populated (${userCount} users found).`);
            return;
        }

        console.log("Empty database detected. Auto-populating initial hospital records...");

        // 1. CREATE ADMIN
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@hospital.com").toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
        await User.create({
            name: "Hospital Administrator",
            email: adminEmail,
            password: adminPasswordHash,
            role: "admin",
            phone: "+91 1111111111",
            address: "Administration Building, Suite 101",
            isActive: true
        });

        // 2. CREATE SPECIALIZATIONS
        const specializationsData = [
            { name: "Cardiology", description: "Diagnosis and treatment of heart and cardiovascular conditions." },
            { name: "Dermatology", description: "Medical care for skin, hair, nails, and related conditions." },
            { name: "Neurology", description: "Treatment of brain, spinal cord, and central nervous system disorders." },
            { name: "Orthopedics", description: "Care for musculoskeletal conditions, bones, joints, and ligaments." },
            { name: "Pediatrics", description: "Comprehensive pediatric care and adolescent health." },
            { name: "General Medicine", description: "Primary healthcare, preventive evaluations, and routine diagnosis." },
            { name: "ENT", description: "Ear, nose, throat, and head-and-neck clinical care." },
            { name: "Gynecology", description: "Women's health, maternity care, and reproductive wellness." }
        ];

        const createdSpecs = await Specialization.insertMany(specializationsData);
        const specMap = {};
        createdSpecs.forEach((s) => (specMap[s.name] = s._id));

        // 3. CREATE DOCTORS
        const doctorPasswordHash = await bcrypt.hash("doctor123", 10);
        const doctorsData = [
            {
                name: "Dr. Robert Smith",
                email: "doctor@hospital.com",
                phone: "+91 1111111112",
                address: "Suite 302, Medical Arts Wing",
                specialization: specMap["Cardiology"],
                qualification: "MBBS, MD (Cardiology), FACC",
                experience: 12
            },
            {
                name: "Dr. Sarah Jenkins",
                email: "dr.sarah@hospital.com",
                phone: "+91 1111111113",
                address: "Suite 210, Dermatology Clinic",
                specialization: specMap["Dermatology"],
                qualification: "MBBS, MD (Dermatology)",
                experience: 8
            },
            {
                name: "Dr. Michael Chang",
                email: "dr.chang@hospital.com",
                phone: "+91 1111111114",
                address: "Suite 405, Neuro Center",
                specialization: specMap["Neurology"],
                qualification: "MBBS, DM (Neurology)",
                experience: 15
            },
            {
                name: "Dr. Emily Davis",
                email: "dr.emily@hospital.com",
                phone: "+91 1111111115",
                address: "Suite 115, Children's Pavilion",
                specialization: specMap["Pediatrics"],
                qualification: "MBBS, DCH, MD (Pediatrics)",
                experience: 9
            }
        ];

        const createdDoctors = [];
        for (const doc of doctorsData) {
            const user = await User.create({
                name: doc.name,
                email: doc.email,
                password: doctorPasswordHash,
                role: "doctor",
                phone: doc.phone,
                address: doc.address,
                isActive: true
            });

            const doctorProfile = await Doctor.create({
                user: user._id,
                specialization: doc.specialization,
                qualification: doc.qualification,
                experience: doc.experience,
                availability: createWeeklySchedule(),
                isAvailable: true
            });

            createdDoctors.push(doctorProfile);
        }

        // 4. CREATE PATIENTS
        const patientPasswordHash = await bcrypt.hash("patient123", 10);
        const patientsData = [
            {
                name: "John Doe",
                email: "patient@hospital.com",
                phone: "+91 1111111116",
                address: "742 Evergreen Terrace, Springfield",
                age: 34,
                gender: "Male"
            },
            {
                name: "Jane Watson",
                email: "jane.watson@hospital.com",
                phone: "+91 1111111117",
                address: "221B Baker Street, London",
                age: 28,
                gender: "Female"
            },
            {
                name: "David Miller",
                email: "david.miller@hospital.com",
                phone: "+91 1111111118",
                address: "42 Wallaby Way, Sydney",
                age: 52,
                gender: "Male"
            }
        ];

        const createdPatients = [];
        for (const p of patientsData) {
            const user = await User.create({
                name: p.name,
                email: p.email,
                password: patientPasswordHash,
                role: "patient",
                phone: p.phone,
                address: p.address,
                isActive: true
            });

            const patientProfile = await Patient.create({
                user: user._id,
                age: p.age,
                gender: p.gender,
                phone: p.phone,
                address: p.address
            });

            createdPatients.push(patientProfile);
        }

        // 5. CREATE SAMPLE APPOINTMENTS & TREATMENTS
        const today = new Date();
        const formatDate = (offsetDays) => {
            const d = new Date(today);
            d.setDate(d.getDate() + offsetDays);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        // Appointment 1: Completed consultation with treatment
        const apt1 = await Appointment.create({
            patient: createdPatients[0]._id,
            doctor: createdDoctors[0]._id,
            date: formatDate(-5),
            time: "10:00 AM - 01:00 PM",
            reason: "Routine cardiac checkup and mild chest tightness",
            status: "Completed"
        });

        await Treatment.create({
            appointment: apt1._id,
            patient: createdPatients[0]._id,
            doctor: createdDoctors[0]._id,
            diagnosis: "Mild Hypertension and Sinus Tachycardia",
            prescription: "1. Amlodipine 5mg once daily after breakfast\n2. Aspirin 75mg once daily at bedtime",
            notes: "Advised 30 minutes of low-impact walking daily. Reduce dietary sodium intake. Follow-up in 4 weeks."
        });

        // Appointment 2: Today's scheduled appointment
        await Appointment.create({
            patient: createdPatients[0]._id,
            doctor: createdDoctors[0]._id,
            date: formatDate(0),
            time: "03:00 PM - 05:00 PM",
            reason: "Follow-up reading for blood pressure medication",
            status: "Booked"
        });

        // Appointment 3: Upcoming appointment with Dermatologist
        await Appointment.create({
            patient: createdPatients[0]._id,
            doctor: createdDoctors[1]._id,
            date: formatDate(2),
            time: "10:00 AM - 01:00 PM",
            reason: "Persistent skin rash on forearm",
            status: "Booked"
        });

        // Appointment 4: Cancelled appointment
        await Appointment.create({
            patient: createdPatients[1]._id,
            doctor: createdDoctors[2]._id,
            date: formatDate(-2),
            time: "10:00 AM - 01:00 PM",
            reason: "Migraine headache consultation",
            status: "Cancelled"
        });

        console.log("Database auto-seeded successfully with initial records.");
    } catch (error) {
        console.error("Seeding error:", error.message);
    }
};

// If executed directly from command line (npm run seed)
if (require.main === module) {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospital_management_db");
            // Clear existing and re-seed
            await User.deleteMany({});
            await Doctor.deleteMany({});
            await Patient.deleteMany({});
            await Appointment.deleteMany({});
            await Treatment.deleteMany({});
            await Specialization.deleteMany({});
            await seedInitialData();
            console.log("Manual re-seeding complete.");
            process.exit(0);
        } catch (err) {
            console.error("Manual seed error:", err);
            process.exit(1);
        }
    })();
}

module.exports = seedInitialData;
