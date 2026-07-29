import dotenv from "dotenv";
import Doctor from "./models/Doctor.js";
import Appointment from "./models/Appointment.js";
import Service from "./models/Service.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const imageUrls = [
  "https://i.pravatar.cc/400?img=68",
  "https://i.pravatar.cc/400?img=56",
  "https://i.pravatar.cc/400?img=12",
  "https://i.pravatar.cc/400?img=28",
  "https://i.pravatar.cc/400?img=16",
  "https://i.pravatar.cc/400?img=36",
  "https://i.pravatar.cc/400?img=27",
  "https://i.pravatar.cc/400?img=30",
  "https://i.pravatar.cc/400?img=52",
  "https://i.pravatar.cc/400?img=5",
  "https://i.pravatar.cc/400?img=13",
  "https://i.pravatar.cc/400?img=20",
  "https://i.pravatar.cc/400?img=39",
  "https://i.pravatar.cc/400?img=49",
  "https://i.pravatar.cc/400?img=41",
  "https://i.pravatar.cc/400?img=18",
  "https://i.pravatar.cc/400?img=24",
  "https://i.pravatar.cc/400?img=31",
  "https://i.pravatar.cc/400?img=44",
  "https://i.pravatar.cc/400?img=8",
];

const futureDays = [1, 3, 7, 14, 21, 28, 35, 50, 70, 100, 130, 160];

function getFutureSchedule(slots, offsets = futureDays) {
  const map = {};
  const now = new Date();

  offsets.forEach((offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    const key = d.toISOString().split("T")[0];
    map[key] = slots;
  });

  return map;
}

