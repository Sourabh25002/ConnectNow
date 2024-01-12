export interface user_profile {
  user_profile_id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  headline?: string;
  current_company?: string;
  highest_education?: string;
  country_of_residence?: string;
  residence?: string;
  email_address?: string;
  phone_number?: string;
  connection_count?: number;
  date_of_birth?: Date;
  personal_website_link?: string;
  profile_picture_url?: string;
  cover_photo_url?: string;
  about_description?: string;
}
