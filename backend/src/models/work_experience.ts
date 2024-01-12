export interface work_experience {
  experience_id: number;
  user_id: number;
  job_title?: string;
  company_name?: string;
  location?: string;
  work_location_type?: string;
  start_date?: Date;
  end_date?: Date;
  industry?: string;
  description?: string;
}