const doctors = [
  {
    email: "sarah.johnson@example.com",
    password: "Password123",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    imageUrl: imageUrls[0],
    experience: "12 years",
    qualifications: "MBBS, MD (Cardiology)",
    location: "City Hospital, Block A",
    about: "Expert in heart rhythm, cardiac care, and coronary interventions.",
    fee: 700,
    availability: "Available",
    schedule: getFutureSchedule(["09:00 AM", "10:00 AM", "11:30 AM", "12:30 PM"]),
    success: "98%",
    patients: "2k+",
    rating: 4.9,
  },
  {
    email: "michael.chen@example.com",
    password: "Password123",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    imageUrl: imageUrls[1],
    experience: "15 years",
    qualifications: "MBBS, DM (Neurology)",
    location: "NeuroCare Center, 2nd Floor",
    about: "Expert in migraine, stroke, epilepsy and neuro disorders.",
    fee: 900,
    availability: "Unavailable",
    schedule: getFutureSchedule(["10:00 AM", "11:00 AM", "03:00 PM", "04:30 PM"]),
    success: "89%",
    patients: "1.8k+",
    rating: 4.5,
  },
  {
    email: "emily.rodriguez@example.com",
    password: "Password123",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrician",
    imageUrl: imageUrls[2],
    experience: "8 years",
    qualifications: "MBBS, DCH",
    location: "Sunrise Pediatrics, Sector 12",
    about: "Child specialist focusing on growth, nutrition, and immunity.",
    fee: 500,
    availability: "Available",
    schedule: getFutureSchedule(["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM"]),
    success: "97%",
    patients: "3.2k+",
    rating: 4.8,
  },
  {
    email: "james.wilson@example.com",
    password: "Password123",
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    imageUrl: imageUrls[3],
    experience: "18 years",
    qualifications: "MBBS, MS (Orthopedics)",
    location: "OrthoPlus Clinic",
    about: "Joint replacement & sports injury expert.",
    fee: 1200,
    availability: "Unavailable",
    schedule: getFutureSchedule(["10:30 AM", "12:00 PM", "03:00 PM", "05:30 PM"]),
    success: "92%",
    patients: "1.5k+",
    rating: 4.6,
  },
  {
    email: "priya.sharma@example.com",
    password: "Password123",
    name: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    imageUrl: imageUrls[4],
    experience: "10 years",
    qualifications: "MBBS, DDV",
    location: "SkinCare Hub, Green Plaza",
    about: "Acne, pigmentation, hair fall & skin treatment specialist.",
    fee: 600,
    availability: "Available",
    schedule: getFutureSchedule(["09:00 AM", "10:30 AM", "12:00 PM", "03:30 PM"]),
    success: "94%",
    patients: "2.7k+",
    rating: 4.7,
  },
  {
    email: "robert.brown@example.com",
    password: "Password123",
    name: "Dr. Robert Brown",
    specialization: "Psychiatrist",
    imageUrl: imageUrls[5],
    experience: "20 years",
    qualifications: "MBBS, MD (Psychiatry)",
    location: "MindWell Clinic",
    about: "Mood disorders, anxiety, therapy & behavioral care.",
    fee: 1100,
    availability: "Unavailable",
    schedule: getFutureSchedule(["11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"]),
    success: "90%",
    patients: "3.1k+",
    rating: 4.4,
  },
  {
    email: "lisa.wang@example.com",
    password: "Password123",
    name: "Dr. Lisa Wang",
    specialization: "Gynecologist",
    imageUrl: imageUrls[6],
    experience: "11 years",
    qualifications: "MBBS, DGO",
    location: "Women's Health Center",
    about: "Infertility, antenatal & gyne care expert.",
    fee: 750,
    availability: "Available",
    schedule: getFutureSchedule(["09:15 AM", "10:45 AM", "02:00 PM", "04:00 PM"]),
    success: "96%",
    patients: "2.4k+",
    rating: 4.9,
  },
  {
    email: "david.kim@example.com",
    password: "Password123",
    name: "Dr. David Kim",
    specialization: "Oncologist",
    imageUrl: imageUrls[7],
    experience: "16 years",
    qualifications: "MBBS, DM (Oncology)",
    location: "CancerCare Institute",
    about: "Specialist in chemotherapy, targeted therapy & cancer care.",
    fee: 1500,
    availability: "Available",
    schedule: getFutureSchedule(["10:00 AM", "11:30 AM", "02:30 PM", "04:30 PM"]),
    success: "93%",
    patients: "2.9k+",
    rating: 4.6,
  },
  {
    email: "rohan.mehta@example.com",
    password: "Password123",
    name: "Dr. Rohan Mehta",
    specialization: "ENT Specialist",
    imageUrl: imageUrls[8],
    experience: "9 years",
    qualifications: "MBBS, MS (ENT)",
    location: "City ENT Clinic",
    about: "Sinus, ear infection, tonsils & throat care.",
    fee: 550,
    availability: "Available",
    schedule: getFutureSchedule(["09:00 AM", "11:00 AM", "04:00 PM"]),
    success: "95%",
    patients: "1.9k+",
    rating: 4.7,
  },
  {
    email: "kavita.rao@example.com",
    password: "Password123",
    name: "Dr. Kavita Rao",
    specialization: "General Physician",
    imageUrl: imageUrls[9],
    experience: "7 years",
    qualifications: "MBBS",
    location: "Healthy Life Clinic",
    about: "General checkups, infections & viral fever expert.",
    fee: 400,
    availability: "Available",
    schedule: getFutureSchedule(["09:30 AM", "02:00 PM", "10:30 AM"]),
    success: "97%",
    patients: "2.3k+",
    rating: 4.8,
  },
  {
    email: "sameer.ali@example.com",
    password: "Password123",
    name: "Dr. Sameer Ali",
    specialization: "Pulmonologist",
    imageUrl: imageUrls[10],
    experience: "14 years",
    qualifications: "MBBS, MD (Pulmonary Medicine)",
    location: "LungCare Center",
    about: "Asthma, COPD & lung infection specialist.",
    fee: 900,
    availability: "Available",
    schedule: getFutureSchedule(["10:00 AM", "03:00 PM", "09:00 AM"]),
    success: "91%",
    patients: "2.1k+",
    rating: 4.5,
  },
  {
    email: "aditi.verma@example.com",
    password: "Password123",
    name: "Dr. Aditi Verma",
    specialization: "Dentist",
    imageUrl: imageUrls[11],
    experience: "6 years",
    qualifications: "BDS, MDS",
    location: "Smile Dental Care",
    about: "Braces, root canal, cleaning & whitening expert.",
    fee: 500,
    availability: "Available",
    schedule: getFutureSchedule(["12:00 PM", "03:00 PM", "10:00 AM"]),
    success: "96%",
    patients: "1.6k+",
    rating: 4.7,
  },
  {
    email: "neha.kapoor@example.com",
    password: "Password123",
    name: "Dr. Neha Kapoor",
    specialization: "Physiotherapist",
    imageUrl: imageUrls[12],
    experience: "9 years",
    qualifications: "BPT, MPT",
    location: "Rehab & Cure Center",
    about: "Sports injuries, muscle pain & recovery.",
    fee: 600,
    availability: "Available",
    schedule: getFutureSchedule(["09:00 AM", "12:30 PM", "03:30 PM"]),
    success: "94%",
    patients: "2.2k+",
    rating: 4.6,
  },
  {
    email: "ishaan.khanna@example.com",
    password: "Password123",
    name: "Dr. Ishaan Khanna",
    specialization: "Psychologist",
    imageUrl: imageUrls[13],
    experience: "10 years",
    qualifications: "BA, MA Psychology",
    location: "Mind Balance Clinic",
    about: "Therapy, depression, stress & relationship issues.",
    fee: 700,
    availability: "Available",
    schedule: getFutureSchedule(["01:00 PM", "03:00 PM", "11:00 AM"]),
    success: "90%",
    patients: "1.3k+",
    rating: 4.4,
  },
  {
    email: "virat.anand@example.com",
    password: "Password123",
    name: "Dr. Virat Anand",
    specialization: "Eye Specialist",
    imageUrl: imageUrls[14],
    experience: "13 years",
    qualifications: "MBBS, MS (Ophthalmology)",
    location: "Vision Care Hospital",
    about: "Cataract, specs check & full eye treatment.",
    fee: 800,
    availability: "Available",
    schedule: getFutureSchedule(["10:00 AM", "12:00 PM", "02:00 PM"]),
    success: "95%",
    patients: "2.6k+",
    rating: 4.8,
  },
  {
    email: "jatin.arora@example.com",
    password: "Password123",
    name: "Dr. Jatin Arora",
    specialization: "Gastroenterologist",
    imageUrl: imageUrls[15],
    experience: "17 years",
    qualifications: "MBBS, DM (Gastro)",
    location: "Digestive Health Clinic",
    about: "Stomach, liver & intestine treatment with GI endoscopy.",
    fee: 1300,
    availability: "Available",
    schedule: getFutureSchedule(["11:00 AM", "03:30 PM", "10:00 AM"]),
    success: "93%",
    patients: "3.4k+",
    rating: 4.7,
  },
  {
    email: "aarav.singh@example.com",
    password: "Password123",
    name: "Dr. Aarav Singh",
    specialization: "Urologist",
    imageUrl: imageUrls[16],
    experience: "12 years",
    qualifications: "MBBS, MS, MCh (Urology)",
    location: "UroPlus Hospital",
    about: "Kidney stones, UTI & prostate treatment.",
    fee: 1400,
    availability: "Available",
    schedule: getFutureSchedule(["09:45 AM", "02:30 PM", "04:00 PM"]),
    success: "92%",
    patients: "1.8k+",
    rating: 4.5,
  },
  {
    email: "megha.shah@example.com",
    password: "Password123",
    name: "Dr. Megha Shah",
    specialization: "Nutritionist",
    imageUrl: imageUrls[17],
    experience: "8 years",
    qualifications: "BSc, MSc Nutrition",
    location: "FitLife Clinic",
    about: "Weight loss, diabetes diet, PCOS & healthy plans.",
    fee: 500,
    availability: "Available",
    schedule: getFutureSchedule(["11:00 AM", "01:00 PM", "03:00 PM"]),
    success: "94%",
    patients: "2.0k+",
    rating: 4.7,
  },
  {
    email: "helena.grace@example.com",
    password: "Password123",
    name: "Dr. Helena Grace",
    specialization: "Radiologist",
    imageUrl: imageUrls[18],
    experience: "10 years",
    qualifications: "MBBS, MD (Radiology)",
    location: "Metro Diagnostics Center",
    about: "X-ray, MRI, CT-scan, ultrasound diagnostic expert.",
    fee: 1000,
    availability: "Available",
    schedule: getFutureSchedule(["10:00 AM", "12:00 PM", "03:00 PM"]),
    success: "95%",
    patients: "2.3k+",
    rating: 4.8,
  },
  {
    email: "kabir.malhotra@example.com",
    password: "Password123",
    name: "Dr. Kabir Malhotra",
    specialization: "Nephrologist",
    imageUrl: imageUrls[19],
    experience: "14 years",
    qualifications: "MBBS, DM (Nephrology)",
    location: "KidneyCare Institute",
    about: "Kidney specialist: dialysis, transplant, kidney disorders.",
    fee: 1600,
    availability: "Available",
    schedule: getFutureSchedule(["09:00 AM", "02:00 PM", "05:00 PM"]),
    success: "91%",
    patients: "2.9k+",
    rating: 4.6,
  },
];

