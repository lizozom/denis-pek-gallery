import { Locale } from './i18n';

export const translations = {
  en: {
    siteTitle: 'Denis Pekerman',
    metaDescription: 'Professional architectural photographer in Israel specializing in stunning architectural designs, interior spaces, and real estate photography. Serving Tel Aviv and across Israel.',
    metaKeywords: 'architectural photographer Israel, architectural photography Tel Aviv, interior photography, real estate photography Israel, commercial photography, building photography, architecture photographer, professional architectural photos, Denis Pekerman photographer',
    nav: {
      home: 'HOME',
      about: 'ABOUT',
      contact: 'CONTACT',
    },
    footer: {
      copyright: 'All rights reserved.',
    },
    loading: 'Loading more...',
    photo: {
      backToGallery: 'Back to Gallery',
      details: 'Details',
      category: 'Category',
      photographer: 'Photographer',
      moreFrom: 'More from',
      notFoundTitle: 'Photo Not Found',
      notFoundDescription: "Sorry, we couldn't find the photo you're looking for.",
    },
    about: {
      title: 'About',
      bio: "I don't look at buildings as mere architecture. I see them as shapes and patterns. Since I was a kid, I've been fascinated by the moment reality breaks down after staring at an occasional pattern on a building for too long.\n\nMy work captures that specific optical illusion. By stripping away the context of the street and the sky, I isolate the rhythm of the illusion until it becomes the soul of the frame. I use tight crops, rotations, and shifts in perspective to create disorientation, yet I never remove the anchor to reality entirely. I want the viewer to lose their balance for a second, letting the mind switch between illusion and reality.\n\nMy photos are not architectural photography. They are records of how my mind processes the urban environment.",
    },
    contact: {
      title: 'Get in Touch',
    },
  },
  he: {
    siteTitle: 'דניס פקרמן',
    metaDescription: 'צלם אדריכלות מקצועי בישראל המתמחה בצילום עיצובים אדריכליים מרהיבים, צילום פנים וצילום נדלן. משרת את תל אביב וכל רחבי ישראל.',
    metaKeywords: 'צלם אדריכלות ישראל, צילום אדריכלות תל אביב, צילום פנים, צילום נדלן ישראל, צילום מסחרי, צילום בניינים, צלם אדריכלות מקצועי, דניס פקרמן צלם, צילום אדריכלי מקצועי',
    nav: {
      home: 'בית',
      about: 'אודות',
      contact: 'צור קשר',
    },
    footer: {
      copyright: 'כל הזכויות שמורות.',
    },
    loading: 'טוען עוד...',
    photo: {
      backToGallery: 'חזרה לגלריה',
      details: 'פרטים',
      category: 'קטגוריה',
      photographer: 'צלם',
      moreFrom: 'עוד מ',
      notFoundTitle: 'התמונה לא נמצאה',
      notFoundDescription: 'מצטערים, לא הצלחנו למצוא את התמונה שאתה מחפש.',
    },
    about: {
      title: 'אודות',
      bio: 'אני מתייחס לאדריכלות כאל חומר גלם של צורות ודפוסים חוזרים\n\nמאז שהייתי ילד, סקרן אותי הרגע שבו המציאות משתנה כשבוהים זמן רב מדי במבנה בעל דפוס קבוע. העבודה שלי מנסה ללכוד בדיוק את האשליה האופטית הזו. על ידי הסרת הסביבה סביב המבנה, אני מבודד את האשליה ונותן לה לעמוד בפני עצמה. אני מוותר על כל מה שקושר את הבניין למיקום ספציפי כדי שהתבנית עצמה תהפוך לנושא התמונה\n\nעל ידי שימוש בקרופים מדויקים ובמשחקי זוויות אני שואף לערער את האוריינטציה של הצופה, אבל אני אף פעם לא מנתק את הקשר למציאות לגמרי. אני רוצה שהצופה יאבד את שיווי המשקל לרגע, ושהמוח יתחיל לנוע בין המבנה המוחשי לבין הצורה המופשטת\n\nהצילומים שלי הם לא צילומי אדריכלות סטנדרטיים. הם תיעוד של האופן שבו אני תופס ומעבד את הסביבה העירונית',
    },
    contact: {
      title: 'צור קשר',
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}
