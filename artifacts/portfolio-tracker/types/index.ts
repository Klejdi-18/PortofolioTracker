export interface Project {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export interface ProjectFormData {
  title: string;
  url: string;
}
