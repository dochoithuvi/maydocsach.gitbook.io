# Kindle Jailbreak Wizard — MayDocSach

Trang tra cứu jailbreak Kindle dạng tĩnh, triển khai cùng repository GitHub Pages hiện tại.

## URL

Sau khi GitHub Pages cập nhật, trang sẽ ở:

https://dochoithuvi.github.io/maydocsach.gitbook.io/jailbreak-wizard/

## Cấu trúc

- `index.html`: giao diện và logic điều hướng/đối chiếu.
- `data.json`: model, mã serial, các khoảng firmware và liên kết hướng dẫn.

Trang không cần backend, không gửi serial đến máy chủ, không dùng analytics và không lưu câu trả lời vào localStorage. Tất cả xử lý lựa chọn diễn ra trong trình duyệt.

## Cập nhật dữ liệu

Khi KindleModding thêm hoặc thay đổi phương pháp jailbreak:

1. Kiểm tra Wizard chính thức: https://kindlemodding.org/jailbreak-wizard.html
2. Đối chiếu các phương pháp và khoảng firmware công bố trong repository KindleModding.
3. Cập nhật `data.json`, nhất là mảng `jailbreaks`, `models` và `serial_codes`.
4. Kiểm tra các trường hợp biên như outlier firmware, điều kiện đăng ký, và yêu cầu quảng cáo.

Không tự thêm phương pháp jailbreak chỉ vì phiên bản firmware gần giống. Nếu model hoặc firmware chưa có trong dữ liệu, giao diện phải báo chưa tìm thấy kết quả và hướng người dùng sang Wizard chính thức, thay vì tự đoán.

## Nguồn tham khảo

- https://kindlemodding.org/jailbreak-wizard.html
- https://kindlemodding.org/jailbreaking/
- https://github.com/KindleModding/kindlemodding.github.io/blob/main/static/jailbreaks.json
- https://github.com/KindleModding/kindlemodding.github.io/blob/main/static/models_json_generator.py

## Lưu ý

Đây là công cụ độc lập, không thuộc KindleModding và không được tổ chức đó xác nhận. Bảng tương thích là bản tham chiếu ngày 29/10/2026; hãy xác nhận bằng hướng dẫn chính thức ngay trước khi thao tác.
