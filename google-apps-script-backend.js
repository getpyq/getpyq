/**
 * GETPYQ - Google Apps Script Backend Database Controller
 * 
 * Instructions:
 * 1. Open Google Sheets. Create a new Spreadsheet or use your existing one.
 * 2. In Google Sheets, click "Extensions" -> "Apps Script".
 * 3. Delete ANY default code in Code.gs and replace it with this EXACT code.
 * 4. Click the "Save" disk icon.
 * 5. Click the "Deploy" button (top right) -> "New deployment".
 * 6. Click the gear icon next to "Select type", select "Web app".
 * 7. Configure:
 *    - Description: GetPYQ Realtime API v2.2
 *    - Execute as: Me (<your-email>)
 *    - Who has access: Anyone (CRITICAL: Do NOT select "Anyone with Google Account" or "Only myself")
 * 8. Click "Deploy". Authorize permissions when prompted.
 * 9. Copy the Web App URL and paste it into the Database Verification dialog in GetPYQ!
 */

// Helper to get or create Spreadsheet sheets with appropriate headers
function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === "Papers") {
      sheet.appendRow([
        "pyqId",
        "paperName",
        "branch",
        "semester",
        "academicYear",
        "paperType",
        "fileName",
        "fileID",
        "uploadedBy",
        "uploadTimestamp",
        "upvotes",
        "downloads"
      ]);
      sheet.getRange("A1:L1").setFontWeight("bold").setBackground("#F3F4F6");
    } else if (name === "Solutions") {
      sheet.appendRow([
        "id",
        "pyq_id",
        "content",
        "author_name",
        "created_at"
      ]);
      sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#F3F4F6");
    } else if (name === "Requests") {
      sheet.appendRow([
        "id",
        "subject_name",
        "branch",
        "semester",
        "year",
        "exam_type",
        "requester_name",
        "note",
        "created_at",
        "status",
        "fulfilled_pyq_id",
        "upvotes"
      ]);
      sheet.getRange("A1:L1").setFontWeight("bold").setBackground("#F3F4F6");
    } else if (name === "Contacts") {
      sheet.appendRow([
        "ticketId",
        "name",
        "email",
        "subject",
        "message",
        "submittedAt",
        "status"
      ]);
      sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#F3F4F6");
    }
  }
  return sheet;
}

// Dynamic column mapping helper so both 11-column and 12-column sheets work perfectly without error
function getPapersColumnMap(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  
  var map = {
    pyqId: 0,
    paperName: 1,
    branch: 2,
    semester: 3,
    academicYear: 4,
    paperType: 5,
    fileName: -1,
    fileID: 6,
    uploadedBy: 7,
    uploadTimestamp: 8,
    upvotes: 9,
    downloads: 10
  };

  for (var c = 0; c < headerRow.length; c++) {
    var h = String(headerRow[c] || "").trim().toLowerCase();
    if (h === "pyqid" || h === "id") map.pyqId = c;
    else if (h === "papername" || h === "subject" || h === "paper") map.paperName = c;
    else if (h === "branch") map.branch = c;
    else if (h === "semester" || h === "sem") map.semester = c;
    else if (h === "academicyear" || h === "year") map.academicYear = c;
    else if (h === "papertype" || h === "exam_type" || h === "type") map.paperType = c;
    else if (h === "filename" || h === "file_name") map.fileName = c;
    else if (h === "fileid" || h === "file_id") map.fileID = c;
    else if (h === "uploadedby" || h === "uploader") map.uploadedBy = c;
    else if (h === "uploadtimestamp" || h === "timestamp" || h === "created_at") map.uploadTimestamp = c;
    else if (h === "upvotes") map.upvotes = c;
    else if (h === "downloads") map.downloads = c;
  }

  // If fileName column not explicitly named but sheet has 12 columns, assume standard order
  if (map.fileName === -1 && headerRow.length >= 12) {
    map.fileName = 6;
    map.fileID = 7;
    map.uploadedBy = 8;
    map.uploadTimestamp = 9;
    map.upvotes = 10;
    map.downloads = 11;
  }
  
  return map;
}

