/**
 * Google Apps Script for Hash Resume Manual Payments & Code Voucher Management
 * -----------------------------------------------------------------------------
 * This script runs as a Web App (with access: "Anyone") and connects to:
 * - Tab 1: "Manual" (For recording and reviewing reference numbers)
 * - Tab 2: "Codes" (For storing pre-generated premium codes)
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Replace all existing code with this script
 * 4. Replace sheetId with your real Sheet ID (optional if linked to active active spreadsheet)
 * 5. Click "Deploy" > "New Deployment"
 * 6. Select Type: "Web App"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": "Anyone"
 * 9. Copy the new Web App URL and paste it in the project.
 */

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  // Open spreadsheet (use active spreadsheet if linked)
  let ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    // Fallback ID if called from outside
    const sheetId = "10FFqG4rYrqJrIHN2C4v7Y42v3PUcLxSB2TUMxr6GTAU"; 
    ss = SpreadsheetApp.openById(sheetId);
  }
  
  const manualSheet = ss.getSheetByName("Manual") || ss.createSheet("Manual");
  const codesSheet = ss.getSheetByName("Codes") || ss.createSheet("Codes");
  
  // Set headers if sheets are empty
  if (manualSheet.getLastRow() === 0) {
    manualSheet.appendRow(["Reference", "Sender Info", "Email", "Amount", "Timestamp", "Status"]);
  }
  if (codesSheet.getLastRow() === 0) {
    codesSheet.appendRow(["Code", "Status", "Date", "Reference"]);
  }

  // --- ACTION 1: Submit Payment Transaction ---
  if (action === "submitPayment") {
    const reference = params.reference ? params.reference.toString().trim() : "";
    const senderInfo = params.senderInfo ? params.senderInfo.toString().trim() : "";
    const email = params.email ? params.email.toString().trim() : "";
    const amount = params.amount ? params.amount.toString().trim() : "50 EGP";
    
    if (!reference) {
      return jsonResponse({ success: false, message: "Reference is required" });
    }
    
    // Check if reference already exists on the Manual sheet
    const manualData = manualSheet.getDataRange().getValues();
    for (let i = 1; i < manualData.length; i++) {
      if (manualData[i][0].toString().trim() === reference) {
        return jsonResponse({ success: false, message: "الرقم المرجعي مسجل مسبقاً / Reference already submitted" });
      }
    }
    
    // Append the new request with pending status
    manualSheet.appendRow([
      reference,
      senderInfo,
      email,
      amount,
      new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }),
      "pending"
    ]);
    
    return jsonResponse({ success: true, message: "تم تسجيل المعاملة بنجاح وتنتظر المراجعة" });
  }
  
  // --- ACTION 2: Check Reference Approval & Retrieve/Assign Codes ---
  if (action === "checkStatus") {
    const reference = params.reference ? params.reference.toString().trim() : "";
    if (!reference) {
      return jsonResponse({ success: false, message: "Reference is required" });
    }
    
    const manualData = manualSheet.getDataRange().getValues();
    let txnRowIdx = -1;
    let txnAmount = "";
    let txnStatus = "";
    
    for (let i = 1; i < manualData.length; i++) {
      if (manualData[i][0].toString().trim() === reference) {
        txnRowIdx = i + 1; // 1-based index including header
        txnAmount = manualData[i][3].toString().trim();
        txnStatus = manualData[i][5].toString().trim().toLowerCase();
        break;
      }
    }
    
    if (txnRowIdx === -1) {
      return jsonResponse({ success: false, status: "not_found", message: "الرقم المرجعي غير موجود" });
    }
    
    // If not approved yet, return pending status
    if (txnStatus !== "approved") {
      return jsonResponse({ success: true, status: txnStatus, message: "المعاملة ما زالت تحت المراجعة" });
    }
    
    // Check if there are already codes assigned to this reference on the "Codes" sheet
    const codesData = codesSheet.getDataRange().getValues();
    const assignedCodes = [];
    
    for (let i = 1; i < codesData.length; i++) {
      const codeRef = codesData[i][3] ? codesData[i][3].toString().trim() : "";
      if (codeRef === reference) {
        assignedCodes.push(codesData[i][0].toString().trim());
      }
    }
    
    // If we already assigned codes before, return them directly!
    if (assignedCodes.length > 0) {
      return jsonResponse({
        success: true,
        status: "approved",
        codes: assignedCodes,
        code: assignedCodes[0],
        message: "تم استرجاع الأكواد المخصصة لك مسبقاً"
      });
    }
    
    // Determine package type based on "Amount" text
    // E.g., "120 EGP" or containing "3 Codes" means it's a Bundle (3 Codes)
    const isBundle = txnAmount.includes("120") || txnAmount.includes("3");
    const codesNeeded = isBundle ? 3 : 1;
    
    const freshlyAssignedCodes = [];
    
    // Look for "unused" codes to reserve for this customer
    for (let i = 1; i < codesData.length; i++) {
      const currentCode = codesData[i][0].toString().trim();
      const currentStatus = codesData[i][1] ? codesData[i][1].toString().trim().toLowerCase() : "";
      
      if (currentStatus === "unused" && currentCode !== "") {
        freshlyAssignedCodes.push({
          code: currentCode,
          rowIdx: i + 1
        });
        
        if (freshlyAssignedCodes.length === codesNeeded) {
          break;
        }
      }
    }
    
    // If we don't have enough codes in the sheet
    if (freshlyAssignedCodes.length < codesNeeded) {
      return jsonResponse({
        success: false,
        status: "approved",
        message: "تم الموافقة على تحويلك ولكن لا توجد أكواد كافية غير مستخدمة في قاعدة البيانات. برجاء التواصل مع الإدارة لتزويد الشيت بأكواد جديدة."
      });
    }
    
    // Reserve these codes for the reference by setting status to "assigned"
    const todayStr = new Date().toLocaleDateString("en-US");
    for (let k = 0; k < freshlyAssignedCodes.length; k++) {
      const targetRow = freshlyAssignedCodes[k].rowIdx;
      // Column B: Status -> "assigned" (reserved, but first-time validation will consume it to "used")
      codesSheet.getCell(targetRow, 2).setValue("assigned"); 
      // Column C: Date
      codesSheet.getCell(targetRow, 3).setValue(todayStr);
      // Column D: Reference
      codesSheet.getCell(targetRow, 4).setValue(reference);
    }
    
    const responseCodesList = freshlyAssignedCodes.map(item => item.code);
    
    return jsonResponse({
      success: true,
      status: "approved",
      codes: responseCodesList,
      code: responseCodesList[0],
      message: "تم توليد وتخصيص أكواد بريميوم بنجاح"
    });
  }
  
  // --- ACTION 3: Code Verification & Unlock (Triggered when user clicks Verify in the app) ---
  if (action === "verify") {
    const inputCode = params.code ? params.code.toString().trim() : "";
    if (!inputCode) {
      return jsonResponse({ success: false, message: "يرجى كتابة الكود" });
    }
    
    const codesData = codesSheet.getDataRange().getValues();
    let codeRowIdx = -1;
    let currentStatus = "";
    
    // Find matching code (case-insensitive to avoid typo issues)
    for (let i = 1; i < codesData.length; i++) {
      const sheetCode = codesData[i][0].toString().trim();
      if (sheetCode.toLowerCase() === inputCode.toLowerCase()) {
        codeRowIdx = i + 1; // 1-based index including header
        currentStatus = codesData[i][1] ? codesData[i][1].toString().trim().toLowerCase() : "";
        break;
      }
    }
    
    if (codeRowIdx === -1) {
      return jsonResponse({ success: false, message: "كود غير صحيح، يرجى التأكد وإعادة الإدخال" });
    }
    
    // If code status is "unused" or "assigned" -> Permit Activation & Mark as "used" immediately!
    if (currentStatus === "assigned" || currentStatus === "unused") {
      // Mark code as fully consumed "used" now that user is using it on a CV
      codesSheet.getCell(codeRowIdx, 2).setValue("used");
      if (!codesSheet.getCell(codeRowIdx, 3).getValue()) {
        codesSheet.getCell(codeRowIdx, 3).setValue(new Date().toLocaleDateString("en-US"));
      }
      
      return jsonResponse({ 
        success: true, 
        message: "تم تفعيل الحساب بريميوم بالنجاح" 
      });
    }
    
    // If it is already marked "used"
    if (currentStatus === "used") {
      return jsonResponse({ 
        success: false, 
        message: "عذراً، هذا الكود تم استخدامه لتفعيل سيرة ذاتية من قبل ولا يمكن إعادة استخدامه." 
      });
    }
    
    return jsonResponse({ 
      success: false, 
      message: "حالة الكود غير صالحة للتفعيل" 
    });
  }
  
  return jsonResponse({ success: false, message: "Action unknown" });
}

function doPost(e) {
  // Redirect POST queries to GET for ease of manual testing & CORS compliance
  return doGet(e);
}

// Utility function to return perfectly formatted CORS-friendly JSON
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
