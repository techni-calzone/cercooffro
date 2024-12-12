type SupportedLanguages = 'en' | 'it';

interface LocalizedLinks {
  en: string;
  it: string;
}

interface ExternalLinks {
  FEEDBACK: {
    GENERAL_FEEDBACK: LocalizedLinks;
    REPORT_BUG: {
      DEFAULT: string;
    };
  };
  SOCIAL_MEDIA: {
    GITHUB: string;
    TELEGRAM: string;
  };
}

export const EXTERNAL_LINKS: ExternalLinks = {
  FEEDBACK: {
    GENERAL_FEEDBACK: {
      en: "https://forms.gle/aR82pJpHYY71joZ96",
      it: "https://forms.gle/aR82pJpHYY71joZ96"
    },
    REPORT_BUG: {
      DEFAULT: "https://github.com/techni-calzone/cercooffro/issues/new"
    }
  },
  SOCIAL_MEDIA: {
    GITHUB: "https://github.com/CercoOffro/student-rental-aggregator",
    TELEGRAM: "https://t.me/cercooffro"
  }
};

export type { SupportedLanguages };
