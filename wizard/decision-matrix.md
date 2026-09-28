# Wiki-eReader Wizard — Bảng tiêu chí lựa chọn → kết quả

> Đây là bảng tham chiếu khi bảo trì Wizard. Khi anh yêu cầu sửa hoặc bổ sung một tiêu chí, em cập nhật bảng này trước, sau đó mới sửa `questions.json`, `models.json` và `index.html`.
>
> Mục tiêu: tránh nhầm giữa **tiêu chí người dùng chọn**, **điều kiện loại cứng**, **điểm xếp hạng**, **giá**, và **kết quả hiển thị**.

## 1. Luồng quyết định tổng thể

| Bước | Quy tắc | Kết quả |
|---|---|---|
| 1 | Chỉ lấy model `status=Wizard-ready` và `critical_fields_ok=true` | Model không đủ dữ liệu quan trọng không vào Wizard |
| 2 | Áp dụng các yêu cầu bắt buộc của người dùng | Model không đạt yêu cầu cứng bị loại |
| 3 | Nếu có chọn ngân sách, tính **giá đại diện** | Có cả `min_vnd` và `max_vnd` → lấy trung bình; chỉ có một mức → lấy mức đó |
| 4 | Ngân sách là **bộ lọc cứng** | Giá đại diện vượt trần → loại; **không fallback sang model vượt ngân sách** |
| 5 | Các model còn lại được chấm điểm | Ưu tiên nhu cầu chính, kích thước, hệ sinh thái, tùy chọn bổ sung và độ tin cậy dữ liệu |
| 6 | Chọn tối đa 5 model | Hiển thị các ứng viên phù hợp nhất trong tập đã qua bộ lọc cứng |
| 7 | Không còn model | Hiển thị lý do không có model khớp và yêu cầu người dùng nới tiêu chí |

## 2. Ngân sách

| Lựa chọn | Trần ngân sách | Cách xử lý |
|---|---:|---|
| Dưới 1 triệu | 1.000.000đ | Giá đại diện > 1 triệu → loại |
| 1–2 triệu | 2.000.000đ | Giá đại diện > 2 triệu → loại |
| 2–4 triệu | 4.000.000đ | Giá đại diện > 4 triệu → loại |
| 4–7 triệu | 7.000.000đ | Giá đại diện > 7 triệu → loại |
| Trên 7 triệu | Không đặt trần | Không loại theo giá |
| Chưa xác định | Không áp dụng | Không dùng ngân sách để loại |

**Công thức giá đại diện**

`(min_vnd + max_vnd) / 2`

Nếu chỉ có một trong các giá trị thì dùng `current_or_from_vnd` hoặc giá đơn lẻ có sẵn.

**Ví dụ kiểm thử quan trọng**

| Giá model | Người dùng chọn | Kết quả |
|---:|---|---|
| 1,2 triệu | 1–2 triệu | Được xét |
| 1,8 triệu | 1–2 triệu | Được xét |
| 2,1 triệu | 1–2 triệu | Loại |
| 2,69 triệu | 1–2 triệu | Loại |
| 3,79 triệu | 1–2 triệu | Loại |
| Không có giá | 1–2 triệu | Không đủ dữ liệu để lọc ngân sách |

> Tuyệt đối không dùng logic “không có model đúng ngân sách thì cho model vượt ngân sách vào”.

## 3. Mục đích sử dụng

| Lựa chọn | Kết quả định hướng |
|---|---|
| Sách chữ / tiểu thuyết | Ưu tiên trải nghiệm đọc chữ, gọn nhẹ |
| PDF / tài liệu | Ưu tiên màn hình lớn và khả năng xử lý tài liệu |
| Manga / truyện tranh | Ưu tiên màn hình đủ lớn; màu là lợi thế khi nội dung cần màu |
| Nội dung màu | Ưu tiên màn hình E Ink màu |
| Học tập / công việc | Ưu tiên PDF, định dạng rộng, Android hoặc bút tùy nhu cầu |
| Web / bài viết | Ưu tiên khả năng hiển thị web và nhiều nguồn nội dung |

Đây là **ưu tiên xếp hạng**, không tự động loại model, trừ khi một tiêu chí khác đã được đặt là bắt buộc.

## 4. Kích thước

| Lựa chọn | Kết quả |
|---|---|
| Càng nhỏ và nhẹ càng tốt | Ưu tiên model nhỏ/gọn |
| Khoảng 6 inch | Ưu tiên model quanh 6 inch |
| Khoảng 7 inch | Ưu tiên model quanh 7 inch |
| Càng lớn càng tốt | Ưu tiên màn hình lớn, đặc biệt cho PDF/tài liệu |
| Không quan trọng | Không dùng kích thước để loại/xếp hạng mạnh |

