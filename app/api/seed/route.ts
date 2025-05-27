import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { University } from '@/lib/types';

const sampleUniversities: Omit<University, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
  name: "Covenant University",
  abbreviation: "CU",
  state: "Ogun",
  location: "Ota",
  yearEstablished: 2002,
  type: "Private",
  accreditation: ["NUC", "COREN", "ICAN"],
  faculties: ["Engineering", "Science and Technology", "Leadership and Development Studies", "Management and Social Sciences"],
  courses: ["Computer Science", "Electrical Engineering", "Business Administration", "Economics"],
  studentPopulation: 8000,
  studentToLecturerRatio: "20:1",
  tuitionFee: {
    min: 800000,
    max: 1000000,
    currency: "NGN"
  },
  accommodationFee: {
    min: 100000,
    max: 200000,
    currency: "NGN"
  },
  otherFees: 50000,
  scholarshipAvailable: true,
  facilities: ["Library", "Laboratories", "Sports Complex", "Medical Center", "Hostels"],
  campusType: "Urban",
  libraryCapacity: 2000,
  hasHostel: true,
  hasMedicalCenter: true,
  hasLaboratories: true,
  hasSportsComplex: true,
  ranking: {
    national: 1,
    regional: 3
  },
  website: "https://covenantuniversity.edu.ng",
  email: "info@covenantuniversity.edu.ng",
  phone: "+234-1-1234567",
  address: "KM 10 Idiroko Road, Canaan Land, Ota, Ogun State, Nigeria",
  missionStatement: "Raising a new generation of leaders.",
  notableAlumni: ["Data not available"],
},
{
  name: "Babcock University",
  abbreviation: "BU",
  state: "Ogun",
  location: "Ilishan-Remo",
  yearEstablished: 1999,
  type: "Private",
  accreditation: ["NUC", "MDCN", "ICAN"],
  faculties: ["Health Sciences", "Law", "Science and Technology", "Management Sciences"],
  courses: ["Medicine", "Law", "Computer Science", "Accounting"],
  studentPopulation: 10000,
  studentToLecturerRatio: "15:1",
  tuitionFee: {
    min: 700000,
    max: 1500000,
    currency: "NGN"
  },
  accommodationFee: {
    min: 80000,
    max: 150000,
    currency: "NGN"
  },
  otherFees: 60000,
  scholarshipAvailable: true,
  facilities: ["Library", "Laboratories", "Sports Complex", "Medical Center", "Hostels"],
  campusType: "Suburban",
  libraryCapacity: 2500,
  hasHostel: true,
  hasMedicalCenter: true,
  hasLaboratories: true,
  hasSportsComplex: true,
  ranking: {
    national: 5
  },
  website: "https://www.babcock.edu.ng",
  email: "info@babcock.edu.ng",
  phone: "+234-1-2345678",
  address: "Ilishan-Remo, Ogun State, Nigeria",
  missionStatement: "Building leadership through Christian education.",
  notableAlumni: ["Data not available"],
},
{
  name: "Bells University of Technology",
  abbreviation: "BellsTech",
  state: "Ogun",
  location: "Ota",
  yearEstablished: 2004,
  type: "Private",
  accreditation: ["NUC", "COREN"],
  faculties: ["Engineering", "Natural Sciences", "Management Sciences"],
  courses: ["Mechanical Engineering", "Computer Science", "Business Administration"],
  studentPopulation: 3000,
  studentToLecturerRatio: "25:1",
  tuitionFee: {
    min: 600000,
    max: 900000,
    currency: "NGN"
  },
  accommodationFee: {
    min: 70000,
    max: 120000,
    currency: "NGN"
  },
  otherFees: 40000,
  scholarshipAvailable: false,
  facilities: ["Library", "Laboratories", "Sports Complex", "Medical Center", "Hostels"],
  campusType: "Urban",
  libraryCapacity: 1500,
  hasHostel: true,
  hasMedicalCenter: true,
  hasLaboratories: true,
  hasSportsComplex: true,
  ranking: {
    national: 15
  },
  website: "https://www.bellsuniversity.edu.ng",
  email: "info@bellsuniversity.edu.ng",
  phone: "+234-1-3456789",
  address: "Km 8, Idiroko Road, Ota, Ogun State, Nigeria",
  missionStatement: "Only the best is good for Bells.",
  notableAlumni: ["Data not available"],
},
{
  name: "Chrisland University",
  abbreviation: "CLU",
  state: "Ogun",
  location: "Abeokuta",
  yearEstablished: 2015,
  type: "Private",
  accreditation: ["NUC"],
  faculties: ["Arts, Management and Social Sciences", "Natural and Applied Sciences"],
  courses: ["Mass Communication", "Computer Science", "Accounting"],
  studentPopulation: 1500,
  studentToLecturerRatio: "20:1",
  tuitionFee: {
    min: 500000,
    max: 800000,
    currency: "NGN"
  },
  accommodationFee: {
    min: 60000,
    max: 100000,
    currency: "NGN"
  },
  otherFees: 30000,
  scholarshipAvailable: true,
  facilities: ["Library", "Laboratories", "Sports Complex", "Medical Center", "Hostels"],
  campusType: "Urban",
  libraryCapacity: 1000,
  hasHostel: true,
  hasMedicalCenter: true,
  hasLaboratories: true,
  hasSportsComplex: true,
  ranking: {
    national: 30
  },
  website: "http://www.chrislanduniversity.edu.ng",
  email: "info@chrislanduniversity.edu.ng",
  phone: "+234-1-4567890",
  address: "Ajebo Road, Abeokuta, Ogun State, Nigeria",
  missionStatement: "Intellectual radiance.",
  notableAlumni: ["Data not available"],
},
{
  name: "Crescent University",
  abbreviation: "CUAB",
  state: "Ogun",
  location: "Abeokuta",
  yearEstablished: 2005,
  type: "Private",
  accreditation: ["NUC"],
  faculties: ["Law", "Environmental Sciences", "Information and Communication Technology", "Natural and Applied Sciences", "Arts, Social and Management Sciences", "Health Sciences"],
  courses: ["Law", "Architecture", "Computer Science", "Biochemistry"],
  studentPopulation: 2000,
  studentToLecturerRatio: "18:1",
  tuitionFee: {
    min: 400000,
    max: 700000,
    currency: "NGN"
  },
  accommodationFee: {
    min: 50000,
    max: 90000,
    currency: "NGN"
  },
  otherFees: 35000,
  scholarshipAvailable: true,
  facilities: ["Library", "Laboratories", "Sports Complex", "Medical Center", "Hostels"],
  campusType: "Urban",
  libraryCapacity: 1200,
  hasHostel: true,
  hasMedicalCenter: true,
  hasLaboratories: true,
  hasSportsComplex: true,
  ranking: {
    national: 25
  },
  website: "http://crescent-university.edu.ng",
  email: "info@crescent-university.edu.ng",
  phone: "+234-1-5678901",
  address: "KM. 5, Lafenwa-Ayetoro Road, Abeokuta, Ogun State, Nigeria",
  missionStatement: "Citadel of academic and moral excellence.",
  notableAlumni: ["Data not available"],
},
{
    name: "American University of Nigeria",
    abbreviation: "AUN",
    state: "Adamawa",
    location: "Yola",
    yearEstablished: 2004,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Arts & Sciences",
      "School of Business & Entrepreneurship",
      "School of Information Technology & Computing",
      "School of Law",
      "School of Engineering",
      "School of Graduate Studies"
    ],
    courses: [
      "Computer Science",
      "Business Administration",
      "Law",
      "Economics",
      "Information Systems",
      "International and Comparative Politics",
      "Engineering"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "16:1",
    tuitionFee: {
      min: 1500000,
      max: 2500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 200000,
      max: 400000,
      currency: "NGN"
    },
    otherFees: 100000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "Innovation Hub"
    ],
    campusType: "Rural",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 10,
      regional: 25
    },
    website: "https://www.aun.edu.ng",
    email: "info@aun.edu.ng",
    phone: "+234-805-123-4567",
    address: "98 Lamido Zubairu Way, Yola, Adamawa State, Nigeria",
    missionStatement: "To be a development university that fosters entrepreneurship, innovation, and leadership.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Adeleke University",
    abbreviation: "AU",
    state: "Osun",
    location: "Ede",
    yearEstablished: 2011,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Arts",
      "Faculty of Basic Medical Sciences",
      "Faculty of Business and Social Sciences",
      "Faculty of Engineering",
      "Faculty of Law",
      "Faculty of Science"
    ],
    courses: [
      "Law",
      "Mechanical Engineering",
      "Computer Science",
      "Mass Communication",
      "Accounting",
      "Biochemistry"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 20
    },
    website: "https://adelekeuniversity.edu.ng",
    email: "info@adelekeuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Adeleke University, Ede, Osun State, Nigeria",
    missionStatement: "Education, Excellence and Character.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Bowen University",
    abbreviation: "BU",
    state: "Osun",
    location: "Iwo",
    yearEstablished: 2001,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Agriculture",
      "Faculty of Humanities",
      "Faculty of Law",
      "Faculty of Science and Science Education",
      "Faculty of Social and Management Sciences",
      "College of Health Sciences"
    ],
    courses: [
      "Medicine",
      "Law",
      "Computer Science",
      "Economics",
      "Microbiology",
      "Political Science"
    ],
    studentPopulation: 5000,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 500000,
      max: 1000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 10
    },
    website: "https://www.bowen.edu.ng",
    email: "info@bowen.edu.ng",
    phone: "+234-802-345-6789",
    address: "Bowen University, Iwo, Osun State, Nigeria",
    missionStatement: "Excellence and Godliness.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Fountain University",
    abbreviation: "FUO",
    state: "Osun",
    location: "Osogbo",
    yearEstablished: 2007,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "College of Basic Medical and Health Sciences",
      "College of Natural and Applied Sciences",
      "College of Management and Social Sciences",
      "College of Law",
      "College of Arts"
    ],
    courses: [
      "Law",
      "Computer Science",
      "Mass Communication",
      "Business Administration",
      "Biochemistry",
      "Political Science"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 400000,
      max: 700000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 30
    },
    website: "https://fountainuniversity.edu.ng",
    email: "info@fountainuniversity.edu.ng",
    phone: "+234-805-678-9012",
    address: "Fountain University, Osogbo, Osun State, Nigeria",
    missionStatement: "Knowledge, Faith and Leadership.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Joseph Ayo Babalola University",
    abbreviation: "JABU",
    state: "Osun",
    location: "Ikeji-Arakeji",
    yearEstablished: 2004,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "College of Agricultural Sciences",
      "College of Environmental Sciences",
      "College of Humanities",
      "College of Law",
      "College of Management Sciences",
      "College of Natural Sciences",
      "College of Social Sciences",
      "College of Health Sciences"
    ],
    courses: [
      "Agriculture",
      "Architecture",
      "English",
      "Law",
      "Accounting",
      "Computer Science",
      "Economics",
      "Public Health"
    ],
    studentPopulation: 4000,
    studentToLecturerRatio: "17:1",
    tuitionFee: {
      min: 450000,
      max: 850000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 130000,
      currency: "NGN"
    },
    otherFees: 55000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Rural",
    libraryCapacity: 1300,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 25
    },
    website: "https://jabu.edu.ng",
    email: "info@jabu.edu.ng",
    phone: "+234-806-789-0123",
    address: "Joseph Ayo Babalola University, Ikeji-Arakeji, Osun State, Nigeria",
    missionStatement: "For knowledge and godly service.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Kings University",
    abbreviation: "KU",
    state: "Osun",
    location: "Odeomu",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Humanities",
      "Faculty of Management and Social Sciences",
      "Faculty of Science"
    ],
    courses: [
      "English",
      "Accounting",
      "Business Administration",
      "Economics",
      "Computer Science",
      "Biochemistry"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "19:1",
    tuitionFee: {
      min: 350000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 900,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 35
    },
    website: "https://kingsuniversity.edu.ng",
    email: "info@kingsuniversity.edu.ng",
    phone: "+234-807-890-1234",
    address: "Kings University, Odeomu, Osun State, Nigeria",
    missionStatement: "Raising leaders for excellence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Oduduwa University",
    abbreviation: "OUI",
    state: "Osun",
    location: "Ipetumodu",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "College of Management and Social Sciences",
      "College of Natural and Applied Sciences",
      "College of Environmental Design and Management",
      "College of Engineering and Technology"
    ],
    courses: [
      "Economics",
      "Computer Science",
      "Architecture",
      "Electrical Engineering",
      "Mass Communication",
      "Business Administration"
    ],
    studentPopulation: 2500,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 400000,
      max: 750000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 110000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Suburban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 28
    },
    website: "https://oduduwauniversity.edu.ng",
    email: "info@oduduwauniversity.edu.ng",
    phone: "+234-809-123-4567",
    address: "Oduduwa University, Ipetumodu, Osun State, Nigeria",
    missionStatement: "Learning for human development.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Baze University",
    abbreviation: "BU",
    state: "FCT",
    location: "Abuja",
    yearEstablished: 2011,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Law",
      "Faculty of Computing and Applied Sciences",
      "Faculty of Engineering",
      "Faculty of Environmental Sciences",
      "Faculty of Medical and Health Sciences",
      "Faculty of Management and Social Sciences"
    ],
    courses: [
      "Law",
      "Computer Science",
      "Mechanical Engineering",
      "Architecture",
      "Medicine",
      "Business Administration"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 500000,
      max: 2000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 300000,
      currency: "NGN"
    },
    otherFees: 75000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "University Teaching Hospital"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 20
    },
    website: "https://bazeuniversity.edu.ng",
    email: "info@bazeuniversity.edu.ng",
    phone: "+234-802-345-6789",
    address: "Baze University, Abuja, FCT, Nigeria",
    missionStatement: "Learn to live.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Nile University of Nigeria",
    abbreviation: "NUN",
    state: "FCT",
    location: "Abuja",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Arts and Social Sciences",
      "Faculty of Engineering",
      "Faculty of Law",
      "Faculty of Management Sciences",
      "Faculty of Natural and Applied Sciences",
      "Faculty of Health Sciences",
      "Faculty of Environmental Sciences",
      "School of Postgraduate Studies"
    ],
    courses: [
      "Law",
      "Electrical Engineering",
      "Computer Science",
      "Mass Communication",
      "Economics",
      "Medicine"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "12:1",
    tuitionFee: {
      min: 600000,
      max: 2500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 120000,
      max: 350000,
      currency: "NGN"
    },
    otherFees: 80000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "Innovation Hub"
    ],
    campusType: "Urban",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 15
    },
    website: "https://nileuniversity.edu.ng",
    email: "info@nileuniversity.edu.ng",
    phone: "+234-803-456-7890",
    address: "Plot 681, Cadastral Zone C-OO, Research & Institution Area, Jabi Airport Bypass, Abuja, FCT, Nigeria",
    missionStatement: "Build Your Success For A Better Society.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Veritas University",
    abbreviation: "VU",
    state: "FCT",
    location: "Bwari",
    yearEstablished: 2007,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Natural and Applied Sciences",
      "Faculty of Management Sciences",
      "Faculty of Humanities",
      "Faculty of Social Sciences",
      "Faculty of Education",
      "Faculty of Engineering",
      "Faculty of Law"
    ],
    courses: [
      "Applied Chemistry",
      "Accounting",
      "English and Literary Studies",
      "Economics",
      "Education Management",
      "Computer Engineering",
      "Law"
    ],
    studentPopulation: 2500,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 400000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "Chapel"
    ],
    campusType: "Rural",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 25
    },
    website: "https://veritas.edu.ng",
    email: "info@veritas.edu.ng",
    phone: "+234-701-586-2819",
    address: "Hostel M, Veritas University, Bwari, Abuja, FCT, Nigeria",
    missionStatement: "Seeking the Truth.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Philomath University",
    abbreviation: "PU",
    state: "FCT",
    location: "Kuje",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Science and Technology",
      "Faculty of Arts and Humanities",
      "Faculty of Social and Management Sciences"
    ],
    courses: [
      "Computer Science",
      "English Language",
      "Business Administration",
      "Political Science",
      "Economics",
      "Mass Communication"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 300000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Suburban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 40
    },
    website: "https://philomathuniversity.edu.ng",
    email: "info@philomathuniversity.edu.ng",
    phone: "+234-704-123-4567",
    address: "Philomath University, Kuje, Abuja, FCT, Nigeria",
    missionStatement: "Passion for Education and Excellence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "African University of Science and Technology",
    abbreviation: "AUST",
    state: "FCT",
    location: "Abuja",
    yearEstablished: 2007,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Science and Engineering",
      "School of Computing and Information Technology",
      "School of Public Policy and Administration"
    ],
    courses: [
      "Computer Science",
      "Material Science and Engineering",
      "Petroleum Engineering",
      "Applied Mathematics",
      "Public Administration"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "10:1",
    tuitionFee: {
      min: 500000,
      max: 1000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 900,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 30
    },
    website: "http://www.aust.edu.ng",
    email: "info@aust.edu.ng",
    phone: "+234-705-678-9012",
    address: "African University of Science and Technology, Abuja, FCT, Nigeria",
    missionStatement: "Advancing Science and Technology in Africa.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Miva Open University",
    abbreviation: "MOU",
    state: "FCT",
    location: "Abuja",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Computing",
      "School of Business and Management",
      "School of Health Sciences",
      "School of Public Policy"
    ],
    courses: [
      "Computer Science",
      "Cyber Security",
      "Data Science",
      "Software Engineering",
      "Public Health",
      "Nursing Science",
      "Accounting",
      "Economics",
      "Entrepreneurship",
      "Information Technology",
      "Criminology & Security Studies",
      "Mass Communication",
      "Business Management",
      "Public Policy and Administration"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 250000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 0, // As an open university, accommodation may not be provided
      max: 0,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Online Library",
      "Virtual Classrooms",
      "E-Laboratories",
      "Support Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: false,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 45
    },
    website: "https://miva.university",
    email: "support@miva.university",
    phone: "+234-901-234-5678",
    address: "Online-based – Miva Open University, Abuja, FCT, Nigeria",
    missionStatement: "To empower learners through accessible, affordable, and flexible education.",
    notableAlumni: []
  },
  {
    name: "Igbinedion University, Okada",
    abbreviation: "IUO",
    state: "Edo",
    location: "Okada",
    yearEstablished: 1999,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Arts and Social Sciences",
      "Faculty of Business and Management Studies",
      "Faculty of Engineering",
      "Faculty of Health Sciences",
      "Faculty of Law",
      "Faculty of Natural and Applied Sciences",
      "Faculty of Pharmacy"
    ],
    courses: [
      "Medicine",
      "Law",
      "Computer Science",
      "Mechanical Engineering",
      "Business Administration",
      "Pharmacy"
    ],
    studentPopulation: 5000,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 600000,
      max: 2500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 300000,
      currency: "NGN"
    },
    otherFees: 75000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 10
    },
    website: "https://iuokada.edu.ng",
    email: "info@iuokada.edu.ng",
    phone: "+234-805-123-4567",
    address: "Igbinedion University, Okada, Edo State, Nigeria",
    missionStatement: "Knowledge and Excellence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Benson Idahosa University",
    abbreviation: "BIU",
    state: "Edo",
    location: "Benin City",
    yearEstablished: 2002,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Agriculture and Agricultural Technology",
      "Faculty of Arts and Education",
      "Faculty of Engineering",
      "Faculty of Law",
      "Faculty of Science",
      "Faculty of Social and Management Sciences"
    ],
    courses: [
      "Law",
      "Electrical Engineering",
      "Computer Science",
      "Mass Communication",
      "Economics",
      "Agriculture"
    ],
    studentPopulation: 4000,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 500000,
      max: 1500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "Chapel"
    ],
    campusType: "Urban",
    libraryCapacity: 1800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 15
    },
    website: "https://biu.edu.ng",
    email: "info@biu.edu.ng",
    phone: "+234-806-789-0123",
    address: "Benson Idahosa University, Benin City, Edo State, Nigeria",
    missionStatement: "Raising Leaders for the Nation.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Glorious Vision University",
    abbreviation: "GVU",
    state: "Edo",
    location: "Ogwa",
    yearEstablished: 2011,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Humanities",
      "Faculty of Social and Management Sciences",
      "Faculty of Natural and Applied Sciences",
      "Faculty of Law"
    ],
    courses: [
      "English Language",
      "Business Administration",
      "Computer Science",
      "Law",
      "Economics",
      "Microbiology"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 300000,
      max: 700000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "Chapel"
    ],
    campusType: "Suburban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 30
    },
    website: "https://gvu.edu.ng",
    email: "info@gvu.edu.ng",
    phone: "+234-705-079-1222",
    address: "KM 1, Ogwa-Ehor Road, Ogwa, Edo State, Nigeria",
    missionStatement: "To Nurture for Discipline & Excellence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Wellspring University",
    abbreviation: "WU",
    state: "Edo",
    location: "Benin City",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "College of Natural and Applied Sciences",
      "College of Social and Management Sciences",
      "College of Computing",
      "College of Health Sciences"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Microbiology",
      "Mass Communication",
      "Business Administration",
      "Nursing"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "22:1",
    tuitionFee: {
      min: 250000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 40000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 900,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 35
    },
    website: "https://wellspringuniversity.edu.ng",
    email: "info@wellspringuniversity.edu.ng",
    phone: "+234-704-255-0535",
    address: "Irhirhi Road, off Airport Road by ADP Junction, Benin City, Edo State, Nigeria",
    missionStatement: "Unlocking Africa's potential through learning.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Mudiame University",
    abbreviation: "MU",
    state: "Edo",
    location: "Irrua",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Engineering",
      "Faculty of Science and Technology",
      "Faculty of Social and Management Sciences"
    ],
    courses: [
      "Mechanical Engineering",
      "Computer Engineering",
      "Software Engineering",
      "Accounting",
      "Economics",
      "Entrepreneurship"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 300000,
      max: 700000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 40
    },
    website: "https://mudiameuniversity.edu.ng",
    email: "info@mudiameuniversity.edu.ng",
    phone: "+234-701-234-5678",
    address: "Mudiame University, Irrua, Edo State, Nigeria",
    missionStatement: "Mind of Innovation.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Lighthouse University",
    abbreviation: "LU",
    state: "Edo",
    location: "Evbuobanosa",
    yearEstablished: 2022,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Science and Technology",
      "Faculty of Social and Management Sciences"
    ],
    courses: [
      "Computer Science",
      "Information Technology",
      "Business Administration",
      "Economics"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 250000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 40000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Suburban",
    libraryCapacity: 700,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 50
    },
    website: "https://lighthouseuniversity.edu.ng",
    email: "info@lighthouseuniversity.edu.ng",
    phone: "+234-806-789-4321",
    address: "Lighthouse University, Evbuobanosa, Edo State, Nigeria",
    missionStatement: "To enlighten minds and shape futures.",
    notableAlumni: []
  },
  {
    name: "Pan-Atlantic University",
    abbreviation: "PAU",
    state: "Lagos",
    location: "Ibeju-Lekki",
    yearEstablished: 2002,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Management and Social Sciences",
      "School of Media and Communication",
      "School of Science and Technology"
    ],
    courses: [
      "Accounting",
      "Business Administration",
      "Economics",
      "Mass Communication",
      "Computer Science",
      "Information Science and Media Studies"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 800000,
      max: 2500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 150000,
      max: 300000,
      currency: "NGN"
    },
    otherFees: 100000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 5
    },
    website: "https://pau.edu.ng",
    email: "info@pau.edu.ng",
    phone: "+234-708-864-1465",
    address: "Km 52, Lekki-Epe Expressway, Ibeju-Lekki, Lagos State, Nigeria",
    missionStatement: "To form competent and committed professionals and encourage them to serve with personal initiative and social responsibility.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Caleb University",
    abbreviation: "CU",
    state: "Lagos",
    location: "Imota",
    yearEstablished: 2007,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "College of Environmental Sciences and Management",
      "College of Pure and Applied Sciences",
      "College of Social and Management Sciences",
      "College of Art, Social and Management Sciences",
      "College of Law"
    ],
    courses: [
      "Accounting",
      "Architecture",
      "Biochemistry",
      "Computer Science",
      "Economics",
      "Mass Communication",
      "Microbiology",
      "Political Science",
      "Law"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 500000,
      max: 1200000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Suburban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 20
    },
    website: "https://calebuniversity.edu.ng",
    email: "info@calebuniversity.edu.ng",
    phone: "+234-802-123-4567",
    address: "Caleb University, Imota, Lagos State, Nigeria",
    missionStatement: "For God and Humanity.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Anchor University",
    abbreviation: "AUL",
    state: "Lagos",
    location: "Ayobo-Ipaja",
    yearEstablished: 2014,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Humanities",
      "Faculty of Social and Management Sciences",
      "Faculty of Natural and Applied Sciences"
    ],
    courses: [
      "Biology",
      "Computer Science",
      "Mass Communication",
      "Microbiology",
      "Physics",
      "Political Science"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 400000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "Chapel"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 35
    },
    website: "https://aul.edu.ng",
    email: "info@aul.edu.ng",
    phone: "+234-815-195-1950",
    address: "Anchor University, Ayobo-Ipaja, Lagos State, Nigeria",
    missionStatement: "Character, Competence, Courage.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Augustine University",
    abbreviation: "AUI",
    state: "Lagos",
    location: "Ilara-Epe",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Humanities, Management and Social Sciences",
      "Faculty of Science"
    ],
    courses: [
      "Accounting",
      "Biochemistry",
      "Computer Science",
      "Economics",
      "Mass Communication",
      "Microbiology",
      "Philosophy",
      "Political Science"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 400000,
      max: 900000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "Chapel"
    ],
    campusType: "Suburban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 40
    },
    website: "https://augustineuniversity.edu.ng",
    email: "info@augustineuniversity.edu.ng",
    phone: "+234-701-234-5678",
    address: "Augustine University, Ilara-Epe, Lagos State, Nigeria",
    missionStatement: "For Learning and Character.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Maranatha University",
    abbreviation: "MU",
    state: "Lagos",
    location: "Lekki",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Natural and Applied Sciences",
      "Faculty of Arts, Management and Social Sciences",
      "Faculty of Environmental Sciences"
    ],
    courses: [
      "Computer Science",
      "Information Technology",
      "Business Administration",
      "Economics",
      "Architecture",
      "Estate Management"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 300000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 40000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 700,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 50
    },
    website: "https://maranathauniversitylagos.edu.ng",
    email: "info@maranathauniversitylagos.edu.ng",
    phone: "+234-703-232-3034",
    address: "Maranatha University, Lekki, Lagos State, Nigeria",
    missionStatement: "Raising World-Class Leaders With Godly Values.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Skyline University Nigeria",
    abbreviation: "SUN",
    state: "Kano",
    location: "Kano City",
    yearEstablished: 2018,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Science and Information Technology",
      "School of Arts, Management and Social Science",
      "School of Basic Medical Sciences"
    ],
    courses: [
      "Computer Science",
      "Software Engineering",
      "Mass Communication",
      "Management",
      "Economics",
      "Political Science",
      "Doctor of Physiotherapy",
      "Nursing Science"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 500000,
      max: 1500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 300000,
      currency: "NGN"
    },
    otherFees: 80000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 30
    },
    website: "https://www.sun.edu.ng",
    email: "info@sun.edu.ng",
    phone: "+234-708-864-1465",
    address: "Skyline University Nigeria, Kano City, Kano State, Nigeria",
    missionStatement: "To provide quality education that fosters innovation and leadership.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Azman University Kano",
    abbreviation: "AUK",
    state: "Kano",
    location: "Kano City",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Computing and Science",
      "Faculty of Management and Social Sciences",
      "Faculty of Allied Health Sciences"
    ],
    courses: [
      "Biotechnology",
      "Microbiology",
      "Computer Science",
      "Cybersecurity",
      "Data Science",
      "Software Engineering",
      "Accounting",
      "Economics",
      "Public Administration",
      "Aviation Management",
      "Entrepreneurship",
      "International Relations",
      "Business Management",
      "Procurement Management",
      "Healthcare Administration",
      "Environmental Health Sciences",
      "Health Information Management",
      "Public Health"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 600000,
      max: 1800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 120000,
      max: 350000,
      currency: "NGN"
    },
    otherFees: 90000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 40
    },
    website: "https://www.azmanuniversity.edu.ng",
    email: "info@azmanuniversity.edu.ng",
    phone: "+234-916-866-6156",
    address: "Azman University Kano, Kano City, Kano State, Nigeria",
    missionStatement: "To provide innovative education that empowers students for global challenges.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Maryam Abacha American University of Nigeria",
    abbreviation: "MAAUN",
    state: "Kano",
    location: "Kano City",
    yearEstablished: 2011,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "School of Computing",
      "School of Health Sciences",
      "School of Nursing Sciences",
      "School of Social and Management Sciences"
    ],
    courses: [
      "Computer Science",
      "Cyber Security",
      "Information Technology",
      "Software Engineering",
      "Data Science",
      "Information Systems",
      "Doctor of Physiotherapy (DPT)",
      "Medical Laboratory Science (MBLS)",
      "Public Health",
      "Nursing Science (BNsc)",
      "Accounting",
      "Banking & Finance",
      "Business Administration",
      "Economics",
      "Human Resources Management",
      "Mass Communication",
      "Peace and Conflict Resolution",
      "International Relations"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "22:1",
    tuitionFee: {
      min: 700000,
      max: 2000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 150000,
      max: 400000,
      currency: "NGN"
    },
    otherFees: 100000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Sports Complex",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 50
    },
    website: "https://maaun.edu.ng",
    email: "info@maaun.edu.ng",
    phone: "+234-703-232-3034",
    address: "Maryam Abacha American University of Nigeria, Kano City, Kano State, Nigeria",
    missionStatement: "To provide quality education that meets international standards.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Elrazi Medical University Kano",
    abbreviation: "EMU",
    state: "Kano",
    location: "Kano City",
    yearEstablished: 2022,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Medicine",
      "Faculty of Dentistry",
      "Faculty of Pharmacy",
      "Faculty of Nursing"
    ],
    courses: [
      "Medicine",
      "Dentistry",
      "Pharmacy",
      "Nursing Science"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 1000000,
      max: 3000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 200000,
      max: 500000,
      currency: "NGN"
    },
    otherFees: 150000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels"
    ],
    campusType: "Urban",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 60
    },
    website: "https://elrazi.edu.ng",
    email: "info@elrazi.edu.ng",
    phone: "+234-703-232-3034",
    address: "Elrazi Medical University Kano, Kano City, Kano State, Nigeria",
    missionStatement: "To provide specialized medical education that meets global standards.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Rhema University",
    abbreviation: "RU",
    state: "Rivers",
    location: "Obeama-Asa",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Basic Medical Sciences",
      "Natural Sciences",
      "Social Sciences",
      "Management Sciences"
    ],
    courses: [
      "Medicine and Surgery",
      "Nursing",
      "Medical Laboratory Science",
      "Computer Science",
      "Accounting",
      "Economics",
      "Mass Communication"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 400000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 60
    },
    website: "https://www.rhemauniversity.edu.ng",
    email: "info@rhemauniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Rhema University, Obeama-Asa, Rivers State, Nigeria",
    missionStatement: "To provide quality education in a conducive environment.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "PAMO University of Medical Sciences",
    abbreviation: "PUMS",
    state: "Rivers",
    location: "Port Harcourt",
    yearEstablished: 2017,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Basic Medical Sciences",
      "Clinical Sciences",
      "Allied Health Sciences"
    ],
    courses: [
      "Medicine and Surgery",
      "Nursing",
      "Medical Laboratory Science",
      "Anatomy",
      "Physiology"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "15:1",
    tuitionFee: {
      min: 1000000,
      max: 2500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 150000,
      max: 300000,
      currency: "NGN"
    },
    otherFees: 100000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 50
    },
    website: "https://www.pums.edu.ng",
    email: "info@pums.edu.ng",
    phone: "+234-809-123-4567",
    address: "PAMO University of Medical Sciences, Port Harcourt, Rivers State, Nigeria",
    missionStatement: "To advance medical education and research in Nigeria.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Wigwe University",
    abbreviation: "WU",
    state: "Rivers",
    location: "Isiokpo",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts and Humanities",
      "Social Sciences",
      "Management Sciences",
      "Science and Technology"
    ],
    courses: [
      "Economics",
      "Business Administration",
      "Computer Science",
      "Mass Communication",
      "Political Science"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 800000,
      max: 2000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 120000,
      max: 250000,
      currency: "NGN"
    },
    otherFees: 70000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 70
    },
    website: "https://www.wigweuniversity.edu.ng",
    email: "info@wigweuniversity.edu.ng",
    phone: "+234-810-123-4567",
    address: "Wigwe University, Isiokpo, Rivers State, Nigeria",
    missionStatement: "To nurture fearless leaders through quality education.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Madonna University (Elele Campus)",
    abbreviation: "MU",
    state: "Rivers",
    location: "Elele",
    yearEstablished: 1999,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Medicine and Surgery",
      "Pharmacology"
    ],
    courses: [
      "Medicine and Surgery",
      "Pharmacology"
    ],
    studentPopulation: 2500,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 600000,
      max: 1500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 55
    },
    website: "https://www.madonnauniversity.edu.ng",
    email: "info@madonnauniversity.edu.ng",
    phone: "+234-811-123-4567",
    address: "Madonna University, Elele Campus, Rivers State, Nigeria",
    missionStatement: "To provide quality education grounded in moral values.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Greenfield University",
    abbreviation: "GFU",
    state: "Kaduna",
    location: "Kaduna City",
    yearEstablished: 2019,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Social and Management Sciences",
      "Faculty of Engineering",
      "Faculty of Science and Technology"
    ],
    courses: [
      "Economics",
      "Business Administration",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Computer Science",
      "Information Technology"
    ],
    studentPopulation: 315,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 500000,
      max: 1000000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 60
    },
    website: "https://gfu.edu.ng/",
    email: "info@gfu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Greenfield University, Kaduna City, Kaduna State, Nigeria",
    missionStatement: "To provide quality education that fosters innovation and leadership.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Franco-British International University",
    abbreviation: "FBIU",
    state: "Kaduna",
    location: "Kaduna City",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Faculty of Business",
      "Faculty of Technology",
      "Faculty of Health Sciences"
    ],
    courses: [
      "Business Administration",
      "Computer Science",
      "Public Health",
      "Information Technology"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 600000,
      max: 1200000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 150000,
      max: 250000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 70
    },
    website: "https://fbiu.edu.ng/",
    email: "info@fbiu.edu.ng",
    phone: "+234-812-345-6789",
    address: "Franco-British International University, Kaduna City, Kaduna State, Nigeria",
    missionStatement: "To provide a unique blend of French and British academic styles for outstanding education.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Ajayi Crowther University",
    abbreviation: "ACU",
    state: "Oyo",
    location: "Oyo Town",
    yearEstablished: 2005,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural Science",
      "Law",
      "Social Science",
      "Management Science",
      "Humanities",
      "Engineering",
      "Education"
    ],
    courses: [
      "Accounting",
      "Law",
      "Computer Science",
      "Economics",
      "Mass Communication",
      "Mechanical Engineering"
    ],
    studentPopulation: 5000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 600000,
      max: 700000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 88
    },
    website: "https://acu.edu.ng/",
    email: "info@acu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Ajayi Crowther University, Oyo Town, Oyo State, Nigeria",
    missionStatement: "Knowledge with Probity.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Lead City University",
    abbreviation: "LCU",
    state: "Oyo",
    location: "Ibadan",
    yearEstablished: 2005,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Social and Management Sciences",
      "Natural Sciences",
      "Engineering",
      "Law",
      "Education"
    ],
    courses: [
      "Business Administration",
      "Computer Science",
      "Law",
      "Mass Communication",
      "Economics"
    ],
    studentPopulation: 4000,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 500000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 200000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 48
    },
    website: "https://www.lcu.edu.ng/",
    email: "info@lcu.edu.ng",
    phone: "+234-802-123-4567",
    address: "Lead City University, Ibadan, Oyo State, Nigeria",
    missionStatement: "Knowledge for Self-reliance.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "KolaDaisi University",
    abbreviation: "KDU",
    state: "Oyo",
    location: "Ibadan",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Applied Sciences",
      "Law",
      "Management and Social Sciences"
    ],
    courses: [
      "Accounting",
      "Business Administration",
      "Computer Science",
      "Law",
      "Economics"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 500000,
      max: 700000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 121
    },
    website: "https://www.koladaisiuniversity.edu.ng/",
    email: "info@koladaisiuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "KolaDaisi University, Ibadan, Oyo State, Nigeria",
    missionStatement: "Knowledge for the Service of Humanity.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Dominican University",
    abbreviation: "DUI",
    state: "Oyo",
    location: "Ibadan",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Humanities",
      "Social Sciences",
      "Natural Sciences"
    ],
    courses: [
      "Philosophy",
      "Religious Studies",
      "Economics",
      "Computer Science",
      "Mass Communication"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Suburban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 102
    },
    website: "https://dui.edu.ng/",
    email: "info@dui.edu.ng",
    phone: "+234-805-123-4567",
    address: "Dominican University, Samonda, Ibadan, Oyo State, Nigeria",
    missionStatement: "In veritate libertas.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Precious Cornerstone University",
    abbreviation: "PCU",
    state: "Oyo",
    location: "Ibadan",
    yearEstablished: 2017,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Pure and Applied Sciences",
      "Social and Management Sciences"
    ],
    courses: [
      "Computer Science",
      "Microbiology",
      "Accounting",
      "Business Administration",
      "Economics"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 155
    },
    website: "https://pcu.edu.ng/",
    email: "info@pcu.edu.ng",
    phone: "+234-806-123-4567",
    address: "Precious Cornerstone University, Ibadan, Oyo State, Nigeria",
    missionStatement: "To produce knowledgeable and moral scholars, professionals, and leaders.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Atiba University",
    abbreviation: "AU",
    state: "Oyo",
    location: "Oyo Town",
    yearEstablished: 2017,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts, Social and Management Sciences",
      "Natural and Applied Sciences",
      "Health Sciences"
    ],
    courses: [
      "Accounting",
      "Business Administration",
      "Computer Science",
      "Nursing",
      "Medical Laboratory Science"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 500000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 149
    },
    website: "https://atibauniversity.edu.ng/",
    email: "info@atibauniversity.edu.ng",
    phone: "+234-807-123-4567",
    address: "Atiba University, Oyo Town, Oyo State, Nigeria",
    missionStatement: "To provide sound education for intellectual development and capacity building.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Hezekiah University",
    abbreviation: "UNIHEZ",
    state: "Imo",
    location: "Umudi, Nkwerre",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Humanities",
      "Management and Social Sciences"
    ],
    courses: [
      "Plant Science and Biotechnology",
      "Microbiology",
      "Biochemistry",
      "Industrial Chemistry",
      "Computer Science",
      "Mathematics & Statistics",
      "Physics with Electronics",
      "English Language and Literacy Studies",
      "History and International Studies",
      "Christian Religious Studies",
      "Accounting",
      "Business Administration",
      "Economics",
      "Political Science",
      "Sociology",
      "Public Administration",
      "Marketing",
      "Mass Communication"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 200000,
      max: 300000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 30000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Suburban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 100
    },
    website: "https://hezekiah.edu.ng/",
    email: "info@hezekiah.edu.ng",
    phone: "+234-803-123-4567",
    address: "Hezekiah University, Umudi, Nkwerre, Imo State, Nigeria",
    missionStatement: "Academic Excellence with Good Morals.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Claretian University of Nigeria",
    abbreviation: "CUN",
    state: "Imo",
    location: "Nekede, Owerri",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts",
      "Sciences",
      "Social and Management Sciences"
    ],
    courses: [
      "English and Literary Studies",
      "Philosophy",
      "Religious Studies",
      "Computer Science",
      "Biochemistry",
      "Microbiology",
      "Accounting",
      "Business Administration",
      "Economics",
      "Political Science"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 250000,
      max: 400000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 35000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 120
    },
    website: "https://claretianuniversity.edu.ng/",
    email: "info@claretianuniversity.edu.ng",
    phone: "+234-901-618-9060",
    address: "Claretian University of Nigeria, Maryland Nekede, Owerri, Imo State, Nigeria",
    missionStatement: "To promote academic excellence and moral integrity.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Maranatha University",
    abbreviation: "MU",
    state: "Imo",
    location: "Mgbidi",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences"
    ],
    courses: [
      "Computer Science",
      "Biochemistry",
      "Microbiology",
      "Accounting",
      "Business Administration",
      "Economics",
      "Political Science"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 130000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 700,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 130
    },
    website: "https://maranathauniversity.edu.ng/",
    email: "info@maranathauniversity.edu.ng",
    phone: "+234-802-123-4567",
    address: "Maranatha University, Mgbidi, Imo State, Nigeria",
    missionStatement: "To provide quality education grounded in Christian values.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Caritas University",
    abbreviation: "CU",
    state: "Enugu",
    location: "Amorji-Nike, Enugu",
    yearEstablished: 2005,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Engineering",
      "Environmental Sciences",
      "Natural Sciences",
      "Management and Social Sciences"
    ],
    courses: [
      "Computer Engineering",
      "Electrical/Electronic Engineering",
      "Urban and Regional Planning",
      "Mathematics and Statistics",
      "Accounting",
      "Economics"
    ],
    studentPopulation: 2500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 400000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 80
    },
    website: "http://www.caritasuni.edu.ng",
    email: "info@caritasuni.edu.ng",
    phone: "+234-803-123-4567",
    address: "Caritas University, Amorji-Nike, Enugu State, Nigeria",
    missionStatement: "Love for Education and Moral.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Godfrey Okoye University",
    abbreviation: "GOUNI",
    state: "Enugu",
    location: "Ugwuomu-Nike, Enugu",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts",
      "Education",
      "Law",
      "Management and Social Sciences",
      "Natural and Applied Sciences"
    ],
    courses: [
      "English and Literary Studies",
      "Biology",
      "Computer Science",
      "Law",
      "Mass Communication"
    ],
    studentPopulation: 7000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 2000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 5
    },
    website: "https://gouni.edu.ng",
    email: "info@gouni.edu.ng",
    phone: "+234-803-123-4567",
    address: "Godfrey Okoye University, Ugwuomu-Nike, Enugu State, Nigeria",
    missionStatement: "Unity of Knowledge.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Renaissance University",
    abbreviation: "RNU",
    state: "Enugu",
    location: "Ugbawka, Enugu",
    yearEstablished: 2005,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Law"
    ],
    courses: [
      "Computer Science",
      "Microbiology",
      "Accounting",
      "Economics",
      "Law"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 90
    },
    website: "http://www.rnu.edu.ng",
    email: "info@rnu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Renaissance University, Ugbawka, Enugu State, Nigeria",
    missionStatement: "You can be what you want to be.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Coal City University",
    abbreviation: "CCU",
    state: "Enugu",
    location: "Enugu",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Education",
      "Arts, Social and Management Sciences"
    ],
    courses: [
      "Accounting",
      "Biochemistry",
      "Computer Science",
      "Mass Communication",
      "Political Science"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 130000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 100
    },
    website: "https://ccu.edu.ng",
    email: "info@ccu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Coal City University, Enugu, Enugu State, Nigeria",
    missionStatement: "Data not available",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Peaceland University",
    abbreviation: "PU",
    state: "Enugu",
    location: "Enugu",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Education"
    ],
    courses: [
      "Computer Science",
      "Business Administration",
      "Economics",
      "Education",
      "Mass Communication"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 400000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 30000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 700,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 120
    },
    website: "https://peacelanduni.edu.ng",
    email: "info@peacelanduni.edu.ng",
    phone: "+234-803-123-4567",
    address: "Peaceland University, Enugu, Enugu State, Nigeria",
    missionStatement: "Integral Human Development.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Madonna University (Akpugo Campus)",
    abbreviation: "MU",
    state: "Enugu",
    location: "Akpugo, Enugu",
    yearEstablished: 1999,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Engineering"
    ],
    courses: [
      "Chemical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical and Electronics Engineering",
      "Petroleum Engineering"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 70
    },
    website: "https://madonnauniversity.edu.ng",
    email: "info@madonnauniversity.edu.ng",
    phone: "+234-803-123-4567",
     address: "Madonna University, Akpugo Campus, Enugu State, Nigeria",
  missionStatement: "To prepare skilled professionals committed to moral and academic excellence.",
  notableAlumni: ["Data not available"]
  },
  {
    name: "Novena University",
    abbreviation: "NU",
    state: "Delta",
    location: "Ogume, Delta State",
    yearEstablished: 2005,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Medical and Health Sciences",
      "Law"
    ],
    courses: [
      "Computer Science",
      "Biochemistry",
      "Accounting",
      "Economics",
      "Mass Communication",
      "Law",
      "Medicine and Surgery",
      "Dentistry",
      "Pharmacy"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 80
    },
    website: "https://novenauniversity.edu.ng",
    email: "info@novenauniversity.edu.ng",
    phone: "+234-803-330-2376",
    address: "Novena University, Ogume, Delta State, Nigeria",
    missionStatement: "Knowledge through diligence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Western Delta University",
    abbreviation: "WDU",
    state: "Delta",
    location: "Oghara, Delta State",
    yearEstablished: 2007,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Social and Management Sciences",
      "Applied Health Sciences",
      "Law",
      "Computing",
      "Postgraduate Studies"
    ],
    courses: [
      "Biochemistry",
      "Microbiology",
      "Computer Science",
      "Software Engineering",
      "Cyber Security",
      "Information Technology",
      "Accounting",
      "Economics",
      "Mass Communication",
      "Political Science",
      "Sociology",
      "Law",
      "Medical Laboratory Science",
      "Nursing Science"
    ],
    studentPopulation: 2500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 350000,
      max: 550000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 45000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 90
    },
    website: "http://wdu.edu.ng",
    email: "info@wdu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Western Delta University, Oghara, Delta State, Nigeria",
    missionStatement: "Knowledge for Human Advancement.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Edwin Clark University",
    abbreviation: "ECU",
    state: "Delta",
    location: "Kiagbodo, Delta State",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Humanities",
      "Social and Management Sciences",
      "Science",
      "Law"
    ],
    courses: [
      "English and Literary Studies",
      "History and International Studies",
      "Economics",
      "Accounting",
      "Business Administration",
      "Political Science",
      "Biology",
      "Chemistry",
      "Mathematics",
      "Physics",
      "Law"
    ],
    studentPopulation: 2000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 85
    },
    website: "https://edwinclarkuniversity.edu.ng",
    email: "info@edwinclarkuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Edwin Clark University, Kiagbodo, Delta State, Nigeria",
    missionStatement: "Empowering future generations.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Michael and Cecilia Ibru University",
    abbreviation: "MCIU",
    state: "Delta",
    location: "Agbara-Otor, Delta State",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts and Humanities",
      "Computing",
      "Law",
      "Management and Social Sciences",
      "Natural and Applied Sciences"
    ],
    courses: [
      "English and Literary Studies",
      "Computer Science",
      "Law",
      "Accounting",
      "Business Administration",
      "Economics",
      "Mass Communication",
      "Microbiology",
      "Public Administration"
    ],
    studentPopulation: 1800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 350000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 900,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 95
    },
    website: "https://mciu.edu.ng",
    email: "info@mciu.edu.ng",
    phone: "+234-803-123-4567",
    address: "Michael and Cecilia Ibru University, Agbara-Otor, Delta State, Nigeria",
    missionStatement: "Reducing poverty through education.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Admiralty University of Nigeria",
    abbreviation: "ADUN",
    state: "Delta",
    location: "Ibusa and Sapele, Delta State",
    yearEstablished: 2017,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Arts and Social Sciences",
      "Management Sciences",
      "Science",
      "Engineering and Technology"
    ],
    courses: [
      "International Relations",
      "History and International Studies",
      "Accounting",
      "Business Administration",
      "Economics",
      "Biology",
      "Chemistry",
      "Computer Science",
      "Electrical/Electronic Engineering",
      "Mechanical Engineering"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 550000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 110000,
      currency: "NGN"
    },
    otherFees: 45000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 88
    },
    website: "https://adun.edu.ng",
    email: "info@adun.edu.ng",
    phone: "+234-803-123-4567",
    address: "Admiralty University of Nigeria, Ibusa and Sapele, Delta State, Nigeria",
    missionStatement: "Providing quality education for national development.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Margaret Lawrence University",
    abbreviation: "MLU",
    state: "Delta",
    location: "Umunede, Delta State",
    yearEstablished: 2023,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Education"
    ],
    courses: [
      "Computer Science",
      "Business Administration",
      "Economics",
      "Education",
      "Mass Communication"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 400000,
      currency: "NGN"
      },
    accommodationFee: {
      min: 50000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 30000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "ICT Center",
      "Hostels"
    ],
    campusType: "Rural",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: undefined
    },
    website: "https://margaretlawrenceuniversity.edu.ng",
    email: "info@margaretlawrenceuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Margaret Lawrence University, Umunede, Delta State, Nigeria",
    missionStatement: "Committed to excellence in higher education.",
    notableAlumni: []
  },
  {
    name: "Madonna University",
    abbreviation: "MU",
    state: "Anambra",
    location: "Okija",
    yearEstablished: 1999,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Medical and Health Sciences",
      "Law"
    ],
    courses: [
      "Computer Science",
      "Biochemistry",
      "Accounting",
      "Economics",
      "Mass Communication",
      "Law",
      "Medicine and Surgery",
      "Dentistry",
      "Pharmacy"
    ],
    studentPopulation: 3000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 1500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 80
    },
    website: "https://madonnauniversity.edu.ng",
    email: "info@madonnauniversity.edu.ng",
    phone: "+234-803-330-2376",
    address: "Madonna University, Okija, Anambra State, Nigeria",
    missionStatement: "Knowledge through diligence.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Paul University",
    abbreviation: "PUA",
    state: "Anambra",
    location: "Awka",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Theology"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Theology"
    ],
    studentPopulation: 400,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 90
    },
    website: "https://pauluniversity.edu.ng",
    email: "info@pauluniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Paul University, Awka, Anambra State, Nigeria",
    missionStatement: "Ecce Ego Mite Me.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Tansian University",
    abbreviation: "TU",
    state: "Anambra",
    location: "Umunya",
    yearEstablished: 2009,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Engineering"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Electrical Engineering"
    ],
    studentPopulation: 1500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 350000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 45000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 85
    },
    website: "https://tansianuniversity.edu.ng",
    email: "info@tansianuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Tansian University, Umunya, Anambra State, Nigeria",
    missionStatement: "Scientia potestas et virtus.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Legacy University",
    abbreviation: "LU",
    state: "Anambra",
    location: "Okija",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Engineering"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Electrical Engineering"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 450000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 90000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 95
    },
    website: "https://legacyuniversity.edu.ng",
    email: "info@legacyuniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Legacy University, Okija, Anambra State, Nigeria",
    missionStatement: "Building a legacy of excellence in learning and research.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "Peter University",
    abbreviation: "PU",
    state: "Anambra",
    location: "Achina-Onneh",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 250000,
      max: 400000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 30000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 300,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 100
    },
    website: "https://peteruniversity.edu.ng",
    email: "info@peteruniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Peter University, Achina-Onneh, Anambra State, Nigeria",
    missionStatement: "Empowering future generations.",
    notableAlumni: ["Data not available"]
  },
  {
    name: "University on the Niger",
    abbreviation: "UoN",
    state: "Anambra",
    location: "Umunya",
    yearEstablished: 2020,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies"
    ],
    studentPopulation: 300,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 200000,
      max: 350000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 40000,
      max: 70000,
      currency: "NGN"
    },
    otherFees: 25000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 200,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 105
    },
    website: "https://uon.edu.ng",
    email: "info@uon.edu.ng",
    phone: "+234-803-987-6543",
    address: "University on the Niger, Umunya, Anambra State, Nigeria",
    missionStatement: "Providing quality education for sustainable development.",
    notableAlumni: []
  },
   {
    name: "Obong University",
    abbreviation: "OU",
    state: "Akwa Ibom",
    location: "Obong Ntak",
    yearEstablished: 1997,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Theology"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Theology"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 85
    },
    website: "https://www.obonguniversity.edu.ng",
    email: "info@obonguniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "Obong University, Obong Ntak, Akwa Ibom State, Nigeria",
    missionStatement: "Academic excellence with Christian values.",
    notableAlumni: []
  },
  {
    name: "Ritman University",
    abbreviation: "RU",
    state: "Akwa Ibom",
    location: "Ikot Ekpene",
    yearEstablished: 2015,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Engineering"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Electrical Engineering"
    ],
    studentPopulation: 1000,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 350000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 70000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 75
    },
    website: "https://www.ritmanuniversity.edu.ng",
    email: "info@ritmanuniversity.edu.ng",
    phone: "+234-803-987-6543",
    address: "Ritman University, Ikot Ekpene, Akwa Ibom State, Nigeria",
    missionStatement: "Knowledge for development.",
    notableAlumni: []
  },
  {
    name: "Topfaith University",
    abbreviation: "TFU",
    state: "Akwa Ibom",
    location: "Mkpatak",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Engineering"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Electrical Engineering"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 90
    },
    website: "https://www.topfaith.edu.ng",
    email: "info@topfaith.edu.ng",
    phone: "+234-805-347-5763",
    address: "Topfaith University, Mkpatak, Akwa Ibom State, Nigeria",
    missionStatement: "Building a legacy of excellence in learning and research.",
    notableAlumni: []
  },
  {
    name: "Southern Atlantic University",
    abbreviation: "SAU",
    state: "Akwa Ibom",
    location: "Uyo",
    yearEstablished: 2025,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Engineering"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Electrical Engineering"
    ],
    studentPopulation: 300,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 250000,
      max: 400000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 50000,
      max: 80000,
      currency: "NGN"
    },
    otherFees: 30000,
    scholarshipAvailable: false,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: false,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 95
    },
    website: "https://www.southernatlantic.edu.ng",
    email: "info@southernatlantic.edu.ng",
    phone: "+234-803-123-4567",
    address: "Southern Atlantic University, Uyo, Akwa Ibom State, Nigeria",
    missionStatement: "Providing quality education for sustainable development.",
    notableAlumni: []
  },
  {
    name: "Arthur Jarvis University",
    abbreviation: "AJU",
    state: "Cross River",
    location: "Akpabuyo",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Basic Medical Sciences",
      "Law",
      "Education",
      "Humanities",
      "Natural and Applied Sciences"
    ],
    courses: [
      "Anatomy",
      "Physiology",
      "Nursing Science",
      "Medical Laboratory Science",
      "Optometry",
      "Law",
      "Education/Economics",
      "Education/Political Science",
      "Education/Biology",
      "Education/Chemistry",
      "Education/Computer Science",
      "Business Education"
    ],
    studentPopulation: 1200,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 400000,
      max: 600000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 80000,
      max: 120000,
      currency: "NGN"
    },
    otherFees: 50000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center",
      "Sports Complex"
    ],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: true,
    ranking: {
      national: 70
    },
    website: "https://arthurjarvisuniversity.edu.ng",
    email: "info@arthurjarvisuniversity.edu.ng",
    phone: "+234-803-270-7230",
    address: "Arthur Jarvis University, Akpabuyo, Cross River State, Nigeria",
    missionStatement: "To provide quality education that meets the needs of society.",
    notableAlumni: []
  },
  {
    name: "Havilla University",
    abbreviation: "HUNI",
    state: "Cross River",
    location: "Nde-Ikom",
    yearEstablished: 2021,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Natural and Applied Sciences",
      "Management and Social Sciences",
      "Humanities",
      "Theology"
    ],
    courses: [
      "Computer Science",
      "Accounting",
      "Economics",
      "English and Literary Studies",
      "Theology"
    ],
    studentPopulation: 800,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 300000,
      max: 500000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 60000,
      max: 100000,
      currency: "NGN"
    },
    otherFees: 40000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Laboratories",
      "Medical Center",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Rural",
    libraryCapacity: 500,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 85
    },
    website: "https://havillauniversity.edu.ng",
    email: "info@havillauniversity.edu.ng",
    phone: "+234-803-585-9130",
    address: "Havilla University, Nde-Ikom, Cross River State, Nigeria",
    missionStatement: "Providing quality education for sustainable development.",
    notableAlumni: []
  },
  {
    name: "The Duke Medical University",
    abbreviation: "DukeMU",
    state: "Cross River",
    location: "Calabar",
    yearEstablished: 2022,
    type: "Private",
    accreditation: ["NUC"],
    faculties: [
      "Medical Sciences",
      "Health Sciences"
    ],
    courses: [
      "Medicine",
      "Nursing",
      "Medical Laboratory Science",
      "Pharmacy"
    ],
    studentPopulation: 500,
    studentToLecturerRatio: "Data not available",
    tuitionFee: {
      min: 600000,
      max: 800000,
      currency: "NGN"
    },
    accommodationFee: {
      min: 100000,
      max: 150000,
      currency: "NGN"
    },
    otherFees: 60000,
    scholarshipAvailable: true,
    facilities: [
      "Library",
      "Medical Laboratories",
      "Hostels",
      "ICT Center"
    ],
    campusType: "Urban",
    libraryCapacity: 300,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 95
    },
    website: "https://thedukemedicaluniversity.edu.ng",
    email: "info@thedukemedicaluniversity.edu.ng",
    phone: "+234-803-123-4567",
    address: "The Duke Medical University, Calabar, Cross River State, Nigeria",
    missionStatement: "Advancing healthcare education and research.",
    notableAlumni: []
  },
  {
    name: "Cranes University",
    abbreviation: "CRANES",
    state: "Bayelsa",
    location: "Agudama-Epie, Yenagoa",
    yearEstablished: 2016,
    type: "Private",
    accreditation: ["NUC"],
    faculties: ["Management Sciences", "Social Sciences", "Natural Sciences", "Law"],
    courses: ["Business Administration", "Accounting", "Mass Communication", "Law", "Computer Science"],
    studentPopulation: 2000,
    studentToLecturerRatio: "20:1",
    tuitionFee: {
      min: 250000,
      max: 350000,
      currency: "NGN",
    },
    accommodationFee: {
      min: 50000,
      max: 80000,
      currency: "NGN",
    },
    otherFees: 15000,
    scholarshipAvailable: true,
    facilities: ["Library", "Hostel", "Medical Center", "Laboratories"],
    campusType: "Urban",
    libraryCapacity: 1000,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 90,
      regional: 5,
    },
    website: "https://www.cranesuniversity.edu.ng",
    email: "info@cranesuniversity.edu.ng",
    phone: "+2348090000000",
    address: "Agudama-Epie, Yenagoa, Bayelsa State",
    missionStatement: "To provide qualitative education that meets global standards and promotes community development.",
    notableAlumni: []
  },
  {
    name: "Joseph Sarwuan Tarka University",
    abbreviation: "JOSTU",
    state: "Plateau",
    location: "Makurdi",
    yearEstablished: 2018,
    type: "Private",
    accreditation: ["NUC"],
    faculties: ["Social Sciences", "Natural Sciences", "Management Sciences", "Education"],
    courses: ["Political Science", "Economics", "Biology", "Business Administration", "Education"],
    studentPopulation: 3500,
    studentToLecturerRatio: "25:1",
    tuitionFee: {
      min: 200000,
      max: 400000,
      currency: "NGN",
    },
    accommodationFee: {
      min: 40000,
      max: 90000,
      currency: "NGN",
    },
    otherFees: 15000,
    scholarshipAvailable: false,
    facilities: ["Library", "Hostel", "Medical Center", "Laboratories"],
    campusType: "Urban",
    libraryCapacity: 1200,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: true,
    hasSportsComplex: false,
    ranking: {
      national: 110,
      regional: 7,
    },
    website: "https://www.jostu.edu.ng",
    email: "info@jostu.edu.ng",
    phone: "+2348031234567",
    address: "Makurdi, Plateau State",
    missionStatement: "To offer quality education that fosters leadership, innovation, and community development.",
    notableAlumni: []
  },
  {
    name: "Joseph Ameh Institute",
    abbreviation: "JAI",
    state: "Plateau",
    location: "Jos",
    yearEstablished: 2012,
    type: "Private",
    accreditation: ["NUC"],
    faculties: ["Health Sciences", "Management Sciences", "Social Sciences"],
    courses: ["Nursing", "Public Health", "Business Administration", "Sociology"],
    studentPopulation: 1500,
    studentToLecturerRatio: "18:1",
    tuitionFee: {
      min: 220000,
      max: 300000,
      currency: "NGN",
    },
    accommodationFee: {
      min: 30000,
      max: 70000,
      currency: "NGN",
    },
    otherFees: 10000,
    scholarshipAvailable: true,
    facilities: ["Library", "Medical Center", "Hostel"],
    campusType: "Urban",
    libraryCapacity: 800,
    hasHostel: true,
    hasMedicalCenter: true,
    hasLaboratories: false,
    hasSportsComplex: false,
    ranking: {
      national: 150,
      regional: 12,
    },
    website: "https://www.josephamehinstitute.edu.ng",
    email: "contact@josephamehinstitute.edu.ng",
    phone: "+2348029876543",
    address: "Jos, Plateau State",
    missionStatement: "Committed to providing practical and professional education in health and management sciences.",
    notableAlumni: []
  }
];

export async function POST() {
  try {
    const db = await getDatabase();
    const collection = db.collection<University>('universities');

    // Optional: prevent duplicate insertion
    const existing = await collection.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { message: 'Universities already seeded.' },
        { status: 200 }
      );
    }

    const result = await collection.insertMany(sampleUniversities as University[]);
    return NextResponse.json(
      { message: 'Universities inserted successfully.', insertedCount: result.insertedCount },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inserting universities:', error);
    return NextResponse.json(
      { message: 'Failed to insert universities.', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(); // Delegate to the same seeding logic
}