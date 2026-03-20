import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  Award,
  CheckCircle2,
  Cpu,
  Headset,
  MonitorPlay,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Về chúng tôi | Smart PC Store",
  description:
    "Tìm hiểu về Smart PC Store - Nơi đam mê công nghệ hội tụ và mang đến những giải pháp PC tối ưu nhất cho bạn.",
}

const stats = [
  { label: "Khách hàng tin dùng", value: "10,000+", icon: Users },
  { label: "PC đã lắp ráp", value: "5,000+", icon: MonitorPlay },
  { label: "Sản phẩm chính hãng", value: "100%", icon: ShieldCheck },
  { label: "Đánh giá 5 sao", value: "4.9/5", icon: Award },
]

const values = [
  {
    title: "Chất lượng hàng đầu",
    description:
      "Cam kết 100% linh kiện chính hãng, nguồn gốc rõ ràng từ các thương hiệu hàng đầu thế giới.",
    icon: Cpu,
  },
  {
    title: "Dịch vụ tận tâm",
    description:
      "Đội ngũ kỹ thuật viên giàu kinh nghiệm, luôn sẵn sàng tư vấn và hỗ trợ khách hàng nhiệt tình.",
    icon: Headset,
  },
  {
    title: "Giá cả cạnh tranh",
    description:
      "Mang đến những cấu hình tối ưu hiệu năng với mức chi phí hợp lý nhất trên thị trường.",
    icon: Zap,
  },
  {
    title: "Bảo hành chuẩn chỉ",
    description:
      "Chính sách bảo hành minh bạch, nhanh chóng và hỗ trợ kỹ thuật trọn đời cho mọi dàn PC.",
    icon: Wrench,
  },
]

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex h-100 items-center justify-center overflow-hidden md:h-125">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/slide-setup.png"
            alt="Smart PC Store Gaming Setup"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 container px-4 text-center text-white md:px-6">
          <h1 className="mb-4 text-4xl font-bold tracking-tight drop-shadow-md md:text-5xl lg:text-6xl">
            Đam Mê Công Nghệ <br className="hidden sm:block" />
            <span className="text-primary">Kiến Tạo Sức Mạnh</span>
          </h1>
          <p className="mx-auto max-w-175 text-lg text-gray-200 drop-shadow md:text-xl">
            Hành trình mang đến những dàn PC mạnh mẽ, tối ưu hoá cho nhu cầu của game thủ, nhà sáng
            tạo và chuyên gia.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 flex flex-row items-center justify-center border-b py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex flex-col items-center justify-center space-y-2">
                  <div className="bg-primary/10 mb-2 rounded-full p-3">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-3xl font-bold md:text-4xl">{stat.value}</h3>
                  <p className="text-muted-foreground text-sm font-medium md:text-base">
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="flex flex-row items-center justify-center py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-6 text-center md:items-start md:text-left">
              <div className="bg-muted inline-block rounded-lg px-3 py-1 text-sm font-medium">
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Từ đam mê đến những dàn PC đỉnh cao
              </h2>
              <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                <p>
                  Khởi nguồn từ một nhóm kỹ sư trẻ đam mê phần cứng máy tính và eSports, Smart PC
                  Store được thành lập với mong muốn thay đổi cách mọi người mua sắm PC. Chúng tôi
                  hiểu rằng, mỗi bộ PC không chỉ là cỗ máy vô tri, mà là công cụ đắc lực đồng hành
                  cùng bạn trong công việc và giải trí.
                </p>
                <p>
                  Thay vì những cấu hình lắp ráp sẵn rập khuôn, chúng tôi tư vấn và cá nhân hoá theo
                  đúng nhu cầu và ngân sách của từng khách hàng. Mỗi linh kiện, mỗi đường đi dây đều
                  được thực hiện với sự tỉ mỉ tối đa.
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  "Linh kiện nhập khẩu chính ngạch",
                  "Quy trình test hiệu năng nghiêm ngặt",
                  "Cài đặt và tối ưu hoá phần mềm miễn phí",
                  "Giao hàng và lắp đặt tận nơi",
                ].map((item, i) => (
                  <li key={i} className="text-md flex items-center">
                    <CheckCircle2 className="text-primary mr-3 h-5 w-5 shrink-0" />
                    <span className="text-left">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-100 overflow-hidden rounded-2xl shadow-2xl md:h-125">
              <Image
                src="/hero/slide-pc-gaming.png"
                alt="Building a Custom PC"
                fill
                className="object-cover"
              />
              {/* Optional overlay gradient for image depth */}
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/50 to-transparent">
                <div className="p-8 text-white">
                  <p className="text-xl font-semibold">Sự tỉ mỉ tạo nên sự khác biệt</p>
                  <p className="mt-1 text-gray-300">Góc kỹ thuật của Smart PC Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-muted/50 flex flex-row items-center justify-center py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-200 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Giá Trị Cốt Lõi</h2>
            <p className="text-muted-foreground text-lg">
              Kim chỉ nam trong mọi hoạt động của Smart PC Store, đảm bảo mang đến trải nghiệm tuyệt
              vời nhất cho mỗi khách hàng.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-background/50 border-none shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center space-y-5 p-6 text-center">
                  <div className="bg-primary/10 text-primary inline-flex rounded-2xl p-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative flex flex-row items-center justify-center overflow-hidden py-20">
        <div className="bg-primary/5 absolute inset-0 z-0" />
        <div className="relative z-10 container flex flex-col items-center space-y-8 px-4 text-center md:px-6">
          <div className="bg-primary/10 text-primary mb-2 inline-flex rounded-full p-4">
            <MonitorPlay className="h-10 w-10" />
          </div>
          <h2 className="max-w-150 text-3xl font-bold tracking-tight md:text-4xl">
            Sẵn sàng để sở hữu bộ PC trong mơ của riêng bạn?
          </h2>
          <p className="text-muted-foreground mb-4 max-w-150 text-lg">
            Khám phá các cấu hình tối ưu hoặc trò chuyện với kỹ thuật viên để build PC theo ý muốn.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="text-md h-12 px-8 font-medium">
              <Link href="/">Mua Sắm Ngay</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
