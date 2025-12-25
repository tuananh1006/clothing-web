import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] lg:h-[500px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2SKUoOEQliT6zI5_2rUgEFrVSvWQPcD3cjHRFtCDzaVNMXWwVfV94R2o12djBf5mzW4zAzSdCQrMNSnhG1rSlVpMLjiYT_9oc5kLFYFhNPVHpACM-lezQ7UP6jbg_Ixpf6z9gL01Aym8plLHL4kz3dP-gYG_KGANfjTrffUpOZkcf0BabuyLegxJc7uc5Uxn_3xE88nhqgcf3D8gssYbmFxf5t24KiW7uAJlrMuURGJ24TSZpHTgs6j2s-bIZXfbiTq-gGNI1aVo")' }}>
          <div className="text-center text-white px-4">
            <span className="uppercase tracking-[0.2em] text-sm md:text-base font-medium mb-3 block opacity-90">
              Giới thiệu
            </span>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
              Câu Chuyện Của YORI
            </h1>
            <p className="text-lg lg:text-xl font-light opacity-95 max-w-2xl mx-auto leading-relaxed">
              Hành trình tìm kiếm vẻ đẹp trong sự tối giản và cân bằng trong cuộc sống hiện đại.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 px-4 lg:px-40 bg-white dark:bg-[#1a2c32]">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="w-10 h-0.5 bg-primary"></span>
              <span className="text-primary font-bold tracking-widest text-xs uppercase">
                Triết lý thương hiệu
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-main dark:text-white leading-snug">
              "Less is More" - Vẻ đẹp của sự tinh giản
            </h2>
            <p className="text-text-sub dark:text-gray-400 text-lg leading-relaxed font-light">
              Tại YORI, chúng tôi tin rằng thời trang không nên là gánh nặng. Nó nên là phương tiện
              để bạn thể hiện cái tôi chân thật nhất, tự do nhất. Lấy cảm hứng từ phong cách sống
              Wabi-sabi của Nhật Bản, mỗi sản phẩm của YORI được tạo ra để loại bỏ những chi tiết
              thừa thãi, tôn vinh chất lượng cốt lõi và mang lại sự thoải mái tuyệt đối cho người
              mặc.
            </p>
          </div>
        </section>

        {/* Origin Section */}
        <section className="py-16 px-4 lg:px-40 bg-background-light dark:bg-background-dark">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-xl overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I")',
                }}
              ></div>
            </div>
            <div className="flex flex-col gap-8 justify-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-4">
                  Khởi nguồn từ sự tinh tế
                </h3>
                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 mb-6"></div>
                <p className="text-text-sub dark:text-gray-400 leading-relaxed mb-4">
                  Cái tên "YORI" trong tiếng Nhật mang ý nghĩa về sự tin cậy và nương tựa. Chúng
                  tôi khởi đầu với một xưởng may nhỏ tại ngoại ô Kyoto, nơi những người thợ thủ công
                  lành nghề dành hàng giờ để chọn lựa từng thớ vải linen, cotton tự nhiên tốt nhất.
                </p>
                <p className="text-text-sub dark:text-gray-400 leading-relaxed">
                  Chúng tôi không chạy theo xu hướng "thời trang nhanh" (fast fashion). Thay vào
                  đó, YORI theo đuổi những giá trị bền vững. Một chiếc áo YORI mua hôm nay vẫn sẽ
                  giữ nguyên phom dáng và vẻ đẹp sau nhiều năm tháng, trở thành người bạn đồng hành
                  trong mọi khoảnh khắc bình yên của cuộc sống.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-primary">2018</span>
                  <span className="text-sm text-text-sub dark:text-gray-500">Năm thành lập</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-primary">15+</span>
                  <span className="text-sm text-text-sub dark:text-gray-500">
                    Bộ sưu tập độc quyền
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-4 lg:px-40 bg-white dark:bg-[#1a2c32]">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-4xl">spa</span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">
                  Chất liệu Tự nhiên
                </h4>
                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                  Sử dụng 100% Cotton, Linen và các loại sợi tự nhiên thân thiện với làn da và môi
                  trường, mang lại cảm giác thoáng mát.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-4xl">architecture</span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">
                  Thiết kế Tối giản
                </h4>
                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                  Mọi chi tiết thừa đều bị loại bỏ. Chúng tôi tập trung vào phom dáng chuẩn mực và
                  tính ứng dụng cao trong đời sống.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-4xl">recycling</span>
                </div>
                <h4 className="text-xl font-bold text-text-main dark:text-white">
                  Cam kết Bền vững
                </h4>
                <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                  Quy trình sản xuất giảm thiểu rác thải, bao bì tái chế và cam kết đạo đức nghề
                  nghiệp với người lao động.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="py-16 px-4 lg:px-40 bg-gray-50 dark:bg-[#152329]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <span className="text-primary font-bold tracking-widest text-xs uppercase">
                Sự tỉ mỉ
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white">
                Nghệ thuật trong từng đường kim
              </h3>
              <p className="text-text-sub dark:text-gray-400 leading-relaxed">
                YORI cam kết về chất lượng gia công hàng đầu. Quy trình kiểm tra chất lượng (QC)
                của chúng tôi tuân thủ nghiêm ngặt các tiêu chuẩn Nhật Bản. Từ đường may giấu chỉ
                tinh tế đến kỹ thuật dệt kim, mọi thứ đều được thực hiện với sự tôn trọng cao nhất
                dành cho sản phẩm.
              </p>
              <ul className="flex flex-col gap-4 mt-4">
                <li className="flex items-center gap-3 text-text-main dark:text-gray-300">
                  <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </span>
                  <span className="font-medium">Kỹ thuật may cuộn (French seam)</span>
                </li>
                <li className="flex items-center gap-3 text-text-main dark:text-gray-300">
                  <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </span>
                  <span className="font-medium">Nhuộm màu tự nhiên an toàn</span>
                </li>
                <li className="flex items-center gap-3 text-text-main dark:text-gray-300">
                  <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </span>
                  <span className="font-medium">Độ bền màu vượt trội</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4 order-1 lg:order-2 h-full">
              <div className="space-y-4 mt-8">
                <div
                  className="rounded-xl overflow-hidden h-64 w-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6Lm7D1D1o3GUSaDSunJ2gOZxjeZ-odAMibuS7BpqAz2bNkvdaga74ni_BjQnSXRZ0qIrCQLAMu3_rXgjDkzwvFuClJvPpxxvJFVPe3ezVZFWOTD3BshXI8jIM5Tg8QYc3ETGvuzFG0Qb3UJt3Fk3p_6RtCWyuC_RgzMkkC7RjM25MN_LffPEMQHaMjQm5tonOuSgTod31DF4zAyQZClgkuQvJOgC3xa4UAJ-OTmHGFEt8k3xsiq5rmbVIAAbXioxT12bHNfYM0k0")',
                  }}
                ></div>
              </div>
              <div className="space-y-4">
                <div
                  className="rounded-xl overflow-hidden h-64 w-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY")',
                  }}
                ></div>
                <div className="p-4 bg-white dark:bg-[#1a2c32] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-primary uppercase mb-1">Craftsmanship</p>
                  <p className="text-sm text-text-main dark:text-white font-medium">
                    100% Hand-checked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 px-4 bg-white dark:bg-background-dark flex justify-center">
          <div className="max-w-4xl text-center relative px-6">
            <span className="material-symbols-outlined text-6xl text-gray-100 dark:text-gray-800 absolute -top-8 -left-4 lg:-left-12 select-none z-0">
              format_quote
            </span>
            <p className="text-xl md:text-3xl font-medium italic text-text-main dark:text-white leading-loose z-10 relative font-serif">
              "Chúng tôi muốn tạo ra những bộ quần áo mà bạn có thể mặc vào mỗi buổi sáng mà không
              cần suy nghĩ quá nhiều, nhưng vẫn cảm thấy bản thân mình đẹp đẽ, tự tin và trọn vẹn
              nhất."
            </p>
            <div className="mt-10 flex flex-col items-center">
              <div
                className="w-12 h-12 bg-gray-200 rounded-full mb-3 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA")',
                }}
              ></div>
              <p className="font-bold text-lg text-text-main dark:text-white">Kenji Yamamoto</p>
              <p className="text-sm text-text-sub dark:text-gray-500 uppercase tracking-wide mt-1">
                Giám đốc Sáng tạo
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
