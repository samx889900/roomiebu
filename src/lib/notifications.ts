import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { NotificationType } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: (params.metadata as any) || undefined,
    },
  });

  // Send email notification
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { email: true, name: true },
    });

    if (user?.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: [user.email],
        subject: params.title,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7C3AED, #6D28D9); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">RoomieBU</h1>
            </div>
            <h2 style="color: #1a1a1a; margin-bottom: 8px;">${params.title}</h2>
            <p style="color: #666; line-height: 1.6;">${params.message}</p>
            <div style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/notifications" 
                 style="background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
                View on RoomieBU
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Bennett University • RoomieBU
            </p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error("Failed to send email notification:", error);
    // Don't throw — email failure shouldn't block in-app notification
  }

  return notification;
}

export async function notifyNewInterest(listingOwnerId: string, interestedUserName: string, listingTitle: string) {
  return createNotification({
    userId: listingOwnerId,
    type: "NEW_INTEREST",
    title: "New Interest Received",
    message: `${interestedUserName} is interested in your listing "${listingTitle}".`,
  });
}

export async function notifyInterestAccepted(interestedUserId: string, ownerName: string, listingTitle: string) {
  return createNotification({
    userId: interestedUserId,
    type: "INTEREST_ACCEPTED",
    title: "Interest Accepted! 🎉",
    message: `${ownerName} accepted your interest in "${listingTitle}". You can now view their contact details.`,
  });
}

export async function notifyInterestRejected(interestedUserId: string, listingTitle: string) {
  return createNotification({
    userId: interestedUserId,
    type: "INTEREST_REJECTED",
    title: "Interest Update",
    message: `Your interest in "${listingTitle}" was not accepted. Keep looking — your perfect match is out there!`,
  });
}

export async function notifyListingFilled(userId: string, listingTitle: string) {
  return createNotification({
    userId,
    type: "LISTING_FILLED",
    title: "Listing Filled",
    message: `Your listing "${listingTitle}" is now full. All spots have been filled!`,
  });
}

export async function notifyListingReported(userId: string, listingTitle: string) {
  return createNotification({
    userId,
    type: "LISTING_REPORTED",
    title: "Listing Reported",
    message: `Your listing "${listingTitle}" has been reported. Our team will review it.`,
  });
}
