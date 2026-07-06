const path = require('path');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/job.model');
const DedupService = require('../services/dedup.service');
const {
  normalizeString,
  parseDate,
  normalizeRemoteFlag,
  normalizeEmploymentType,
  normalizeExperienceLevel,
} = require('../utils/normalize');

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
      
      const title = normalizeString(row.title);
      const company = normalizeString(row.company);
      const location = normalizeString(row.location);

      // Handle invalid/inconsistent data gracefully: title and company are mandatory
      if (!title || !company) {
        console.warn(`Row ${i + 2}: Skipped due to missing title or company name.`);
        skippedCount++;
        continue;
      }

      const jobObj = {
        _id: new mongoose.Types.ObjectId(), // pre-generate _id for duplicate population links
        title,
        company,
        location,
        url: normalizeString(row.url) || null,
        description: normalizeString(row.description) || null,
        applyType: normalizeString(row.applyType) || null,
        experienceLevel: normalizeExperienceLevel(row.experience_level, title),
        datePosted: parseDate(row.datePosted),
        salary: normalizeString(row.salary) || null,
        currency: normalizeString(row.currency) || 'USD',
        employmentType: normalizeEmploymentType(row.employment_type, title),
        department: normalizeString(row.department) || null,
        remoteFlag: normalizeRemoteFlag(row.remote_flag, title),
        
        // Default deduplication fields
        isDuplicate: false,
        duplicateGroupId: null,
        duplicateOf: null,
        duplicateConfidence: null,
        duplicateStatus: 'pending_review',
      };

      normalizedJobs.push(jobObj);
    }

    console.log(`Normalized ${normalizedJobs.length} rows. Skipped ${skippedCount} invalid rows.`);

    // 5. Run Deduplication engine on normalized rows
    const processedJobs = DedupService.findDuplicates(normalizedJobs);

    // 6. Bulk Insert into Database
    console.log("Inserting jobs into MongoDB...");
    const start = Date.now();
    await Job.insertMany(processedJobs, { ordered: false });
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    // 7. Calculate and Display Statistics
    const totalDuplicates = processedJobs.filter(j => j.isDuplicate).length;
    const uniqueInsertCount = processedJobs.length - totalDuplicates;
    const groupIds = new Set(processedJobs.map(j => j.duplicateGroupId).filter(Boolean));

    console.log("\n=================================");
    console.log("       IMPORT METRICS");
    console.log("=================================");
    console.log(`Total Rows in Excel:      ${rawRows.length}`);
    console.log(`Skipped (Invalid):         ${skippedCount}`);
    console.log(`Valid Records Processed:   ${processedJobs.length}`);
    console.log(`Unique Base Jobs:          ${uniqueInsertCount}`);
    console.log(`Duplicates Flagged:        ${totalDuplicates} (${((totalDuplicates / processedJobs.length) * 100).toFixed(1)}%)`);
    console.log(`Duplicate Groups Created:  ${groupIds.size}`);
    console.log(`Insertion Time:            ${duration}s`);
    console.log("=================================\n");

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error(`Import Failed: ${error.message}`, error);
    process.exit(1);
  }
};

importData();