## 5. Đọc ban đêm

| Lựa chọn | Kết quả |
|---|---|
| Thường xuyên | **Bắt buộc có front light**; đèn ấm là lợi thế |
| Thỉnh thoảng | Front light hữu ích nhưng không bắt buộc |
| Hầu như không | Có thể bỏ qua tiêu chí đèn |

## 6. Tính năng bắt buộc

| Lựa chọn | Điều kiện để model vượt bộ lọc |
|---|---|
| Chống nước | `waterproof=true` |
| Đèn ấm | `warm_light=true` |
| Nút chuyển trang | `buttons=true` |
| Android / cài app | `android=true` |
| Ghi chú bằng bút | `stylus=true` **và** `note_taking=true` |
| Màn hình màu | `color=true` |
| Thẻ nhớ gắn ngoài | `microsd=true` |
| Nghe audiobook / âm thanh | Dựa trên dữ liệu audio/Bluetooth/loa của model |
| Cổng USB-C | `usb_c=true` |
| Tự xoay màn hình | Ưu tiên model có khả năng rotation |

**Lưu ý:** các mục trong nhóm này được mô tả là **yêu cầu bắt buộc** khi người dùng tick chọn. Không được biến chúng thành điểm cộng nếu người dùng đã yêu cầu bắt buộc.

## 7. Hệ sinh thái / nguồn sách

| Lựa chọn | Điều kiện / kết quả |
|---|---|
| Amazon / Kindle | **Chỉ Kindle** |
| EPUB / thư viện cá nhân | **Bắt buộc `native_epub=true`** |
| Nhiều nguồn khác nhau | Model phải có độ linh hoạt đủ cao (`format_flexibility >= 4`, hoặc `multi_source_fit >= 4`, hoặc Android) |
| Muốn cài nhiều ứng dụng | **Bắt buộc Android** |
| Chưa biết | Không loại theo hệ sinh thái |

## 8. Jailbreak / KOReader / tùy biến

| Lựa chọn | Kết quả |
|---|---|
| Có, quan trọng | Tăng điểm cho khả năng tùy biến phù hợp với từng hệ máy |
| Có, nhưng không bắt buộc | Cho điểm cộng, nhưng không loại model |
| Không | Không dùng tiêu chí tùy biến để xếp hạng |

### Cách hiểu theo hệ máy

| Hệ máy | Cách Wizard đánh giá |
|---|---|
| Kindle | Xét jailbreak/KOReader và trạng thái hỗ trợ dữ liệu |
| Kobo | Xét khả năng tùy biến/KOReader cộng đồng; **không coi jailbreak là điều kiện bắt buộc** |
| BOOX | Xét Android/cài KOReader như ứng dụng; **không coi jailbreak là điều kiện bắt buộc** |

## 9. Quy tắc để tránh sửa nhầm

| Trường hợp | Cách xử lý |
|---|---|
| Anh muốn **loại hẳn** model khi chọn một tiêu chí | Ghi thành **hard filter** |
| Anh chỉ muốn model **được ưu tiên hơn** | Ghi thành **scoring** |
| Anh thay đổi ngưỡng tiền | Sửa cả bảng ngân sách và `BUDGET_CAP` |
| Anh sửa tên lựa chọn | Sửa `questions.json` và nhãn hiển thị |
| Anh thêm model | Bổ sung đủ dữ liệu trong `models.json`, đặc biệt giá VN và ảnh nếu có |
| Không có ảnh thật đáng tin | Để trống; **không tạo ảnh giả/placeholder** |
| Không có giá VN đủ tin cậy | Không đưa model vào nhóm Wizard-ready nếu tiêu chí giá là cần thiết |
| Một bộ tiêu chí không có model | Không cho model vượt yêu cầu cứng vào chỉ để “có kết quả” |

## 10. Bộ test hồi quy tối thiểu

| Test | Kỳ vọng |
|---|---|
| 1–2 triệu + yêu cầu nhiều tính năng | Không được xuất model có giá đại diện > 2 triệu |
| 1–2 triệu + model có khoảng giá 2,1–3,9 triệu | Bị loại |
| Đọc đêm thường xuyên | Model không có front light bị loại |
| Chọn Android | Model không Android bị loại |
| Chọn màn hình màu | Model đen trắng bị loại |
| Chọn Amazon / Kindle | Không xuất Kobo/BOOX |
| Chọn muốn cài nhiều ứng dụng | Không xuất model không Android |
| Chọn nhiều nguồn | Không xuất model có độ linh hoạt dưới ngưỡng |
| Không có model khớp | Hiển thị “Chưa có model khớp...” thay vì nới bộ lọc âm thầm |

