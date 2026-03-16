import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticketId } = body;

    // 🔎 Find ticket in Firestore
    const q = query(
      collection(db, "guests"),
      where("ticketId", "==", ticketId)
    );

    const querySnapshot = await getDocs(q);

    // ❌ If no ticket found
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Invalid Ticket ❌" },
        { status: 404 }
      );
    }

    const docSnap = querySnapshot.docs[0];
    const guestData = docSnap.data();

    // ❌ Already checked in
    if (guestData.checkedIn) {
      return NextResponse.json(
        { error: "Ticket Already Used ❌" },
        { status: 400 }
      );
    }

    // ✅ Mark as checked in
    await updateDoc(docSnap.ref, {
      checkedIn: true,
      checkInTime: new Date(),
    });

    return NextResponse.json({
      message: `Access Granted ✅ - ${guestData.name} (${guestData.ticketType})`,
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}