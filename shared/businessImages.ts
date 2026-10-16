/** Cover images for business transfer listings (Unsplash, industry-themed). */
const BY_ID: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  2: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
  3: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  4: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  5: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  6: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
};

const BY_INDUSTRY: Record<string, string> = {
  "F&B": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  "E-commerce": "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  Beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  Services: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
};

const DEFAULT =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";

export function getBusinessImageUrl(listing: {
  id: number;
  industry: string;
  imageUrl?: string;
}): string {
  if (listing.imageUrl) return listing.imageUrl;
  return BY_ID[listing.id] ?? BY_INDUSTRY[listing.industry] ?? DEFAULT;
}