---

## Nguyên tắc bảo trì

**Bảng này là nơi kiểm tra đầu tiên mỗi khi thay đổi Wizard.**

Thứ tự làm việc:

`Yêu cầu của anh → cập nhật bảng tiêu chí → xác định hard/soft → sửa dữ liệu model → sửa thuật toán → chạy test hồi quy`

Mỗi lần anh phản hồi một kết quả thực tế, em sẽ dùng phản hồi đó để bổ sung một dòng vào **Bộ test hồi quy**, để lỗi đó không lặp lại.
## 11. Trạng thái catalog — 2026-09-28

Sau đợt mở rộng catalog, `wizard/models.json` có **53 record**, trong đó **52 Wizard-ready** và **1 Reference** (`iReader Color7` chưa có giá VN đủ tin cậy).

Các nhóm Kindle hiện được theo dõi theo cấu trúc:

`Keyboard → Basic → Voyage → Paperwhite → Oasis → Scribe → Colorsoft`

Đã bổ sung trong đợt này:

| Nhóm | Model mới |
|---|---|
| Kindle Oasis | Oasis 1 (8th), Oasis 2 (9th), Oasis 3 (10th) |
| Kindle Scribe | Scribe 2024, Scribe 3 có đèn, Scribe 3 không đèn, Scribe Colorsoft |
| Kobo | Kobo Sage |
| BOOX | Go 10.3 (Gen II) Lumi |
| Meebook | E6, M6, M6C, M7, G7S, G7C, M8, M8C, M103 |

### Trạng thái dữ liệu của các model vừa thêm

Mỗi model mới được yêu cầu phải có:
- Giá tham khảo tại Việt Nam.
- Thông số cốt lõi đủ cho bộ lọc.
- Ảnh sản phẩm thật.
- Nguồn tham chiếu để kiểm tra lại.

Nếu thiếu một trong các phần trên, model không nên tự động chuyển sang `Wizard-ready`.

### Nhóm đang để Reference

| Hãng | Model | Lý do chưa đưa vào Wizard |
|---|---|---|
| iReader | iReader Color7 | Chưa có giá VN đủ tin cậy |
| Bigme | Bigme B6 Color | Thiếu một số trường quan trọng để hard-filter |
| PocketBook | InkPad Color 3 | Thiếu một số trường quan trọng để hard-filter |

## 12. Kiểm tra nhất quán schema — 2026-09-28

Đợt audit toàn bộ 52 model Wizard-ready đã kiểm tra các trường dùng trực tiếp cho bộ lọc và xếp hạng.

| Hạng mục | Kết quả |
|---|---|
| Wizard-ready có giá VN | 52/52 |
| Wizard-ready có ảnh | 51/52; còn thiếu ảnh thật: **Xteink X4 Classic (X4 V2)** |
| OS / ecosystem | Đã chuẩn hóa các model mới; sửa Kobo Touch về KoboOS và BOOX Lumi về Android 15 |
| Bút / ghi chú | Đã sửa BOOX Go 6: không có bút/ghi chú tích hợp trong dữ liệu Wizard |
| Tự xoay | Thêm trường `auto_rotation`; chỉ đánh dấu true khi dữ liệu xác nhận có cảm biến/tính năng tự xoay |
| Âm thanh | Tiêu chí `audio` nay được áp dụng như yêu cầu bắt buộc khi người dùng chọn |
| Tự xoay | Tiêu chí `rotation` nay được áp dụng như yêu cầu bắt buộc khi người dùng chọn |
| Candidate gate | Wizard chỉ nạp model có cả `status=Wizard-ready` và `critical_fields_ok=true` |
| Ngân sách | `budget_hint_vn` được đồng bộ theo giá đại diện; bộ lọc cứng vẫn dùng công thức giá trung bình |

**Lưu ý về dữ liệu:** Các trường chưa có nguồn xác nhận đủ chắc không được tự động nâng thành `true`. Đây là nguyên tắc bảo thủ để tránh Wizard đề xuất nhầm tính năng.

**Nguồn kiểm tra đại diện:** Amazon xác nhận các thế hệ Kindle Scribe hiện tại và đặc điểm front light/pen; Kobo xác nhận Sage 8 inch, 32GB, USB-C, chống nước và ComfortLight PRO; BOOX xác nhận Android, front light, stylus, microSD, audio và auto-rotation trên các model tương ứng; Meebook Việt Nam xác nhận 9 model và giá niêm yết hiện tại. citeturn709113search0turn709113search2turn709113search6turn278082search1turn297759search0turn225140search0

