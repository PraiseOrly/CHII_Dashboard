export { GENDERS } from "@/types";
/* ════════════════════════════════════════════════════════
   Impact Stories — synthetic dataset
═══════════════════════════════════════════════════════ */

export type StoryType = "Text story" | "Video story";

export interface Story {
  id: number;
  name: string;
  type: StoryType;
  program: string;
  missionArea: string;
  humanitarianStatus: string;
  nationality: string;
  disabilityStatus: string;
  gender: string;
  location: string;
  lat: number;
  lng: number;
  body: string;
  videoUrl?: string;
}

export const PROGRAMS = ["BSc Software Eng", "Entrepreneurial Leadership", "Global Challenges", "International Business", "Computer Science"];
export const MISSION_AREAS = ["Digital Health", "MedTech", "Biotech & Pharma", "Mental Health & Wellness", "Fitness & Preventive Health", "Healthcare Infrastructure & Operations", "Personalized & Precision Medicine", "Public Health & Accessibility", "Maternal Health"];
export const HUMANITARIAN = ["Refugee", "Asylum Seeker", "Internally Displaced Person (IDP)", "None"];
export const NATIONALITIES = ["Rwanda", "Kenya", "Nigeria", "Ghana", "South Africa", "Uganda", "Ethiopia", "Senegal", "Zimbabwe", "DR Congo"];
export const DISABILITY = ["Yes", "None"];

