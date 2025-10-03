import { PDFDocument, StandardFonts } from "pdf-lib";

// Utility functions
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
    } catch (err) {
      word = word.replace(/[^ -~]/g, "");
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
};

// PDF generation function
export const generateNOCPDF = async (userData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - margin;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSizeHeader = 16;
  const fontSizeNormal = 10;
  const lineGap = 2;
  const maxTextWidth = width - margin * 2;

  /**
   * Draw text block with optional alignment
   * @param {string} text
   * @param {number} size
   * @param {boolean} bold
   * @param {'left'|'center'|'right'} align
   */
  const drawTextBlock = (
    text,
    size = fontSizeNormal,
    bold = false,
    align = "left"
  ) => {
    const lines = wrapText(
      sanitizeText(text),
      bold ? fontBold : font,
      size,
      maxTextWidth
    );

    lines.forEach((line) => {
      if (y < margin + size) return; // avoid overflow

      const textWidth = (bold ? fontBold : font).widthOfTextAtSize(line, size);
      let x;
      if (align === "center") x = (width - textWidth) / 2;
      else if (align === "right") x = width - margin - textWidth;
      else x = margin; // default left

      page.drawText(line, { x, y, size, font: bold ? fontBold : font });
      y -= size + lineGap;
    });

    y -= lineGap * 2; // extra space after block
  };

  // Header
  drawTextBlock("SARIN WORKSPACE LLP", fontSizeHeader, true, "center");
  drawTextBlock(
    "LLP Identification Number: ACP-8465",
    fontSizeNormal,
    false,
    "center"
  );
  // drawTextBlock(
  //   "Office Address: Unit no 213,214 2nd floor Welldone Tech Park Sohna Road Sec 48, Gurugram, Haryana - 122001",
  //   fontSizeNormal,
  //   false
  // );
  drawTextBlock(
    `Date: ${new Date().toLocaleDateString("en-IN")}`,
    fontSizeNormal,
    false,
    "right"
  );

  // Recipient Details
  [
    `Name: ${userData.name}`,
    `Address: ${userData.address}`,
    `Company Name: ${userData.companyName}`,
    `Aadhar No: ${userData.aadharNo}`,
  ].forEach((line) => drawTextBlock(line, fontSizeNormal));

  drawTextBlock(
    "Subject: No Objection Certificate (NOC)",
    fontSizeNormal,
    true,
    "center"
  );

  // Body
  // Body
  const body = [
    `Dear Sir,`,

    `We, SARIN WORKSPACE LLP having our office at "LGF-56, Runway Suites, Mirzapur Site Sector 19, Noida, Gautam Buddha Nagar - 201301, Uttar Pradesh," hereby declare and confirm that we are the legal lease owner of the above mentioned office premises and hereby allow Company "${userData.companyName}" (${userData.name}) to use the above-mentioned address as the Registered Office (GST Address office/Virtual Office) of the company ("${userData.companyName}").`,

    `Further, we have no objection if Company "${userData.companyName}" carries any business-related activity in the above-mentioned address.`,

    `I (${userData.name}), Aadhar No: ${userData.aadharNo}, DOB: ${userData.dob}, further agree that this address can only be used till the expiry of Virtual Office use at this premise including renewal period, if any.`,

    `On expiry or termination of Registered Office Membership Letter-Terms of Offer, ${userData.name} has to immediately take all steps to remove / de-list the company address "${userData.companyName}" of the premises “LGF-56, Runway Suites, Mirzapur Site Sector 19, Noida, Sector 19 Noida Police Station, Noida, Gautam Buddha Nagar - 201301, Uttar Pradesh,” from the records of above mentioned appropriate authority and from all registrations / filings etc. with statutory / government authorities and mandatorily shall keep SARIN WORKSPACE LLP informed of the same in writing and also shall provide a proof of such removal to SARIN WORKSPACE LLP within 2 weeks prior to termination or expiration of the membership agreement.`,

    `${userData.name} shall be solely responsible for compliance of such registration and SARIN WORKSPACE LLP will have no responsibility whatsoever.`,

    "For SARIN WORKSPACE LLP",
    "Authorized Signatory",
    "Noida",
  ];

  // Now actually draw the body
  body.forEach((line) => {
    if (
      line === "For SARIN WORKSPACE LLP" ||
      line === "Authorized Signatory" ||
      line === "Noida"
    ) {
      drawTextBlock(line, fontSizeNormal, false, "left");
    } else {
      drawTextBlock(line, fontSizeNormal);
    }
  });

  return await pdfDoc.save();
};
