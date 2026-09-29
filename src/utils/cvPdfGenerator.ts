import { jsPDF } from 'jspdf';
import { SAAD_PORTFOLIO } from '../data/portfolio.ts';

export const generateCvPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  // Background Header Accents
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line
  doc.setFillColor(0, 240, 255); // Cyan Neon
  doc.rect(0, 40, pageWidth, 1.2, 'F');

  // Header: Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SAAD M', margin, 16);

  // Title / Role
  doc.setTextColor(0, 240, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Electronics & Communication Engineer  |  Web Developer', margin, 23.5);

  // Contact Strip in Header
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Email: ${SAAD_PORTFOLIO.email}   |   Phone: ${SAAD_PORTFOLIO.phone}   |   UK: ${SAAD_PORTFOLIO.ukPhone}`, margin, 30);
  doc.text(`Location: ${SAAD_PORTFOLIO.location}   |   Portfolio: clickncreate.co.uk`, margin, 35);

  y = 48;

  // Helper to draw section headers
  const drawSectionHeader = (title: string) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), margin, y);

    // Cyan underline
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 1.8, margin + 35, y + 1.8);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin + 35, y + 1.8, pageWidth - margin, y + 1.8);

    y += 6;
  };

  // Section 1: Professional Summary / About Me (Purely personal)
  drawSectionHeader('Professional Summary (About Me)');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const bioLines = doc.splitTextToSize(
    'Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development. Experienced in developing web applications using WordPress with PHP and CSS customization, React, and responsive layouts. Proficient in using AI tools for accelerated research, productivity, and technical problem-solving with strong analytical thinking and adaptability.',
    contentWidth
  );
  doc.text(bioLines, margin, y);
  y += bioLines.length * 3.8 + 4;

  // Section 2: Education
  drawSectionHeader('Education');
  const edu = SAAD_PORTFOLIO.education[0];
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(edu.degree + ' in ' + edu.field, margin, y);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(edu.timeline, pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setTextColor(30, 41, 59);
  doc.text(`${edu.institution}  •  ${edu.location}`, margin, y);
  y += 6;

  // Section 3: Dedicated Key Projects Section
  drawSectionHeader('Key Web & Engineering Projects');

  // Project 1: Owais Academic Dashboard
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Owais Portfolio & Academic Dashboard', margin, y);

  doc.setTextColor(0, 150, 180);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('owaisdashboard.vercel.app  [Client Delivery · 2026]', pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const owaisLines = doc.splitTextToSize(
    '• Designed & deployed comprehensive student academic dashboard for client Owais featuring verified academic records, degree trajectory, and interactive technical & soft skills matrix with fast Vercel edge delivery.',
    contentWidth
  );
  doc.text(owaisLines, margin, y);
  y += owaisLines.length * 3.8 + 2.5;

  // Project 2: Click N Create Platform
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Click N Create Web Platform & Brand System', margin, y);

  doc.setTextColor(0, 150, 180);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('clickncreate.co.uk  [Flagship Platform · 2024 – Present]', pageWidth - margin, y, { align: 'right' });

  y += 4;
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const cncLines = doc.splitTextToSize(
    '• Built full-stack freelance website featuring custom geometric vector logo, real-time cost estimator (£35/hr and fixed milestone calculation), responsive dark/light UI, and direct WhatsApp quote pipelines.',
    contentWidth
  );
  doc.text(cncLines, margin, y);
  y += cncLines.length * 3.8 + 4;

  // Section 4: Professional Experience & Internships
  drawSectionHeader('Experience & Internships');

  SAAD_PORTFOLIO.experience.forEach((exp) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${exp.role}  —  ${exp.company}`, margin, y);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(exp.timeline, pageWidth - margin, y, { align: 'right' });

    y += 3.8;
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    const descLines = doc.splitTextToSize(exp.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 3.6 + 1;

    // Bullet points
    exp.keyResponsibilities.slice(0, 2).forEach((resp) => {
      doc.setTextColor(30, 41, 59);
      doc.text('•', margin + 2, y);
      const respLines = doc.splitTextToSize(resp, contentWidth - 8);
      doc.text(respLines, margin + 6, y);
      y += respLines.length * 3.5 + 0.5;
    });

    y += 2.5;
  });

  // Section 5: Technical Skills
  drawSectionHeader('Skills & Competencies');

  const skillsData = [
    { label: 'Web & Development:', items: 'React 19, TypeScript, Tailwind CSS, WordPress, PHP, Vercel, Responsive UI/UX' },
    { label: 'Electronics & Comm:', items: 'Analog & Digital Signals, Satellite & Wireless Systems, CircuitJS, eSim' },
    { label: 'Digital Tools & AI:', items: 'Proficiency in AI Tools, Microsoft Office (Word, Excel, PowerPoint), SEO & Branding' }
  ];

  skillsData.forEach((cat) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(cat.label, margin, y);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    const itemsLines = doc.splitTextToSize(cat.items, contentWidth - 48);
    doc.text(itemsLines, margin + 48, y);
    y += Math.max(itemsLines.length * 3.6, 4.2);
  });

  y += 2;

  // Section 6: Languages
  drawSectionHeader('Languages');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('• English (Professional)      • Hindi (Fluent)      • Gujarati (Native)', margin, y);

  // Footer note
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text(`Official Curriculum Vitae · Generated from Click N Create (clickncreate.co.uk) · Saad M`, pageWidth / 2, 287, { align: 'center' });

  // Save the PDF
  doc.save('Saad_M_CV.pdf');
};
