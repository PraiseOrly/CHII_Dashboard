function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface CourseRecord {
  id: string;
  title: string;
  category: string;
  year: number;
  enrollments: number;
  completions: number;
  satisfaction: number;
}

const COURSE_CATEGORIES = ['Clinical', 'Business', 'Soft Skills', 'Health Systems', 'Digital', 'Research'];
const COURSES = [
  'Advanced Diagnostics', 'Healthcare Management', 'Financial Planning', 'Leadership Skills',
  'Digital Health', 'Epidemiology', 'Patient Care', 'Health Policy', 'Entrepreneurship',
  'Communication', 'Data Analysis', 'Research Methods', 'Public Health', 'Nursing Care',
  'Pharmacy Practice', 'Health Technology', 'Quality Management', 'Strategic Planning',
  'Grant Writing', 'Clinical Ethics', 'Team Leadership', 'Project Management', 'Health Economics', 'Telemedicine'
];

export const courseRecords: CourseRecord[] = [];

for (let i = 0; i < 24; i++) {
  const enrollments = Math.floor(seededRandom(i * 1) * 25) + 10;
  const completions = Math.floor(enrollments * (seededRandom(i * 2) * 0.2 + 0.82));

  courseRecords.push({
    id: `COURSE-${String(i + 1).padStart(2, '0')}`,
    title: COURSES[i],
    category: COURSE_CATEGORIES[Math.floor(seededRandom(i * 3) * COURSE_CATEGORIES.length)],
    year: 2024,
    enrollments,
    completions,
    satisfaction: Math.round((seededRandom(i * 4) * 0.5 + 4) * 10) / 10
  });
}

export function getCourseStats() {
  const totalEnrollments = courseRecords.reduce((sum, c) => sum + c.enrollments, 0);
  const totalCompletions = courseRecords.reduce((sum, c) => sum + c.completions, 0);
  const totalCourses = courseRecords.length;
  const avgCompletion = Math.round((totalCompletions / totalEnrollments) * 100);
  const dropouts = totalEnrollments - totalCompletions;
  const avgSatisfaction = (courseRecords.reduce((sum, c) => sum + c.satisfaction, 0) / totalCourses).toFixed(1);
  const certificates = Math.round(totalCompletions * 0.88);
  
  return {
    totalEnrollments,
    totalCompletions,
    totalCourses,
    avgCompletion,
    dropouts,
    avgSatisfaction,
    certificates,
    certificateRate: Math.round((certificates / totalCompletions) * 100),
    enrollmentGrowth: 22,
    completionGrowth: 18
  };
}
