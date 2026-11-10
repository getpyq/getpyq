import { PDFDocument, rgb, StandardFonts, PDFString } from "pdf-lib";

export const FOOTER_LINE1 = "GetPYQ | BPUT Previous Year Questions";
export const FOOTER_LABEL = "For more, visit: ";
export const FOOTER_URL = "https://getpyq.vercel.app";
export const FOOTER_SIZE = 8;

export interface StampResult {
  file: File;
  pageCount: number;
  flattened: boolean;
}

/**
 * Adds the official GetPYQ clickable footer to a single PDF page
 */
function addFooterToPage(
  doc: PDFDocument,
  page: any,
  font: any
) {
  const blue = rgb(0.12, 0.37, 1);
  const grey = rgb(0.33, 0.38, 0.45);
  
  // Resilient origin calculation in case PDF has non-zero crop/media box origin
  const box = page.getCropBox ? (page.getCropBox() || page.getMediaBox()) : page.getMediaBox();
  const originX = (box && typeof box.x === "number") ? box.x : 0;
  const originY = (box && typeof box.y === "number") ? box.y : 0;
  const w = (box && typeof box.width === "number") ? box.width : page.getWidth();

  const lw = font.widthOfTextAtSize(FOOTER_LABEL, FOOTER_SIZE);
  const uw = font.widthOfTextAtSize(FOOTER_URL, FOOTER_SIZE);
  const t1w = font.widthOfTextAtSize(FOOTER_LINE1, FOOTER_SIZE);

  const y2 = originY + 8;
  const y1 = y2 + FOOTER_SIZE + 3;

  // Line 1: Centered brand header
  page.drawText(FOOTER_LINE1, {
    x: originX + (w - t1w) / 2,
    y: y1,
    size: FOOTER_SIZE,
    font: font,
    color: grey,
  });

  // Line 2: Label + Clickable URL
  const x = originX + (w - (lw + uw)) / 2;
  page.drawText(FOOTER_LABEL, {
    x: x,
    y: y2,
    size: FOOTER_SIZE,
    font: font,
    color: grey,
  });

  const ux = x + lw;
  page.drawText(FOOTER_URL, {
    x: ux,
    y: y2,
    size: FOOTER_SIZE,
    font: font,
    color: blue,
  });

  // Underline for the clickable URL
  page.drawLine({
    start: { x: ux, y: y2 - 1.5 },
    end: { x: ux + uw, y: y2 - 1.5 },
    thickness: 0.5,
    color: blue,
  });

  // Clickable Link Annotation
  try {
    const link = doc.context.register(
      doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [ux, y2 - 3, ux + uw, y2 + FOOTER_SIZE + 1],
        Border: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(FOOTER_URL),
        },
      })
    );
    page.node.addAnnot(link);
  } catch (err) {
    console.warn("Could not register link annotation on PDF page:", err);
  }
}

/**
 * Standard vector stamping: preserves text, vectors, and pristine quality.
 */
async function stampDirect(bytes: Uint8Array): Promise<{ pdfBytes: Uint8Array; pageCount: number }> {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  for (const page of pages) {
    addFooterToPage(doc, page, font);
  }
  const saved = await doc.save();
  return { pdfBytes: saved, pageCount: pages.length };
}

/**
 * Converts an image file (PNG/JPG) to a stamped PDF with the GetPYQ footer
 */
async function stampImageFile(file: File): Promise<{ pdfBytes: Uint8Array; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  let img;
  if (file.type === "image/png" || /\.png$/i.test(file.name)) {
    img = await doc.embedPng(arrayBuffer);
  } else {
    img = await doc.embedJpg(arrayBuffer);
  }

  // Standard A4 dimensions in points: 595 x 842
  const pageWidth = 595;
  const pageHeight = 842;
  const page = doc.addPage([pageWidth, pageHeight]);

  const margin = 20;
  const bottomMargin = 40; // reserve space for footer
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin - bottomMargin;

  const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const x = (pageWidth - drawWidth) / 2;
  const y = bottomMargin + (maxHeight - drawHeight) / 2;

  page.drawImage(img, {
    x: x,
    y: y,
    width: drawWidth,
    height: drawHeight,
  });

  addFooterToPage(doc, page, font);
  const saved = await doc.save();
  return { pdfBytes: saved, pageCount: 1 };
}

/**
 * Main stamping function: takes an uploaded File, applies the GetPYQ footer,
 * and returns the stamped File ready for upload.
 */
export async function stampPdfFooter(file: File): Promise<StampResult> {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.name) || file.type.startsWith("image/");

  if (isPdf) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    try {
      const { pdfBytes, pageCount } = await stampDirect(bytes);
      const stampedBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const stampedFile = new File([stampedBlob], file.name, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      return { file: stampedFile, pageCount, flattened: false };
    } catch (directErr) {
      console.warn("Direct stamping encountered error, attempting non-strict load:", directErr);
      return { file, pageCount: 1, flattened: false };
    }
  } else if (isImage) {
    try {
      const { pdfBytes, pageCount } = await stampImageFile(file);
      const pdfName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
      const stampedBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const stampedFile = new File([stampedBlob], pdfName, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      return { file: stampedFile, pageCount, flattened: true };
    } catch (imgErr) {
      console.warn("Image conversion to PDF failed, uploading original image:", imgErr);
      return { file, pageCount: 1, flattened: false };
    }
  }

  return { file, pageCount: 1, flattened: false };
}
