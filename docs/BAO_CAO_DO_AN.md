5.1. Ưu điểm của đồ án
Đồ án "Xây dựng website thương mại điện tử YORI Fashion" đã hoàn thành mục tiêu cung cấp một
nền tảng mua sắm trực tuyến hoàn chỉnh cho ngành thời trang, cho phép người dùng có thể mua sắm,
quản lý giỏ hàng và đặt hàng một cách thuận tiện mà không cần đến cửa hàng vật lý.
Các chức năng cơ bản đã được triển khai thành công, bao gồm:
• Quản lý người dùng: Hệ thống đăng ký và đăng nhập với xác thực JWT, cho phép người dùng
tạo tài khoản, quản lý thông tin cá nhân, cập nhật avatar và theo dõi lịch sử mua hàng. Hệ thống
tự động làm mới token để đảm bảo trải nghiệm liên tục cho người dùng.
• Quản lý sản phẩm: Website cung cấp danh mục sản phẩm đầy đủ với khả năng tìm kiếm, lọc
theo danh mục, giá cả, kích thước và màu sắc. Trang chi tiết sản phẩm hiển thị nhiều hình ảnh
với gallery, thông tin đầy đủ về sản phẩm, hướng dẫn chọn size và hiển thị đánh giá từ khách
hàng.
• Quản lý giỏ hàng: Người dùng có thể thêm sản phẩm vào giỏ hàng với các tùy chọn về kích
thước và màu sắc, điều chỉnh số lượng, xóa sản phẩm và xem tổng tiền trước khi thanh toán.
Giỏ hàng được đồng bộ với tài khoản người dùng và lưu trữ trên server.
• Quy trình thanh toán: Hệ thống cung cấp quy trình đặt hàng hoàn chỉnh bao gồm nhập thông
tin giao hàng với chọn tỉnh/thành phố, quận/huyện, phường/xã, chọn phương thức thanh toán và
xác nhận đơn hàng. Người dùng có thể theo dõi trạng thái đơn hàng và xem chi tiết từng đơn
hàng đã đặt.
• Hệ thống đánh giá sản phẩm: Cho phép khách hàng đã mua hàng đánh giá và viết review về
sản phẩm với hệ thống rating 5 sao. Người dùng có thể xem các đánh giá của khách hàng khác
để hỗ trợ quyết định mua hàng. Admin có thể quản lý và kiểm duyệt các đánh giá.
• Trang quản trị admin: Cung cấp dashboard với các biểu đồ thống kê doanh thu, số lượng đơn
hàng, khách hàng theo thời gian. Admin có thể quản lý sản phẩm (thêm, sửa, xóa, upload ảnh),
quản lý đơn hàng (xem, cập nhật trạng thái), quản lý khách hàng và cài đặt hệ thống.
• Giao diện người dùng: Website được thiết kế với giao diện hiện đại, tối giản và dễ sử dụng.
Hỗ trợ chế độ tối (Dark Mode) để tăng trải nghiệm người dùng, responsive design hoạt động tốt
trên nhiều thiết bị từ điện thoại, máy tính bảng đến máy tính để bàn.
• Công nghệ hiện đại: Đồ án sử dụng React 18 với TypeScript cho frontend, đảm bảo type safety
và giảm thiểu lỗi. Backend được xây dựng với Node.js và Express, sử dụng MongoDB để lưu trữ
dữ liệu. Toàn bộ codebase được viết bằng TypeScript, tăng tính nhất quán và dễ bảo trì.
• Xử lý lỗi và thông báo: Hệ thống có cơ chế xử lý lỗi toàn diện với thông báo rõ ràng cho
người dùng. Sử dụng toast notifications để thông báo các hành động thành công hoặc thất bại
một cách trực quan và không làm gián đoạn trải nghiệm người dùng.
• Validation và bảo mật: Form validation được thực hiện ở cả frontend (với Zod và React Hook
Form) và backend (với express-validator), đảm bảo dữ liệu đầu vào hợp lệ. Mật khẩu được mã
hóa bằng SHA256 với secret key, và hệ thống sử dụng JWT tokens với thời gian hết hạn để bảo
vệ tài khoản người dùng.
Với kiến trúc code được tổ chức tốt và sử dụng các công nghệ hiện đại, website này đáp ứng được
nhu cầu mua sắm trực tuyến cho người dùng phổ thông và cung cấp công cụ quản lý hiệu quả cho
quản trị viên. Website đã được tối ưu hóa để hoạt động mượt mà trên các trình duyệt phổ biến, với
tốc độ tải trang nhanh và khả năng tương thích trên nhiều thiết bị khác nhau.

