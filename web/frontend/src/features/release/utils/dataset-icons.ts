import { Building2, Bus, Database, FileQuestion, GraduationCap, Headset, HeartPulse, Landmark, Network, Zap, type LucideIcon } from 'lucide-react'

/** An icon for each challenge dataset, so the list scans by subject before the name is read. */
const DATASET_ICONS: Record<string, LucideIcon> = {
  health: HeartPulse,
  customer_service: Headset,
  cyber: Network,
  education: GraduationCap,
  energy: Zap,
  finance: Landmark,
  mobility: Bus,
  public_admin: Building2,
  smart_city: Building2,
  unseen: FileQuestion,
}

export function datasetIcon(name: string): LucideIcon {
  return DATASET_ICONS[name] ?? Database
}

/** Each subject's tag: a word for its domain and a colour of its own, so the cards tell apart at a glance. */
const DATASET_DOMAINS: Record<string, { label: string; palette: string }> = {
  health: { label: 'Healthcare', palette: 'pink' },
  customer_service: { label: 'Customer service', palette: 'purple' },
  cyber: { label: 'Cybersecurity', palette: 'blue' },
  education: { label: 'Education', palette: 'yellow' },
  energy: { label: 'Energy', palette: 'orange' },
  finance: { label: 'Finance', palette: 'teal' },
  mobility: { label: 'Mobility', palette: 'cyan' },
  public_admin: { label: 'Public sector', palette: 'gray' },
  smart_city: { label: 'Smart city', palette: 'green' },
  unseen: { label: 'Unseen, unnamed columns', palette: 'accent' },
}

export function datasetDomain(name: string) {
  return DATASET_DOMAINS[name] ?? { label: 'Your data', palette: 'brand' }
}