const emails = doctors.map((item) => item.email);
const DEMO_PATIENT_USER_ID = "demo-patient-1";
const DEMO_APPOINTMENTS = [
  { doctorIndex: 0, offsetDays: 3, time: "10:00 AM", status: "Confirmed", fees: 700, paymentMethod: "Cash", paymentStatus: "Paid" },
  { doctorIndex: 2, offsetDays: 7, time: "11:30 AM", status: "Confirmed", fees: 500, paymentMethod: "Cash", paymentStatus: "Paid" },
  { doctorIndex: 4, offsetDays: 10, time: "03:00 PM", status: "Pending", fees: 600, paymentMethod: "Cash", paymentStatus: "Pending" },
];

function getFutureDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

async function seedAppointments(savedDoctors) {
  const demoName = "John Doe";
  const demoMobile = "9876543210";

  for (const item of DEMO_APPOINTMENTS) {
    const doctor = savedDoctors[item.doctorIndex % savedDoctors.length];
    if (!doctor) continue;

    const date = getFutureDate(item.offsetDays);
    const appointmentData = {
      owner: doctor.owner || String(doctor._id),
      createdBy: DEMO_PATIENT_USER_ID,
      patientName: demoName,
      mobile: demoMobile,
      age: 35,
      gender: "Male",
      doctorId: doctor._id,
      doctorName: doctor.name || "Doctor",
      speciality: doctor.specialization || doctor.speciality || "General",
      doctorImage: { url: doctor.imageUrl || doctor.image || "", publicId: doctor.imagePublicId || "" },
      date,
      time: item.time,
      fees: item.fees,
      status: item.status,
      payment: {
        method: item.paymentMethod,
        status: item.paymentStatus,
        amount: item.fees,
      },
      sessionId: null,
      paidAt: item.paymentStatus === "Paid" ? new Date() : null,
    };

    const existing = await Appointment.findOne({
      createdBy: DEMO_PATIENT_USER_ID,
      doctorId: doctor._id,
      date,
      time: item.time,
    });

    if (existing) {
      console.log(`🔄 Updating demo appointment for ${doctor.name} on ${date} at ${item.time}`);
      await Appointment.updateOne({ _id: existing._id }, { $set: appointmentData });
    } else {
      console.log(`➕ Creating demo appointment for ${doctor.name} on ${date} at ${item.time}`);
      await Appointment.create(appointmentData);
    }
  }
}

