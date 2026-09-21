import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "輝蹴会 サイト管理",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
