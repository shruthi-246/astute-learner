import type { Announcement, StudyTip } from "@/types/academic";

export const announcements: readonly Announcement[] = [
  {
    id: "a-01",
    title: "End-semester examination timetable published",
    body: "The examination cell has released the final timetable for semester 5. Hall tickets will be available in your dashboard from 20 May.",
    category: "Examination",
    publishedOn: "2026-05-04",
  },
  {
    id: "a-02",
    title: "Data Science capstone showcase — 12 June",
    body: "Twenty shortlisted capstone projects will be presented to an industry panel. Registration is open to all semesters.",
    category: "Event",
    publishedOn: "2026-04-28",
  },
  {
    id: "a-03",
    title: "Attendance review for the current term",
    body: "Students below the 75% attendance threshold will be contacted by their faculty advisor with a structured recovery plan.",
    category: "Notice",
    publishedOn: "2026-04-21",
  },
  {
    id: "a-04",
    title: "New elective: Applied Machine Learning Lab",
    body: "A four-credit lab elective opens next term with 40 seats. Prerequisite: Data Science Foundations.",
    category: "Academic",
    publishedOn: "2026-04-12",
  },
];

export const studyTips: readonly StudyTip[] = [
  {
    id: "tip-01",
    title: "Space your revision",
    body: "Three thirty-minute sessions across a week beat one three-hour cram. Spaced repetition raises recall on assessed topics by a wide margin.",
  },
  {
    id: "tip-02",
    title: "Practise retrieval, not re-reading",
    body: "Close the notes and reconstruct the concept from memory. Retrieval practice is the single most effective study habit for exam performance.",
  },
  {
    id: "tip-03",
    title: "Attack your weakest subject first",
    body: "Start each study block with the subject your analytics flag as weak, while attention is highest.",
  },
  {
    id: "tip-04",
    title: "Close the feedback loop",
    body: "Rework every assignment comment within 48 hours. Unreviewed feedback is the most common cause of repeated mistakes.",
  },
];

export const faqs: readonly { readonly question: string; readonly answer: string }[] = [
  {
    question: "How is the attendance percentage calculated?",
    answer:
      "Attendance is computed per subject as present days divided by working days, then averaged across enrolled subjects. Institutional policy requires a minimum of 75% to be eligible for end-semester examinations.",
  },
  {
    question: "What data does the AI engine analyse?",
    answer:
      "The engine reads attendance, assignment completion, internal marks, examination marks and the direction of recent assessments. It does not use personal or demographic attributes.",
  },
  {
    question: "Are AI insights a replacement for faculty judgement?",
    answer:
      "No. Every insight is labelled as AI Analysis and is intended as a decision aid. Faculty advisors confirm interventions before they are actioned.",
  },
  {
    question: "How do I request a grade review?",
    answer:
      "Raise a review from Exams & Grades within seven days of publication. Your course instructor and the examination cell are notified automatically.",
  },
  {
    question: "Is this demo connected to a real student record system?",
    answer:
      "No. This deployment runs entirely on generated demo data with mock authentication, so no real student information is stored or transmitted.",
  },
];
