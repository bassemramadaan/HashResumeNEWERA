import { ResumeData } from "../store/useResumeStore";

// Basic stop words to ignore in keyword matching
const STOP_WORDS = new Set([
  "the",
  "and",
  "a",
  "to",
  "of",
  "in",
  "i",
  "is",
  "that",
  "it",
  "on",
  "you",
  "this",
  "for",
  "but",
  "with",
  "are",
  "have",
  "be",
  "at",
  "or",
  "as",
  "was",
  "so",
  "if",
  "out",
  "not",
  "we",
  "my",
  "by",
  "from",
  "an",
  "will",
  "can",
  "about",
  "which",
  "your",
  "all",
  "has",
  "one",
  "more",
  "do",
  "their",
  "there",
  "what",
  "who",
  "when",
  "where",
  "why",
  "how",
  "any",
  "some",
  "such",
  "into",
  "up",
  "down",
  "over",
  "under",
  "between",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "off",
  "again",
  "further",
  "then",
  "once",
  "here",
  "both",
  "each",
  "few",
  "most",
  "other",
  "no",
  "nor",
  "only",
  "own",
  "same",
  "than",
  "too",
  "very",
  "s",
  "t",
  "just",
  "don",
  "should",
  "now",
]);

export interface ATSResult {
  score: number;
  sections: {
    title: string;
    score: number;
    maxScore: number;
    goodPoints: string[];
    improvements: string[];
  }[];
  tips: string[];
  criticalFailures: string[];
}

const ACTION_VERBS = new Set([
  "led",
  "managed",
  "developed",
  "increased",
  "decreased",
  "created",
  "designed",
  "implemented",
  "coordinated",
  "negotiated",
  "presented",
  "researched",
  "analyzed",
  "built",
  "coded",
  "launched",
  "mentored",
  "trained",
  "optimized",
  "streamlined",
  "achieved",
  "accelerated",
  "delivered",
  "generated",
  "improved",
  "pioneered",
  "transformed",
  "won",
  "executed",
  "formulated",
  "initiated",
]);

const ARABIC_ACTION_VERBS = new Set([
  "قاد", "أدار", "صمم", "طور", "أنشأ", "حقق", "نفذ", "أطلق", "حسن", "ساعد", 
  "أشرف", "أنتج", "حلل", "برمج", "إدارة", "تطوير", "تصميم", "تنفيذ", "تحقيق",
  "قدت", "أدرت", "صممت", "طورت", "أنشأت", "حققت", "نفذت", "أطلقت", "حسنت",
  "ساهمت", "شاركت", "أشرفت", "أنتجت", "حللت", "برمجت", "تخطيط", "تحليل"
]);

const SOFT_SKILLS = new Set([
  "communication",
  "leadership",
  "teamwork",
  "problem solving",
  "critical thinking",
  "adaptability",
  "time management",
  "collaboration",
  "interpersonal",
  "creativity",
  "emotional intelligence",
  "work ethic",
  "attention to detail",
  "organization",
]);

