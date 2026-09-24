# MayDocSach E-Reader Wizard

Wizard tĩnh để nhúng vào GitBook Wiki-Ereader của MayDocSach.

## Cấu trúc

- `index.html`: giao diện + logic lọc/model matching.
- `questions.json`: câu hỏi và lựa chọn.
- `models.json`: runtime catalog, chỉ lấy các model đã được đánh dấu `Wizard-ready` trong database master.
- `sources.json`: nguồn dữ liệu dùng cho catalog.
- `full_database_source.json`: bản snapshot database master dùng để truy nguyên lúc đóng gói; **không cần publish file này nếu repo public**.

## Cách publish bằng GitHub Pages

1. Tạo một repository GitHub mới, ví dụ `maydocsach-ereader-wizard`.
2. Upload `index.html`, `questions.json`, `models.json`, `sources.json`.
3. Vào **Settings → Pages**.
4. Ở **Build and deployment → Source**, chọn **Deploy from a branch**.
5. Chọn branch `main` và thư mục `/(root)`, rồi Save.
6. Sau khi GitHub Pages deploy xong, mở URL dạng:
   `https://<username>.github.io/maydocsach-ereader-wizard/`

GitHub Pages hỗ trợ publish static files và dùng `index.html` làm entry file. Có thể publish trực tiếp từ branch/root như trên.

## Cách đưa vào GitBook

GitBook hỗ trợ embed các công cụ/nội dung tương tác bên thứ ba. Sau khi GitHub Pages có URL live, tạo một page mới trong GitBook, chọn block **Embed** (hoặc block tích hợp tương đương trong giao diện hiện tại), rồi dán URL GitHub Pages của Wizard.

Nội dung Wiki vẫn nằm ở GitBook; Wizard chỉ là một công cụ interactive được host riêng.

## Cập nhật model sau này

Không sửa danh sách model trực tiếp trong `index.html`.

Quy trình chuẩn:

1. Cập nhật database master `maydocsach-ereader-model-database.xlsx`.
2. Fact-check model bằng nguồn nhà sản xuất khi kích hoạt model mới.
3. Chạy script tạo `maydocsach-ereader-models.json`.
4. Sinh lại `models.json` chỉ từ các dòng `Wizard-ready`.
5. Commit/push `models.json` lên GitHub.
6. GitBook không cần sửa; Wizard sẽ dùng catalog mới sau khi GitHub Pages deploy.

## Nguyên tắc dữ liệu

- Không dùng rating chủ quan của website so sánh để chấm điểm Wizard.
- Giá Việt Nam không được suy ra từ MSRP/USD.
- Affiliate chỉ là link phụ; model không có affiliate vẫn được hiển thị.
- Model `Reference` hoặc `Needs review` không đưa vào production Wizard cho tới khi được xác minh/kích hoạt.
