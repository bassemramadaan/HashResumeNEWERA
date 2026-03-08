export interface BlogPost {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  excerpt: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  date: string;
  author: {
    en: string;
    ar: string;
  };
  image: string;
  readTime: {
    en: string;
    ar: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 'how-to-write-ats-cv',
    title: {
      en: "How to Write a CV That Beats the ATS",
      ar: "كيف تكتب سيرة ذاتية يقبلها نظام ATS"
    },
    excerpt: {
      en: "75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Here's how to ensure yours makes the cut.",
      ar: "يتم رفض 75% من السير الذاتية بواسطة أنظمة تتبع المتقدمين قبل أن يراها أي شخص. إليك كيفية ضمان قبول سيرتك الذاتية."
    },
    content: {
      en: `
## What is an ATS?

An Applicant Tracking System (ATS) is software used by employers to manage the hiring process. It scans resumes for keywords, skills, and experience to filter out unqualified candidates. If your resume isn't formatted correctly, it might be rejected instantly—even if you're perfect for the job.

## 1. Use a Clean, Standard Format

ATS software struggles with complex layouts. Avoid:
*   Columns (unless simple 2-column layouts)
*   Tables
*   Graphics, images, or charts
*   Headers and footers (sometimes ignored)

**Best Practice:** Stick to a clean, single-column or simple two-column layout. Use standard fonts like Arial, Calibri, or Roboto.

## 2. Use Standard Section Headings

Don't get creative with headings. The ATS looks for specific terms.
*   **Use:** "Experience", "Work History", "Education", "Skills"
*   **Avoid:** "My Journey", "Where I've Been", "Knowledge Base"

## 3. Incorporate Keywords from the Job Description

Read the job description carefully. If they ask for "Project Management" and "Agile", make sure those exact words appear in your resume.

> **Tip:** Don't "keyword stuff" (listing keywords randomly). Weave them naturally into your bullet points.

## 4. Save as PDF or DOCX

While PDF is best for preserving formatting, make sure it's text-selectable. If you can't highlight the text in your PDF, the ATS can't read it. Hash Resume exports are always ATS-friendly PDFs.

## 5. Focus on Achievements, Not Just Duties

Instead of listing what you did, list what you achieved. Use numbers and percentages.
*   *Bad:* "Managed sales team."
*   *Good:* "Led a team of 5 sales representatives, increasing revenue by 20% in Q3."

## Conclusion

Writing for an ATS doesn't mean writing like a robot. It means structuring your human achievements in a way that machines can understand. Use Hash Resume's **ATS Audit** feature to check your score in real-time!
      `,
      ar: `
## ما هو نظام ATS؟

نظام تتبع المتقدمين (ATS) هو برنامج يستخدمه أصحاب العمل لإدارة عملية التوظيف. يقوم بمسح السير الذاتية بحثًا عن الكلمات المفتاحية والمهارات والخبرات لتصفية المرشحين غير المؤهلين. إذا لم يتم تنسيق سيرتك الذاتية بشكل صحيح، فقد يتم رفضها فورًا — حتى لو كنت مثاليًا للوظيفة.

## 1. استخدم تنسيقًا بسيطًا وقياسيًا

تواجه برامج ATS صعوبة مع التخطيطات المعقدة. تجنب:
*   الأعمدة (إلا إذا كانت تخطيطات بسيطة من عمودين)
*   الجداول
*   الرسومات أو الصور أو المخططات البيانية
*   الرؤوس والتذييلات (يتم تجاهلها أحيانًا)

**أفضل ممارسة:** التزم بتخطيط نظيف بعمود واحد أو عمودين بسيطين. استخدم خطوطًا قياسية مثل Arial أو Calibri أو Roboto.

## 2. استخدم عناوين أقسام قياسية

لا تكن مبدعًا في العناوين. يبحث ATS عن مصطلحات محددة.
*   **استخدم:** "الخبرة" (Experience)، "التعليم" (Education)، "المهارات" (Skills)
*   **تجنب:** "رحلتي"، "أين كنت"، "قاعدة المعرفة"

## 3. قم بتضمين الكلمات المفتاحية من الوصف الوظيفي

اقرأ الوصف الوظيفي بعناية. إذا طلبوا "إدارة المشاريع" و "Agile"، فتأكد من ظهور هذه الكلمات بالضبط في سيرتك الذاتية.

> **نصيحة:** لا تقم "بحشو الكلمات المفتاحية" (سرد الكلمات المفتاحية عشوائيًا). ادمجها بشكل طبيعي في نقاطك.

## 4. احفظ الملف بصيغة PDF أو DOCX

بينما يعد PDF الأفضل للحفاظ على التنسيق، تأكد من أن النص قابل للتحديد. إذا لم تتمكن من تظليل النص في ملف PDF الخاص بك، فلن يتمكن ATS من قراءته. تصديرات Hash Resume دائمًا ما تكون ملفات PDF متوافقة مع ATS.

## 5. ركز على الإنجازات، وليس فقط الواجبات

بدلاً من سرد ما فعلته، اذكر ما حققته. استخدم الأرقام والنسب المئوية.
*   *سيء:* "أدرت فريق المبيعات."
*   *جيد:* "قدت فريقًا مكونًا من 5 ممثلي مبيعات، مما زاد الإيرادات بنسبة 20% في الربع الثالث."

## الخاتمة

الكتابة لنظام ATS لا تعني الكتابة مثل الروبوت. إنها تعني هيكلة إنجازاتك البشرية بطريقة يمكن للآلات فهمها. استخدم ميزة **تدقيق ATS** في Hash Resume للتحقق من درجاتك في الوقت الفعلي!
      `
    },
    date: "2026-03-05",
    author: {
      en: "Hash Resume Team",
      ar: "فريق Hash Resume"
    },
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    readTime: {
      en: "5 min read",
      ar: "5 دقائق قراءة"
    }
  },
  {
    id: 'top-skills-2026',
    title: {
      en: "Top Skills Employers Are Looking For in 2026",
      ar: "أهم المهارات التي يبحث عنها أصحاب العمل في 2026"
    },
    excerpt: {
      en: "From AI literacy to emotional intelligence, discover the skills that will make your resume stand out this year.",
      ar: "من محو الأمية في الذكاء الاصطناعي إلى الذكاء العاطفي، اكتشف المهارات التي ستجعل سيرتك الذاتية تبرز هذا العام."
    },
    content: {
      en: `
## The Skill Shift in 2026

The job market is evolving rapidly. Automation and AI are changing the way we work, and employers are looking for candidates who can adapt.

## 1. AI Literacy
Understanding how to work *with* AI, not just against it, is crucial. You don't need to be a developer, but knowing how to prompt, verify, and leverage AI tools is a must-have skill.

## 2. Emotional Intelligence (EQ)
As machines handle more logic tasks, human connection becomes more valuable. Empathy, conflict resolution, and leadership are skills that AI cannot replicate.

## 3. Data Analysis
Data is everywhere. The ability to interpret data and make decisions based on it is required in almost every role, from marketing to HR.

## 4. Adaptability
The only constant is change. Show examples of how you've learned new tools or pivoted strategies in your resume.
      `,
      ar: `
## تحول المهارات في 2026

سوق العمل يتطور بسرعة. الأتمتة والذكاء الاصطناعي يغيران طريقة عملنا، ويبحث أصحاب العمل عن مرشحين يمكنهم التكيف.

## 1. محو الأمية في الذكاء الاصطناعي
فهم كيفية العمل *مع* الذكاء الاصطناعي، وليس ضده فقط، أمر بالغ الأهمية. لا تحتاج إلى أن تكون مطورًا، ولكن معرفة كيفية التوجيه والتحقق والاستفادة من أدوات الذكاء الاصطناعي هي مهارة ضرورية.

## 2. الذكاء العاطفي (EQ)
مع تولي الآلات المزيد من المهام المنطقية، يصبح الاتصال البشري أكثر قيمة. التعاطف وحل النزاعات والقيادة هي مهارات لا يمكن للذكاء الاصطناعي تكرارها.

## 3. تحليل البيانات
البيانات موجودة في كل مكان. القدرة على تفسير البيانات واتخاذ القرارات بناءً عليها مطلوبة في كل دور تقريبًا، من التسويق إلى الموارد البشرية.

## 4. القدرة على التكيف
الثابت الوحيد هو التغيير. اعرض أمثلة على كيفية تعلمك لأدوات جديدة أو تغيير الاستراتيجيات في سيرتك الذاتية.
      `
    },
    date: "2026-03-01",
    author: {
      en: "Sarah Johnson",
      ar: "سارة جونسون"
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    readTime: {
      en: "4 min read",
      ar: "4 دقائق قراءة"
    }
  },
  {
    id: 'cover-letter-guide',
    title: {
      en: "Do You Still Need a Cover Letter?",
      ar: "هل ما زلت بحاجة إلى خطاب تقديم؟"
    },
    excerpt: {
      en: "The short answer is yes. The long answer involves knowing when specifically it can make or break your application.",
      ar: "الإجابة القصيرة هي نعم. الإجابة الطويلة تتضمن معرفة متى بالتحديد يمكن أن ينجح طلبك أو يفشله."
    },
    content: {
      en: `
## The Debate
Many recruiters say they don't read cover letters. However, hiring managers often do—especially for competitive roles.

## When is it Mandatory?
*   **When the job description asks for it.** Ignoring this instruction shows a lack of attention to detail.
*   **When you're referring to a connection.** Use the cover letter to mention who referred you.
*   **When you're changing careers.** Your resume shows *what* you did; your cover letter explains *why* you're switching and how your skills transfer.

## How to Write a Modern Cover Letter
Keep it short. Three paragraphs max. Focus on the company's problems and how you can solve them.
      `,
      ar: `
## الجدل
يقول العديد من مسؤولي التوظيف إنهم لا يقرؤون خطابات التقديم. ومع ذلك، غالبًا ما يفعل مديرو التوظيف ذلك — خاصةً للأدوار التنافسية.

## متى يكون إلزاميًا؟
*   **عندما يطلب الوصف الوظيفي ذلك.** تجاهل هذه التعليمات يظهر نقصًا في الاهتمام بالتفاصيل.
*   **عندما تشير إلى اتصال.** استخدم خطاب التقديم لذكر من أحالك.
*   **عندما تغير مهنتك.** تظهر سيرتك الذاتية *ما* فعلته؛ يشرح خطاب التقديم *لماذا* تقوم بالتبديل وكيف تنتقل مهاراتك.

## كيفية كتابة خطاب تقديم حديث
اجعله قصيرًا. ثلاث فقرات كحد أقصى. ركز على مشاكل الشركة وكيف يمكنك حلها.
      `
    },
    date: "2026-02-28",
    author: {
      en: "Omar Khaled",
      ar: "عمر خالد"
    },
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800",
    readTime: {
      en: "3 min read",
      ar: "3 دقائق قراءة"
    }
  }
];
