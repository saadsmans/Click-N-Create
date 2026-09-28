import { jsPDF } from 'jspdf';
import { SAAD_PORTFOLIO } from '../data/portfolio.ts';

export const generateCvPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  // Background Header Accents
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line
  doc.setFillColor(0, 240, 255); // Cyan Neon
  doc.rect(0, 42, pageWidth, 1.5, 'F');

  // Header: Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('SAAD M', margin, 18);

  // Title / Role
  doc.setTextColor(0, 240, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Electronics & Communication Engineer  |  Web Developer', margin, 26);

  // Contact Strip in Header
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Email: ${SAAD_PORTFOLIO.email}   |   Phone: ${SAAD_PORTFOLIO.phone}   |   UK: ${SAAD_PORTFOLIO.ukPhone}`, margin, 33);
  doc.text(`Location: ${SAAD_PORTFOLIO.location}   |   Portfolio: clickncreate.co.uk`, margin, 38);

  y = 52;

  // Helper to draw section headers
  const drawSectionHeader = (title: string) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), margin, y);

    // Cyan underline
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + 40, y + 2);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin + 40, y + 2, pageWidth - margin, y + 2);

    y += 7;
  };

  // Section 1: Professional Summary / About Me
  drawSectionHeader('Professional Summary');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bioLines = doc.splitTextToSize(
    'Motivated and enthusiastic Electronics & Communication Engineering student with a strong interest in communication technologies, satellite communication, wireless systems, and modern web development. Experienced in designing and building full freelance web platforms (Click N Create) using WordPress with PHP and CSS customization, React, and responsive layouts. Proficient in using AI tools for accelerated productivity, technical research, and problem-solving.',
    contentWidth
  );
  doc.text(bioLines, margin, y);
  y += bioLines.length * 4.2 + 5;

  // Section 2: Education
  drawSectionHeader('Education');
  const edu = SAAD_PORTFOLIO.education[0];
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(edu.degree + ' in ' + edu.field, margin, y);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(edu.timeline, pageWidth - margin, y, { align: 'right' });

  y += 4.5;
  doc.setTextColor(30, 41, 59);
  doc.text(`${edu.institution}  •  ${edu.location}`, margin, y);
  y += 7;

  // Section 3: Professional Experience & Projects
  drawSectionHeader('Experience & Engineering Projects');

  SAAD_PORTFOLIO.experience.forEach((exp) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${exp.role}  —  ${exp.company}`, margin, y);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(exp.timeline, pageWidth - margin, y, { align: 'right' });

    y += 4.5;
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(exp.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 4.0 + 1;

    // Bullet points
    exp.keyResponsibilities.slice(0, 3).forEach((resp) => {
      doc.setTextColor(30, 41, 59);
      doc.text('•', margin + 2, y);
      const respLines = doc.splitTextToSize(resp, contentWidth - 8);
      doc.text(respLines, margin + 6, y);
      y += respLines.length * 3.8 + 0.8;
    });

    y += 3;
  });

  // Section 4: Technical Skills
  drawSectionHeader('Skills & Competencies');

  const skillsData = [
    { label: 'Web & E-Commerce:', items: 'WordPress, Shopify, React 19, PHP, Tailwind CSS, TypeScript, Mobile UI/UX' },
    { label: 'Electronics & Communication:', items: 'Analog & Digital Signal Conversion, Satellite & Wireless Systems, CircuitJS, eSim' },
    { label: 'Digital Tools & Productivity:', items: 'Proficiency in AI Tools, Microsoft Office (Word, Excel, PowerPoint), SEO & Google Ads, Social Media Design' }
  ];

  skillsData.forEach((cat) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(cat.label, margin, y);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    const itemsLines = doc.splitTextToSize(cat.items, contentWidth - 55);
    doc.text(itemsLines, margin + 55, y);
    y += Math.max(itemsLines.length * 4.0, 5.0);
  });

  y += 3;

  // Section 5: Languages
  drawSectionHeader('Languages');
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('• English (Professional)      • Hindi (Fluent)      • Gujarati (Native)', margin, y);

  // Footer note
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text(`Official Curriculum Vitae · Generated from Click N Create (clickncreate.co.uk) · Saad M`, pageWidth / 2, 287, { align: 'center' });

  // Save the PDF
  doc.save('Saad_M_CV.pdf');
};
