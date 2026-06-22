import { z } from "zod";

/** Where a source sits in the credibility hierarchy. */
export const SourceTier = z.enum([
  "official", // government / regulator — treated as fact
  "media", // established outlet
  "community", // forum / review site — experience
  "sns", // social post — signal only
  "user_submitted", // pending review
]);
export type SourceTier = z.infer<typeof SourceTier>;

export const TrustLevel = z.enum(["high", "medium", "low"]);
export type TrustLevel = z.infer<typeof TrustLevel>;

export const Source = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  title: z.string().min(1),
  tier: SourceTier,
  trustLevel: TrustLevel,
  publisher: z.string().optional(),
  lastCheckedAt: z.string().datetime().optional(),
});
export type Source = z.infer<typeof Source>;

/** Default trust for a tier before any manual override. */
export function defaultTrustForTier(tier: SourceTier): TrustLevel {
  switch (tier) {
    case "official":
      return "high";
    case "media":
      return "medium";
    case "community":
    case "sns":
    case "user_submitted":
      return "low";
  }
}

/** Tier weight added to vector similarity so official outranks experience. */
export const TIER_WEIGHT: Record<SourceTier, number> = {
  official: 0.15,
  media: 0.05,
  community: 0,
  user_submitted: 0,
  sns: -0.05,
};
