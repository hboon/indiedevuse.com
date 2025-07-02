export interface Developer {
  id: string
  name: string
  avatar: string
  bio: string
  tools: string[]
  link: {
    url: string
    text: string
  }
  socialMediaLink?: string
  location?: string
}
