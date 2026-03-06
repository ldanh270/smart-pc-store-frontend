import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MonitorPlay, 
  Cpu, 
  ShieldCheck, 
  Headset, 
  Award, 
  Users, 
  Zap, 
  CheckCircle2,
  Wrench
} from "lucide-react";

export const metadata: Metadata = {
  title: "Về chúng tôi | Smart PC Store",
  description: "Tìm hiểu về Smart PC Store - Nơi đam mê công nghệ hội tụ và mang đến những giải pháp PC tối ưu nhất cho bạn.",
};

const stats = [
  { label: "Khách hàng tin dùng", value: "10,000+", icon: Users },
  { label: "PC đã lắp ráp", value: "5,000+", icon: MonitorPlay },
  { label: "Sản phẩm chính hãng", value: "100%", icon: ShieldCheck },
  { label: "Đánh giá 5 sao", value: "4.9/5", icon: Award },
];

const values = [
  {
    title: "Chất lượng hàng đầu",
    description: "Cam kết 100% linh kiện chính hãng, nguồn gốc rõ ràng từ các thương hiệu hàng đầu thế giới.",
    icon: Cpu,
  },
  {
    title: "Dịch vụ tận tâm",
    description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, luôn sẵn sàng tư vấn và hỗ trợ khách hàng nhiệt tình.",
    icon: Headset,
  },
  {
    title: "Giá cả cạnh tranh",
    description: "Mang đến những cấu hình tối ưu hiệu năng với mức chi phí hợp lý nhất trên thị trường.",
    icon: Zap,
  },
  {
    title: "Bảo hành chuẩn chỉ",
    description: "Chính sách bảo hành minh bạch, nhanh chóng và hỗ trợ kỹ thuật trọn đời cho mọi dàn PC.",
    icon: Wrench,
  },
];

const teamData = [
  {
    name: "Nguyễn Văn A",
    role: "Giám Đốc Kỹ Thuật (CTO)",
    image: "/avatars/avatar-1.jpg", 
    description: "Hơn 10 năm kinh nghiệm trong lĩnh vực phần cứng & thiết kế hệ thống PC High-end."
  },
  {
    name: "Trần Thị B",
    role: "Trưởng Phòng Sale",
    image: "/avatars/avatar-2.jpg",
    description: "Chuyên gia tư vấn cấu hình, luôn đem đến giải pháp tối ưu chi phí cho khách hàng."
  },
  {
    name: "Lê Hoàng C",
    role: "Chuyên Viên Lắp Ráp",
    image: "/avatars/avatar-3.jpg",
    description: "Đôi tay vàng trong làng đi dây, đảm bảo mỗi hệ thống đều gọn gàng, thoáng mát."
  },
  {
    name: "Phạm Minh D",
    role: "Hỗ Trợ Khách Hàng",
    image: "/avatars/avatar-4.jpg",
    description: "Luôn túc trực 24/7 để giải đáp mọi thắc mắc và hỗ trợ kỹ thuật cho người dùng."
  }
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-100 md:h-125 flex items-center justify-center overflow-hidden">
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
        
        <div className="container relative z-10 text-center text-white px-4 md:px-6">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
            Đam Mê Công Nghệ <br className="hidden sm:block" /> 
            <span className="text-primary">Kiến Tạo Sức Mạnh</span>
          </h1>
          <p className="max-w-175 mx-auto text-lg md:text-xl text-gray-200 drop-shadow">
            Hành trình mang đến những dàn PC mạnh mẽ, tối ưu hoá cho nhu cầu 
            của game thủ, nhà sáng tạo và chuyên gia.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex flex-row items-center justify-center py-12 bg-muted/30 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold">{stat.value}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="flex flex-row items-center justify-center py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Từ đam mê đến những dàn PC đỉnh cao</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Khởi nguồn từ một nhóm kỹ sư trẻ đam mê phần cứng máy tính và eSports, Smart PC Store 
                  được thành lập với mong muốn thay đổi cách mọi người mua sắm PC. Chúng tôi hiểu rằng, 
                  mỗi bộ PC không chỉ là cỗ máy vô tri, mà là công cụ đắc lực đồng hành cùng bạn trong công việc và giải trí.
                </p>
                <p>
                  Thay vì những cấu hình lắp ráp sẵn rập khuôn, chúng tôi tư vấn và cá nhân hoá theo 
                  đúng nhu cầu và ngân sách của từng khách hàng. Mỗi linh kiện, mỗi đường đi dây đều 
                  được thực hiện với sự tỉ mỉ tối đa.
                </p>
              </div>
              
              <ul className="space-y-3 mt-6">
                {[
                  "Linh kiện nhập khẩu chính ngạch",
                  "Quy trình test hiệu năng nghiêm ngặt",
                  "Cài đặt và tối ưu hoá phần mềm miễn phí",
                  "Giao hàng và lắp đặt tận nơi"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-md">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0" />
                    <span className="text-left">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero/slide-pc-gaming.png"
                alt="Building a Custom PC"
                fill
                className="object-cover"
              />
              {/* Optional overlay gradient for image depth */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <p className="font-semibold text-xl">Sự tỉ mỉ tạo nên sự khác biệt</p>
                  <p className="text-gray-300 mt-1">Góc kỹ thuật của Smart PC Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="flex flex-row items-center justify-center py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-200 mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Giá Trị Cốt Lõi</h2>
            <p className="text-lg text-muted-foreground">
              Kim chỉ nam trong mọi hoạt động của Smart PC Store, đảm bảo mang đến 
              trải nghiệm tuyệt vời nhất cho mỗi khách hàng.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-5 flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary inline-flex">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-xl">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-row items-center justify-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0" />
        <div className="container relative z-10 px-4 md:px-6 text-center flex flex-col items-center space-y-8">
          <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-2">
            <MonitorPlay className="h-10 w-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-150">
            Sẵn sàng để sở hữu bộ PC trong mơ của riêng bạn?
          </h2>
          <p className="text-lg text-muted-foreground max-w-150 mb-4">
            Khám phá các cấu hình tối ưu hoặc trò chuyện với kỹ thuật viên để build PC theo ý muốn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="font-medium px-8 text-md h-12">
              <Link href="/">
                Mua Sắm Ngay
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
