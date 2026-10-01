# Wiki-eReader Wizard — Google Sheets Analytics

Mục đích: lưu **ẩn danh** các lượt hoàn thành Wizard và lượt click vào model để sau này tối ưu câu hỏi/scoring.

## Dữ liệu được ghi

Mỗi lượt hoàn thành tạo một dòng với:
- thời gian server
- event type = completed
- mã event ngẫu nhiên
- phiên bản analytics
- phiên bản schema câu hỏi
- câu trả lời dưới dạng JSON
- danh sách các model được trả về

Mỗi lần người dùng click link trên card sẽ tạo thêm một dòng:
- event type = model_click
- model ID
- link kind = wiki hoặc commerce

Không ghi:
- tên
- email
- IP
- User-Agent

## Thiết lập

1. Tạo Google Sheet mới, ví dụ: **Wiki-eReader Wizard Analytics**.
2. Vào **Extensions → Apps Script**.
3. Dán nội dung `Code.gs` vào project và Save.
4. Chọn **Deploy → New deployment**.
5. Chọn loại **Web app**.
6. **Execute as:** Me.
7. **Who has access:** Anyone.
8. Deploy và copy URL kết thúc bằng **/exec**.
9. Gửi URL /exec cho quản trị Wizard để đặt vào `ANALYTICS_ENDPOINT`.

Sau khi kết nối, sheet sẽ tự tạo tab **Wizard Responses** và hàng tiêu đề.

## Lưu ý

Endpoint công khai có thể bị spam. Bộ nhận hiện chỉ chấp nhận hai event type hợp lệ và không lưu dữ liệu định danh. Khi lượng truy cập lớn, nên bổ sung cơ chế chống abuse/rate limit.
