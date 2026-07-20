/**
 * Site content for George Zerdalis.
 * Primary source: https://groverpro.com/artist/georgios-zerdalis
 * Secondary: local CV PDF + legacy src/main.js (email, venues, form labels).
 */

export type Cta = {
  label: string;
  href: string;
};

export type Appointment = {
  title: string;
  organization: string;
  location?: string;
  dates: string;
  bullets?: string[];
  image: string;
  url: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  location?: string;
  year: string;
};

export type VenueHighlight = {
  name: string;
  place: string;
  image: string;
};

export type FormField = {
  name: "name" | "email" | "subject" | "message";
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  required: boolean;
};

export type SiteMeta = {
  title: string;
  description: string;
};

export type HeroContent = {
  name: string;
  role: string;
  doctoral: string;
  ctas: Cta[];
};

export type CurrentChapter = {
  eyebrow: string;
  title: string;
  body: string;
};

export type MentorQuote = {
  text: string;
  attribution?: string;
};

export type PedagogyItem = {
  title: string;
  body: string;
};

export type Endorsement = {
  label: string;
  url: string;
};

export type ConnectContent = {
  email: string;
  location: string;
  locationDetail: string;
  locationUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  intro: string;
  form: {
    submitLabel: string;
    fields: FormField[];
  };
};

export type SiteContent = {
  meta: SiteMeta;
  hero: HeroContent;
  currentChapter: CurrentChapter;
  appointments: Appointment[];
  education: EducationItem[];
  shortBio: string;
  mentorQuote: MentorQuote;
  pedagogy: PedagogyItem[];
  endorsement: Endorsement;
  connect: ConnectContent;
  venues: VenueHighlight[];
};

export const meta: SiteMeta = {
  title: "George Zerdalis | Timpanist, Percussionist, and Educator",
  description:
    "George Zerdalis — timpanist, percussionist, and educator. Doctoral Candidate (DMA) at the University of Miami Frost School of Music; formerly timpani lecturer at Hochschule für Musik Detmold and solo guest timpanist of the Detmold Chamber Orchestra.",
};

export const hero: HeroContent = {
  name: "George Zerdalis",
  role: "Timpanist, Percussionist, and Educator",
  doctoral:
    "Doctoral Candidate\nUniversity of Miami · Frost School of Music",
  ctas: [
    { label: "Let's Connect", href: "/connect" },
    { label: "View Gallery", href: "/gallery" },
  ],
};

export const currentChapter: CurrentChapter = {
  eyebrow: "Current chapter",
  title: "Doctor of Musical Arts\nFrost School of Music",
  body: "Based in the United States, George Zerdalis is pursuing his Doctor of Musical Arts (DMA) at the University of Miami’s Frost School of Music under Professor Svetoslav Stoyanov, Leonardo Soto and Pablo Rieppi.",
};