// OPTIONS preflight handler for CORS
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// GET API endpoint
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "getAll";
  var jsonResponse;
  
  try {
    if (action === "verify" || action === "ping") {
      jsonResponse = verifyDatabaseConnection();
    } else if (action === "getPYQ") {
      var id = e.parameter.id || e.parameter.pyqId || e.parameter.pyqid || e.parameter.pyq_id;
      jsonResponse = getPYQById(id);
    } else if (action === "getSolutions") {
      var pyq_id = e.parameter.pyqId;
      jsonResponse = getSolutionsForPYQ(pyq_id);
    } else if (action === "getStats") {
      jsonResponse = calculateStats();
    } else if (action === "getRequests") {
      jsonResponse = getAllRequests();
    } else if (action === "updatePYQ" || action === "update" || action === "editPYQ" || action === "edit") {
      jsonResponse = handleUpdatePYQ(e.parameter);
    } else if (action === "deletePYQ" || action === "delete") {
      var idToDelete = e.parameter.pyqId || e.parameter.id;
      var fileIdToDelete = e.parameter.fileId || e.parameter.fileID;
      jsonResponse = handleDeletePYQ({ pyqId: idToDelete, fileId: fileIdToDelete });
    } else {
      // Default: fetch all papers
      jsonResponse = getAllPapers();
    }
  } catch (err) {
    jsonResponse = { error: true, message: err.toString() };
  }
  
  // NOTE: Do NOT call .setHeader()! Apps Script handles CORS automatically.
  return ContentService.createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST API endpoint
