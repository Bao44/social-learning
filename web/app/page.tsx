import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BookOpen,
  MessageCircle,
  Trophy,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Học tập Hợp tác",
      description:
        "Kết nối với bạn bè, tạo nhóm học tập và cùng nhau học tiếng Anh trong một môi trường tương tác.",
    },
    {
      icon: MessageCircle,
      title: "Diễn đàn Thảo luận",
      description:
        "Tham gia các cuộc thảo luận ý nghĩa, đặt câu hỏi và chia sẻ kiến thức với cộng đồng học tiếng Anh.",
    },
    {
      icon: Trophy,
      title: "Hệ thống Thành tích",
      description:
        "Theo dõi tiến độ, giành huy hiệu và kỷ niệm các mốc quan trọng với hệ thống học tập có tính thử thách.",
    },
    {
      icon: BookOpen,
      title: "Thư viện Nội dung Phong phú",
      description:
        "Truy cập hàng ngàn khóa học, hướng dẫn và tài nguyên học tiếng Anh được tuyển chọn bởi các chuyên gia.",
    },
    {
      icon: Globe,
      title: "Cộng đồng Toàn cầu",
      description:
        "Học hỏi từ nhiều góc nhìn đa dạng và kết nối với người học tiếng Anh trên toàn thế giới.",
    },
    {
      icon: Zap,
      title: "Học tập Cá nhân hóa",
      description:
        "Đề xuất do AI cung cấp được điều chỉnh theo phong cách và mục tiêu học tiếng Anh của bạn.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sinh viên Khoa học Máy tính",
      content:
        "Nền tảng này đã thay đổi cách tôi học tiếng Anh. Các nhóm học tập và thảo luận với bạn bè đã giúp tôi hiểu các chủ đề phức tạp dễ dàng hơn rất nhiều!",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Lập trình viên Chuyên nghiệp",
      content:
        "Cách tiếp cận hợp tác trong học tập thật đáng kinh ngạc. Tôi đã tạo dựng được những mối quan hệ lâu dài trong khi nâng cao kỹ năng tiếng Anh của mình.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Chuyên viên Marketing",
      content:
        "Cuối cùng, một nền tảng học tiếng Anh có tính xã hội và hấp dẫn. Sự hỗ trợ từ cộng đồng thật tuyệt vời!",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10K+", label: "Thành viên tích cực" },
    { number: "1000+", label: "Khóa học có sẵn" },
    { number: "25K+", label: "Nhóm học tập" },
    { number: "95%", label: "Tỷ lệ thành công" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-black rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-400 to-black bg-clip-text text-transparent">
                LearnTogether
                {/* SocialLearning */}
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tính năng
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cách hoạt động
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Đánh giá
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Giá
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-gray-500 to-gray-900 hover:from-gray-700 hover:to-black"
              >
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  🚀 Cùng chúng tôi và hơn 10,000+ thành viên tham gia nền tảng
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Mạng xã hội học{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-black bg-clip-text text-transparent">
                    {" "}
                    Tiếng Anh
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Kết nối với bạn bè, tham gia nhóm học tập và tăng tốc quá
                  trình học tiếng Anh của bạn thông qua giáo dục hợp tác. Trải
                  nghiệm sức mạnh của việc học tập xã hội.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-gray-500 to-gray-900 hover:from-gray-700 hover:to-black"
                >
                  <Link href="/register" className="flex items-center">
                    Bắt đầu ngay
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Nhóm học của John</p>
                      <p className="text-sm text-gray-600">
                        Phát triển React • 12 thành viên
                      </p>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-800">
                      Trực tuyến
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">SA</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3 flex-1">
                        <p className="text-sm">
                          Có ai giải thích React hooks được không?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">MK</AvatarFallback>
                      </Avatar>
                      <div className="bg-blue-100 rounded-lg p-3 flex-1">
                        <p className="text-sm">
                          Hooks cho phép bạn sử dụng trạng thái trong các thành
                          phần hàm...
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar
                          key={i}
                          className="w-6 h-6 border-2 border-white"
                        >
                          <AvatarFallback className="text-xs">
                            U{i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      +8 người khác đang học cùng nhau
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg">
                <Trophy className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-full p-3 shadow-lg">
                <CheckCircle className="w-6 h-6 text-green-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Tại sao chọn Học tập Xã hội?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trải nghiệm sức mạnh của giáo dục hợp tác với các tính năng được
              thiết kế để nâng cao hành trình học tiếng Anh của bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Bắt đầu chỉ với ba bước đơn giản
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tạo hồ sơ của bạn",
                description:
                  "Đăng ký và cho chúng tôi biết về mục tiêu và sở thích học tiếng Anh của bạn.",
              },
              {
                step: "02",
                title: "Tham gia nhóm học tập",
                description:
                  "Tìm và tham gia các nhóm học tập phù hợp với môn học và lịch trình của bạn.",
              },
              {
                step: "03",
                title: "Cùng nhau học hỏi",
                description:
                  "Hợp tác, thảo luận và đạt được mục tiêu học tiếng Anh của bạn với bạn bè.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Người học của chúng tôi nói gì
            </h2>
            <p className="text-xl text-gray-600">
              Tham gia cùng hàng ngàn người học thành công
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Sẵn sàng thay đổi cách học của bạn?
            </h2>
            <p className="text-xl text-blue-100">
              Tham gia cộng đồng người học của chúng tôi và bắt đầu hành trình
              học tiếng Anh hợp tác ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register" className="flex items-center">
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LearnTogether</span>
              </div>
              <p className="text-gray-400">
                Trao quyền cho người học thông qua giáo dục hợp tác và trải
                nghiệm học tập xã hội.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Nền tảng</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tính năng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Nhóm học tập
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Ứng dụng di động
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trung tâm Trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cộng đồng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Liên hệ với chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trạng thái
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Quyền riêng tư
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnTogether. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
