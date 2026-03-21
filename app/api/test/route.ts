import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { Resend } from "resend";
import { generateTicketImage } from "@/app/lib/generateTicket";

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_TICKET_TYPES = [
  "Regular",
  "VIP",
  "Table for 10",
  "All Star",
] as const;

type TicketType = (typeof ALLOWED_TICKET_TYPES)[number];

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");

  if (!adminAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const ticketType = body.ticketType?.trim() as TicketType;

    if (!name || !email || !phone || !ticketType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TICKET_TYPES.includes(ticketType)) {
      return NextResponse.json(
        { error: "Invalid ticket type selected" },
        { status: 400 }
      );
    }

    const guestRef = doc(db, "guests", email);
    const existingDoc = await getDoc(guestRef);

    if (existingDoc.exists()) {
      return NextResponse.json(
        { error: "Ticket already generated for this email ❌" },
        { status: 400 }
      );
    }

    const ticketId = "DN-" + uuidv4().slice(0, 8).toUpperCase();
    const qrCodeImage = await QRCode.toDataURL(ticketId);

    await setDoc(guestRef, {
      name,
      email,
      phone,
      ticketType,
      ticketId,
      checkedIn: false,
      createdAt: new Date(),
    });

    const finalTicketBuffer = await generateTicketImage({
      name,
      ticketType,
      ticketId,
    });

    await resend.emails.send({
      from: "ESUCOM Dinner <tickets@esucomdinner.org>",
      to: email,
      subject: "Your ESUMSA ALL-STAR Dinner & AWARD NIGHT TICKET 🎟️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="margin-bottom: 8px;">ESUMSA ALL-STAR Dinner Ticket</h2>
          <p>Hello <strong>${name}</strong>,</p>

          <p>Your ticket for the ESUMSA ALL STAR DINNER & AWARD NIGHT has been generated successfully.</p>

          <p>
            <strong>Ticket Type:</strong> ${ticketType}<br />
            <strong>Ticket ID:</strong> ${ticketId}
          </p>

          <p>Your ticket is attached to this email.</p>

          <p style="margin: 20px 0;">
            You can also present this QR code at the entrance:
          </p>

          <div style="margin: 20px 0;">
            <img src="${qrCodeImage}" alt="QR Code" width="220" height="220" />
          </div>

          <p style="font-size: 14px; color: #555;">
            Please keep this email safe and show your attached ticket or QR code at the venue.
          </p>

          <hr style="margin: 24px 0;" />

          <p style="font-size: 12px; color: #777;">
            This email was sent automatically by the ESUCOM Dinner Ticket System. <br />
            Powered by ESUMSA FINANCIAL SECRETARY 2026: AROH DOZZY
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `${ticketId}.png`,
          content: finalTicketBuffer.toString("base64"),
        },
      ],
    });

    return NextResponse.json({
      message: "Guest saved successfully and email sent ✅",
      ticketId,
      qrCode: qrCodeImage,
    });
  } catch (error) {
    console.error("Error saving guest or sending email:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}