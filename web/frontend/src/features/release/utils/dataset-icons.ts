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
