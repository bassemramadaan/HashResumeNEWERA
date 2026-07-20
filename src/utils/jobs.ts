import { Job } from "../data/jobs";

export async function fetchJobsFromSheet(): Promise<Job[]> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = "Sheet1!A2:Z100"; // Assuming headers are in row 1

  if (!apiKey || !sheetId) {
    console.warn("Google Sheets API key or Sheet ID missing. Falling back to mock data.");
    return getMockJobs();
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Map rows to Job objects
    // Expected column order: jobId, title, company, location, type, salary, description, postedAt, logo, url, code
    return rows.map((row: string[]) => ({
      jobId: row[0] || "",
      title: row[1] || "",
      company: row[2] || "",
      location: row[3] || "",
      type: row[4] || "",
      salary: row[5] || "",
      description: row[6] || "",
      postedAt: row[7] || "",
      logo: row[8] || "",
      url: row[9] || "",
      code: row[10] || "",
    }));
  } catch (error) {
    console.error("Error fetching jobs from Google Sheets:", error);
    return getMockJobs();
  }
}

function getMockJobs(): Job[] {
  return [
    {
      jobId: "it-support",
      title: "Officer - IT Support Egypt",
      company: "Almosafer",
      location: "Cairo, Egypt",
      type: "Full-time",
      dept: "IT Support Egypt & Tech",
      exp: "1-3 Years",
      arabicTitle: "مسؤول - الدعم الفني وتكنولوجيا المعلومات",
      bullets: [
        "Provide daily desktop & infrastructure technical support to Cairo office staff.",
        "Troubleshoot local hardware, software, security setups, and local network issues.",
        "Provision new equipment, accounts, software access, and workstations.",
        "Maintain office IT assets, inventory records, and support internal SLA guidelines."
      ],
      logo: "https://ui-avatars.com/api/?name=Almosafer&background=001639&color=fff",
      url: "https://jobs.almosafer.com/job/Cairo-Officer-IT-Support-Egypt/1401870033/",
      code: "AM-IT-01"
    },
    {
      jobId: "revenue-assurance",
      title: "Officer - Revenue Assurance",
      company: "Almosafer",
      location: "Cairo, Egypt",
      type: "Full-time",
      dept: "Finance & Commercial Audit",
      exp: "2-4 Years",
      arabicTitle: "مسؤول - تدقيق ومراقبة صحة الإيرادات",
      bullets: [
        "Audit daily transactions and bookings to find and prevent leakage early.",
        "Perform routine reconciliations between core systems and tourist travel vendors.",
        "Identify commercial pricing deviations, incorrect commissions or chargebacks.",
        "Validate payment gateway settlement workflows and reconcile differences."
      ],
      logo: "https://ui-avatars.com/api/?name=Almosafer&background=001639&color=fff",
      url: "https://jobs.almosafer.com/job/Cairo-Officer-Revenue-Assurance/1399488333/",
      code: "AM-RA-02"
    },
    {
      jobId: "order-to-cash",
      title: "Sr.Officer - Order-to-Cash",
      company: "Almosafer",
      location: "Cairo, Egypt",
      type: "Full-time",
      dept: "Finance & Accounts Receivable (O2C)",
      exp: "3-5 Years",
      arabicTitle: "مسؤول أول - دورة الطلب وسداد الفواتير حتى التحصيل",
      bullets: [
        "Lead the Order-to-Cash (O2C) accounting lifecycle for corporate high-value partners.",
        "Audit corporate booking sales, manage credit lines, and produce flawless active invoices.",
        "Track customer aging reports, manage active collections, and maintain healthy cash flow.",
        "Post incoming payments in Oracle/SAP ERP and clear open invoices accurately."
      ],
      logo: "https://ui-avatars.com/api/?name=Almosafer&background=001639&color=fff",
      url: "https://jobs.almosafer.com/job/Cairo-Sr_Officer-Order-to-Cash/1400535133/",
      code: "AM-OC-03"
    }
  ];
}
