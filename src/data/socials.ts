export interface SocialLink {
  name: string;
  url: string;
  label: string;
  iconName: string;
}

export const CONTACT_CHANNELS = {
  freelancerName: 'Saad M',
  brandName: 'Click N Create',
  role: 'Freelance Web Developer',
  email: 'Mansurisaad28012@gmail.com',
  phone: '+44 7927 548123',
  whatsappUrl: 'https://wa.me/447927548123',
  linkedinUrl: 'https://www.linkedin.com/in/saad-m-aa54bb375?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  hourlyRate: '£35/hr',
  pricingNote: 'Custom fixed packages available based on project scope',
  availability: 'Accepting select freelance projects for 2026',
  turnaround: 'Direct response within 24 business hours'
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    label: 'Connect on LinkedIn',
    url: 'https://www.linkedin.com/in/saad-m-aa54bb375?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    iconName: 'Linkedin'
  },
  {
    name: 'WhatsApp',
    label: 'Chat on WhatsApp (+44 7927 548123)',
    url: 'https://wa.me/447927548123',
    iconName: 'MessageSquare'
  },
  {
    name: 'Email',
    label: 'Mansurisaad28012@gmail.com',
    url: 'mailto:Mansurisaad28012@gmail.com',
    iconName: 'Mail'
  }
];