export function getJobMatchResults(data: ResumeData) {
  const { jobDescription, personalInfo, experience, education, skills } = data;
  if (!jobDescription || !jobDescription.trim()) return null;

  const arabicUnicodeRange = "\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF";
  const regex = new RegExp(`[^\\w\\s${arabicUnicodeRange}]`, "g");

  // Extract words from JD
  const jdWords = jobDescription
    .toLowerCase()
    .replace(regex, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Extract words from Resume
  const resumeText = [
    personalInfo.summary,
    ...experience.map((e) => `${e.position} ${e.company} ${e.description}`),
    ...education.map((e) => `${e.degree} ${e.institution} ${e.description}`),
    ...skills,
  ]
    .join(" ")
    .toLowerCase()
    .replace(regex, "");

  const resumeWords = new Set(resumeText.split(/\s+/));

  // Calculate frequencies in JD to find important keywords
  const wordFreq: Record<string, number> = {};
  jdWords.forEach((w) => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  // Sort by frequency to get top keywords
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map((entry) => entry[0]);

  const matched = topKeywords.filter((kw) => resumeWords.has(kw));
  const missing = topKeywords.filter((kw) => !resumeWords.has(kw));

  const matchPercentage =
    topKeywords.length > 0
      ? Math.round((matched.length / topKeywords.length) * 100)
      : 0;

  return { matchPercentage, matched, missing };
}

export function calculateATSScore(data: ResumeData, lang: string = "en"): ATSResult {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    settings,
  } = data;

  const isAr = lang === "ar";
  const tStr = (en: string, ar: string) => isAr ? ar : en;

  const sections: ATSResult["sections"] = [];

  // 1. Contact Info (10 points max)
  const contact = {
    title: tStr("Contact Info", "معلومات الاتصال"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (personalInfo.fullName && personalInfo.fullName.trim().length > 2) {
    contact.score += 3;
    contact.goodPoints.push(tStr("Full name is present.", "الاسم الكامل مضاف بشكل صحيح."));
  } else contact.improvements.push(tStr("Add your full name.", "يرجى إضافة اسمك الكامل في أعلى السيرة الذاتية."));

  if (personalInfo.email && personalInfo.email.includes("@")) {
    contact.score += 3;
    contact.goodPoints.push(tStr("Email address is present.", "البريد الإلكتروني مضاف بشكل صحيح."));
  } else contact.improvements.push(tStr("Add a professional email address.", "أضف بريداً إلكترونياً مهنياً رسمياً يحتوي على اسمك (تجنب الأسماء المستعارة)."));

  if (personalInfo.phone && personalInfo.phone.trim().length > 4) {
    contact.score += 2;
    contact.goodPoints.push(tStr("Phone number is present.", "رقم الهاتف مضاف للتواصل السريع."));
  } else contact.improvements.push(tStr("Add your phone number.", "أضف رقم هاتفك للتواصل المباشر مع مسؤولي التوظيف."));

  let socialCount = 0;
  if (personalInfo.linkedin && personalInfo.linkedin.trim().length > 0) {
    contact.score += 2;
    socialCount++;
    contact.goodPoints.push(tStr("LinkedIn profile included.", "رابط حساب لينكد إن مضاف."));
  }
  if (personalInfo.github && personalInfo.github.trim().length > 0) {
    if (socialCount < 1) contact.score += 2; // award points if linkedin wasn't filled
    socialCount++;
    contact.goodPoints.push(tStr("GitHub profile included.", "رابط حساب جيتهاب مضاف."));
  }
  if (personalInfo.portfolio && personalInfo.portfolio.trim().length > 0) {
    if (socialCount < 1) contact.score += 2; // award points
    socialCount++;
    contact.goodPoints.push(tStr("Portfolio website included.", "رابط معرض الأعمال/الموقع الشخصي مضاف."));
  }

  // Cap score at 10
  contact.score = Math.min(10, contact.score);

  if (socialCount === 0) {
    contact.improvements.push(
      tStr(
        "Add a professional online profile (LinkedIn, GitHub, or Portfolio) to build trust.",
        "يرجى إضافة رابط مهني نشط مثل حساب LinkedIn أو GitHub أو موقعك الشخصي لزيادة المصداقية."
      )
    );
  }
  sections.push(contact);

  // 2. Summary (10 points)
  const summary = {
    title: tStr("Summary", "الملخص المهني"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (personalInfo.summary && personalInfo.summary.length > 150) {
    summary.score += 10;
    summary.goodPoints.push(tStr("Detailed professional summary.", "ملخص مهني تفصيلي واحترافي مضاف."));
  } else if (personalInfo.summary && personalInfo.summary.length > 50) {
    summary.score += 5;
    summary.improvements.push(
      tStr(
        "Make your summary more impactful by adding specific achievements and years of experience.",
        "اجعل الملخص المهني أكثر تأثيراً عبر إضافة سنوات الخبرة وأهم الإنجازات ولغة الأرقام."
      )
    );
  } else {
    summary.improvements.push(
      tStr(
        "Add a professional summary (3-4 sentences) to highlight your core value proposition.",
        "أضف ملخصاً مهنياً (3-4 جمل) يبرز مهاراتك الرئيسية وقيمتك المضافة لجهة التوظيف."
      )
    );
  }
  sections.push(summary);

  // 3. Experience Formatting (10 points)
  const expStructure = {
    title: tStr("Experience Formatting", "تنسيق الخبرات المهنية"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (experience.length > 0) {
    expStructure.score += 5;
    expStructure.goodPoints.push(tStr("Work experience section is present.", "قسم الخبرات المهنية مضاف وموجود."));

    let bulletCount = 0;
    let totalBullets = 0;

    experience.forEach((exp) => {
      const bullets = exp.description
        .split("\n")
        .filter((b) => b.trim().length > 0);
      totalBullets += bullets.length;
      bullets.forEach((bullet) => {
        const trimmed = bullet.trim();
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          bulletCount++;
        }
      });
    });

    if (totalBullets > 0) {
      if (bulletCount / totalBullets > 0.8) {
        expStructure.score += 5;
        expStructure.goodPoints.push(
          tStr("Consistent use of standard bullet points.", "استخدام متناسق للنقاط النقطية القياسية.")
        );
      } else {
        expStructure.improvements.push(
          tStr(
            "Use standard bullet points (•, -, *) for all experience descriptions to ensure ATS readability.",
            "استخدم علامات تنقيط موحدة وقياسية (مثل • أو -) لضمان قراءة النظام الآلي ATS للخبرات بشكل صحيح."
          )
        );
      }
    } else {
      expStructure.improvements.push(
        tStr(
          "Add bullet points to describe your responsibilities and achievements.",
          "أضف نقاطاً تفصيلية منظمة لشرح مسؤولياتك وإنجازاتك في كل دور وظيفي."
        )
      );
    }
  } else {
    expStructure.improvements.push(
      tStr("Add work experience or relevant internships.", "يرجى إضافة خبراتك المهنية أو التدريبية السابقة لإثراء السيرة الذاتية.")
    );
  }
  sections.push(expStructure);

  // 4. Experience Bullet Points (20 points)
  const bulletQuality = {
    title: tStr("Experience Bullet Points", "جودة الأوصاف الوظيفية"),
    score: 0,
    maxScore: 20,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (experience.length > 0) {
    let actionVerbCount = 0;
    let quantifiedCount = 0;
    let totalBullets = 0;

    experience.forEach((exp) => {
      const bullets = exp.description
        .split("\n")
        .filter((b) => b.trim().length > 0);
      totalBullets += bullets.length;

      bullets.forEach((bullet) => {
        const cleanBullet = bullet
          .trim()
          .replace(/^[•*\s-]+/, "")
          .trim()
          .toLowerCase();

        // Match English or Arabic action verbs anywhere in the bullet
        let hasActionVerb = false;
        const words = cleanBullet.split(/\s+/);
        for (const w of words) {
          if (ACTION_VERBS.has(w) || ARABIC_ACTION_VERBS.has(w)) {
            hasActionVerb = true;
            break;
          }
        }
        
        if (hasActionVerb) actionVerbCount++;
        // Check for English (0-9) and Arabic/Indic (٠-٩) numerals and percentages
        if (/[0-9]+%|\$[0-9]+|[0-9]+\+|[٠-٩]+٪|[٠-٩]+\+|[0-9]+/.test(cleanBullet)) quantifiedCount++;
      });
    });

    if (totalBullets > 0) {
      const actionVerbRatio = actionVerbCount / totalBullets;
      if (actionVerbRatio > 0.6) {
        bulletQuality.score += 10;
        bulletQuality.goodPoints.push(tStr("Excellent use of strong action verbs.", "استخدام ممتاز ومميز للأفعال القوية والدلالية."));
      } else if (actionVerbRatio > 0.3) {
        bulletQuality.score += 5;
        bulletQuality.goodPoints.push(tStr("Good attempt at using action verbs.", "محاولة جيدة لاستخدام الأفعال التعبيرية النشطة."));
        bulletQuality.improvements.push(
          tStr(
            "Start more of your bullet points with action verbs to show active leadership and technical execution.",
            "ابدأ المزيد من النقاط بأفعال قوية مهنية لتظهر دورك الفعّال والنشط."
          )
        );
      } else {
        bulletQuality.improvements.push(
          tStr(
            "Most descriptions should include clear action verbs (e.g., 'Led', 'Developed', 'قاد', 'طور') to detail your output.",
            "يجب أن تبدأ معظم الأوصاف الوظيفية بأفعال دلالية واضحة تشرح بدقة ما أنجزته وتكشف جدارتك."
          )
        );
      }

      if (quantifiedCount >= 2) {
        bulletQuality.score += 10;
        bulletQuality.goodPoints.push(
          tStr("Great job adding numbers and metrics to substantiate impact.", "عمل رائع! استخدام الأرقام والنسب المئوية يعطي مصداقية كبيرة لإنجازاتك.")
        );
      } else if (quantifiedCount > 0) {
        bulletQuality.score += 5;
        bulletQuality.goodPoints.push(tStr("Some quantified impact included.", "تم استخدام بعض الأرقام لقياس الأثر."));
        bulletQuality.improvements.push(
          tStr(
            "Try to quantify more achievements with numbers, percentages, or scale metrics.",
            "حاول إدراج أرقام ونسب مئوية أكثر لقياس مدى نجاحك وتأثيرك في أدوارك السابقة."
          )
        );
      } else {
        bulletQuality.improvements.push(
          tStr(
            "Add metrics/numbers to your accomplishments (e.g., 'Increased efficiency by 15%', 'Managed $10k budget' or 'تقليص التكاليف بنسبة ١٥٪').",
            "أضف لغة الأرقام والنسب لقياس نتائج أعمالك (مثل: زيادة المبيعات بنسبة 15%، أو إدارة ميزانية محددة)."
          )
        );
      }
    }
  }
  sections.push(bulletQuality);

  // 5. Education (10 points)
  const edu = {
    title: tStr("Education", "المؤهل الدراسي والتعليم"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (education.length > 0) {
    edu.score += 10;
    edu.goodPoints.push(tStr("Education section is complete.", "قسم المؤهل الدراسي مضاف ومكتمل."));
  } else {
    edu.improvements.push(tStr("Add your educational background.", "يرجى إضافة مؤهلك الدراسي أو جامعتك وتاريخ التخرج."));
  }
  sections.push(edu);

  // 6. Skills Section (15 points)
  const skillsSection = {
    title: tStr("Skills Section", "قسم المهارات"),
    score: 0,
    maxScore: 15,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (skills.length > 0) {
    if (skills.length >= 8) {
      skillsSection.score += 5;
      skillsSection.goodPoints.push(tStr("Good number of skills listed.", "عدد ممتاز ومتنوع من المهارات المضافة."));
    } else {
      skillsSection.improvements.push(
        tStr("Add more relevant skills (aim for 8-12).", "أضف المزيد من المهارات ذات الصلة بمجال عملك (ننصح بـ 8 إلى 12 مهارة).")
      );
    }

    let softSkillCount = 0;
    skills.forEach((skill) => {
      if (SOFT_SKILLS.has(skill.toLowerCase())) softSkillCount++;
    });

    const hardSkillCount = skills.length - softSkillCount;

    if (softSkillCount > 0 && hardSkillCount > 0) {
      skillsSection.score += 10;
      skillsSection.goodPoints.push(
        tStr("Balanced mix of technical and soft skills.", "مزيج متوازن واحترافي بين المهارات التقنية والشخصية.")
      );
    } else if (hardSkillCount === 0) {
      skillsSection.improvements.push(
        tStr("Add technical (hard) skills specific to your role.", "أضف مهارات تقنية متخصصة تبرز جدارتك العملية لمجال تخصصك.")
      );
    } else {
      skillsSection.improvements.push(
        tStr("Add some soft skills (e.g., 'Leadership', 'Communication').", "أضف بعض المهارات الشخصية الهامة مثل العمل الجماعي وحل المشكلات أو القيادة.")
      );
    }
  } else {
    skillsSection.improvements.push(
      tStr("Add a skills section to highlight your expertise.", "أضف قسم مهارات مخصص لتوضيح أدواتك وخبراتك للمراجعين والأنظمة الآلية.")
    );
  }
  sections.push(skillsSection);

  // 7. Projects (10 points max)
  const projSection = {
    title: tStr("Projects", "المشاريع والإنجازات العملية"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (projects.length > 0) {
    projSection.score += 10;
    projSection.goodPoints.push(tStr("Projects section included.", "قسم المشاريع العملية مضاف بنجاح."));
  } else if (experience.length >= 2) {
    // Senior/Professional Compensation rule
    projSection.score += 8;
    projSection.goodPoints.push(tStr("Projects score compensated by extensive professional employment history.", "تم استكمال تقييم المشاريع تلقائياً نظراً لعمق وسنوات خبرتك المهنية الطويلة المضافة."));
  } else {
    projSection.improvements.push(
      tStr("Add key projects or case studies to demonstrate hands-on application of your skills.", "أضف مشاريعك البارزة أو دراسات حالة تثبت تطبيقك العملي لمهاراتك في مواقف حقيقية.")
    );
  }
  sections.push(projSection);

  // 8. Certifications (5 points)
  const certSection = {
    title: tStr("Certifications", "الشهادات والاعتمادات"),
    score: 0,
    maxScore: 5,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (certifications.length > 0) {
    certSection.score += 5;
    certSection.goodPoints.push(tStr("Certifications included.", "الشهادات والاعتمادات مضافة بنجاح."));
  } else {
    certSection.improvements.push(
      tStr("Add relevant certifications to boost credibility.", "أضف شهادات مهنية أو دورات معتمدة لرفع مستوى الثقة بك ومهاراتك.")
    );
  }
  sections.push(certSection);

  // 9. Formatting (10 points)
  const formatting = {
    title: tStr("Formatting", "التنسيق والمظهر العام"),
    score: 0,
    maxScore: 10,
    goodPoints: [] as string[],
    improvements: [] as string[],
  };
  if (settings.template === "creative") {
    formatting.score += 5;
    formatting.improvements.push(
      tStr("Consider a more standard template like 'Modern' for better ATS parsing.", "ننصح باستخدام قوالب كلاسيكية أو 'Modern' لضمان قراءة مثالية وخالية من الأخطاء الآلية.")
    );
  } else {
    formatting.score += 10;
    formatting.goodPoints.push(tStr("Clean, ATS-friendly template structure.", "قالب السيرة الذاتية متناسق ومنظم ويسهل قراءته آلياً بنسبة %100."));
  }
  sections.push(formatting);

  // 10. Job Match (Bonus/Context)
  if (data.jobDescription) {
    const jobMatch = {
      title: tStr("Job Match", "التطابق مع الوصف الوظيفي"),
      score: 0,
      maxScore: 0,
      goodPoints: [] as string[],
      improvements: [] as string[],
    };
    const matchResults = getJobMatchResults(data);
    if (matchResults) {
      if (matchResults.missing.length > 0) {
        jobMatch.improvements.push(
          tStr(
            `Missing keywords: ${matchResults.missing.slice(0, 5).join(", ")}`,
            `الكلمات المفتاحية المفقودة من الوصف: ${matchResults.missing.slice(0, 5).join(", ")}`
          )
        );
      } else {
        jobMatch.goodPoints.push(tStr("All top keywords from JD are present.", "جميع الكلمات المفتاحية الرئيسية من الوصف الوظيفي مضافة ومكتملة."));
      }
      sections.push(jobMatch);
    }
  }

  // Calculate overall score
  const totalScore = sections.reduce((acc, s) => acc + s.score, 0);

  // Extract all improvements as tips
  const tips = sections.flatMap((s) => s.improvements);
  
  // Critical failures (e.g. score < 5 in important sections)
  const criticalFailures = sections
    .filter(s => s.score < (s.maxScore * 0.4) && (s.title === "Contact Info" || s.title === "Experience Formatting" || s.title === "معلومات الاتصال" || s.title === "تنسيق الخبرات المهنية"))
    .map(s => s.title);

  return {
    score: Math.round(Math.min(100, Math.max(0, totalScore))),
    sections: sections || [],
    tips: (tips || []).filter(t => typeof t === 'string'),
    criticalFailures: (criticalFailures || []).filter(cf => typeof cf === 'string'),
  };
}
