import type { Metadata } from "next";
import ProfileClient from "./_components/ProfileClient";

export const metadata: Metadata = {
  title: "Tài khoản | Smart PC Store",
  description: "Xem và cập nhật thông tin tài khoản của bạn.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
