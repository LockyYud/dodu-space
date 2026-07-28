import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IeltsNav } from "@/components/ielts/ielts-nav";

export const metadata: Metadata = {
  title: "IELTS Tracker",
  description: "Chấm Writing bằng AI, kho lỗi cá nhân + ôn tập SRS.",
};

export default function IeltsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <IeltsNav />
      {children}
    </div>
  );
}
