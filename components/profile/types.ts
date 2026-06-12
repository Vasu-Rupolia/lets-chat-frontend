export type User = {
  _id?: string;
  name: string;
  email?: string;
  image?: string;
  dob?: string;
  about?: string;

  skills?: string[];
  skillsToLearn?: string[];

  rating?: number;
  connections?: number;
  exchanges?: number;
};