function doPost(e) {
  var jsonResponse;
  try {
    var rawData = (e && e.postData && e.postData.contents) || "{}";
    var data = JSON.parse(rawData);
    var action = data.action;
    
    if (action === "upload") {
      jsonResponse = handleUpload(data);
    } else if (action === "upvote") {
      jsonResponse = handleUpvote(data.pyqId);
    } else if (action === "updatePYQ" || action === "update" || action === "editPYQ" || action === "edit") {
      jsonResponse = handleUpdatePYQ(data);
    } else if (action === "deletePYQ" || action === "delete") {
      jsonResponse = handleDeletePYQ(data);
    } else if (action === "addSolution") {
      jsonResponse = handleAddSolution(data);
    } else if (action === "createRequest") {
      jsonResponse = handleCreateRequest(data);
    } else if (action === "upvoteRequest") {
      jsonResponse = handleUpvoteRequest(data.requestId);
    } else if (action === "fulfillRequest") {
      jsonResponse = handleFulfillRequest(data);
    } else if (action === "contact" || action === "submitContact") {
      jsonResponse = handleSubmitContact(data);
    } else {
      jsonResponse = { error: true, message: "Invalid action specifier: " + action };
    }
  } catch (err) {
    jsonResponse = { error: true, message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}

// Verify live database and sheet connection
function verifyDatabaseConnection() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var papersSheet = getOrCreateSheet("Papers");
  var solutionsSheet = getOrCreateSheet("Solutions");
  var requestsSheet = getOrCreateSheet("Requests");
  var contactsSheet = getOrCreateSheet("Contacts");
  
  var paperCount = Math.max(0, papersSheet.getDataRange().getValues().length - 1);
  var solutionCount = Math.max(0, solutionsSheet.getDataRange().getValues().length - 1);
  var requestCount = Math.max(0, requestsSheet.getDataRange().getValues().length - 1);
  var contactCount = Math.max(0, contactsSheet.getDataRange().getValues().length - 1);
  
  return {
    success: true,
    status: "connected",
    mode: "realtime",
    spreadsheetName: ss.getName(),
    spreadsheetId: ss.getId(),
    activeSheets: ["Papers", "Solutions", "Requests", "Contacts"],
    paperCount: paperCount,
    solutionCount: solutionCount,
    requestCount: requestCount,
    contactCount: contactCount,
    serverTimestamp: new Date().toISOString()
  };
}

// Store contact feedback/query in Google Sheet Contacts tab
function handleSubmitContact(data) {
  var sheet = getOrCreateSheet("Contacts");
  var ticketId = "TKT-" + Math.floor(100000 + Math.random() * 900000);
  var name = String(data.name || "Anonymous Student").trim();
  var email = String(data.email || "").trim();
  var subject = String(data.subject || "General Inquiry").trim();
  var message = String(data.message || "").trim();
  var submittedAt = new Date().toISOString();
  var status = "open";

  sheet.appendRow([
    ticketId,
    name,
    email,
    subject,
    message,
    submittedAt,
    status
  ]);

  return {
    success: true,
    status: "success",
    ticketId: ticketId,
    message: "Contact message stored successfully in Contacts Google Sheet!"
  };
}

// Process base64 PDF upload and spreadsheet entry
function handleUpload(data) {
  var sheet = getOrCreateSheet("Papers");
  var map = getPapersColumnMap(sheet);
  
  // Strictly subject name only!
  var paperName = String(data.paperName || data.paper || "Engineering Subject").trim();
  var branch = String(data.branch || "CSE").trim();
  var semester = String(data.semester || "1").trim();
  var academicYear = String(data.academicYear || data.year || "2024-25").trim();
  var paperType = String(data.paperType || data.exam_type || "Regular/Back").trim();
  var fileBase64 = data.fileBase64;
  var uploadedBy = data.uploadedBy || "Anonymous Member";

  // Clean, descriptive file name
  var sanitizedSubject = paperName.replace(/[\\s/\\\\?%*:|"<>]+/g, "_");
  var sanitizedBranch = branch.replace(/[\\s/\\\\?%*:|"<>]+/g, "_");
  var sanitizedExamType = paperType.replace(/[\\s/\\\\?%*:|"<>]+/g, "_");
  var defaultFileName = sanitizedSubject + "_" + sanitizedBranch + "_sem" + semester + "_" + academicYear + "_" + sanitizedExamType + ".pdf";
  var fileName = String(data.fileName || data.file_name || defaultFileName).trim();

  // 1. Strict duplicate validation checks:
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var rName = String(rows[i][map.paperName] || "").trim();
    var rBranch = String(rows[i][map.branch] || "").trim();
    var rSem = String(rows[i][map.semester] || "").trim();
    var rYear = String(rows[i][map.academicYear] || "").trim();
    var rType = String(rows[i][map.paperType] || "").trim();
    
    if (rName.toLowerCase() === paperName.toLowerCase() && rSem === semester && rYear === academicYear && rType.toLowerCase() === paperType.toLowerCase()) {
      var isAll1 = branch.toLowerCase().indexOf("all") !== -1 || branch.toLowerCase().indexOf("common") !== -1;
      var isAll2 = rBranch.toLowerCase().indexOf("all") !== -1 || rBranch.toLowerCase().indexOf("common") !== -1;
      if (isAll1 || isAll2) {
        return { 
          error: true, 
          status: "exists", 
          message: "This examination paper has already been contributed in this semester library!" 
        };
      }
      var b1 = branch.toLowerCase().split(/[,/|;&\s]+/).map(function(s) { return s.trim(); });
      var b2 = rBranch.toLowerCase().split(/[,/|;&\s]+/).map(function(s) { return s.trim(); });
      var matchedBranch = b1.some(function(bValue) {
        return bValue && b2.indexOf(bValue) !== -1;
      });
      
      if (matchedBranch) {
        return { 
          error: true, 
          status: "exists", 
          message: "This examination paper has already been contributed for this branch / semester!" 
        };
      }
    }
  }
  
  // 2. Drive file generation from Base64 upload
  var fileId = "";
  if (fileBase64) {
    var folder;
    var folderId = "";
    
    try {
      if (folderId) {
        folder = DriveApp.getFolderById(folderId);
      } else {
        var folders = DriveApp.getFoldersByName("GetPYQ_Papers");
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder("GetPYQ_Papers");
        }
      }
    } catch (fError) {
      folder = DriveApp;
    }
    
    var contentType = "application/pdf";
    var base64Data = fileBase64;
    var parts = fileBase64.split(",");
    
    if (parts.length > 1) {
      contentType = parts[0].split(";")[0].split(":")[1] || "application/pdf";
      base64Data = parts[1];
    }
    
    var decodedBytes = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedBytes, contentType, fileName);
    var driveFile = folder.createFile(blob);
    
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    fileId = driveFile.getId();
  }
  
  // 3. Detect serial number strictly serially across existing rows (strictly: pyq-000001, 6 digits)
  var maxSerial = 0;
  for (var k = 1; k < rows.length; k++) {
    var cellVal = String(rows[k][map.pyqId] || "").trim();
    if (!cellVal) continue;
    var match = cellVal.match(/^pyq[-_]?(\\d+)$/i);
    if (match) {
      var num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSerial) {
        maxSerial = num;
      }
    } else {
      var digits = cellVal.replace(/\\D/g, "");
      if (digits.length > 0) {
        var parsed = parseInt(digits, 10);
        if (!isNaN(parsed) && parsed > maxSerial) {
          maxSerial = parsed;
        }
      }
    }
  }

  var nextSerial = maxSerial > 0 ? maxSerial + 1 : (rows.length > 1 ? rows.length : 1);
  var pyqId = "pyq-" + ("000000" + nextSerial).slice(-6);
  var timestamp = new Date().toISOString();
  
  if (map.fileName !== -1) {
    sheet.appendRow([
      pyqId,
      paperName, // Strictly subject name only!
      branch,
      semester,
      academicYear,
      paperType,
      fileName,  // New column for file name!
      fileId,
      uploadedBy,
      timestamp,
      0, // Initial Upvotes
      0  // Initial Downloads
    ]);
  } else {
    // If user has the 11-column sheet without fileName column
    sheet.appendRow([
      pyqId,
      paperName,
      branch,
      semester,
      academicYear,
      paperType,
      fileId,
      uploadedBy,
      timestamp,
      0,
      0
    ]);
  }
  
  invalidateScriptCache();
  return {
    success: true,
    status: "success",
    pyqId: pyqId,
    fileID: fileId,
    fileId: fileId,
    fileName: fileName,
    paperName: paperName,
    message: "Paper uploaded and stored successfully!"
  };
}

// Invalidate in-memory script cache on mutations
function invalidateScriptCache() {
  try {
    CacheService.getScriptCache().remove("getpyq_all_papers");
  } catch (e) {}
}

// Fetch all papers from Spreadsheet with high-speed CacheService RAM caching
function getAllPapers() {
  try {
    var cached = CacheService.getScriptCache().get("getpyq_all_papers");
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (cErr) {}

  var sheet = getOrCreateSheet("Papers");
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var map = getPapersColumnMap(sheet);
  var papers = [];
  
  for (var i = 1; i < rows.length; i++) {
    var pId = rows[i][map.pyqId];
    if (!pId) continue;

    var fId = map.fileID !== -1 ? String(rows[i][map.fileID] || "") : "";
    var fName = map.fileName !== -1 ? String(rows[i][map.fileName] || "") : "";
    var subj = String(rows[i][map.paperName] || "");

    papers.push({
      id: String(pId),
      paper: subj,
      branch: String(rows[i][map.branch] || "CSE"),
      semester: String(rows[i][map.semester] || "1"),
      year: String(rows[i][map.academicYear] || "2024-25"),
      exam_type: String(rows[i][map.paperType] || "Regular/Back"),
      file_name: fName,
      fileName: fName,
      file_id: fId,
      fileId: fId,
      file_url: fId ? "https://drive.google.com/file/d/" + fId + "/view?usp=drive_link" : "",
      uploader_name: map.uploadedBy !== -1 ? String(rows[i][map.uploadedBy] || "Anonymous Member") : "Anonymous Member",
      created_at: map.uploadTimestamp !== -1 ? String(rows[i][map.uploadTimestamp] || new Date().toISOString()) : new Date().toISOString(),
      upvotes: map.upvotes !== -1 ? Number(rows[i][map.upvotes] || 0) : 0,
      downloads: map.downloads !== -1 ? Number(rows[i][map.downloads] || 0) : 0,
      content_type: (function(filename) {
        var fn = String(filename || "").toLowerCase();
        if (fn.endsWith(".png")) return "image/png";
        if (fn.endsWith(".jpg") || fn.endsWith(".jpeg")) return "image/jpeg";
        if (fn.endsWith(".webp")) return "image/webp";
        return "application/pdf";
      })(fName || subj)
    });
  }
  
  var reversed = papers.reverse();
  try {
    var serialized = JSON.stringify(reversed);
    if (serialized.length < 95000) {
      CacheService.getScriptCache().put("getpyq_all_papers", serialized, 300); // 5 min RAM cache
    }
  } catch (cErr) {}

  return reversed;
}

// Fetch single paper by PYQ ID (Primary Key)
function getPYQById(id) {
  if (!id) return null;
  var target = String(id).trim().toLowerCase();
  var normTarget = target.replace(/[-_]/g, "");
  var baseTarget = target.replace(/-\d+$/, "");
  var normBaseTarget = baseTarget.replace(/[-_]/g, "");

  var papers = getAllPapers();
  for (var i = 0; i < papers.length; i++) {
    var pId = String(papers[i].id || "").trim().toLowerCase();
    var normPid = pId.replace(/[-_]/g, "");
    var basePid = pId.replace(/-\d+$/, "");
    var fId = String(papers[i].file_id || papers[i].fileId || "").trim().toLowerCase();

    if (pId === target || normPid === normTarget) {
      return papers[i];
    }
    if (basePid && (basePid === target || basePid === baseTarget || basePid === normTarget)) {
      return papers[i];
    }
    if (pId && (pId === baseTarget || normPid === normBaseTarget)) {
      return papers[i];
    }
    if (fId && (fId === target || target.indexOf(fId) !== -1 || fId.indexOf(target) !== -1)) {
      return papers[i];
    }
  }
  return null;
}

// Handle Incremental Upvoting
function handleUpvote(pyqId) {
  var sheet = getOrCreateSheet("Papers");
  var rows = sheet.getDataRange().getValues();
  var map = getPapersColumnMap(sheet);
  
  var target = String(pyqId || "").trim().toLowerCase();
  for (var i = 1; i < rows.length; i++) {
    var rId = String(rows[i][map.pyqId] || "").trim().toLowerCase();
    if (rId === target || rId.replace(/[-_]/g, "") === target.replace(/[-_]/g, "")) {
      var colUpvotes = map.upvotes !== -1 ? map.upvotes : 10;
      var currentUpvotes = Number(rows[i][colUpvotes] || 0);
      var nextUpvotes = currentUpvotes + 1;
      sheet.getRange(i + 1, colUpvotes + 1).setValue(nextUpvotes);
      invalidateScriptCache();
      return { success: true, upvotes: nextUpvotes };
    }
  }
  return { error: true, message: "Paper code " + pyqId + " not found." };
}

// Handle deletion of paper from sheet and Drive
function handleDeletePYQ(data) {
  var pyqId = data.pyqId || data.id;
  var fileId = data.fileId || data.fileID;
  
  if (!pyqId) {
    return { error: true, message: "Missing required pyqId for deletion." };
  }
  
  var sheet = getOrCreateSheet("Papers");
  var rows = sheet.getDataRange().getValues();
  var map = getPapersColumnMap(sheet);
  var deleted = false;
  var targetFileId = fileId || "";
  var targetClean = String(pyqId).trim().toLowerCase();
  
  for (var i = 1; i < rows.length; i++) {
    var rowId = String(rows[i][map.pyqId] || "").trim().toLowerCase();
    if (rowId === targetClean || rowId.replace(/[-_]/g, "") === targetClean.replace(/[-_]/g, "")) {
      if (!targetFileId && map.fileID !== -1 && rows[i][map.fileID]) {
        targetFileId = String(rows[i][map.fileID]).trim();
      }
      sheet.deleteRow(i + 1);
      deleted = true;
      break;
    }
  }
  
  // Also delete/trash Drive file if targetFileId exists
  var fileDeleted = false;
  if (targetFileId) {
    try {
      var file = DriveApp.getFileById(targetFileId);
      if (file) {
        file.setTrashed(true);
        fileDeleted = true;
      }
    } catch (fErr) {
      // File may already be removed or ID invalid
    }
  }
  
  // Also delete associated solutions
  try {
    var solSheet = getOrCreateSheet("Solutions");
    var solRows = solSheet.getDataRange().getValues();
    for (var j = solRows.length - 1; j >= 1; j--) {
      var sPyqId = String(solRows[j][1] || "").trim().toLowerCase();
      if (sPyqId === targetClean || sPyqId.replace(/[-_]/g, "") === targetClean.replace(/[-_]/g, "")) {
        solSheet.deleteRow(j + 1);
      }
    }
  } catch (sErr) {}
  
  if (deleted) {
    invalidateScriptCache();
    return {
      success: true,
      status: "deleted",
      pyqId: pyqId,
      fileDeleted: fileDeleted,
      message: "PYQ record and associated Drive file removed successfully."
    };
  } else {
    return {
      error: true,
      message: "PYQ with ID " + pyqId + " was not found in the spreadsheet."
    };
  }
}

// Handle modifying/editing paper details in Google Sheet
function handleUpdatePYQ(data) {
  var pyqId = data.pyqId || data.id;
  if (!pyqId) {
    return { error: true, message: "Missing required pyqId for update." };
  }
  
  var sheet = getOrCreateSheet("Papers");
  var rows = sheet.getDataRange().getValues();
  var map = getPapersColumnMap(sheet);
  var targetClean = String(pyqId).trim().toLowerCase();
  var updated = false;
  var rowIndex = -1;
  
  for (var i = 1; i < rows.length; i++) {
    var rowId = String(rows[i][map.pyqId] || "").trim().toLowerCase();
    if (rowId === targetClean || rowId.replace(/[-_]/g, "") === targetClean.replace(/[-_]/g, "")) {
      rowIndex = i + 1; // 1-based row index in sheet
      
      // Update paper name / subject
      if (data.paperName !== undefined || data.paper !== undefined || data.subject !== undefined) {
        var newPaper = String(data.paperName || data.paper || data.subject || "").trim();
        if (newPaper && map.paperName !== -1) {
          sheet.getRange(rowIndex, map.paperName + 1).setValue(newPaper);
        }
      }
      
      // Update branch
      if (data.branch !== undefined) {
        var newBranch = String(data.branch || "").trim();
        if (newBranch && map.branch !== -1) {
          sheet.getRange(rowIndex, map.branch + 1).setValue(newBranch);
        }
      }
      
      // Update semester
      if (data.semester !== undefined) {
        var newSem = String(data.semester || "").trim();
        if (newSem && map.semester !== -1) {
          sheet.getRange(rowIndex, map.semester + 1).setValue(newSem);
        }
      }
      
      // Update academic year
      if (data.academicYear !== undefined || data.year !== undefined) {
        var newYear = String(data.academicYear || data.year || "").trim();
        if (newYear && map.academicYear !== -1) {
          sheet.getRange(rowIndex, map.academicYear + 1).setValue(newYear);
        }
      }
      
      // Update exam type / paper type
      if (data.paperType !== undefined || data.exam_type !== undefined) {
        var newType = String(data.paperType || data.exam_type || "").trim();
        if (newType && map.paperType !== -1) {
          sheet.getRange(rowIndex, map.paperType + 1).setValue(newType);
        }
      }
      
      // Update uploader name
      if (data.uploadedBy !== undefined || data.uploader_name !== undefined) {
        var newUploader = String(data.uploadedBy || data.uploader_name || "").trim();
        if (newUploader && map.uploadedBy !== -1) {
          sheet.getRange(rowIndex, map.uploadedBy + 1).setValue(newUploader);
        }
      }
      
      // Update file ID if provided
      if (data.fileId !== undefined || data.fileID !== undefined) {
        var newFileId = String(data.fileId || data.fileID || "").trim();
        if (newFileId && map.fileID !== -1) {
          sheet.getRange(rowIndex, map.fileID + 1).setValue(newFileId);
        }
      }

      updated = true;
      break;
    }
  }
  
  if (updated) {
    invalidateScriptCache();
    return {
      success: true,
      status: "updated",
      pyqId: pyqId,
      message: "PYQ record updated successfully in Google Sheet!"
    };
  } else {
    return {
      error: true,
      message: "PYQ with ID " + pyqId + " was not found in the spreadsheet."
    };
  }
}

// Create new solution
function handleAddSolution(data) {
  var sheet = getOrCreateSheet("Solutions");
  var id = "sol-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
  var createdAt = new Date().toISOString();
  
  sheet.appendRow([
    id,
    data.pyqId,
    data.content,
    data.authorName || "Anonymous Student",
    createdAt
  ]);
  
  return {
    success: true,
    solution: {
      id: id,
      pyq_id: data.pyqId,
      content: data.content,
      author_name: data.authorName || "Anonymous Student",
      created_at: createdAt
    }
  };
}

// Get solutions for a specific paper
function getSolutionsForPYQ(pyqId) {
  var sheet = getOrCreateSheet("Solutions");
  var rows = sheet.getDataRange().getValues();
  var solutions = [];
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] === pyqId) {
      solutions.push({
        id: rows[i][0],
        pyq_id: rows[i][1],
        content: rows[i][2],
        author_name: rows[i][3] || "Anonymous Student",
        created_at: rows[i][4] || new Date().toISOString()
      });
    }
  }
  
  return solutions.reverse();
}

// Calculate statistical counters across spreadsheet data
function calculateStats() {
  var sheet = getOrCreateSheet("Papers");
  var rows = sheet.getDataRange().getValues();
  var map = getPapersColumnMap(sheet);
  var count = Math.max(0, rows.length - 1);
  var totalDownloads = 0;
  var totalUpvotes = 0;
  var branchSet = {};
  
  for (var i = 1; i < rows.length; i++) {
    if (map.downloads !== -1) {
      totalDownloads += Number(rows[i][map.downloads] || 0);
    }
    if (map.upvotes !== -1) {
      totalUpvotes += Number(rows[i][map.upvotes] || 0);
    }
    
    var bVal = map.branch !== -1 ? String(rows[i][map.branch] || "") : "";
    var branches = bVal.split(/[,\\\\s]+/);
    for (var j = 0; j < branches.length; j++) {
      var b = branches[j].trim();
      if (b) {
        branchSet[b] = true;
      }
    }
  }
  
  var branchCount = Object.keys(branchSet).length;
  
  return {
    total_pyqs: count,
    total_branches: branchCount > 0 ? branchCount : 8,
    total_downloads: totalDownloads,
    total_upvotes: totalUpvotes
  };
}

// Student Paper Requests Handlers
function getAllRequests() {
  var sheet = getOrCreateSheet("Requests");
  var rows = sheet.getDataRange().getValues();
  var requests = [];
  
  for (var i = 1; i < rows.length; i++) {
    requests.push({
      id: String(rows[i][0] || ""),
      subject_name: String(rows[i][1] || ""),
      branch: String(rows[i][2] || "CSE"),
      semester: String(rows[i][3] || "1"),
      year: String(rows[i][4] || "2024-25"),
      exam_type: String(rows[i][5] || "Regular/Back"),
      requester_name: String(rows[i][6] || "Anonymous"),
      note: String(rows[i][7] || ""),
      created_at: String(rows[i][8] || new Date().toISOString()),
      status: String(rows[i][9] || "open"),
      fulfilled_pyq_id: String(rows[i][10] || ""),
      upvotes: Number(rows[i][11] || 1)
    });
  }
  
  return requests.reverse();
}

function handleCreateRequest(data) {
  var sheet = getOrCreateSheet("Requests");
  var id = "req-" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
  var createdAt = new Date().toISOString();
  
  sheet.appendRow([
    id,
    data.subject_name || "",
    data.branch || "CSE",
    String(data.semester || "1"),
    String(data.year || "2024-25"),
    String(data.exam_type || "Regular/Back"),
    data.requester_name || "Anonymous",
    data.note || "",
    createdAt,
    "open",
    "",
    1
  ]);
  
  return {
    success: true,
    request: {
      id: id,
      subject_name: data.subject_name || "",
      branch: data.branch || "CSE",
      semester: String(data.semester || "1"),
      year: String(data.year || "2024-25"),
      exam_type: String(data.exam_type || "Regular/Back"),
      requester_name: data.requester_name || "Anonymous",
      note: data.note || "",
      created_at: createdAt,
      status: "open",
      upvotes: 1
    }
  };
}

function handleUpvoteRequest(requestId) {
  var sheet = getOrCreateSheet("Requests");
  var rows = sheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(requestId)) {
      var currentUpvotes = Number(rows[i][11] || 1);
      var nextUpvotes = currentUpvotes + 1;
      sheet.getRange(i + 1, 12).setValue(nextUpvotes);
      return { success: true, upvotes: nextUpvotes };
    }
  }
  return { error: true, message: "Request ID not found in sheet." };
}

function handleFulfillRequest(data) {
  var sheet = getOrCreateSheet("Requests");
  var rows = sheet.getDataRange().getValues();
  var requestId = data.requestId;
  var pyqId = data.pyqId;
  
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(requestId)) {
      sheet.getRange(i + 1, 10).setValue("fulfilled");
      sheet.getRange(i + 1, 11).setValue(pyqId);
      return { success: true, message: "Request marked as fulfilled!" };
    }
  }
  return { error: true, message: "Request ID not found in sheet." };
}
