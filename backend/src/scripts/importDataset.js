import path from "path";
import XLSX from "xlsx";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Job from "../models/job.model.js";
import { detectAndFlagDuplicates } from "../services/dedup.service.js";
import {
  normalizeText,
  cleanDisplayText,
  normalizeLocation,
  normalizeExperienceLevel,
  normalizeEnum,
  buildContentHash,
} from "../utils/normalize.js";
import { safeParseDate } from "../utils/parseDate.js";
import { parseSalary } from "../utils/parseSalary.js";
import { sanitizeDescriptionHtml, stripToPlainText } from "../utils/sanitize.js";

const EXCEL_PATH = "C:\\Users\\admin\\Downloads\\Jobs Dataset.xlsx";

const importData = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    console.log(`Starting dataset import. Reading workbook from: ${EXCEL_PATH}`);
    
    // 2. Read Workbook
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Excel file parsed. Found ${rawRows.length} total rows.`);

    // 3. Clear existing collection to start fresh
    console.log("Clearing existing jobs collection...");
    await Job.deleteMany({});
    console.log("Collection cleared.");

    // 4. Normalize and Clean Rows
    const normalizedJobs = [];
    let skippedCount = 0;

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      
      const title = cleanDisplayText(row.title);
      const company = cleanDisplayText(row.company);

      // Handle invalid/inconsistent data gracefully: title and company are mandatory
      if (!title || !company) {
        console.warn(`Row ${i + 2}: Skipped due to missing title or company name.`);
        skippedCount++;
        continue;
      }

      // Location normalization
      const locObj = normalizeLocation(row.location);

      // Description normalization
      const rawDesc = row.description || "";
      const descHtml = sanitizeDescriptionHtml(rawDesc);
      const descText = stripToPlainText(rawDesc);

      // Date normalization
      const rawDate = row.datePosted || "";
      const parsedDateObj = safeParseDate(rawDate);

      // Salary normalization
      const salaryObj = parseSalary(row.salary, row.currency || "USD");

      // Experience Level
      const experience = normalizeExperienceLevel(row.experience_level || row.experienceLevel);

      // Employment Type
      const employment = normalizeEnum(
        row.employment_type || row.employmentType,
        ["Full Time", "Contract", "Internship"],
        "Unknown"
      );

      // Department
      const dept = normalizeEnum(
        row.department,
        ["AI", "Analytics", "Engineering", "Data"],
        "Unknown"
      );

      // Remote Flag
      const remote = normalizeEnum(
        row.remote_flag || row.remoteFlag || (locObj.isRemoteHint ? "Remote" : "Unknown"),
        ["Hybrid", "Onsite", "Remote"],
        "Unknown"
      );

      // Apply Type
      const apply = normalizeEnum(
        row.applyType || row.apply_type,
        ["EXTERNAL", "EASY_APPLY"],
        "Unknown"
      );

      // Data Quality
      const missingFields = [];
      if (!row.location) missingFields.push("location");
      if (!rawDesc) missingFields.push("description");
      if (!row.salary) missingFields.push("salary");
      if (!row.experience_level && !row.experienceLevel) missingFields.push("experienceLevel");
      if (!row.employment_type && !row.employmentType) missingFields.push("employmentType");
      if (!row.department) missingFields.push("department");
      if (!row.applyType && !row.apply_type) missingFields.push("applyType");

      const hadUnsafeHtml = rawDesc && descHtml !== rawDesc;

      const jobObj = {
        _id: new mongoose.Types.ObjectId(),
        title,
        normalizedTitle: normalizeText(title),
        company,
        normalizedCompany: normalizeText(company),
        location: {
          raw: locObj.raw,
          city: locObj.city,
          state: locObj.state,
          country: locObj.country,
          normalized: locObj.normalized,
        },
        url: cleanDisplayText(row.url) || null,
        description: {
          html: descHtml,
          text: descText,
        },
        applyType: apply,
        exprienceLevel: experience, // Matches schema spelling "exprienceLevel"
        employmentType: employment,
        department: dept,
        remoteFlag: remote,
        datePosted: {
          raw: String(rawDate).trim(),
          parsed: parsedDateObj.parsed,
          inValid: !parsedDateObj.isValid,
        },
        salary: salaryObj,
        dataQuality: {
          missingFields,
          hadInvalidDate: !parsedDateObj.isValid,
          hadUnsafeHtml,
        },
        contentHash: buildContentHash({ title, company, location: locObj.raw }),

        // Default deduplication fields
        isDuplicate: false,
        duplicateGroupId: null,
        isPrimaryInGroup: true,
        duplicateScore: null,
        duplicateType: null,
        duplicateReviewStatus: "unreviewed",
      };

      normalizedJobs.push(jobObj);
    }

    console.log(`Normalized ${normalizedJobs.length} rows. Skipped ${skippedCount} invalid rows.`);

    // 5. Bulk Insert into Database
    console.log("Inserting jobs into MongoDB...");
    const start = Date.now();
    await Job.insertMany(normalizedJobs, { ordered: false });
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`Inserted ${normalizedJobs.length} raw jobs in ${duration}s.`);

    // 6. Run Deduplication engine on inserted rows
    console.log("Running duplicate detection engine...");
    const dedupStart = Date.now();
    const dedupStats = await detectAndFlagDuplicates();
    const dedupDuration = ((Date.now() - dedupStart) / 1000).toFixed(2);

    console.log("\n=================================");
    console.log("       IMPORT METRICS");
    console.log("=================================");
    console.log(`Total Rows in Excel:      ${rawRows.length}`);
    console.log(`Skipped (Invalid):         ${skippedCount}`);
    console.log(`Valid Records Processed:   ${normalizedJobs.length}`);
    console.log(`Duplicate Groups Created:  ${dedupStats.duplicateGroups}`);
    console.log(`Duplicates Flagged:        ${dedupStats.duplicateJobs} (${((dedupStats.duplicateJobs / normalizedJobs.length) * 100).toFixed(1)}%)`);
    console.log(`Deduplication Time:        ${dedupDuration}s`);
    console.log("=================================\n");

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Import Failed: ${error.message}`, error);
    process.exit(1);
  }
};

importData();
