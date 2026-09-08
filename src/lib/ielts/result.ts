/**
 * Kết quả của một server action có thể thất bại vì lý do đã lường trước.
 *
 * Next che thông điệp của mọi lỗi ném ra từ server action ở bản production và
 * thay bằng một digest, nên `throw new Error("Hôm nay đã đủ 5 thẻ")` đến tay
 * người dùng thành "An error occurred in the Server Components render". Lý do
 * bị từ chối lại thường là phần đáng đọc nhất — nó dạy người học vì sao có luật
 * đó — nên thất bại **đã lường trước** phải được *trả về*, không phải ném ra.
 *
 * `throw` vẫn dành cho lỗi ngoài dự tính: mất kết nối, hỏng dữ liệu.
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T>(error: string): ActionResult<T> {
  return { ok: false, error };
}

/** Lấy dữ liệu, ném nếu thất bại — dùng khi phía gọi không xử lý lỗi riêng. */
export function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
