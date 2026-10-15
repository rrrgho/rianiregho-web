import { z } from "zod";
import {
  laravelBoolean, optionalDate, optionalText, optionalUrl,
} from "./http";

export const PROJECT_DATES = ["project_date"];

export const projectSchema = z.object({
  name: z.string().min(1).max(255),
  description: optionalText(),
  project_date: optionalDate,
  github_link: optionalUrl,
  project_link: optionalUrl,
  tech_stack: optionalText(255),
  role: optionalText(255),
});

export const EXPERIENCE_DATES = ["start_date", "end_date"];

export const experienceSchema = z.object({
  title: z.string().min(1).max(255),
  subtitle: optionalText(255),
  description: optionalText(),
  start_date: optionalDate,
  end_date: optionalDate,
  is_present: laravelBoolean,
  location: optionalText(255),
});

// field name -> directory (same layout Laravel used)
export const EXPERIENCE_FILE_FIELDS = {
  icon: "work-experience-icons",
  company_logo: "work-experience-logos",
  banner: "work-experience-banners",
} as const;

export const GALLERY_DATES = ["taken_date"];

export const gallerySchema = z.object({
  title: z.string().min(1).max(255),
  story: optionalText(),
  taken_date: optionalDate,
});

export const GALLERY_PHOTO_DIR = "gallery-photos";
export const GALLERY_PHOTO_MAX_KB = 8192;
export const GALLERY_MAX_PHOTOS_PER_REQUEST = 10;
