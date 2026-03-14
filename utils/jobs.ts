export async function fetchJobsFromSheet() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A2:K'; // Assuming headers are in row 1

  const mockJobs = [
    {
      jobId: "1",
      title: "Senior Frontend Engineer",
      company: "TechNova",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      postedAt: "2 days ago",
      description: "We are looking for an experienced Frontend Engineer to join our core team. You will be responsible for building and maintaining our main web application using React and TypeScript.",
      url: "https://example.com/job/1",
      logo: "https://ui-avatars.com/api/?name=TechNova&background=random",
      code: "TN-FE-01"
    },
    {
      jobId: "2",
      title: "Product Designer",
      company: "CreativeSolutions",
      location: "New York, NY",
      type: "Hybrid",
      salary: "$90k - $120k",
      postedAt: "1 week ago",
      description: "Join our design team to create beautiful and intuitive user experiences. You should have a strong portfolio demonstrating your UI/UX skills.",
      url: "https://example.com/job/2",
      logo: "https://ui-avatars.com/api/?name=CreativeSolutions&background=random",
      code: "CS-PD-02"
    },
    {
      jobId: "3",
      title: "Backend Developer",
      company: "DataSystems Inc.",
      location: "San Francisco, CA",
      type: "On-site",
      salary: "$130k - $160k",
      postedAt: "3 days ago",
      description: "We need a strong Backend Developer with experience in Node.js, Express, and PostgreSQL to help scale our infrastructure.",
      url: "https://example.com/job/3",
      logo: "https://ui-avatars.com/api/?name=DataSystems&background=random",
      code: "DS-BE-03"
    },
    {
      jobId: "4",
      title: "Marketing Manager",
      company: "GrowthHackers",
      location: "Remote",
      type: "Full-time",
      salary: "$80k - $110k",
      postedAt: "5 days ago",
      description: "Looking for a data-driven Marketing Manager to lead our user acquisition strategies and manage our digital campaigns.",
      url: "https://example.com/job/4",
      logo: "https://ui-avatars.com/api/?name=GrowthHackers&background=random",
      code: "GH-MM-04"
    }
  ];

  if (!apiKey || !sheetId) {
    console.warn("Google Sheets API key or Sheet ID not configured. Falling back to mock jobs.");
    return mockJobs;
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to fetch from Google Sheets: ${response.statusText}. Falling back to mock jobs.`);
      return mockJobs;
    }

    const data = await response.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      console.warn("Google Sheet is empty. Falling back to mock jobs.");
      return mockJobs;
    }

    return rows.map((row: any[], index: number) => ({
      jobId: row[0] || String(index + 1),
      title: row[1] || "Untitled Job",
      company: row[2] || "Unknown Company",
      location: row[3] || "Remote",
      type: row[4] || "Full-time",
      salary: row[5] || "",
      postedAt: row[6] || "Recently",
      description: row[7] || "",
      url: row[8] || "",
      logo: row[9] || `https://ui-avatars.com/api/?name=${encodeURIComponent(row[2] || 'Company')}&background=random`,
      code: row[10] || ""
    }));
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
    return mockJobs;
  }
}
