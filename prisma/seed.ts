import "dotenv/config";
import { Client } from "pg";

const colleges = [
  {
    name: "IIT Delhi",
    location: "New Delhi",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.2 Lakhs",
    rating: 4.8,
    placement: "₹25 LPA",
  },
  {
    name: "IIT Bombay",
    location: "Mumbai, Maharashtra",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.3 Lakhs",
    rating: 4.9,
    placement: "₹26 LPA",
  },
  {
    name: "IIT Kanpur",
    location: "Kanpur, Uttar Pradesh",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.2 Lakhs",
    rating: 4.8,
    placement: "₹28 LPA",
  },
  {
    name: "IIT Kharagpur",
    location: "Kharagpur, West Bengal",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.2 Lakhs",
    rating: 4.7,
    placement: "₹25 LPA",
  },
  {
    name: "IIT Roorkee",
    location: "Roorkee, Uttarakhand",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.2 Lakhs",
    rating: 4.7,
    placement: "₹24 LPA",
  },
  {
    name: "IIT Hyderabad",
    location: "Hyderabad, Telangana",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.1 Lakhs",
    rating: 4.6,
    placement: "₹22 LPA",
  },
  {
    name: "IIT BHU",
    location: "Varanasi, Uttar Pradesh",
    type: "Government",
    course: "B.Tech",
    fees: "₹2.2 Lakhs",
    rating: 4.7,
    placement: "₹22 LPA",
  },
  {
    name: "NIT Allahabad",
    location: "Prayagraj, Uttar Pradesh",
    type: "Government",
    course: "B.Tech",
    fees: "₹1.8 Lakhs",
    rating: 4.5,
    placement: "₹20 LPA",
  },
  {
    name: "NIT Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    type: "Government",
    course: "B.Tech",
    fees: "₹1.7 Lakhs",
    rating: 4.7,
    placement: "₹21 LPA",
  },
  {
    name: "NIT Rourkela",
    location: "Rourkela, Odisha",
    type: "Government",
    course: "B.Tech",
    fees: "₹1.7 Lakhs",
    rating: 4.6,
    placement: "₹19 LPA",
  },
  {
    name: "NIT Warangal",
    location: "Warangal, Telangana",
    type: "Government",
    course: "B.Tech",
    fees: "₹1.8 Lakhs",
    rating: 4.6,
    placement: "₹20 LPA",
  },
  {
    name: "NIT Surathkal",
    location: "Mangaluru, Karnataka",
    type: "Government",
    course: "B.Tech",
    fees: "₹1.7 Lakhs",
    rating: 4.6,
    placement: "₹19 LPA",
  },
  {
    name: "IIIT Hyderabad",
    location: "Hyderabad, Telangana",
    type: "Private",
    course: "B.Tech",
    fees: "₹4.0 Lakhs",
    rating: 4.8,
    placement: "₹32 LPA",
  },
  {
    name: "IIIT Delhi",
    location: "New Delhi",
    type: "Government",
    course: "B.Tech",
    fees: "₹4.5 Lakhs",
    rating: 4.7,
    placement: "₹25 LPA",
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    type: "Private",
    course: "B.Tech",
    fees: "₹5.0 Lakhs",
    rating: 4.7,
    placement: "₹25 LPA",
  },
  {
    name: "VIT Vellore",
    location: "Vellore, Tamil Nadu",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.0 Lakhs",
    rating: 4.5,
    placement: "₹9 LPA",
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.5 Lakhs",
    rating: 4.4,
    placement: "₹8 LPA",
  },
  {
    name: "Manipal Institute of Technology",
    location: "Manipal, Karnataka",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.5 Lakhs",
    rating: 4.5,
    placement: "₹12 LPA",
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab",
    type: "Private",
    course: "B.Tech",
    fees: "₹4.0 Lakhs",
    rating: 4.4,
    placement: "₹11 LPA",
  },
  {
    name: "Amity University",
    location: "Noida, Uttar Pradesh",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.5 Lakhs",
    rating: 4.2,
    placement: "₹7 LPA",
  },
  {
    name: "Lovely Professional University",
    location: "Phagwara, Punjab",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.8 Lakhs",
    rating: 4.1,
    placement: "₹7 LPA",
  },
  {
    name: "Chandigarh University",
    location: "Mohali, Punjab",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.6 Lakhs",
    rating: 4.3,
    placement: "₹8 LPA",
  },
  {
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.0 Lakhs",
    rating: 4.2,
    placement: "₹7 LPA",
  },
  {
    name: "Galgotias University",
    location: "Greater Noida, Uttar Pradesh",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.5 Lakhs",
    rating: 4.1,
    placement: "₹6 LPA",
  },
  {
    name: "Sharda University",
    location: "Greater Noida, Uttar Pradesh",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.8 Lakhs",
    rating: 4.1,
    placement: "₹6 LPA",
  },
  {
    name: "KIIT University",
    location: "Bhubaneswar, Odisha",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.2 Lakhs",
    rating: 4.3,
    placement: "₹8 LPA",
  },
  {
    name: "Bennett University",
    location: "Greater Noida, Uttar Pradesh",
    type: "Private",
    course: "B.Tech",
    fees: "₹4.0 Lakhs",
    rating: 4.2,
    placement: "₹8 LPA",
  },
  {
    name: "UPES Dehradun",
    location: "Dehradun, Uttarakhand",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.5 Lakhs",
    rating: 4.2,
    placement: "₹8 LPA",
  },
  {
    name: "Jaypee Institute of Information Technology",
    location: "Noida, Uttar Pradesh",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.0 Lakhs",
    rating: 4.3,
    placement: "₹8 LPA",
  },
  {
    name: "Hindustan Institute of Technology and Science",
    location: "Chennai, Tamil Nadu",
    type: "Private",
    course: "B.Tech",
    fees: "₹2.5 Lakhs",
    rating: 4.1,
    placement: "₹6 LPA",
  },
  {
    name: "NIIT University",
    location: "Neemrana, Rajasthan",
    type: "Private",
    course: "B.Tech",
    fees: "₹3.5 Lakhs",
    rating: 4.2,
    placement: "₹8 LPA",
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("Connected to database...");
  console.log("Adding colleges...");

  for (const college of colleges) {
    await client.query(
      `INSERT INTO college
       (name, location, type, course, fees, rating, placement)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        college.name,
        college.location,
        college.type,
        college.course,
        college.fees,
        college.rating,
        college.placement,
      ]
    );
  }

  console.log(`Successfully added ${colleges.length} colleges.`);

  await client.end();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});