export const STORIES: Story[] = [
  { id: 1, name: "Peter Mwangi", type: "Video story", program: "BSc Software Eng", missionArea: "Digital Health", humanitarianStatus: "None", nationality: "Kenya", disabilityStatus: "None", gender: "Male", location: "Nairobi, Kenya", lat: -1.2921, lng: 36.8219, body: "Peter built an edtech platform reaching 12,000 learners across East Africa.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, name: "Amara Okafor", type: "Text story", program: "Entrepreneurial Leadership", missionArea: "MedTech", humanitarianStatus: "None", nationality: "Nigeria", disabilityStatus: "None", gender: "Female", location: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792, body: "Amara founded a fintech serving informal traders with micro-savings tools." },
  { id: 3, name: "Jean-Paul Habimana", type: "Text story", program: "Global Challenges", missionArea: "Fitness & Preventive Health", humanitarianStatus: "None", nationality: "Rwanda", disabilityStatus: "None", gender: "Male", location: "Kigali, Rwanda", lat: -1.9706, lng: 30.1044, body: "Jean-Paul leads a solar mini-grid venture electrifying rural communities." },
  { id: 4, name: "Fatima Diallo", type: "Video story", program: "International Business", missionArea: "Maternal Health", humanitarianStatus: "Refugee", nationality: "Senegal", disabilityStatus: "None", gender: "Female", location: "Dakar, Senegal", lat: 14.7167, lng: -17.4677, body: "Fatima scaled an agri-export co-op linking smallholders to global buyers.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 5, name: "Thabo Nkosi", type: "Text story", program: "Computer Science", missionArea: "Public Health & Accessibility", humanitarianStatus: "None", nationality: "South Africa", disabilityStatus: "Yes", gender: "Male", location: "Johannesburg, South Africa", lat: -26.2041, lng: 28.0473, body: "Thabo developed accessible diagnostic software used in 30 clinics." },
  { id: 6, name: "Grace Achieng", type: "Text story", program: "BSc Software Eng", missionArea: "Digital Health", humanitarianStatus: "Internally Displaced Person (IDP)", nationality: "Uganda", disabilityStatus: "None", gender: "Female", location: "Kampala, Uganda", lat: 0.3476, lng: 32.5825, body: "Grace created a low-bandwidth learning app for displaced students." },
  { id: 7, name: "Samuel Tesfaye", type: "Text story", program: "Global Challenges", missionArea: "Fitness & Preventive Health", humanitarianStatus: "None", nationality: "Ethiopia", disabilityStatus: "Yes", gender: "Male", location: "Addis Ababa, Ethiopia", lat: 9.0249, lng: 38.7469, body: "Samuel runs a clean-cooking enterprise reducing household emissions." },
  { id: 8, name: "Akosua Mensah", type: "Video story", program: "Entrepreneurial Leadership", missionArea: "MedTech", humanitarianStatus: "None", nationality: "Ghana", disabilityStatus: "None", gender: "Female", location: "Accra, Ghana", lat: 5.6037, lng: -0.1870, body: "Akosua's lending platform has disbursed over $2M to women-led businesses.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 9, name: "Chiamaka Eze", type: "Text story", program: "International Business", missionArea: "Maternal Health", humanitarianStatus: "None", nationality: "Nigeria", disabilityStatus: "None", gender: "Female", location: "Abuja, Nigeria", lat: 9.0765, lng: 7.3986, body: "Chiamaka connects farmers to fair-price markets via a mobile platform." },
  { id: 10, name: "David Mugisha", type: "Text story", program: "Computer Science", missionArea: "Public Health & Accessibility", humanitarianStatus: "None", nationality: "Rwanda", disabilityStatus: "None", gender: "Male", location: "Musanze, Rwanda", lat: -1.4998, lng: 29.6347, body: "David built a telemedicine service for remote highland communities." },
  { id: 11, name: "Lerato Dube", type: "Video story", program: "Global Challenges", missionArea: "Digital Health", humanitarianStatus: "None", nationality: "Zimbabwe", disabilityStatus: "None", gender: "Female", location: "Harare, Zimbabwe", lat: -17.8252, lng: 31.0335, body: "Lerato's nonprofit trains girls in coding and digital skills.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 12, name: "Emmanuel Kabila", type: "Text story", program: "Entrepreneurial Leadership", missionArea: "MedTech", humanitarianStatus: "Refugee", nationality: "DR Congo", disabilityStatus: "None", gender: "Male", location: "Goma, DR Congo", lat: -1.6792, lng: 29.2228, body: "Emmanuel started a savings cooperative serving refugee entrepreneurs." },
  { id: 13, name: "Nadia Hassan", type: "Text story", program: "BSc Software Eng", missionArea: "Public Health & Accessibility", humanitarianStatus: "None", nationality: "Kenya", disabilityStatus: "None", gender: "Female", location: "Mombasa, Kenya", lat: -4.0435, lng: 39.6682, body: "Nadia leads a maternal-health data startup improving clinic outcomes." },
  { id: 14, name: "Kwame Asante", type: "Text story", program: "International Business", missionArea: "Fitness & Preventive Health", humanitarianStatus: "None", nationality: "Ghana", disabilityStatus: "None", gender: "Male", location: "Kumasi, Ghana", lat: 6.6885, lng: -1.6244, body: "Kwame's recycling venture diverts plastic waste into building materials." },
  { id: 15, name: "Aisha Bello", type: "Video story", program: "Computer Science", missionArea: "Digital Health", humanitarianStatus: "None", nationality: "Nigeria", disabilityStatus: "Yes", gender: "Female", location: "Kano, Nigeria", lat: 12.0022, lng: 8.5920, body: "Aisha builds screen-reader-friendly learning tools for blind students.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 16, name: "Brian Otieno", type: "Text story", program: "Global Challenges", missionArea: "Maternal Health", humanitarianStatus: "None", nationality: "Kenya", disabilityStatus: "None", gender: "Male", location: "Kisumu, Kenya", lat: -0.0917, lng: 34.7680, body: "Brian's agritech reduces post-harvest losses for lakeside farmers." },
  { id: 17, name: "Sarah Niyonsaba", type: "Text story", program: "Entrepreneurial Leadership", missionArea: "Public Health & Accessibility", humanitarianStatus: "Internally Displaced Person (IDP)", nationality: "Rwanda", disabilityStatus: "None", gender: "Female", location: "Huye, Rwanda", lat: -2.5967, lng: 29.7392, body: "Sarah runs a community pharmacy network in underserved districts." },
  { id: 18, name: "Tariro Moyo", type: "Text story", program: "BSc Software Eng", missionArea: "MedTech", humanitarianStatus: "None", nationality: "Zimbabwe", disabilityStatus: "None", gender: "Non-binary", location: "Bulawayo, Zimbabwe", lat: -20.1325, lng: 28.6265, body: "Tariro created a digital wallet for cross-border informal trade." },
  { id: 19, name: "Joseph Mutua", type: "Video story", program: "International Business", missionArea: "Digital Health", humanitarianStatus: "None", nationality: "Uganda", disabilityStatus: "None", gender: "Male", location: "Gulu, Uganda", lat: 2.7746, lng: 32.2990, body: "Joseph's social enterprise funds scholarships through ethical trade.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 20, name: "Mariam Sow", type: "Text story", program: "Computer Science", missionArea: "Fitness & Preventive Health", humanitarianStatus: "None", nationality: "Senegal", disabilityStatus: "Yes", gender: "Female", location: "Saint-Louis, Senegal", lat: 16.0179, lng: -16.4896, body: "Mariam develops flood-prediction tools for coastal communities." },
];

/* headline summary figures (illustrative) */
export const SUMMARY = { stories: 364, countries: 29, video: 15, written: 349 };
