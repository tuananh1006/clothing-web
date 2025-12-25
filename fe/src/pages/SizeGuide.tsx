import { useState } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { ROUTES } from '@/utils/constants'

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState<'how-to-measure' | 'tops' | 'bottoms' | 'fit-guide'>('how-to-measure')
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm')

  // Bảng size Áo (Tops) - từ UI gốc
  const topsSizeChart = [
    { size: 'S', chest: '88 - 92', shoulder: '42', length: '68', height: '160 - 165' },
    { size: 'M', chest: '93 - 97', shoulder: '44', length: '70', height: '165 - 170' },
    { size: 'L', chest: '98 - 102', shoulder: '46', length: '72', height: '170 - 175' },
    { size: 'XL', chest: '103 - 108', shoulder: '48', length: '74', height: '175 - 180' },
  ]

  // Bảng size Quần (Bottoms) - từ UI gốc
  const bottomsSizeChart = [
    { size: '28', waist: '70 - 72', hips: '88', thigh: '54', length: '98' },
    { size: '29', waist: '73 - 75', hips: '90', thigh: '56', length: '99' },
    { size: '30', waist: '76 - 78', hips: '92', thigh: '58', length: '100' },
    { size: '31', waist: '79 - 81', hips: '94', thigh: '60', length: '101' },
    { size: '32', waist: '82 - 84', hips: '96', thigh: '62', length: '102' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 px-4 py-2">
              <a
                href={ROUTES.HOME}
                className="text-[#4e8597] hover:text-primary transition-colors text-sm md:text-base font-medium leading-normal"
              >
                Trang chủ
              </a>
              <span className="text-[#4e8597] text-sm md:text-base font-medium leading-normal">/</span>
              <a
                href="#"
                className="text-[#4e8597] hover:text-primary transition-colors text-sm md:text-base font-medium leading-normal"
              >
                Hỗ trợ
              </a>
              <span className="text-[#4e8597] text-sm md:text-base font-medium leading-normal">/</span>
              <span className="text-text-main dark:text-white text-sm md:text-base font-medium leading-normal">
                Hướng dẫn chọn Size
              </span>
            </div>

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-3 px-4 py-6">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Hướng dẫn chọn Size
                </h1>
                <p className="text-[#4e8597] text-base font-normal leading-normal max-w-lg">
                  Tìm kiếm sự vừa vặn hoàn hảo cho trang phục của bạn cùng YORI. Tham khảo các thông số chi tiết dưới đây.
                </p>
              </div>
              <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white hover:bg-opacity-90 transition-all text-sm font-bold leading-normal tracking-[0.015em] shadow-sm">
                <span className="truncate">Liên hệ hỗ trợ</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="pb-6 sticky top-[65px] bg-background-light dark:bg-background-dark z-40 transition-colors duration-200">
              <div className="flex overflow-x-auto hide-scrollbar border-b border-[#d0e1e7] dark:border-gray-800 px-4 gap-8">
                <button
                  onClick={() => setActiveTab('how-to-measure')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap transition-colors ${
                    activeTab === 'how-to-measure'
                      ? 'border-b-primary text-text-main dark:text-white'
                      : 'border-b-transparent text-[#4e8597] hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Cách đo cơ thể</p>
                </button>
                <button
                  onClick={() => setActiveTab('tops')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap transition-colors ${
                    activeTab === 'tops'
                      ? 'border-b-primary text-text-main dark:text-white'
                      : 'border-b-transparent text-[#4e8597] hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Áo (Tops)</p>
                </button>
                <button
                  onClick={() => setActiveTab('bottoms')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap transition-colors ${
                    activeTab === 'bottoms'
                      ? 'border-b-primary text-text-main dark:text-white'
                      : 'border-b-transparent text-[#4e8597] hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Quần (Bottoms)</p>
                </button>
                <button
                  onClick={() => setActiveTab('fit-guide')}
                  className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap transition-colors ${
                    activeTab === 'fit-guide'
                      ? 'border-b-primary text-text-main dark:text-white'
                      : 'border-b-transparent text-[#4e8597] hover:text-primary'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">Lưu ý Form dáng</p>
                </button>
              </div>
            </div>

            {/* Section 1: How to Measure */}
            {activeTab === 'how-to-measure' && (
              <section className="px-4 py-6 scroll-mt-32" id="how-to-measure">
                <h2 className="text-text-main dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-6">
                  1. Cách đo cơ thể
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-[#1a2c32] rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                  {/* Visual Diagram Area */}
                  <div
                    className="relative order-2 md:order-2 flex items-center justify-center bg-background-light dark:bg-background-dark rounded-lg min-h-[300px]"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBc-z7FE20lXBj4xsJO6VqUV2hpFGP8HFYVSYNCxbFzradt5dc3Kiz0zxiKuFQxdiyKVMyB3W8wbYaUYYy7iBtxtv-bsOX5ZK87ajDDWI6rPid1pcWNkb58iaG2S5TPj6D-eUHZgi1fNoNiF_ERAO0M3RD2T2ImO-Wc5vU-61yeGrfoTL2Gl-nxrcoL5N8YJRCG-oKccoH1gFPA4dxYzbDRnDyNuzg5xtDf6CayDjJmdhWq5mwz10Xe1EYIYUZkE6HnGfCo91ERw4U")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Text Instructions */}
                  <div className="flex flex-col justify-center gap-6 order-1 md:order-1">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="text-text-main dark:text-white font-bold mb-1">Vòng Ngực (Chest)</h3>
                        <p className="text-[#4e8597] text-sm leading-relaxed">
                          Đo quanh phần rộng nhất của ngực, giữ thước dây song song với mặt đất.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="text-text-main dark:text-white font-bold mb-1">Vòng Eo (Waist)</h3>
                        <p className="text-[#4e8597] text-sm leading-relaxed">
                          Đo quanh phần hẹp nhất của eo (thường là ngay trên rốn), giữ thước hơi lỏng để thoải mái.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="text-text-main dark:text-white font-bold mb-1">Vòng Mông (Hips)</h3>
                        <p className="text-[#4e8597] text-sm leading-relaxed">
                          Đứng khép hai chân, đo phần nở nhất của hông và mông.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-lg border border-primary/20">
                      <p className="text-sm text-[#4e8597] italic">
                        <span className="font-bold text-primary mr-1">*Lưu ý:</span>
                        Nếu số đo của bạn nằm giữa hai size, hãy chọn size lớn hơn để thoải mái hơn.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Section 2: Tops Size Chart */}
            {activeTab === 'tops' && (
              <section className="px-4 py-6 scroll-mt-32" id="tops">
                <div className="flex justify-between items-center pb-4">
                  <h2 className="text-text-main dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                    2. Bảng size Áo (Tops)
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className={unit === 'cm' ? 'text-primary' : 'text-[#4e8597]'}>CM</span>
                    <button
                      onClick={() => setUnit(unit === 'cm' ? 'inch' : 'cm')}
                      className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${
                        unit === 'cm' ? 'bg-primary' : 'bg-[#d0e1e7]'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
                          unit === 'cm' ? 'left-1' : 'left-4'
                        }`}
                      />
                    </button>
                    <span className={unit === 'inch' ? 'text-primary' : 'text-[#4e8597]'}>INCH</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-white dark:bg-[#1a2c32] text-text-main dark:text-white font-bold uppercase border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-6 py-4 whitespace-nowrap bg-[#f8fbfc] dark:bg-[#1a2c32]">Size</th>
                          <th className="px-6 py-4 whitespace-nowrap">Ngực (Chest)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Vai (Shoulder)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Dài áo (Length)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Chiều cao (Height)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-background-dark text-[#4e8597] dark:text-[#a0b0b5]">
                        {topsSizeChart.map((row) => (
                          <tr
                            key={row.size}
                            className="hover:bg-[#f8fbfc] dark:hover:bg-[#152328] transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-text-main dark:text-white">{row.size}</td>
                            <td className="px-6 py-4">{row.chest}</td>
                            <td className="px-6 py-4">{row.shoulder}</td>
                            <td className="px-6 py-4">{row.length}</td>
                            <td className="px-6 py-4">{row.height}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: Bottoms Size Chart */}
            {activeTab === 'bottoms' && (
              <section className="px-4 py-6 scroll-mt-32" id="bottoms">
                <h2 className="text-text-main dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                  3. Bảng size Quần (Bottoms)
                </h2>
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-white dark:bg-[#1a2c32] text-text-main dark:text-white font-bold uppercase border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-6 py-4 whitespace-nowrap bg-[#f8fbfc] dark:bg-[#1a2c32]">Size</th>
                          <th className="px-6 py-4 whitespace-nowrap">Eo (Waist)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Mông (Hips)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Đùi (Thigh)</th>
                          <th className="px-6 py-4 whitespace-nowrap">Dài quần (Length)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-background-dark text-[#4e8597] dark:text-[#a0b0b5]">
                        {bottomsSizeChart.map((row) => (
                          <tr
                            key={row.size}
                            className="hover:bg-[#f8fbfc] dark:hover:bg-[#152328] transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-text-main dark:text-white">{row.size}</td>
                            <td className="px-6 py-4">{row.waist}</td>
                            <td className="px-6 py-4">{row.hips}</td>
                            <td className="px-6 py-4">{row.thigh}</td>
                            <td className="px-6 py-4">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Section 4: Fit Guide */}
            {activeTab === 'fit-guide' && (
              <section className="px-4 py-6 scroll-mt-32 mb-10" id="fit-guide">
                <h2 className="text-text-main dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-6">
                  4. Lưu ý về Form dáng (Fit Guide)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Regular Fit */}
                  <div className="bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="size-16 rounded-full bg-background-light dark:bg-background-dark mb-4 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                        accessibility_new
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Regular Fit</h3>
                    <p className="text-[#4e8597] text-sm">
                      Form tiêu chuẩn, vừa vặn với cơ thể. Thích hợp cho trang phục công sở và hàng ngày.
                    </p>
                  </div>
                  {/* Slim Fit */}
                  <div className="bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="size-16 rounded-full bg-background-light dark:bg-background-dark mb-4 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                        straighten
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Slim Fit</h3>
                    <p className="text-[#4e8597] text-sm">
                      Ôm nhẹ vào cơ thể để tôn dáng. Phù hợp với những người có thân hình cân đối.
                    </p>
                  </div>
                  {/* Oversized */}
                  <div className="bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="size-16 rounded-full bg-background-light dark:bg-background-dark mb-4 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                        checkroom
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Oversized</h3>
                    <p className="text-[#4e8597] text-sm">
                      Form rộng rãi, thoải mái, phong cách hiện đại. Nên chọn đúng size hoặc lùi 1 size nếu muốn vừa hơn.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SizeGuide
