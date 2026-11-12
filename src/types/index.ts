export type PersonCategory = 
  | 'Incharges'
  | 'Teaching Faculty'
  | 'Non-Teaching Faculty'
  | 'Core'
  | 'Heads of Department';

export interface Architect {
  id: string;
  name: string;
  firstName: string;
  title: string;
  role?: string;
  department?: string;
  category: PersonCategory;
  image: string;
  initials: string;
  codeName?: string;
  bio?: string;
  tags?: string[];
}
