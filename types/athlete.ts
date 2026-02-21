export interface CompetitionRecord {
  event: string
  date: string
  opponent: string
  result: 'Win' | 'Loss' | 'Draw' | 'No Contest'
  method: string
  round?: number | null
  notes?: string
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  youtube?: string
  website?: string
}

export interface Athlete {
  id: string
  name: string
  slug: string
  sport: string
  bio?: string
  image_url?: string
  competition_record: CompetitionRecord[]
  nationality: string
  weight_class?: string
  team?: string
  social_links: SocialLinks
  created_at: string
  updated_at: string
}
