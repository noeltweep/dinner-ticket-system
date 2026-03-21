import path from "path";
import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";

type TicketType = "Regular" | "VIP" | "Table for 10" | "All Star";

const TEMPLATE_MAP: Record<TicketType, string> = {
  Regular: "regular.jpg",
  VIP: "vip.jpg",
  "Table for 10": "table-for-10.jpg",
  "All Star": "all-star.jpg",
};

export async function generateTicketImage({
  name,
  ticketType,
  ticketId,
}: {
  name: string;
  ticketType: TicketType;
  ticketId: string;
}) {
  const fileName = TEMPLATE_MAP[ticketType];

  if (!fileName) {
    throw new Error("Invalid ticket type for template selection");
  }

  const templatePath = path.join(
    process.cwd(),
    "public",
    "ticket-templates",
    fileName
  );

  const template = await loadImage(templatePath);
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(template, 0, 0, template.width, template.height);

  // NAME
  ctx.font = '44px Arial';
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";

  const maxNameWidth = 760;
  const nameX = 125;
  const nameY = 404;

  let finalName = name.trim();
  while (ctx.measureText(finalName).width > maxNameWidth && finalName.length > 0) {
    finalName = finalName.slice(0, -1);
  }

  if (finalName !== name.trim()) {
    finalName = finalName.trimEnd() + "...";
  }

  ctx.fillText(finalName, nameX, nameY);

  // TICKET ID
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = "#111111";
  ctx.fillText("Ticket ID:", 1090, 95);

  ctx.font = '22px Arial';
  ctx.fillText(ticketId, 1090, 125);

  // QR CODE
  const qrDataUrl = await QRCode.toDataURL(ticketId, {
    margin: 1,
    width: 180,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  const qrImage = await loadImage(qrDataUrl);
  ctx.drawImage(qrImage, 1095, 150, 150, 150);

  return canvas.toBuffer("image/png");
}