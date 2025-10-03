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
  const landlordName = "M/S SINGHKHERI HOSPITALITY PRIVATE LIMITED";
  const landlordAddress =
    "Unit No 213,214, 2nd Floor, Welldone Tech Park, Sector 48, Gurugram, Haryana, 122018";
  const landlordSignatory = "Manoj Yadav";
  const landlordDesignation = "Authorised Signatory";

  const clientName = userData.compnayName || "Popfly Design Consultants LLP";
  const clientSignatory = userData.name || "Kannishk Gupta";
  const clientPAN = userData.aadharNo || "ASCPG1607M";
  const clientAddress =
    userData.companyAddress ||
    "D174, Spaze Privy, Captain Chandan Lal Marg, Fazilpur, Gurgaon 122101";
  const clientDesignation = userData.designation || "Director";

  const effectiveDate = `Date: ${new Date().toLocaleDateString("en-IN")}`;
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
    `This LEAVE AND LICENSE AGREEMENT is made on  ${new Date().toLocaleDateString(
      "en-IN"
    )} between ${landlordName}, R/O ${landlordAddress}, through its Authorized Signatory ${landlordSignatory} (hereinafter referred to as "LANDLORD") and ${clientName}, through its Authorized Signatory ${clientSignatory}, PAN Number-${clientPAN}, R/O ${clientAddress} (hereinafter referred to as "CLIENT") on such terms and conditions as set forth herein.`
  );

  drawTextBlock(
    `The CLIENT (${clientName}) desires to take a portion of the property on lease for ${termMonths} months as its registered office.\n\nThe LANDLORD (${landlordName}) agrees to permit ${clientName} to use the said property on license subject to the conditions hereinafter contained.`
  );

  drawTextBlock(
    `EFFECTIVE Date: ${new Date().toLocaleDateString("en-IN")}`,
    12,
    true
  );
  drawTextBlock(`TERM: ${termMonths} months`, 12, true);

  // Sections (kept short for clarity)
  drawTextBlock("USE OF AND ACCESS TO THE LICENSED PREMISES", 12, true);
  drawTextBlock(
    `The whole of the Premise remains the property of the LANDLORD and remains in the LANDLORD's possession and control. This Agreement is non- transferrable. LANDLORD may transfer the benefit of this Agreement and its obligations under it at any time without any intimation to Client.`
  );

  drawTextBlock("ACKNOWLEDGMENT AND ACCEPTANCE OF TERMS OF USE.", 12, true);
  drawTextBlock(
    `The Client shall abide with the terms and conditions of this Agreement with free consent& without any force. Each person authorized by the Client to use the Service, or enters into a premise shall be informed to Landlord in writing or through email or any other electronic mode. In the case of any violation of these terms, LANDLORD reserves the right to cancel Services to CLIENT immediately and seek all remedies available by law and in equity for such violations.
`
  );

  drawTextBlock("USAGE OF ADDRESS", 12, true);
  drawTextBlock(
    `The Client may use the address for its business correspondence.
Clients may also use the Office Address for obtaining business registrations, trade licenses, GST & Bank Account, with the understanding that the client assumes the responsibility for complying with all the required provisions of applicable acts and laws. The
address client with may use the address of the designated center as their primary registered office MCA/ROC. The or any Lessee/Client
is not permitted to avail any credit facility, whether relating to any loans other forms of credit line,
on this address.The CLIENT shall indemnify and keep and hold LANDLORD fully indemnified and harmless from 
and against all claims, non-compliances, proceedings, damages, losses,actions, costs and expenses etc. arising
as a consequence of or out of this agreement or arising from any breach of rules and regulations of any applicable law.

In case the CLIENT is unable to fulfill the obligations mentioned herein, this Agreement shall be deemed to be terminated therefrom.
`
  );

  drawTextBlock("INDEMNITY", 12, true);
  drawTextBlock(
    `${clientName} agrees to indemnify ${landlordName} against all claims or losses arising due to misuse or breach.`
  );

  drawTextBlock("LICENSE FEES", 12, true);
  drawTextBlock(
    `License fees are payable in advance. Any dues in the License fees will cause the termination of the Services on the expiration date set forth at the time of signup or payment. For late payments, (if acceptable to the Licensor) the client has to pay an additional INR 500 penalty every day, in addition to renewal license fees.

`
  );
  drawTextBlock("SERVICE RETAINER / DEPOSIT AMOUNT", 12, true);
  drawTextBlock(
    `If interested, the client will be required to pay a service retainer / deposit fees of INR 1000+GST,
     at any time during the agreement, in case it wishes to use the “Courier Forwarding” facility. This 
     amount will be kept separately from Subscription fees. Client has to replenish the deposit when it
      reaches the minimum level. When the client terminates the service, the balance of deposit amount will be refunded to the client.
`
  );

  drawTextBlock("MAIL HANDLING", 12, true);
  drawTextBlock(
    `Client can receive registered and certified mail at the premise.Service Provider will receive up to
     10 letters or packages per month free of charge for Client. For additional letters or packages, Service 
     Provider will charge a handling fee of Rs.10 per letter / package. Service Provider will not accept packages 
     more than 5 Kg of weight or 1 cubic feet size. Client can pick up the mails from the location free of cost. 
     Service Provider shall not be liable for any mail not collected within 10 days from the date of receipt-date
      of the package at the Premise.


`
  );

  drawTextBlock("TERMINATION OF SERVICE", 12, true);
  drawTextBlock(
    `Client may decide to terminate the service at any time. Service will be automatically terminated on 
    the expiry date unless the subscription is renewed. Upon termination of the agreement, the Client must
     cease the use of address of the premise for any governmen registrations, and any Phone Numbers issued
    by the service provider to the client immediately,from all places including but not limited to business cards, websites, stationary, 
    advertising material, licenses, certificates etc. Notwithstanding any other provision under this Agreement, 
    if the client has used the address of the premise for registration with the registrar of companies, Statutory compliances authority, Banks, or
    other governmental authorities etc., it has to change the address submitted with such authorities
   within 30 (Thirty) days after the date of termination or expiry of this Agreement, unless otherwise 
   agreed with the Service Provider The Licensor reserves the right to take legal action against the 
   Licensor if they are found in breach of this clause.

  The Service Provider reserves the right to terminate the service and this Agreement by providing 30
  (Thirty) days’ written notice if, in its reasonable opinion, the Client engages in any activity that 
  may harm the Service Provider’s reputation, impair its normal operations, or breach any applicable laws 
  or regulations.

However, in the event of fraudulent activity, unlawful conduct, or any serious breach of the terms of 
this Agreement, the Service Provider may terminate the service and this Agreement with immediate effect
and without prior notice and Client would be responsible for all such activities and Client would also
compensate to Licensor for all loss/damages bear by Service Provider, if any.

`
  );

  drawTextBlock("REFUND POLICY ", 12, true);
  drawTextBlock(
    `Any License fee paid fully or partially is non-refundable, unless the Licensor purposely 
    terminates the agreement without the breach of any condition of this agreement by the Client. 
`
  );
  drawTextBlock("NATURE OF BUSINESS", 12, true);
  drawTextBlock(`Client has to explain its nature of business in writing on this agreement in Annexure 1
     hereto. The Client agrees with Service Provider not to carry on any business, which could be construed 
     illegal, defamatory, immoral or obscene and agrees not to use the address of Service the premise, whether
    directly or indirectly for any such purpose or purposes.

    If the Client changes the nature of business, it must notify the Service Provider in writing beforehand.

`);
  drawTextBlock("LIABILITY", 12, true);
  drawTextBlock(`
  Service Provider will not be liable for any loss sustained as a result of Service Provider’s failure to
   provide the services as a result of any Software Glitches, Mechanical breakdown,Strike, Loss of electric 
   power, or termination of Service Provider interest in the building containing the office. The Service Provider
   does not accept liability for actions, services of/by third parties in anyway whatsoever, including delays & Non
   receipt of messages or communication due to delays or failures in the email, SMS or fax systems, Phone, courier or
   postal service.

 Further, Service Provider shall not be responsible or liable to Client for any loss or damage resulting 
 to Client by reason including but not limited to flood, fire, hurricane, riots, explosion, acts of God, 
 war, terror, governmental action, or any other cause which is beyond the reasonable control of the
 Service Provider.

The Client shall indemnify and keep and hold Service provider fully indemnified and harmless 
from and against all claims, proceedings, damages, losses, actions, costs and expenses arising
as a consequence of or out of this agreement or arising from any breach of rules and regulations
of any applicable law even after expiry or termination of this agreement.

  `);

  drawTextBlock("CONFIDENTIALITY", 12, true);
  drawTextBlock(`
    Client recognizes that it may, in the course of obtaining or using the Services, come into possession 
    of or learn the confidential information ("Confidential Information") about Service Provider. Client
     agrees that during the Term of this Agreement and thereafter: (a) Client shall provide, at a minimum,
      the care to avoid disclosure of unauthorized use of Confidential Information as is provided with 
      respect to Client's own similar information, but in no event less than a reasonable standard of
       care; (b) Client will use Confidential Information solely for the purposes of this Agreement; 
       and (c) Client will not disclose Confidential Information to any third party without the express
        prior written consent of Service Provider, unless required to do so under applicable law.


Similarly, Service Provider recognizes that it may, in the course of obtaining or using the Services,
 come into possession of or learn confidential and proprietary business information ("Confidential 
 Information") about Client. Service Provider agrees that during the Term of this Agreement and 
 thereafter Service Provider shall provide, at a minimum, the care to avoid disclosure of unauthorized 
 use of Confidential Information of Client.

If Service Provider transfers its business or any business segment that provides services to Client,
 Service Provider is authorized to transfer all user information to Service Provider's successor.
    `);
  drawTextBlock("OWNERSHIP", 12, true);
  drawTextBlock(`All programs, services, processes, designs, software, technologies, trademarks,
       trade names, inventions and materials comprising the services are wholly owned by the Service 
       Provider and/or its Licensors and service providers except where expressly stated otherwise. 
      This agreement only provides a license to the Client to use the Premise and will not provide 
       any leasehold rights to the Client. Client agrees that the client is not the owner of any phone
        number assigned to them by the Service Provider. Upon termination of the agreement for any reason,
         such number may be reassigned to another client. 

`);
  drawTextBlock("Client’s Address will be:", 12, true);
  drawTextBlock(`${userData.companyAddress}`);
  // ✅ Signature section with dynamic injection
  drawTextBlock(
    "THIS IS A FORMAL AGREEMENT ON Licensors TERMS AND CONDITIONSA GREE TO THE ABOVE TERMS AND CONDITIONS",
    12,
    true
  );
  drawTextBlock(`For Client: ${clientName}`, 12, true);
  drawTextBlock(`Authorized Signatory: ${clientSignatory}`);
  drawTextBlock(`Designation: ${clientDesignation}`);
  drawTextBlock(`Date: ${new Date().toLocaleDateString("en-IN")}`);
  drawTextBlock("Signature: __________________________");

  drawTextBlock("");
  drawTextBlock(`For Landlord: ${landlordName}`, 12, true);
  drawTextBlock(`Authorized Signatory: ${landlordSignatory}`);
  drawTextBlock(`Designation: ${landlordDesignation}`);
  drawTextBlock(`Date: ${new Date().toLocaleDateString("en-IN")}`);
  drawTextBlock("Signature: __________________________");

  // ✅ Witnesses side by side

  drawTextBlock("");
  drawTextBlock("");
  drawTextBlock("");
  drawTextBlock("WITNESSES", 12, true, 12);

  const witnessFontSize = 11;
  const leftX = margin;
  const rightX = width / 2 + 20;

  // Make sure there's enough space, else add new page
  if (y < margin + 100) {
    const newPage = pdfDoc.addPage([595, 842]);
    pageRef.current = newPage;
    y = height - margin;
  }

  y -= 30; // move down a bit

  // Left Witness
  pageRef.current.drawText(
    `Witness 1: ${witness1Name}
Aadhar: ${witness1Aadhar}
Contact: ${witness1Contact}
Signature: __________________`,
    {
      x: leftX,
      y,
      size: witnessFontSize,
      font,
      lineHeight: 14,
    }
  );

  // Right Witness
  pageRef.current.drawText(
    `Witness 2: ${witness2Name}
Aadhar: ${witness2Aadhar}
Contact: ${witness2Contact}
Signature: __________________`,
    {
      x: rightX,
      y,
      size: witnessFontSize,
      font,
      lineHeight: 14,
    }
  );

  y -= 100;

  return await pdfDoc.save();
};
