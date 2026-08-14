export type UserRole = 'student' | 'admin';
export type DegreeLevel = 'diploma' | 'bachelor' | 'master' | 'phd';
export type FundingType = 'full' | 'partial';
export type SavedItemType = 'university' | 'program' | 'scholarship';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
export type VerificationStatus = 'verified' | 'pending' | 'failed';
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';
export type DeadlineType = 'application' | 'scholarship' | 'document';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  education_level: string | null;
  field_of_interest: string | null;
  country_of_origin: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Country = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  flag_emoji: string | null;
  image_url: string | null;
  description: string | null;
  currency: string | null;
  avg_tuition_min: number | null;
  avg_tuition_max: number | null;
  visa_info: string | null;
  created_at: string;
  updated_at: string;
};

export type University = {
  id: string;
  slug: string;
  country_id: string;
  name: string;
  city: string | null;
  ranking: number | null;
  description: string | null;
  image_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UniversityWithCountry = University & { country: Country | null };

export type Program = {
  id: string;
  university_id: string;
  name: string;
  degree_level: DegreeLevel;
  field_of_study: string | null;
  duration_months: number | null;
  tuition_amount: number | null;
  tuition_currency: string | null;
  language: string | null;
  application_deadline: string | null;
  scholarship_available: boolean;
  description: string | null;
  requirements: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgramWithUniversity = Program & {
  university: (University & { country: Country | null }) | null;
};

export type Scholarship = {
  id: string;
  name: string;
  country_id: string | null;
  university_id: string | null;
  program_id: string | null;
  funding_type: FundingType;
  amount_text: string | null;
  coverage: string | null;
  deadline: string | null;
  eligibility: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ScholarshipWithRelations = Scholarship & {
  country: Country | null;
  university: University | null;
};

export type Deadline = {
  id: string;
  title: string;
  deadline_type: DeadlineType;
  deadline_date: string;
  university_id: string | null;
  program_id: string | null;
  scholarship_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DeadlineWithRelations = Deadline & {
  university: University | null;
  program: Program | null;
  scholarship: Scholarship | null;
};

export type SavedItem = {
  id: string;
  user_id: string;
  item_type: SavedItemType;
  item_id: string;
  created_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  program_id: string;
  status: ApplicationStatus;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationWithProgram = Application & { program: ProgramWithUniversity | null };

export type DataSource = {
  id: string;
  name: string;
  source_url: string;
  source_type: string | null;
  last_scraped_at: string | null;
  last_verified_at: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
};

export type ScrapingJob = {
  id: string;
  data_source_id: string;
  job_type: string;
  status: JobStatus;
  started_at: string | null;
  completed_at: string | null;
  records_found: number;
  records_created: number;
  records_updated: number;
  error_message: string | null;
  created_at: string;
};

export type ScrapingJobWithSource = ScrapingJob & { data_source: DataSource | null };

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string }>;
      countries: Table<Country, Partial<Country>>;
      universities: Table<University, Partial<University>>;
      programs: Table<Program, Partial<Program>>;
      scholarships: Table<Scholarship, Partial<Scholarship>>;
      deadlines: Table<Deadline, Partial<Deadline>>;
      saved_items: Table<SavedItem, Partial<SavedItem>>;
      applications: Table<Application, Partial<Application>>;
      data_sources: Table<DataSource, Partial<DataSource>>;
      scraping_jobs: Table<ScrapingJob, Partial<ScrapingJob>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
