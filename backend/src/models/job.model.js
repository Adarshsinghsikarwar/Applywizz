import mongoose from "mongoose";
import { Schema } from "mongoose";

const JobSchema = new Schema(
  {
    // ---- Core display fields ----
    title: { type: String, required: true, trim: true },
    normalizedTitle: { type: String, index: true },
    company: { type: String, required: true, trim: true },
    normalizedCompany: { type: String, index: true },
    location: {
      raw: { type: String, default: "" },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      normalized: { type: String, default: "", index: true },
    },
    url: { type: String, default: null, index: true },
    // ---- Description: raw is never rendered; html is sanitized, text is plain ----
    description: {
      html: { type: String, default: "" }, // sanitized, safe to render
      text: { type: String, default: "" }, // plain text for search/preview
    },

    // ---- Categorical / enum-like fields ----

    applyType: {
      type: String,
      enum: ["EXTERNAL", "EASY_APPLY", "Unknown"],
      default: "Unknown",
    },
    exprienceLevel: {
      type: String,
      enum: [
        "Entry Level",
        "Associate",
        "Mid-Senior Level",
        "Director",
        "Executive",
        "Internship",
        "Not Specified",
      ],
      default: "Not Specified",
      index: true,
    },

    employmentType: {
      type: String,
      enum: ["Full Time", "Contract", "Internship", "Unknown"],
      default: "Unknown",
      index: true,
    },

    department: {
      type: String,
      enum: ["AI", "Analytics", "Engineering", "Data", "Unknown"],
      default: "Unknown",
      index: true,
    },
    remoteFlag: {
      type: String,
      enum: ["Hybrid", "Onsite", "Remote", "Unknown"],
      default: "Unknown",
      index: true,
    },

    // ---- Dates ----
    datePosted: {
      raw: { type: String, default: "" },
      parsed: { type: Date, default: null, index: true },
      inValid: { type: Boolean, default: false },
    },

    // ---- Salary (best-effort; see parseSalary.js for why this is approximate) ----
    salary: {
      raw: { type: String, default: null },
      currency: {
        type: String,
        enum: ["USD", "INR", "EUR", null],
        default: null,
      },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      isNegotiable: { type: Boolean, default: false },
      isCompetitive: { type: Boolean, default: false },
    },

    // ---- Data quality flags ----
    dataQuality: {
      missingFields: { type: [String], default: [] },
      hadInvalidDate: { type: Boolean, default: false },
      hadUnsafeHtml: { type: Boolean, default: false },
    },

    // ---- Duplicate detection ----
    contentHash: { type: String, index: true },
    duplicateGroupId: { type: String, default: null, index: true },
    isDuplicate: { type: Boolean, default: false, index: true },
    isPrimaryInGroup: { type: Boolean, default: true },
    duplicateScore: { type: Number, default: null },
    duplicateType: {
      type: String,
      enum: ["exact_url", "exact_content", "near_duplicate", null],
      default: null,
    },
    duplicateReviewStatus: {
      type: String,
      enum: ["unreviewed", "confirmed_duplicate", "not_duplicate", "merged"],
      default: "unreviewed",
      index: true,
    },
  },
  { timestamps: true }
);

// Full-text search across the fields recruiters actually search by
JobSchema.index({ title: "text", company: "text", "description.text": "text" });

// Common compound query pattern: filter + sort by recency
JobSchema.index({ department: 1, employmentType: 1, "datePosted.parsed": -1 });

export default mongoose.model("Job", JobSchema);
