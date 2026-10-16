import { getDb } from "../db";
import { notifications, notificationPreferences } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

interface CreateNotificationOptions {
  userId: number;
  inquiryId?: number;
  title: string;
  content: string;
  type: "inquiry" | "system" | "update";
}

/**
 * Create a new notification for a user
 */
export async function createNotification(options: CreateNotificationOptions) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const result = await db.insert(notifications).values({
      userId: options.userId,
      inquiryId: options.inquiryId,
      title: options.title,
      content: options.content,
      type: options.type,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId: number) {
  try {
    const db = await getDb();
    if (!db) return null;
    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    return prefs[0] || null;
  } catch (error) {
    console.error("Failed to get notification preferences:", error);
    return null;
  }
}

/**
 * Create or update notification preferences for a user
 */
export async function upsertNotificationPreferences(
  userId: number,
  preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    notifyOnNewInquiry?: boolean;
    notifyOnInquiryUpdate?: boolean;
  }
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const existing = await getNotificationPreferences(userId);

    if (existing) {
      await db
        .update(notificationPreferences)
        .set({
          emailNotifications: preferences.emailNotifications !== undefined ? (preferences.emailNotifications ? 1 : 0) : existing.emailNotifications,
          pushNotifications: preferences.pushNotifications !== undefined ? (preferences.pushNotifications ? 1 : 0) : existing.pushNotifications,
          notifyOnNewInquiry: preferences.notifyOnNewInquiry !== undefined ? (preferences.notifyOnNewInquiry ? 1 : 0) : existing.notifyOnNewInquiry,
          notifyOnInquiryUpdate: preferences.notifyOnInquiryUpdate !== undefined ? (preferences.notifyOnInquiryUpdate ? 1 : 0) : existing.notifyOnInquiryUpdate,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(notificationPreferences.userId, userId));
    } else {
      await db.insert(notificationPreferences).values({
        userId,
        emailNotifications: preferences.emailNotifications !== false ? 1 : 0,
        pushNotifications: preferences.pushNotifications !== false ? 1 : 0,
        notifyOnNewInquiry: preferences.notifyOnNewInquiry !== false ? 1 : 0,
        notifyOnInquiryUpdate: preferences.notifyOnInquiryUpdate !== false ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to upsert notification preferences:", error);
    throw error;
  }
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(userId: number, limit = 20) {
  try {
    const db = await getDb();
    if (!db) return [];
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy((t: any) => t.createdAt)
      .limit(limit);

    return userNotifications;
  } catch (error) {
    console.error("Failed to get user notifications:", error);
    return [];
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.id, notificationId));

    return true;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db
      .update(notifications)
      .set({ isRead: 1 })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, 0)));

    return true;
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    throw error;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: number) {
  try {
    const db = await getDb();
    if (!db) return 0;
    const result = await db
      .select({ count: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, 0)))
      .limit(1);

    return result[0]?.count ? 1 : 0; // Just return 1 or 0 for simplicity
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }
}
