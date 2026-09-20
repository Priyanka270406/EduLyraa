export type Role = 'student'|'faculty'|'industry'|'institution';
export type AssessmentEventType =
  | 'STARTED'
  | 'AUTO_SUBMITTED'
  | 'MANUALLY_SUBMITTED'
  | 'FULLSCREEN_ENTERED'
  | 'FULLSCREEN_EXIT'
  | 'TAB_SWITCH'
  | 'ANSWER_CHANGED';

export interface AssessmentSession {
  id: string;
  studentId: string;
  startedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'submitted';
  violationCount: number;
}

export interface User { id:string; name:string; email:string; role:Role; avatar?:string; profile?:Record<string,unknown>; }
export interface Application {
  id: string;
  opportunityId: string;
  company: string;
  role: string;
  appliedDate: string;

  stage:
    | 'Saved'
    | 'Applied'
    | 'Shortlisted'
    | 'AI Shortlisted'
    | 'Assessment'
    | 'Interview'
    | 'Selected'
    | 'Rejected';

  nextAction: string;
  interviewRequired?: boolean;
  interviewDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;

  type:
    | 'opportunity'
    | 'application'
    | 'learning'
    | 'system';
}
export interface Opportunity {
  id: string;
  title: string;
  company: string;

  type:
    | 'Internship'
    | 'Job'
    | 'Faculty'
    | 'Training'
    | 'Project'
    | 'Apprenticeship'
    | 'Certification'
    | 'Workshop'
    | 'Research'
    | 'FDP'
    | 'Mentorship'
    | 'Consultancy';

  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  compensation: string;
  duration?: string;
  skills: string[];
  eligibility: string;
  deadline: string;
  match: number;
  description: string;
  /** How a learner engages with this listing; defaults to Application for legacy records. */
  engagement?: 'Application' | 'Registration' | 'Expression of Interest' | 'Challenge';
  /** Optional capacity for events, workshops, bootcamps and cohorts. */
  capacity?: number;
  /** Optional target audience for smarter discovery. */
  audience?: string;
  /** Optional publish metadata used by the Industry Opportunity Studio. */
  postedAt?: string;
  status?: 'Draft'|'Published'|'Closed'|'Expired';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  trainer?: string;
  speaker?: string;
  learningObjectives?: string[];
  completionCriteria?: string;
  preferredDepartment?: string;
  registrationDeadline?: string;
}