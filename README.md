# TRA CỨU ĐIỂM THI LỚP 10 TỈNH PHÚ THỌ
### SỞ GIÁO DỤC VÀ ĐÀO TẠO PHÚ THỌ — NĂM HỌC 2026-2027

---

> [!IMPORTANT]
> **CHỈ MANG TÍNH CHẤT THAM KHẢO**
> - **Độ chính xác:** Khoảng **90%** — dữ liệu được thu thập (crawl) tự động từ hệ thống tra cứu của Sở GD&ĐT Phú Thọ.
> - **Lưu ý:** Kết quả chính thức cuối cùng hoàn toàn phụ thuộc vào công bố chính thức từ **Sở Giáo dục và Đào tạo tỉnh Phú Thọ**. Vui lòng không sử dụng dữ liệu này làm căn cứ pháp lý quyết định nhập học.

---

## 🌟 Giới thiệu

Cổng tra cứu điểm thi tuyển sinh lớp 10 tĩnh (client-side only), hỗ trợ tra cứu điểm thi và phân tích thứ hạng cho thí sinh tại tỉnh Phú Thọ. Trang web **không cần backend**, chạy hoàn toàn bằng HTML + CSS + JavaScript thuần.

Dữ liệu bao gồm **8 mã trường/hội đồng thi**, tương ứng với cả hệ **Công lập** lẫn **Tư thục / GDTX / Nghề**:

| Mã SBD | Hệ | Số thí sinh |
|---|---|---|
| **101** | Công lập | ~420 |
| **102** | Công lập | 574 |
| **104** | Công lập | ~120 |
| **112** | Công lập | ~350 |
| **114** | Công lập | ~380 |
| **115** | Công lập | ~200 |
| **206** | Tư thục / GDTX / Nghề | ~376 |
| **219** | Tư thục / GDTX / Nghề | ~544 |

---

## 🚀 Tính năng chính

### 🔍 Tra cứu thông minh
- **Instant Search:** Tìm kiếm theo Số Báo Danh (SBD) hoặc Họ và tên — không cần viết đúng dấu tiếng Việt, không phân biệt hoa/thường.
- **Gợi ý tự động (Autocomplete):** Hiển thị tối đa 6 thí sinh khớp nhất khi gõ.
- **Validation SBD:** Nếu nhập số, hệ thống kiểm tra xem SBD có bắt đầu đúng bằng mã trường đang chọn không — hiện cảnh báo nếu sai mã.

### 🏫 Chọn trường linh hoạt
- **Dropdown chọn trường:** Chuyển đổi nhanh giữa 8 mã trường/hội đồng thi bằng một thao tác.
- Khi đổi trường, dữ liệu, bảng xếp hạng, biểu đồ và thống kê đều tự động cập nhật.

### 🎓 Thẻ kết quả cá nhân
- Điểm chi tiết từng môn: **Toán**, **Ngữ văn**, **Tiếng Anh** và **Tổng điểm**.
- **Thứ hạng** chính xác (có tính các trường hợp bằng điểm nhau).
- **Phân tích Beat Rate:** Top bao nhiêu %, vượt hơn bao nhiêu thí sinh.
- **Khoảng cách** so với điểm trung bình và điểm Thủ khoa.
- Khi chọn thí sinh, trang tự động **cuộn lên thẻ kết quả**.
- Nút **"Xem vị trí trong bảng xếp hạng"** — cuộn và highlight đúng hàng của thí sinh trong bảng.

### 📊 Thống kê & Biểu đồ
- **3 chỉ số tổng quát:** Điểm trung bình, Điểm trung vị, Điểm Thủ khoa.
- **Biểu đồ phổ điểm:** Phân bố thí sinh theo các dải tổng điểm (< 10, 10–15, 15–20, 20–22, 22–24, 24–26).

### 🏆 Bảng xếp hạng toàn diện
- Hiển thị toàn bộ thí sinh, xếp theo tổng điểm giảm dần.
- Biểu tượng 🏆🥈🥉 cho Top 3.
- Hàng được tìm kiếm tự động lọc khi gõ tên/SBD.

### 📖 Chú thích cấu trúc SBD (có thể thu gọn)
- Giải thích cấu trúc 7 chữ số: `[Mã Trường: 3 số] + [Số Thứ Tự: 4 số]`.
- Phân biệt đầu số `1XX` (Công lập) và `2XX` (Tư thục / GDTX / Nghề).
- Dạng **toggle có thể đóng/mở** để không chiếm diện tích màn hình.

---

## 🧠 Quy luật đầu số SBD Phú Thọ

Số báo danh tuyển sinh lớp 10 Phú Thọ gồm **7 chữ số**: 3 chữ số đầu là mã hội đồng thi, 4 chữ số sau là số thứ tự thí sinh.

- **`101` – `199`**: Hội đồng thi các trường **THPT Công lập** (bắt buộc thi đủ 3 môn: Toán, Ngữ văn, Tiếng Anh).
- **`201` – `299`**: Hội đồng thi **THPT Tư thục**, **Trung tâm GDNN-GDTX** cấp huyện, hoặc trường **Trung cấp/Cao đẳng Nghề** (có thể chỉ thi 2 môn Toán + Văn, Tiếng Anh là tự chọn).
- Các đầu số từ **300 trở lên**: Không có thí sinh (đã xác minh qua quét toàn bộ).

---

## 🛠️ Deploy trang web

Trang web chạy hoàn toàn client-side, không cần server hay database. Có thể deploy miễn phí lên bất kỳ nền tảng hosting tĩnh nào.

### 1. Deploy qua GitHub Pages (Khuyến nghị)
```bash
git add .
git commit -m "Deploy lookup portal"
git push origin main
```
Vào **Settings** > **Pages** > Chọn nhánh `main`, thư mục `/root` > **Save**.

### 2. Deploy qua Netlify Drop
1. Truy cập [Netlify Drop](https://app.netlify.com/drop).
2. Kéo thả toàn bộ thư mục này vào trang.
3. Nhận link trực tuyến ngay lập tức!

---

## 📁 Cấu trúc tệp tin

```
dist-lookup/
├── index.html          # Giao diện trang tra cứu
├── lookup.js           # Logic tra cứu, tìm kiếm, xếp hạng, validation
├── index.css           # Stylesheet glassmorphism chung
├── data.json           # Dataset trường 102 (bản gốc)
├── data_101.json       # Dataset trường 101
├── data_102.json       # Dataset trường 102
├── data_104.json       # Dataset trường 104
├── data_112.json       # Dataset trường 112
├── data_114.json       # Dataset trường 114
├── data_115.json       # Dataset trường 115
├── data_206.json       # Dataset trường 206 (Tư thục/GDTX)
└── data_219.json       # Dataset trường 219 (Tư thục/GDTX)
```

---

## 💡 Hỗ trợ & Đóng góp

Nếu bạn thấy trang web này hữu ích:
- ⭐ **Star** repository tại [github.com/VietHoang24/Mark-finding-phutho](https://github.com/VietHoang24/Mark-finding-phutho)
- 👤 **Follow** tác giả tại [github.com/VietHoang24](https://github.com/VietHoang24)

---

*Chúc các sĩ tử Phú Thọ đạt kết quả thật cao và trúng tuyển vào ngôi trường THPT mong ước!* 🎓
