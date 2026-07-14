export interface TemplateData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    link: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
}

export const ROLE_TEMPLATES: Record<string, Record<"ar" | "en", TemplateData>> = {
  developer: {
    ar: {
      fullName: "أحمد محمود علي",
      jobTitle: "مهندس برمجيات أول (Full-Stack)",
      email: "ahmed.mahmoud@example.com",
      phone: "+966 50 123 4567",
      address: "الرياض، المملكة العربية السعودية",
      linkedin: "linkedin.com/in/ahmed-mahmoud",
      github: "github.com/ahmed-dev",
      portfolio: "ahmed.dev",
      summary: "مهندس برمجيات أول بخبرة تزيد عن 6 سنوات في تطوير تطبيقات الويب المتكاملة ومواقع التجارة الإلكترونية عالية الأداء. متخصص في تقنيات React و Node.js و TypeScript مع مهارة استثنائية في تصميم قواعد البيانات ورفع كفاءة محركات البحث وتحسين سرعة استجابة الخوادم بنسبة 40%.",
      experience: [
        {
          company: "شركة الحلول الرقمية المتقدمة",
          position: "مطور برمجيات أول",
          startDate: "2022-01",
          endDate: "الحاضر",
          description: "• قيادة فريق مكون من 5 مطورين لبناء منصة تجارة إلكترونية متكاملة تخدم أكثر من 100 ألف مستخدم نشط شهرياً.\n• إعادة هيكلة الواجهات الأمامية باستخدام Next.js وتطبيق تحسينات على تجربة المستخدم (SEO) مما أدى إلى زيادة حركة المرور العضوية بنسبة 35%.\n• تحسين استعلامات قاعدة البيانات واستخدام Redis للتخزين المؤقت، مما قلل وقت تحميل الصفحات من 2.4 ثانية إلى 0.8 ثانية."
        },
        {
          company: "مؤسسة التقنية الذكية",
          position: "مطور ويب (Full-Stack)",
          startDate: "2019-06",
          endDate: "2021-12",
          description: "• تطوير وصيانة أكثر من 15 تطبيق ويب لعملاء من مختلف القطاعات الحكومية والخاصة باستخدام React و Express.\n• تصميم وتنفيذ واجهات برمجية RESTful APIs آمنة وربطها مع بوابات دفع إلكترونية متعددة (Stripe, PayTabs).\n• تقليل الأخطاء البرمجية في الإنتاج بنسبة 25% من خلال إدخال اختبارات الوحدة الآلية (Jest) في بيئة العمل."
        }
      ],
      education: [
        {
          institution: "جامعة الملك سعود",
          degree: "بكالوريوس علوم الحاسب الآلي",
          startDate: "2015-09",
          endDate: "2019-05",
          description: "تخرجت بمرتبة الشرف الأولى. التركيز على هندسة البرمجيات، تراكيب البيانات، والذكاء الاصطناعي."
        }
      ],
      skills: ["React.js", "Next.js", "Node.js", "TypeScript", "JavaScript", "PostgreSQL", "MongoDB", "RESTful APIs", "Git & GitHub", "Docker", "AWS", "Agile/Scrum"],
      projects: [
        {
          name: "منصة حجز المواعيد الطبية",
          description: "نظام حجوزات فوري تفاعلي يدعم الإشعارات اللحظية عبر الرسائل القصيرة وإدارة مرنة للأطباء والمرضى بجدول زمني ذكي.",
          link: "github.com/ahmed-dev/med-booking"
        },
        {
          name: "لوحة تحكم إحصائية متقدمة",
          description: "لوحة تحكم تفاعلية لعرض بيانات المبيعات والمخزون بشكل فوري باستخدام الرسوم البيانية المتجاوبة مع فلترة ذكية متعددة المعايير.",
          link: "dashboard.ahmed.dev"
        }
      ],
      certifications: [
        {
          name: "مطور حلول معتمد من AWS (Associate)",
          issuer: "Amazon Web Services",
          date: "2023-08"
        },
        {
          name: "شهادة مطور React الاحترافية",
          issuer: "Meta (Coursera)",
          date: "2021-04"
        }
      ]
    },
    en: {
      fullName: "Alexander Wright",
      jobTitle: "Senior Full-Stack Engineer",
      email: "alexander.wright@example.com",
      phone: "+1 (555) 019-2834",
      address: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexander-wright",
      github: "github.com/alexwright-dev",
      portfolio: "alexwright.dev",
      summary: "Results-driven Senior Software Engineer with over 6 years of experience designing, building, and deploying highly scalable web applications. Expert in React, TypeScript, Node.js, and cloud architecture (AWS). Proven track record of optimizing database queries and frontend performance to reduce page load speeds by 40% and scale systems for millions of requests.",
      experience: [
        {
          company: "CloudScale Technologies",
          position: "Lead Software Developer",
          startDate: "2022-03",
          endDate: "Present",
          description: "• Directed a cross-functional agile team of 6 engineers to build a SaaS analytics dashboard handling 20M+ daily events.\n• Architected a modular frontend using React and Next.js, boosting Core Web Vitals score by 35% and improving SEO traffic.\n• Designed and implemented secure Node.js microservices with Redis caching, resulting in a 50% drop in API response latency."
        },
        {
          company: "Aura Creative Studio",
          position: "Full-Stack Software Engineer",
          startDate: "2019-08",
          endDate: "2022-02",
          description: "• Developed, optimized, and maintained responsive custom web platforms using PostgreSQL, Express, and React.\n• Streamlined CI/CD deployment pipelines using GitHub Actions and AWS ECS, cutting production release cycles from days to hours.\n• Implemented robust unit and integration testing suites with Jest/Cypress, reducing critical post-release bugs by 28%."
        }
      ],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science in Computer Science",
          startDate: "2015-09",
          endDate: "2019-05",
          description: "Graduated with Honors. Specialization in Distributed Systems, Computer Networks, and Human-Computer Interaction."
        }
      ],
      skills: ["React.js", "Next.js", "Node.js", "TypeScript", "JavaScript", "PostgreSQL", "MongoDB", "GraphQL", "Docker", "Amazon Web Services (AWS)", "CI/CD", "Tailwind CSS"],
      projects: [
        {
          name: "SaaS Multi-tenant E-Commerce",
          description: "A fast, fully-featured, serverless shopping platform utilizing Stripe Connect, real-time inventory management, and tailored admin dashboards.",
          link: "github.com/alexwright-dev/saas-ecommerce"
        },
        {
          name: "CollabTask Canvas",
          description: "Interactive real-time Kanban board workspace with drag-and-drop mechanics, nested task trackers, and live WebSocket sync.",
          link: "collabtask.alexwright.dev"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          date: "2023-11"
        },
        {
          name: "Professional Scrum Master (PSM I)",
          issuer: "Scrum.org",
          date: "2021-06"
        }
      ]
    }
  },
  accountant: {
    ar: {
      fullName: "خالد عبد الرحمن الحربي",
      jobTitle: "رئيس حسابات / محلل مالي معتمد",
      email: "khaled.alharbi@example.com",
      phone: "+966 55 987 6543",
      address: "جدة، المملكة العربية السعودية",
      linkedin: "linkedin.com/in/khaled-alharbi-cpa",
      github: "",
      portfolio: "",
      summary: "رئيس حسابات ومحلل مالي ذو خبرة تزيد عن 8 سنوات في الإدارة المالية، وتدقيق الحسابات، وإعداد الميزانيات التقديرية للشركات المتوسطة والكبيرة. بارع في استخدام البرمجيات المالية ERP (مثل SAP, Odoo)، وتحسين التدفق النقدي بنسبة 15% وتوفير التكاليف غير الضرورية من خلال تحليلات التكلفة الدقيقة.",
      experience: [
        {
          company: "مجموعة النهدي التجارية",
          position: "رئيس حسابات",
          startDate: "2021-03",
          endDate: "الحاضر",
          description: "• الإشراف على إعداد القوائم المالية الشهرية والسنوية والتدفقات النقدية وفقاً للمعايير الدولية لإعداد التقارير المالية (IFRS).\n• قيادة فريق محاسبي من 4 أفراد وتدقيق المعاملات اليومية وضمان دقتها بنسبة 99.9%.\n• تطوير نموذج ميزانية تقديرية جديد قلل من الانحرافات بين الفعلي والمخطط بنسبة 12% ووفر 50 ألف دولار سنوياً."
        },
        {
          company: "مكتب المحاسبون المتحدون للاستشارات",
          position: "محاسب قانوني أول",
          startDate: "2017-01",
          endDate: "2021-02",
          description: "• مراجعة الحسابات والملفات الضريبية لأكثر من 25 عميلاً تجارياً، وضمان الالتزام الكامل بأنظمة هيئة الزكاة والضريبة والجمارك.\n• تقديم توصيات استراتيجية للعملاء لإعادة هيكلة الديون مما ساعد في تحسين ملاءتهم المالية الإجمالية.\n• أتمتة إعداد كشوف المرتبات الشهرية باستخدام حلول ERP المتخصصة، مما وفر 10 ساعات عمل أسبوعياً."
        }
      ],
      education: [
        {
          institution: "جامعة الملك عبد العزيز",
          degree: "بكالوريوس محاسبة وتمويل",
          startDate: "2012-09",
          endDate: "2016-06",
          description: "تخرجت بتقدير ممتاز مع مرتبة الشرف الثانية. متميز في محاسبة التكاليف والمحاسبة الضريبية."
        }
      ],
      skills: ["المعايير الدولية (IFRS)", "نظام SAP المالي", "تحليل القوائم المالية", "التدقيق والمراجعة الداخلية", "ضريبة القيمة المضافة والزكاة", "Odoo ERP", "التخطيط والموازنة", "مايكروسوفت إكسل المتقدم", "إدارة التدفقات النقدية"],
      projects: [
        {
          name: "إعادة هيكلة الدورة المحاسبية للمستودعات",
          description: "مشروع متكامل لإعادة تنظيم عمليات جرد المخزون والربط المحاسبي التلقائي، مما قلل نسبة الفاقد في الجرد بنسبة 18%.",
          link: ""
        }
      ],
      certifications: [
        {
          name: "زمالة الهيئة السعودية للمراجعين والمحاسبين (SOCPA)",
          issuer: "الهيئة السعودية للمحاسبين",
          date: "2022-05"
        },
        {
          name: "المحاسب القانوني المعتمد (CPA)",
          issuer: "معهد المحاسبين القانونيين الأمريكيين",
          date: "2019-10"
        }
      ]
    },
    en: {
      fullName: "Sarah Elizabeth Jenkins",
      jobTitle: "Senior Accountant & Financial Analyst",
      email: "sarah.jenkins@example.com",
      phone: "+1 (415) 555-0148",
      address: "Boston, MA",
      linkedin: "linkedin.com/in/sarah-jenkins-cpa",
      github: "",
      portfolio: "",
      summary: "Certified Public Accountant (CPA) with 7+ years of experience managing complex financial accounts, preparing accurate tax declarations, and analyzing corporate budgets for multi-million dollar corporations. Expert in leveraging high-performance ERP software (SAP, NetSuite) to optimize general ledger reconciliation and identify redundant operational costs, saving an average of 14% annually.",
      experience: [
        {
          company: "Beacon Corporate Group",
          position: "Accounting Manager",
          startDate: "2021-05",
          endDate: "Present",
          description: "• Supervise the closing of monthly, quarterly, and annual accounts in strict compliance with US GAAP guidelines.\n• Manage a team of 3 accountants and coordinate with external auditors to complete reviews with zero compliance issues.\n• Re-designed the departmental expense reporting process, reducing reimbursement processing times by 35%."
        },
        {
          company: "Apex Accounting Services",
          position: "Senior Tax & Audit Associate",
          startDate: "2018-02",
          endDate: "2021-04",
          description: "• Conducted comprehensive audits and structured tax filings for over 30 corporate clients across retail and tech industries.\n• Implemented automated macros in Excel and customized ERP ledger tools, saving 80 hours of manual labor during year-end closing.\n• Identified $45,000 in unused tax credits for clients through thorough research of new federal and state guidelines."
        }
      ],
      education: [
        {
          institution: "Boston College",
          degree: "Bachelor of Science in Accounting & Finance",
          startDate: "2013-09",
          endDate: "2017-05",
          description: "Graduated Magna Cum Laude. Selected as 'Accounting Student of the Year' in 2017."
        }
      ],
      skills: ["US GAAP & IFRS", "SAP & NetSuite ERP", "Advanced Excel (VBA, Pivot)", "Corporate Budgeting", "General Ledger Audit", "Tax Compliance & Filings", "Cost Reduction Analysis", "Financial Statements Preparation", "Payroll Systems"],
      projects: [
        {
          name: "ERP Inventory Cost Alignment",
          description: "Spearheaded the physical and systemic reconciliation of raw stock valuations, correcting a 6% margin variance on high-value items.",
          link: ""
        }
      ],
      certifications: [
        {
          name: "Certified Public Accountant (CPA)",
          issuer: "AICPA",
          date: "2019-03"
        },
        {
          name: "Certified Management Accountant (CMA)",
          issuer: "IMA",
          date: "2022-07"
        }
      ]
    }
  },
  designer: {
    ar: {
      fullName: "ليلى يوسف العلي",
      jobTitle: "مصممة تجربة وواجهات مستخدم أولى (UI/UX)",
      email: "layla.yousef@example.com",
      phone: "+966 56 111 2222",
      address: "دبي، الإمارات العربية المتحدة",
      linkedin: "linkedin.com/in/layla-yousef-design",
      github: "",
      portfolio: "behance.net/layladesigns",
      summary: "مصممة واجهات وتجربة مستخدم (UI/UX) أولى بخبرة تزيد عن 5 سنوات في تحويل الأفكار المعقدة إلى واجهات رقمية مذهلة وبسيطة. ماهرة في إجراء بحوث المستخدمين، وبناء النماذج التفاعلية (Figma)، وتصميم أنظمة التصميم (Design Systems) المتكاملة التي تساهم في رفع نسب التحويل (Conversion Rate) بنسبة 25%.",
      experience: [
        {
          company: "بوابة المستقبل للتقنية",
          position: "رئيسة فريق التصميم (UI/UX)",
          startDate: "2022-05",
          endDate: "الحاضر",
          description: "• إدارة وتطوير الهوية البصرية والنماذج التفاعلية لتطبيقات الهاتف ومواقع الويب الخاصة بـ 4 منتجات برمجية رئيسية.\n• إنشاء نظام تصميم موحد (Design System) قلل زمن تطوير الواجهات الأمامية لدى المهندسين بنسبة 30% وضمن الاتساق الكامل.\n• إجراء اختبارات قابلية الاستخدام (Usability Testing) مع أكثر من 50 مستخدماً واقعياً، مما ساعد في إعادة صياغة رحلة الدفع ورفع المبيعات بنسبة 20%."
        },
        {
          company: "وكالة الإبداع الرقمي",
          position: "مصممة تجربة مستخدم",
          startDate: "2020-01",
          endDate: "2022-04",
          description: "• تصميم رحلات مستخدم وخرائط تعاطف ونماذج أولية سريعة (Wireframes) لـ 12 عميلاً في مجالات مختلفة مثل التعليم والتوصيل.\n• التعاون الوثيق مع مدراء المنتجات لكتابة متطلبات الاستخدام والمواصفات الفنية قبل مرحلة البرمجة.\n• زيادة التفاعل والاحتفاظ بالمستخدمين (Retention) بنسبة 15% من خلال إدخال لمسات تفاعلية دقيقة ورسوم متحركة مدروسة."
        }
      ],
      education: [
        {
          institution: "جامعة الشارقة",
          degree: "بكالوريوس تصميم جرافيكي ووسائط متعددة",
          startDate: "2015-09",
          endDate: "2019-06",
          description: "تخرجت بمرتبة الشرف الأولى. الفوز بجائزة أفضل مشروع تخرج إبداعي رقمي لعام 2019."
        }
      ],
      skills: ["تصميم واجهات Figma", "بحوث واختبارات المستخدمين", "هندسة المعلومات (Information Architecture)", "بناء أنظمة التصميم", "تطوير رحلة العميل (User Journeys)", "Adobe XD / Creative Suite", "تصميم الهويات البصرية", "النماذج الأولية التفاعلية", "الرسوم التفاعلية الدقيقة (Micro-interactions)"],
      projects: [
        {
          name: "إعادة تصميم تطبيق البنك الرقمي",
          description: "إعادة صياغة كاملة لتجربة التحويل المالي وإرسال الحوالات بالتطبيق، مما قلل عدد الخطوات من 6 إلى خطوتين وضاعف رضا العملاء.",
          link: "behance.net/gallery/digital-bank-redesign"
        },
        {
          name: "نظام التصميم 'واحة'",
          description: "نظام تصميم مفتوح وموثق بالكامل لدعم المصممين والمطورين في بناء منصات حكومية سريعة ومتناسقة تتماشى مع معايير الوصول العالمية.",
          link: "figma.com/@oasis-design-system"
        }
      ],
      certifications: [
        {
          name: "الشهادة الاحترافية لتصميم تجربة المستخدم من Google",
          issuer: "Google (Coursera)",
          date: "2021-08"
        },
        {
          name: "أخصائي بحوث تجربة المستخدم المعتمد",
          issuer: "Interaction Design Foundation",
          date: "2020-11"
        }
      ]
    },
    en: {
      fullName: "Maya Sophia Chen",
      jobTitle: "Senior Product & UI/UX Designer",
      email: "maya.chen@example.com",
      phone: "+1 (312) 555-0199",
      address: "Seattle, WA",
      linkedin: "linkedin.com/in/mayachen-designs",
      github: "",
      portfolio: "dribbble.com/mayachen",
      summary: "User-centric Senior Product Designer with 6+ years of experience leading UI/UX architectures for web and native mobile apps. Expert in crafting responsive design systems, structuring customer-first information layouts in Figma, and conducting user research tests to remove onboarding friction. Proven ability to boost SaaS signup conversion rates by 22% with elegant visual hierarchies.",
      experience: [
        {
          company: "Nexus Product Studios",
          position: "Lead UI/UX Designer",
          startDate: "2022-02",
          endDate: "Present",
          description: "• Head user experience strategies across 3 core cross-platform SaaS platforms used by 500k+ subscribers.\n• Designed and maintained an enterprise-level, highly accessible Design System in Figma, cutting frontend development time by 30%.\n• Pioneered automated interactive A/B testing and customer heatmaps review, improving checkout completion rates by 18%."
        },
        {
          company: "Vivid Digital Agency",
          position: "UI/UX Designer",
          startDate: "2019-07",
          endDate: "2022-01",
          description: "• Developed interactive wireframes, user flow diagrams, and pixel-perfect UI screens for 15+ clients across FinTech and Travel.\n• Facilitated brainstorming and design sprints with stakeholders to align design strategies with concrete business KPIs.\n• Created micro-interactions and smooth layout transitions that lifted app store ratings from 4.1 to 4.7 stars."
        }
      ],
      education: [
        {
          institution: "University of Washington",
          degree: "Bachelor of Design in Interaction Design",
          startDate: "2015-09",
          endDate: "2019-06",
          description: "Graduated with High Honors. Active Member of the IxDA Student Chapter."
        }
      ],
      skills: ["Figma Design", "User Research & Persona Mapping", "Information Architecture", "Enterprise Design Systems", "High-Fidelity Prototyping", "Adobe Creative Cloud", "SaaS Conversion Optimization", "A/B Testing", "Aesthetic Typography", "UX Copywriting"],
      projects: [
        {
          name: "Orbit Wallet Redesign",
          description: "Total visual overhaul of a multi-currency crypto wallet, simplifying asset transfers to a single tap and securing outstanding accessibility feedback.",
          link: "behance.net/orbit-wallet-ux"
        },
        {
          name: "Stellar Design System",
          description: "A publicly shared, WCAG-compliant responsive UI design tokens and component library for Figma, downloaded by 2k+ designers.",
          link: "figma.com/@stellar-components"
        }
      ],
      certifications: [
        {
          name: "Google UX Design Professional Certificate",
          issuer: "Google",
          date: "2021-05"
        },
        {
          name: "UX Certified Professional (UXC)",
          issuer: "Nielsen Norman Group (NN/g)",
          date: "2020-10"
        }
      ]
    }
  }
};