const servicesSeed = [
  {
    name: "Blood Sugar Test",
    about: "Fasting and postprandial blood sugar testing to check glucose levels.",
    shortDescription: "Quick blood sugar test",
    price: 199,
    available: true,
    imageUrl: "https://media.istockphoto.com/id/491965869/photo/woman-doing-blood-sugar-test.jpg",
    dates: [
      getFutureDate(3),
      getFutureDate(7),
      getFutureDate(14)
    ],
    slots: {
      [getFutureDate(3)]: ["09:00 AM","10:00 AM","11:00 AM"],
      [getFutureDate(7)]: ["09:00 AM","11:00 AM","01:00 PM"],
    },
  },
  {
    name: "Blood Pressure Check",
    about: "Non-invasive blood pressure measurement and consultation.",
    shortDescription: "Blood pressure screening",
    price: 149,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1580281657524-7b2b7b119b8a",
    dates: [getFutureDate(2), getFutureDate(6)],
    slots: { [getFutureDate(2)]: ["09:30 AM", "10:30 AM", "11:30 AM"] },
  },
  {
    name: "X-Ray Scan",
    about: "Digital X-Ray imaging for chest, limbs and other body parts.",
    shortDescription: "X-Ray imaging",
    price: 599,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-7b5b8f9c6f2e",
    dates: [getFutureDate(4), getFutureDate(11)],
    slots: { [getFutureDate(4)]: ["10:00 AM", "02:00 PM"] },
  },
  {
    name: "Full Blood Count",
    about: "Complete blood count (FBC) to analyse blood components.",
    shortDescription: "Full blood count",
    price: 399,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1580281657524-7b2b7b119b8a",
    dates: [getFutureDate(5), getFutureDate(12)],
    slots: { [getFutureDate(5)]: ["09:00 AM", "11:00 AM"] },
  },
  {
    name: "Complete Blood Count",
    about: "CBC to evaluate overall health and detect disorders.",
    shortDescription: "Complete blood count",
    price: 399,
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1580281657524-7b2b7b119b8a",
    dates: [getFutureDate(5), getFutureDate(10)],
    slots: { [getFutureDate(5)]: ["10:00 AM","12:00 PM"] },
  },
  {
    name: "Eye Check-up",
    about: "Vision and eyesight check-up with basic screening.",
    shortDescription: "Eye screening",
    price: 299,
    available: true,
    imageUrl: "https://media.istockphoto.com/id/1140521075/photo/tuning-the-intrument-little-boy-with-phoropter-having-testing-his-eyes-in-the-doctors-office.jpg",
    dates: [getFutureDate(2), getFutureDate(9)],
    slots: { [getFutureDate(2)]: ["02:00 PM","03:00 PM"] },
  },
];

