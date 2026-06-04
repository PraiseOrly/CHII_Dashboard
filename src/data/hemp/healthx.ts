export type HealthXType =
  | "Health Facility Visit"
  | "Innovation Challenge"
  | "Field Exposure"
  | "Industry Tour";

export interface HealthXSession {
  id:             string;
  year:           number;
  month:          string;
  title:          string;
  type:           HealthXType;
  location:       string;
  country:        string;
  participants:   number;
  femalePart:     number;
  completionRate: number;
  partnerships:   number;
  scores: {
    "Learning Experience": number;
    "Practical Relevance": number;
    "Accessibility":       number;
    "Innovation Impact":   number;
  };
}

export const HX_TYPES: HealthXType[] = [
  "Health Facility Visit",
  "Innovation Challenge",
  "Field Exposure",
  "Industry Tour",
];

export const healthXSessions: HealthXSession[] = [
  { id:"hx01", year:2021, month:"Mar", title:"Rwanda Health Facility Immersion",   type:"Health Facility Visit", location:"Kigali",       country:"Rwanda",       participants:34, femalePart:19, completionRate:97,  partnerships:2, scores:{"Learning Experience":4.5,"Practical Relevance":4.6,"Accessibility":4.3,"Innovation Impact":4.2} },
  { id:"hx02", year:2021, month:"Sep", title:"Digital Health Innovation Sprint",   type:"Innovation Challenge",  location:"Nairobi",      country:"Kenya",        participants:48, femalePart:25, completionRate:92,  partnerships:3, scores:{"Learning Experience":4.3,"Practical Relevance":4.4,"Accessibility":4.1,"Innovation Impact":4.6} },
  { id:"hx03", year:2022, month:"Feb", title:"Ghana Community Health Exposure",    type:"Field Exposure",        location:"Accra",        country:"Ghana",        participants:41, femalePart:24, completionRate:95,  partnerships:2, scores:{"Learning Experience":4.6,"Practical Relevance":4.5,"Accessibility":4.4,"Innovation Impact":4.3} },
  { id:"hx04", year:2022, month:"Jun", title:"MedTech Industry Tour Johannesburg", type:"Industry Tour",         location:"Johannesburg", country:"South Africa", participants:39, femalePart:20, completionRate:98,  partnerships:4, scores:{"Learning Experience":4.4,"Practical Relevance":4.7,"Accessibility":4.2,"Innovation Impact":4.5} },
  { id:"hx05", year:2022, month:"Oct", title:"Health Systems Innovation Lab",      type:"Innovation Challenge",  location:"Lagos",        country:"Nigeria",      participants:55, femalePart:30, completionRate:89,  partnerships:3, scores:{"Learning Experience":4.2,"Practical Relevance":4.3,"Accessibility":3.9,"Innovation Impact":4.4} },
  { id:"hx06", year:2023, month:"Jan", title:"Primary Healthcare Field Study",     type:"Health Facility Visit", location:"Kampala",      country:"Uganda",       participants:44, femalePart:26, completionRate:94,  partnerships:2, scores:{"Learning Experience":4.5,"Practical Relevance":4.6,"Accessibility":4.3,"Innovation Impact":4.2} },
  { id:"hx07", year:2023, month:"Apr", title:"Pharma Supply Chain Exposure",       type:"Industry Tour",         location:"Dar es Salaam",country:"Tanzania",     participants:37, femalePart:21, completionRate:97,  partnerships:3, scores:{"Learning Experience":4.3,"Practical Relevance":4.5,"Accessibility":4.4,"Innovation Impact":4.1} },
  { id:"hx08", year:2023, month:"Jul", title:"Pan-African Health Hackathon",       type:"Innovation Challenge",  location:"Kigali",       country:"Rwanda",       participants:72, femalePart:41, completionRate:91,  partnerships:5, scores:{"Learning Experience":4.7,"Practical Relevance":4.5,"Accessibility":4.4,"Innovation Impact":4.8} },
  { id:"hx09", year:2023, month:"Sep", title:"Mental Health Ecosystem Study",      type:"Field Exposure",        location:"Nairobi",      country:"Kenya",        participants:50, femalePart:32, completionRate:96,  partnerships:2, scores:{"Learning Experience":4.6,"Practical Relevance":4.5,"Accessibility":4.5,"Innovation Impact":4.4} },
  { id:"hx10", year:2023, month:"Nov", title:"Rural Health Clinic Immersion",      type:"Health Facility Visit", location:"Lilongwe",     country:"Malawi",       participants:28, femalePart:17, completionRate:100, partnerships:1, scores:{"Learning Experience":4.8,"Practical Relevance":4.9,"Accessibility":4.6,"Innovation Impact":4.5} },
  { id:"hx11", year:2024, month:"Feb", title:"Digital Health Systems Tour",        type:"Industry Tour",         location:"Cape Town",    country:"South Africa", participants:46, femalePart:25, completionRate:95,  partnerships:4, scores:{"Learning Experience":4.5,"Practical Relevance":4.6,"Accessibility":4.3,"Innovation Impact":4.5} },
  { id:"hx12", year:2024, month:"May", title:"Community Health Worker Exposure",   type:"Field Exposure",        location:"Kigali",       country:"Rwanda",       participants:53, femalePart:32, completionRate:98,  partnerships:3, scores:{"Learning Experience":4.7,"Practical Relevance":4.8,"Accessibility":4.5,"Innovation Impact":4.6} },
  { id:"hx13", year:2024, month:"Aug", title:"Health AI Innovation Sprint",        type:"Innovation Challenge",  location:"Nairobi",      country:"Kenya",        participants:65, femalePart:37, completionRate:93,  partnerships:5, scores:{"Learning Experience":4.6,"Practical Relevance":4.5,"Accessibility":4.4,"Innovation Impact":4.9} },
  { id:"hx14", year:2024, month:"Oct", title:"Hospital Management Study Tour",     type:"Health Facility Visit", location:"Accra",        country:"Ghana",        participants:42, femalePart:24, completionRate:97,  partnerships:2, scores:{"Learning Experience":4.4,"Practical Relevance":4.6,"Accessibility":4.3,"Innovation Impact":4.2} },
  { id:"hx15", year:2025, month:"Mar", title:"Health Entrepreneurship Field Lab",  type:"Innovation Challenge",  location:"Lagos",        country:"Nigeria",      participants:78, femalePart:45, completionRate:92,  partnerships:6, scores:{"Learning Experience":4.6,"Practical Relevance":4.7,"Accessibility":4.3,"Innovation Impact":4.8} },
  { id:"hx16", year:2025, month:"Jun", title:"East Africa Health Systems Visit",   type:"Health Facility Visit", location:"Kampala",      country:"Uganda",       participants:49, femalePart:29, completionRate:96,  partnerships:3, scores:{"Learning Experience":4.7,"Practical Relevance":4.8,"Accessibility":4.5,"Innovation Impact":4.5} },
  { id:"hx17", year:2025, month:"Sep", title:"MedTech & Pharma Ecosystem Tour",    type:"Industry Tour",         location:"Johannesburg", country:"South Africa", participants:55, femalePart:30, completionRate:98,  partnerships:5, scores:{"Learning Experience":4.5,"Practical Relevance":4.6,"Accessibility":4.4,"Innovation Impact":4.6} },
  { id:"hx18", year:2025, month:"Nov", title:"West Africa Primary Care Exposure",  type:"Field Exposure",        location:"Dakar",        country:"Senegal",      participants:38, femalePart:23, completionRate:94,  partnerships:2, scores:{"Learning Experience":4.5,"Practical Relevance":4.5,"Accessibility":4.3,"Innovation Impact":4.4} },
  { id:"hx19", year:2026, month:"Feb", title:"Digital Therapeutics Innovation",    type:"Innovation Challenge",  location:"Kigali",       country:"Rwanda",       participants:62, femalePart:37, completionRate:91,  partnerships:4, scores:{"Learning Experience":4.6,"Practical Relevance":4.7,"Accessibility":4.4,"Innovation Impact":4.9} },
  { id:"hx20", year:2026, month:"May", title:"Community Diagnostics Field Visit",  type:"Health Facility Visit", location:"Addis Ababa",  country:"Ethiopia",     participants:44, femalePart:27, completionRate:97,  partnerships:2, scores:{"Learning Experience":4.7,"Practical Relevance":4.8,"Accessibility":4.5,"Innovation Impact":4.6} },
];