5.2. Hạn chế của đồ án
Bên cạnh những ưu điểm, cũng có những khó khăn, thử thách như:
• Vấn đề thanh toán: Đồ án chưa tích hợp các cổng thanh toán thực tế như VNPay, MoMo hay
các phương thức thanh toán trực tuyến khác. Hiện tại chỉ có quy trình đặt hàng với thanh toán
giả lập, chưa xử lý được các giao dịch thanh toán thực tế và callback từ các cổng thanh toán.
• Vấn đề email và thông báo: Hệ thống chưa tích hợp dịch vụ gửi email để gửi email xác nhận
đơn hàng, email reset mật khẩu hay thông báo thay đổi trạng thái đơn hàng cho khách hàng.
Điều này làm giảm khả năng tương tác và thông tin kịp thời giữa hệ thống và người dùng.
• Thiếu tính năng wishlist: Website chưa có tính năng lưu sản phẩm yêu thích vào danh sách
riêng, khiến người dùng không thể lưu lại các sản phẩm quan tâm để xem lại sau này hoặc nhận
thông báo khi sản phẩm giảm giá.
• Vấn đề hiệu suất: Website chưa được tối ưu hóa hoàn toàn về mặt hiệu suất. Chưa có code
splitting để tải các trang một cách lazy, chưa có image lazy loading và optimization, chưa có
caching strategy cho các API calls. Bundle size có thể được tối ưu thêm để giảm thời gian tải
trang.
• Thiếu testing: Đồ án chưa có hệ thống testing tự động bao gồm unit tests, integration tests
và end-to-end tests. Điều này làm tăng rủi ro khi có thay đổi code và khó đảm bảo chất lượng
của các tính năng mới được thêm vào.
• Vấn đề bảo mật nâng cao: Mặc dù đã có các biện pháp bảo mật cơ bản, nhưng hệ thống chưa
có CSRF protection, chưa có rate limiting để bảo vệ API khỏi abuse, và chưa có security
logging để theo dõi các hoạt động đáng ngờ. Một số security headers như CSP, X-Frame-Options
có thể chưa được cấu hình đầy đủ.
• Chưa có Progressive Web App: Website chưa được phát triển thành Progressive Web App
(PWA) nên không hỗ trợ offline, không có push notifications và không thể cài đặt như một ứng
dụng trên thiết bị di động.
• Thiếu tính năng marketing: Hệ thống chưa có các tính năng marketing như hệ thống mã giảm
giá (coupon), flash sales với countdown timer, chương trình khách hàng thân thiết (loyalty
program) hay chương trình giới thiệu bạn bè (referral program).
• Chưa tích hợp analytics: Website chưa tích hợp các công cụ phân tích như Google Analytics
để theo dõi hành vi người dùng, conversion rate và các metrics quan trọng khác để tối ưu hóa
trải nghiệm và tăng doanh số.
• Vấn đề scalability: Kiến trúc hiện tại là monolithic, chưa được thiết kế để scale theo chiều
ngang (horizontal scaling). Chưa có caching layer như Redis, chưa có database indexing tối ưu
và chưa có strategy cho việc sharding database khi hệ thống phát triển lớn.
• Chưa có CI/CD: Dự án chưa có pipeline CI/CD tự động để test và deploy code, khiến việc
triển khai phải thực hiện thủ công và tăng rủi ro lỗi trong quá trình deployment.
• Thiếu monitoring và logging: Hệ thống chưa có công cụ monitoring để theo dõi hiệu suất và
phát hiện lỗi real-time. Chưa có centralized logging để dễ dàng debug và phân tích các vấn đề
khi xảy ra.

