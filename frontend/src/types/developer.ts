export type DeveloperProfileSourceType = "self-submitted" | "owner-curated"

export type DeveloperProfileConfidence = "self-reported" | "high" | "medium"

export interface DeveloperProfileSource {
  label: string
  url: string
}

export interface DeveloperProfileProvenance {
  sourceType: DeveloperProfileSourceType
  confidence: DeveloperProfileConfidence
  reviewedAt: string
  sources: DeveloperProfileSource[]
  correctionURL: string
  avatarSource: string
}

export interface Developer {
  id: string
  name: string
  avatar: string
  bio: string
  seoSummary?: string
  tools: string[]
  link: {
    url: string
    text: string
  }
  socialMediaLink?: string
  location?: string
  provenance: DeveloperProfileProvenance
}