export const appointments: Appointment[] = [
  {
    title: "Lecturer of Timpani & Percussion",
    organization: "Hochschule für Musik Detmold",
    location: "Germany",
    dates: "2023–2026",
    image: "/images/Hochschule-für-Musik-Detmold.jpg",
    url: "https://www.hfm-detmold.de/die-hochschule/personenverzeichnis/lehrende/vita/georgios-zerdalis/",
    bullets: [
      "Private lessons, group studio classes, and ensemble coaching",
      "Lead the HfM Percussion Ensemble",
      "Integrate mindfulness and posture-based awareness into percussion teaching",
    ],
  },
  {
    title: "Solo Guest Performer",
    organization: "Detmold Chamber Orchestra (DKO)",
    location: "Germany",
    dates: "2023–2026",
    image: "/images/Solo Guest Performer.jpg",
    url: "https://www.detmolder-kammerorchester.de/",
    bullets: [
      "Featured soloist and principal timpanist on national tours",
      "Collaborate with conductors and composers on new works and recordings",
    ],
  },
  {
    title: "Principal Timpanist",
    organization: "Athens Philharmonia Orchestra",
    location: "Greece",
    dates: "2022–2023",
    image: "/images/Principal Timpanist.jpeg",
    url: "https://www.apho.gr/home/en",
    bullets: [
      "Won national audition to serve as principal timpanist",
      "Performed in major Greek venues and on international tours",
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "Doctor of Musical Arts (DMA)",
    institution: "University of Miami, Frost School of Music",
    location: "USA",
    year: "2029",
  },
  {
    degree: "Master Degree",
    institution: "Hochschule für Musik Detmold, OrchesterZentrum | NRW",
    location: "Germany",
    year: "2026",
  },
  {
    degree: "Bachelor & Master Degree",
    institution: "Ionian University, Department of Music, Corfu",
    location: "Greece",
    year: "2020",
  },
];

/** ~175 words — adapted from Grover Pro + CV; always George on-site. */
export const shortBio = `Based in the United States, timpanist and percussionist George Zerdalis is pursuing his Doctor of Musical Arts (DMA) at the University of Miami’s Frost School of Music, with an expected completion in 2029. Prior to his move to Miami, George served as the timpani and percussion lecturer at the Hochschule für Musik Detmold and as the solo guest timpanist and percussionist of the Detmold Chamber Orchestra. An internationally active performer and educator who has presented masterclasses across Europe and the U.S., including at SUNY Fredonia, he combines technical excellence with a mindful, student-centered approach in all his artistic endeavors. Known for precision, musical depth, and leadership in ensemble work, George brings a distinctive blend of artistry and pedagogy that fosters growth both on and off the stage. His path also includes principal timpani with the Athens Philharmonia Orchestra and formative study with mentors such as Professor Peter Prommel and Marinos Tranoudakis, Principal Timpanist of the Greek National Opera.`;

/** Full quote from Grover Pro artist page (mentor / pedagogy statement). */
export const mentorQuote: MentorQuote = {
  text: "My commitment to the fine details of craftsmanship and sound is something I owe directly to my mentors. My standards of discipline and vital orchestral knowledge were shaped by my lifelong mentor, Professor Peter Prommel, at the Hochschule für Musik Detmold completely transformed my worldview—teaching me to stay endlessly curious, continuously evolve, and integrate a heavy focus on psychology and mindfulness into my own pedagogy. And of course, my teacher Mr. Marinos Tranoudakis (Principal Timpanist of the Greek National Opera), who continues to serve as a steady, guiding hand whenever I need it.",
  attribution: "George Zerdalis",
};

const pedagogyPlaceholder =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export const pedagogy: PedagogyItem[] = [
  {
    title: "Artistic leadership and ensemble direction",
    body: pedagogyPlaceholder,
  },
  {
    title: "Emphasis on sound production through posture and awareness",
    body: pedagogyPlaceholder,
  },
  {
    title: "Promotion of independence, mindfulness, and responsibility",
    body: pedagogyPlaceholder,
  },
  {
    title: "Commitment to instrument care and organized workspaces",
    body: pedagogyPlaceholder,
  },
  {
    title: "Cross-cultural communication and inclusive collaboration",
    body: pedagogyPlaceholder,
  },
];

export const endorsement: Endorsement = {
  label: "Grover Pro Percussion® Artist",
  url: "https://groverpro.com/artist/georgios-zerdalis",
};

export const connect: ConnectContent = {
  email: "georgios.zerdalis@hotmail.com",
  location: "University of Miami · Frost School of Music",
  locationDetail: "Miami, Florida, USA",
  locationUrl:
    "https://www.google.com/maps/search/?api=1&query=Frost+School+of+Music+University+of+Miami",
  instagramUrl: "https://www.instagram.com/georgezerdalis/",
  instagramHandle: "@georgezerdalis",
  intro:
    "Whether you're interested in collaboration, lessons, or just want to say hello — I'd love to hear from you.",
  form: {
    submitLabel: "Send Message",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Your name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "your@email.com",
        required: true,
      },
      {
        name: "subject",
        label: "Subject",
        type: "text",
        placeholder: "What's this about?",
        required: true,
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Your message...",
        required: true,
      },
    ],
  },
};

/** Performance highlights from CV / legacy site (no emoji icons). */
export const venues: VenueHighlight[] = [
  {
    name: "Carnegie Hall",
    place: "New York City, USA",
    image: "/images/Carnegie-Hall.png",
  },
  {
    name: "Konzerthaus",
    place: "Berlin, Germany",
    image: "/images/Konzerthaus.jpg",
  },
  {
    name: "Concertgebouw",
    place: "Amsterdam, Netherlands",
    image: "/images/Concertgebouw.jpg",
  },
  {
    name: "Odeon of Herodes Atticus",
    place: "Athens, Greece",
    image: "/images/Odeon-of-Herodes.jpg",
  },
];

export const site: SiteContent = {
  meta,
  hero,
  currentChapter,
  appointments,
  education,
  shortBio,
  mentorQuote,
  pedagogy,
  endorsement,
  connect,
  venues,
};

export default site;
