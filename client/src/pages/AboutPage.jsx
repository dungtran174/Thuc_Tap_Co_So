import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về ApparelStore
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Chúng tôi mang đến cho bạn những sản phẩm thời trang chất lượng cao với phong cách hiện đại và giá cả hợp lý
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <section className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu Chuyện Của Chúng Tôi</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  ApparelStore được thành lập với sứ mệnh mang đến những sản phẩm thời trang chất lượng cao, 
                  phù hợp với xu hướng hiện đại và phong cách sống năng động của giới trẻ Việt Nam.
                </p>
                <p>
                  Chúng tôi tin rằng thời trang không chỉ là việc mặc đẹp, mà còn là cách thể hiện cá tính, 
                  sự tự tin và phong cách riêng của mỗi người.
                </p>
                <p>
                  Với đội ngũ thiết kế trẻ trung, sáng tạo và am hiểu xu hướng thời trang thế giới, 
                  chúng tôi không ngừng nghiên cứu và phát triển những sản phẩm mới nhất.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🏪</div>
                <p className="text-gray-600 font-medium">Cửa hàng thời trang hiện đại</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn theo đuổi trong mọi hoạt động kinh doanh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chất Lượng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết chỉ cung cấp những sản phẩm có chất lượng tốt nhất, 
                được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sáng Tạo</h3>
              <p className="text-gray-600">
                Đội ngũ thiết kế của chúng tôi luôn đổi mới, sáng tạo để mang đến 
                những sản phẩm độc đáo và phù hợp với xu hướng thời trang.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Khách Hàng</h3>
              <p className="text-gray-600">
                Sự hài lòng của khách hàng là ưu tiên hàng đầu. Chúng tôi luôn lắng nghe 
                và cải thiện để phục vụ khách hàng tốt nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội Ngũ Của Chúng Tôi</h2>
            <p className="text-gray-600 text-lg">
              Những con người tài năng và nhiệt huyết đang làm việc để mang đến trải nghiệm tốt nhất cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'Nguyễn Văn A', role: 'CEO & Founder', avatar: '👨‍💼' },
              { name: 'Trần Thị B', role: 'Creative Director', avatar: '👩‍🎨' },
              { name: 'Lê Văn C', role: 'Head of Marketing', avatar: '👨‍💻' },
              { name: 'Phạm Thị D', role: 'Customer Service', avatar: '👩‍💼' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Bạn có câu hỏi hoặc muốn hợp tác? Chúng tôi rất vui được lắng nghe từ bạn!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">📍</div>
                <h4 className="font-semibold mb-1">Địa chỉ</h4>
                <p className="text-sm opacity-90">123 Đường ABC, Quận 1, TP.HCM</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">📞</div>
                <h4 className="font-semibold mb-1">Hotline</h4>
                <p className="text-sm opacity-90">1900 1234</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl mb-2">✉️</div>
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-sm opacity-90">contact@apparelstore.com</p>
              </div>
            </div>

            <Link
              to="/shop"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Khám Phá Sản Phẩm
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;