async function seedServices() {
  try {
    for (const svc of servicesSeed) {
      const existing = await Service.findOne({ name: svc.name });
      if (existing) {
        console.log(`🔄 Updating service: ${svc.name}`);
        await Service.updateOne({ _id: existing._id }, { $set: svc });
      } else {
        console.log(`➕ Creating service: ${svc.name}`);
        await Service.create(svc);
      }
    }
  } catch (err) {
    console.error("Error seeding services:", err);
  }
}

async function seedDoctors() {
  try {
    await connectDB();

    const savedDoctors = [];
    for (const doctor of doctors) {
      const existing = await Doctor.findOne({ email: doctor.email });

      if (existing) {
        console.log(`🔄 Updating schedule for existing doctor: ${doctor.email}`);
        await Doctor.updateOne(
          { email: doctor.email },
          { $set: { schedule: doctor.schedule } }
        );
        savedDoctors.push(existing);
      } else {
        console.log(`➕ Adding new doctor: ${doctor.email}`);
        const created = await Doctor.create(doctor);
        savedDoctors.push(created);
      }
    }

    await seedAppointments(savedDoctors);
    await seedServices();

    console.log(`✅ Seed completed: ${doctors.length} doctors processed, ${DEMO_APPOINTMENTS.length} demo appointments seeded, and ${servicesSeed.length} services seeded.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDoctors();
