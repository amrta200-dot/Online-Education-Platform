// ==========================================================================
// بيانات وهمية — سيتم استبدالها ببيانات حقيقية من الـ API لاحقًا.
// ==========================================================================

export const teachers = [
  {
    id: 1,
    name: " الأستاذ : أنس أسامة",
    subject:  "مدرسة اللغة العربية",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGKOxhMCQ9E9xACvW5nqSZ8GI7UAZMWwy1WXSubQS-Jw&s=10"
  },
  // {
  //   id: 2,
  //   name: "منى عادل",
  //   subject: "مدرسة اللغة العربية",
  //   image:
  //     "https://images.unsplash.com/photo-1580489944761-1b1cdb0e1e0b?q=80&w=400&auto=format&fit=crop",
  // },
  // {
  //   id: 3,
  //   name: "يوسف إبراهيم",
  //   subject: "مدرس الحاسب الآلي",
  //   image:
  //     "https://images.unsplash.com/photo-1610631066894-62452ccb927c?q=80&w=400&auto=format&fit=crop",
  // },
  // {
  //   id: 4,
  //   name: "ليلى حسن",
  //   subject: "مدرسة الفيزياء",
  //   image:
  //     "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  // },
  // {
  //   id: 5,
  //   name: "عمر خالد",
  //   subject: "مدرس الكيمياء",
  //   image:
  //     "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  // },
  // {
  //   id: 6,
  //   name: "نور السيد",
  //   subject: "مدرسة اللغة الإنجليزية",
  //   image:
  //     "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=400&auto=format&fit=crop",
  // },
];

// دروس كل مدرس — مرتبطة عبر teacherId
export const lessons = [
  {
    id: 1,
    teacherId: 1,
    title: "شرح الوحدة الأولى",
    date: "السبت",
    time: "7:00 مساءً",
    status: "قادم",
  },
  {
    id: 2,
    teacherId: 1,
    title: "تمارين الوحدة الأولي",
    date: "الإثنين",
    time: "5:30 مساءً",
    status: "قادم",
  },
  {
    id: 3,
    teacherId: 1,
    title: "مراجعة الوحدة الأولي",
    date: "الأربعاء",
    time: "6:00 مساءً",
    status: "قادم",
  },
  // {
  //   id: 4,
  //   teacherId: 2,
  //   title: "قواعد النحو - الدرس الثاني",
  //   date: "الأحد",
  //   time: "4:00 عصرًا",
  //   status: "قادم",
  // },
  // {
  //   id: 5,
  //   teacherId: 2,
  //   title: "تحليل نص أدبي",
  //   date: "الثلاثاء",
  //   time: "6:30 مساءً",
  //   status: "قادم",
  // },
  // {
  //   id: 6,
  //   teacherId: 3,
  //   title: "مقدمة في البرمجة",
  //   date: "السبت",
  //   time: "8:00 مساءً",
  //   status: "قادم",
  // },
  // {
  //   id: 7,
  //   teacherId: 3,
  //   title: "بناء أول موقع ويب",
  //   date: "الخميس",
  //   time: "7:00 مساءً",
  //   status: "قادم",
  // },
];
export const aboutPoints = [
  {
    id: 1,
    icon: "fa-laptop",
    title: "دروس أونلاين",
    description: "احضر دروسك أونلاين من أي مكان وفي أي وقت يناسبك.",
  },
  {
    id: 2,
    icon: "fa-chalkboard-user",
    title: "مع مدرسك",
    description: "تابع دروسك مع مدرسك واستفد من شرح واضح ومتابعة مستمرة.",
  },
  {
    id: 3,
    icon: "fa-face-smile",
    title: "تجربة تعليمية سهلة",
    description: "منصة بسيطة وواضحة مصممة لتناسب الطلاب.",
  },
];
export const howItWorksSteps = [
  {
    id: 1,
    number: "١",
    icon: "fa-user-plus",
    title: "أنشئ حسابك",
    description: "أنشئ حسابك بسهولة وابدأ استخدام منصة فصلي.",
  },
  {
    id: 2,
    number: "٢",
    icon: "fa-chalkboard-user",
    title: "تعرف على مدرسك",
    description: "تعرف على مدرس المنصة واستكشف الدروس المتاحة.",
  },
  {
    id: 3,
    number: "٣",
    icon: "fa-calendar-check",
    title: "تابع مواعيد دروسك",
    description: "شاهد مواعيد الدروس القادمة وتابع جدولك بسهولة.",
  },
  {
    id: 4,
    number: "٤",
    icon: "fa-video",
    title: "ادخل إلى الدرس",
    description: "انضم إلى الدرس مباشرة عند حلول موعده وابدأ التعلم.",
  },
];