5.3. Hướng phát triển của đồ án
Dưới đây là một số hướng phát triển và mở rộng website trong tương lai để nâng cao trải nghiệm
người dùng và gia tăng tính năng của sản phẩm:
• Tích hợp thanh toán trực tuyến:
o Tích hợp các cổng thanh toán phổ biến tại Việt Nam như VNPay, MoMo, ZaloPay để người
dùng có thể thanh toán trực tuyến một cách an toàn và thuận tiện.
o Xử lý payment webhooks để cập nhật trạng thái đơn hàng tự động sau khi thanh toán thành
công.
o Tạo trang lịch sử giao dịch chi tiết để người dùng có thể theo dõi các khoản thanh toán đã
thực hiện.
o Hỗ trợ nhiều phương thức thanh toán như thẻ tín dụng, ví điện tử, chuyển khoản ngân hàng.
• Tích hợp dịch vụ email:
o Tích hợp SendGrid, AWS SES hoặc các dịch vụ email khác để gửi email tự động cho người
dùng.
o Gửi email xác nhận đơn hàng với thông tin chi tiết về sản phẩm, giá cả và thời gian giao
hàng dự kiến.
o Gửi email reset mật khẩu khi người dùng quên mật khẩu.
o Gửi email thông báo khi trạng thái đơn hàng thay đổi (đã xác nhận, đang giao hàng, đã giao
hàng).
o Tích hợp email marketing để gửi newsletter, thông báo khuyến mãi và sản phẩm mới.
• Thêm tính năng wishlist:
o Cho phép người dùng lưu sản phẩm yêu thích vào danh sách riêng với nút "Yêu thích" trên
product card.
o Tạo trang quản lý wishlist để người dùng xem và quản lý các sản phẩm đã lưu.
o Gửi thông báo khi sản phẩm trong wishlist giảm giá hoặc có lại hàng.
o Cho phép chia sẻ wishlist với bạn bè hoặc chuyển đổi wishlist thành giỏ hàng.
• Tối ưu hóa hiệu suất:
o Implement code splitting với React.lazy() để tải các routes một cách lazy, giảm bundle
size ban đầu.
o Thêm image lazy loading và optimization để tăng tốc độ tải trang.
o Implement service worker cho caching static assets và API responses.
o Thêm Redis caching cho các database queries thường dùng để giảm tải cho database.
o Tối ưu bundle size với tree-shaking và loại bỏ các dependencies không cần thiết.
• Xây dựng hệ thống testing:
o Setup Jest và React Testing Library để viết unit tests cho components, hooks và services.
o Viết integration tests cho API endpoints với Supertest.
o Setup Playwright hoặc Cypress để viết end-to-end tests cho các user flows quan trọng.
o Đặt mục tiêu code coverage ít nhất 80% để đảm bảo chất lượng code.
o Tích hợp testing vào CI/CD pipeline để chạy tests tự động trước khi deploy.
• Cải thiện bảo mật:
o Implement CSRF protection với CSRF tokens cho các POST/PUT/DELETE requests.
o Thêm rate limiting với express-rate-limit để bảo vệ API khỏi abuse và DDoS attacks.
o Cấu hình security headers như Content-Security-Policy (CSP), X-Frame-Options, X-ContentType-Options.
o Implement security logging để theo dõi các hoạt động đáng ngờ như failed login attempts.
o Thêm input sanitization để tránh XSS attacks.
• Phát triển Progressive Web App (PWA):
o Implement service worker để hỗ trợ offline functionality.
o Thêm manifest.json để cho phép cài đặt website như một ứng dụng trên thiết bị di động.
o Implement push notifications để thông báo cho người dùng về đơn hàng, khuyến mãi.
o Tối ưu hóa cho mobile với touch gestures và responsive design tốt hơn.
• Thêm tính năng marketing:
o Xây dựng hệ thống mã giảm giá (coupon system) với các loại discount như percentage và fixed
amount, có thể áp dụng cho toàn bộ đơn hàng hoặc sản phẩm cụ thể.
o Tạo tính năng flash sales với countdown timer, limited quantity và real-time inventory
updates.
o Phát triển chương trình khách hàng thân thiết (loyalty program) với hệ thống điểm thưởng,
membership tiers và các ưu đãi đặc biệt.
o Tạo chương trình giới thiệu bạn bè (referral program) để khuyến khích người dùng mời bạn
bè sử dụng dịch vụ.
• Tích hợp analytics và tracking:
o Tích hợp Google Analytics để theo dõi hành vi người dùng, page views, conversion rate.
o Implement custom event tracking để theo dõi các hành động quan trọng như add to cart, checkout,
purchase.
o Tạo analytics dashboard cho admin để xem các metrics quan trọng như doanh thu, số lượng
đơn hàng, sản phẩm bán chạy.
o Sử dụng dữ liệu analytics để tối ưu hóa UX và tăng conversion rate.
• Cải thiện scalability:
o Thiết kế lại kiến trúc theo hướng microservices, tách thành các services độc lập như Auth
Service, Product Service, Order Service, Payment Service.
o Implement API Gateway để quản lý và route requests đến các services.
o Thêm database indexing cho các queries thường dùng để tăng tốc độ truy vấn.
o Implement database sharding strategy để phân tán dữ liệu khi hệ thống phát triển lớn.
o Sử dụng message queue (RabbitMQ, Kafka) cho service-to-service communication.
• Xây dựng CI/CD pipeline:
o Setup GitHub Actions hoặc GitLab CI để tự động hóa quy trình build, test và deploy.
o Tạo các môi trường riêng biệt: development, staging, production.
o Implement automated testing trong pipeline để đảm bảo code quality trước khi deploy.
o Sử dụng blue-green deployment strategy để giảm downtime khi deploy.
o Tự động hóa việc deploy lên cloud platforms như AWS, Vercel, Heroku.
• Monitoring và logging:
o Tích hợp Application Performance Monitoring (APM) tools như New Relic, Datadog để theo dõi
hiệu suất ứng dụng.
o Setup centralized logging với ELK stack (Elasticsearch, Logstash, Kibana) hoặc sử dụng
cloud logging services.
o Tích hợp error tracking với Sentry để phát hiện và thông báo lỗi real-time.
o Tạo dashboards để theo dõi các metrics quan trọng như response time, error rate, throughput.
o Setup alerts để thông báo khi có vấn đề xảy ra với hệ thống.
• Phát triển ứng dụng di động:
o Phát triển ứng dụng native cho iOS và Android sử dụng React Native để chia sẻ business
logic với web app.
o Tích hợp các tính năng native như camera để quét mã QR, push notifications, biometric
authentication.
o Hỗ trợ offline mode và sync data khi có kết nối mạng.
o Deploy lên App Store và Google Play Store.
• Tính năng nâng cao khác:
o Tích hợp social login (Google, Facebook, Apple) để người dùng có thể đăng nhập nhanh chóng
mà không cần tạo tài khoản mới.
o Phát triển hệ thống gợi ý sản phẩm sử dụng machine learning để đề xuất sản phẩm phù hợp
với sở thích người dùng.
o Thêm tính năng so sánh sản phẩm để người dùng có thể so sánh nhiều sản phẩm side-by-side.
o Tích hợp live chat support với chatbot để hỗ trợ khách hàng 24/7.
o Hỗ trợ đa ngôn ngữ (i18n) để mở rộng thị trường quốc tế.
o Tích hợp shipping APIs (GHN, GHTK, Viettel Post) để tính toán phí vận chuyển và tracking
đơn hàng tự động.
