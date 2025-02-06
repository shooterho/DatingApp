import { Photo } from './photo';

export type Member = {
  id: number;
  userName: string;
  age: number;
  photoUrl: string;
  knownAs: string;
  created: Date;
  lastActive: Date;
  gender: string;
  introduction: string;
  interest: any;
  lookingFor: string;
  city: string;
  country: string;
  photos: Photo[];
};
