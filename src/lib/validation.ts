import { z } from "zod";

export const personalInfoSchema = (lang: "en" | "fr" | "ar" = "en") =>
  z.object({
    fullName: z.string().min(2, {
      message:
        lang === "ar"
          ? "يجب أن يكون الاسم حرفين على الأقل"
          : "Full name must be at least 2 characters",
    }),
    jobTitle: z.string().min(2, {
      message:
        lang === "ar" ? "يجب إدخال المسمى الوظيفي" : "Job title is required",
    }),
    email: z.string().email({
      message:
        lang === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email address",
    }),
    phone: z.string().min(5, {
      message: lang === "ar" ? "رقم الهاتف غير صالح" : "Invalid phone number",
    }),
    address: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    summary: z
      .string()
      .min(10, {
        message:
          lang === "ar"
            ? "يجب أن يكون الملخص 10 أحرف على الأقل"
            : "Summary must be at least 10 characters",
      })
      .optional()
      .or(z.literal("")),
  });

export const experienceSchema = (lang: "en" | "fr" | "ar" = "en") =>
  z.object({
    company: z.string().min(2, {
      message: lang === "ar" ? "اسم الشركة مطلوب" : "Company name is required",
    }),
    position: z.string().min(2, {
      message: lang === "ar" ? "المسمى الوظيفي مطلوب" : "Position is required",
    }),
    startDate: z.string().min(1, {
      message: lang === "ar" ? "تاريخ البدء مطلوب" : "Start date is required",
    }),
    endDate: z.string().optional(),
    description: z.string().min(10, {
      message:
        lang === "ar"
          ? "الوصف يجب أن يكون 10 أحرف على الأقل"
          : "Description must be at least 10 characters",
    }),
  });

export const educationSchema = (lang: "en" | "fr" | "ar" = "en") =>
  z.object({
    institution: z.string().min(2, {
      message: lang === "ar" ? "اسم المؤسسة مطلوب" : "Institution is required",
    }),
    degree: z.string().min(2, {
      message: lang === "ar" ? "الدرجة العلمية مطلوبة" : "Degree is required",
    }),
    startDate: z.string().min(1, {
      message: lang === "ar" ? "تاريخ البدء مطلوب" : "Start date is required",
    }),
    endDate: z.string().optional(),
    description: z.string().optional(),
  });

export const projectSchema = (lang: "en" | "fr" | "ar" = "en") =>
  z.object({
    name: z.string().min(2, {
      message: lang === "ar" ? "اسم المشروع مطلوب" : "Project name is required",
    }),
    description: z.string().min(10, {
      message:
        lang === "ar"
          ? "الوصف يجب أن يكون 10 أحرف على الأقل"
          : "Description must be at least 10 characters",
    }),
    link: z
      .string()
      .url({
        message: lang === "ar" ? "رابط غير صالح" : "Invalid URL",
      })
      .optional()
      .or(z.literal("")),
  });
