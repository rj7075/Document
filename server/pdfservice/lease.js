// leaseGenerator.js
import { PDFDocument, StandardFonts } from "pdf-lib";

const sanitizeText = (text) =>
  (text || "").replace(/[“”]/g, '"').replace(/\r/g, "");

const wrapText = (text, font, fontSize, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  words.forEach((word) => {
    const testLine = currentLine ? currentLine + " " + word : word;
    try {
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    } catch {
      word = word.replace(/[^ -~]/g, "");
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
};

export const generateLeaseAgreementPDF = async (userData) => {
  // ✅ Dynamic defaults
  const landlordName =
    userData.name || "M/S SINGHKHERI HOSPITALITY PRIVATE LIMITED";
  const landlordAddress =
    userData.address ||
    "Unit No 213,214, 2nd Floor, Welldone Tech Park, Sector 48, Gurugram, Haryana, 122018";
  const landlordSignatory = userData.landlordSignatory || "Manoj Yadav";
  const landlordDesignation = userData.designation || "Authorised Signatory";

  const clientName = userData.compnayName || "Popfly Design Consultants LLP";
  const clientSignatory = userData.name || "Kannishk Gupta";
  const clientPAN = userData.aadharNo || "ASCPG1607M";
  const clientAddress =
    userData.clientAddress ||
    "D174, Spaze Privy, Captain Chandan Lal Marg, Fazilpur, Gurgaon 122101";
  const clientDesignation = userData.designation || "Director";

  const effectiveDate = userData.effectiveDate || "30/06/2025";
  const termMonths = userData.termMonths || 11;
  const natureOfBusiness = userData.natureOfBusiness || "Design Agency";

  const witness1Name = userData.name || "Witness 1";
  const witness1Aadhar = userData.aadharNo || "XXXX-XXXX-XXXX";
  const witness1Contact = userData.witness1Contact || "0000000000";

  const witness2Name = userData.name || "Witness 2";
  const witness2Aadhar = userData.aadharNo || "XXXX-XXXX-XXXX";
  const witness2Contact = userData.witness2Contact || "0000000000";

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - margin;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 11;
  const maxWidth = width - margin * 2;

  const pageRef = { current: page };

  const drawTextBlock = (text, size = fontSize, bold = false, spacing = 6) => {
    if (!text) return;
    const paragraphs = String(text).split("\n");
    paragraphs.forEach((para) => {
      const lines = wrapText(
        sanitizeText(para.trim()),
        bold ? fontBold : font,
        size,
        maxWidth
      );
      lines.forEach((line) => {
        if (y < margin) {
          const newPage = pdfDoc.addPage([595, 842]);
          pageRef.current = newPage;
          y = height - margin;
        }
        pageRef.current.drawText(line, {
          x: margin,
          y,
          size,
          font: bold ? fontBold : font,
        });
        y -= size + 2;
      });
      y -= spacing;
    });
  };

  // ✅ Injecting dynamic values everywhere

  // Title
  drawTextBlock("LEAVE AND LICENSE AGREEMENT", 16, true, 12);

  // Intro
  drawTextBlock(
    `This LEAVE AND LICENSE AGREEMENT is made on ${effectiveDate} between ${landlordName}, R/O ${landlordAddress}, through its Authorized Signatory ${landlordSignatory} (hereinafter referred to as "LANDLORD") and ${clientName}, through its Authorized Signatory ${clientSignatory}, PAN Number-${clientPAN}, R/O ${clientAddress} (hereinafter referred to as "CLIENT") on such terms and conditions as set forth herein.`
  );

  drawTextBlock(
    `The CLIENT (${clientName}) desires to take a portion of the property on lease for ${termMonths} months as its registered office.\n\nThe LANDLORD (${landlordName}) agrees to permit ${clientName} to use the said property on license subject to the conditions hereinafter contained.`
  );

  drawTextBlock(`EFFECTIVE DATE: ${effectiveDate}`, 12, true);
  drawTextBlock(`TERM: ${termMonths} months`, 12, true);

  // Sections (kept short for clarity)
  drawTextBlock("USE OF AND ACCESS", 12, true);
  drawTextBlock(
    `${clientName} shall have access to the premises owned by ${landlordName} only for office use.`
  );

  drawTextBlock("ACKNOWLEDGMENT", 12, true);
  drawTextBlock(
    `${clientSignatory} on behalf of ${clientName} agrees to comply with all terms and conditions. ${landlordName} reserves the right to terminate services for violations.`
  );

  drawTextBlock("USAGE OF ADDRESS", 12, true);
  drawTextBlock(
    `${clientName} may use ${landlordAddress} as its registered office, subject to compliance of laws.`
  );

  drawTextBlock("INDEMNITY", 12, true);
  drawTextBlock(
    `${clientName} agrees to indemnify ${landlordName} against all claims or losses arising due to misuse or breach.`
  );

  drawTextBlock("LICENSE FEES", 12, true);
  drawTextBlock(
    `The agreed license fees shall be payable by ${clientName} in advance. Delay will attract penalty as mutually agreed.`
  );

  drawTextBlock("NATURE OF BUSINESS", 12, true);
  drawTextBlock(`Nature of Business: ${natureOfBusiness}`);

  // ✅ Signature section with dynamic injection
  drawTextBlock("AGREED AND ACCEPTED", 12, true);
  drawTextBlock(`For Client: ${clientName}`, 12, true);
  drawTextBlock(`Authorized Signatory: ${clientSignatory}`);
  drawTextBlock(`Designation: ${clientDesignation}`);
  drawTextBlock(`Date: ${effectiveDate}`);
  drawTextBlock("Signature: __________________________");

  drawTextBlock("");
  drawTextBlock(`For Landlord: ${landlordName}`, 12, true);
  drawTextBlock(`Authorized Signatory: ${landlordSignatory}`);
  drawTextBlock(`Designation: ${landlordDesignation}`);
  drawTextBlock(`Date: ${effectiveDate}`);
  drawTextBlock("Signature: __________________________");

  // ✅ Witnesses
  drawTextBlock("");
  drawTextBlock("WITNESSES", 12, true);
  drawTextBlock(
    `Witness 1: ${witness1Name}, 
    Aadhar: ${witness1Aadhar}, 
    Contact: ${witness1Contact}, 
    Signature: __________________`
  );
  drawTextBlock(
    `Witness 2: ${witness2Name}, 
    Aadhar: ${witness2Aadhar}, 
    Contact: ${witness2Contact}, 
    Signature: __________________`
  );

  return await pdfDoc.save();
};
