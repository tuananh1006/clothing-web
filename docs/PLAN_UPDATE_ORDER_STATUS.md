# Kế hoạch Implement Chức năng Chỉnh sửa Trạng thái Đơn hàng

## Mục tiêu
Implement chức năng cho phép admin chỉnh sửa trạng thái đơn hàng từ giao diện quản lý đơn hàng.

## Phân tích hiện trạng

### Backend
- ✅ Đã có `OrderStatus` enum với các giá trị: `pending`, `processing`, `shipping`, `completed`, `cancelled`
- ✅ Đã có `getAdminOrders` trong `admin.services.ts` để lấy danh sách orders
- ❌ **Chưa có** API để update order status
- ❌ **Chưa có** controller và route cho update order status

### Frontend
- ✅ Đã có trang `Orders.tsx` với table hiển thị orders
- ✅ Đã có button "Cập nhật trạng thái" trong action column
- ❌ **Chưa có** modal/form để update status
- ❌ **Chưa có** service function để gọi API update status

## Các Order Status

1. **pending** - Chờ xử lý
2. **processing** - Đang xử lý
3. **shipping** - Đang giao
4. **completed** - Hoàn thành
5. **cancelled** - Đã hủy

## Kế hoạch Implementation

### Phase 1: Backend - Tạo API Update Order Status

#### 1.1. Tạo Service Function
**File:** `be/src/services/admin.services.ts`

**Nội dung:**
```typescript
async updateAdminOrderStatus(id: string, status: OrderStatus) {
  const _id = new ObjectId(id)
  const order = await databaseServices.orders.findOne({ _id })
  
  if (!order) {
    throw new Error('Order not found')
  }
  
  // Validate status transition (optional - có thể thêm logic kiểm tra)
  // Ví dụ: không cho chuyển từ cancelled sang các status khác
  
  await databaseServices.orders.updateOne(
    { _id },
    { 
      $set: { 
        status,
        updated_at: new Date()
      }
    }
  )
  
  return { 
    message: `Đã cập nhật trạng thái đơn hàng thành ${status}`,
    order_id: id,
    new_status: status
  }
}
```

**Yêu cầu:**
- Validate order tồn tại
- Validate status hợp lệ (trong OrderStatus enum)
- Update `updated_at` timestamp
- Return message và thông tin order đã update

#### 1.2. Tạo Controller
**File:** `be/src/controllers/admin.controller.ts`

**Nội dung:**
```typescript
export const adminUpdateOrderStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status: OrderStatus }
  
  if (!status || !Object.values(OrderStatus).includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }
  
  const data = await adminService.updateAdminOrderStatus(id, status)
  return res.json({ message: data.message, data: { order_id: data.order_id, status: data.new_status } })
}
```

**Yêu cầu:**
- Validate status từ request body
- Gọi service function
- Return response với message và data

#### 1.3. Tạo Validator Middleware
**File:** `be/src/middlewares/admin.middleware.ts`

**Nội dung:**
```typescript
export const updateOrderStatusValidator = validate(
  checkSchema({
    status: {
      notEmpty: {
        errorMessage: 'Status is required'
      },
      isIn: {
        options: [Object.values(OrderStatus)],
        errorMessage: `Status must be one of: ${Object.values(OrderStatus).join(', ')}`
      }
    }
  }, ['body'])
)
```

**Yêu cầu:**
- Validate status không rỗng
- Validate status phải là một trong các giá trị OrderStatus

#### 1.4. Tạo Route
**File:** `be/src/routes/admin.routes.ts`

**Nội dung:**
```typescript
/**
 * Description: Admin - Update order status
 * Path: /orders/:id/status
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' }
 */
adminRouter.put(
  '/orders/:id/status',
  accessTokenValidator,
  requireAdmin,
  updateOrderStatusValidator,
  wrapRequestHandler(adminUpdateOrderStatusController)
)
```

**Yêu cầu:**
- Route: `PUT /admin/orders/:id/status`
- Require authentication và admin role
- Validate request body

---

### Phase 2: Frontend - Tạo Service Function

#### 2.1. Thêm API Endpoint Constant
**File:** `fe/src/utils/constants.ts`

**Nội dung:**
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  ADMIN: {
    // ... existing admin endpoints
    UPDATE_ORDER_STATUS: (id: string) => `/admin/orders/${id}/status`,
  }
}
```

#### 2.2. Tạo Service Function
**File:** `fe/src/services/admin.service.ts`

**Nội dung:**
```typescript
/**
 * Update order status (admin)
 * Backend endpoint: PUT /admin/orders/:id/status
 */
export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
): Promise<{ order_id: string; status: string }> => {
  try {
    const response = await api.put<ApiResponse<{ order_id: string; status: string }>>(
      API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id),
      { status }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}
```

**Yêu cầu:**
- Type-safe với OrderStatus
- Error handling
- Return updated order info

---

### Phase 3: Frontend - Tạo Update Status Modal Component

#### 3.1. Tạo Component
**File:** `fe/src/components/admin/UpdateOrderStatusModal.tsx`

**Nội dung:**
- Modal component với:
  - Title: "Cập nhật trạng thái đơn hàng"
  - Hiển thị order code hiện tại
  - Select dropdown với các status options
  - Hiển thị status hiện tại
  - Buttons: "Hủy" và "Cập nhật"
  - Loading state khi đang update

**Props:**
```typescript
interface UpdateOrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    _id: string
    order_code: string
    status: OrderStatus
  }
  onSuccess?: () => void
}
```

**Features:**
- Select dropdown với các status options
- Disable status hiện tại trong dropdown (hoặc highlight)
- Validation trước khi submit
- Loading state
- Error handling với toast notifications

---

### Phase 4: Frontend - Tích hợp vào Orders Page

#### 4.1. Update Orders.tsx
**File:** `fe/src/pages/admin/Orders.tsx`

**Nội dung:**
- Import `UpdateOrderStatusModal` component
- Import `updateOrderStatus` service function
- Thêm state cho modal:
  - `isUpdateStatusModalOpen: boolean`
  - `selectedOrderForUpdate: Order | null`
- Update action button "Cập nhật trạng thái" để mở modal
- Implement `handleUpdateStatus` function:
  - Gọi API `updateOrderStatus`
  - Show success toast
  - Refresh orders list
  - Close modal
- Handle error với toast notification

**Yêu cầu:**
- Modal chỉ mở khi click button "Cập nhật trạng thái"
- Pass đúng order data vào modal
- Refresh orders list sau khi update thành công
- Handle loading state

---

### Phase 5: Testing & Validation

#### 5.1. Backend Testing
- [ ] Test API với valid status
- [ ] Test API với invalid status (should return 400)
- [ ] Test API với non-existent order ID (should return 404)
- [ ] Test API với unauthorized user (should return 403)
- [ ] Test API với non-admin user (should return 403)
- [ ] Verify `updated_at` được update

#### 5.2. Frontend Testing
- [ ] Test mở modal từ action button
- [ ] Test select status và submit
- [ ] Test cancel button
- [ ] Test success flow (modal close, list refresh)
- [ ] Test error handling
- [ ] Test loading state
- [ ] Test với các status khác nhau
- [ ] Test responsive design

#### 5.3. Integration Testing
- [ ] Test full flow: Click button → Select status → Submit → Verify update
- [ ] Test với nhiều orders khác nhau
- [ ] Test refresh orders list sau khi update
- [ ] Test stats cards update sau khi status change

---

## File Structure

```
be/src/
├── services/
│   └── admin.services.ts          # Add updateAdminOrderStatus()
├── controllers/
│   └── admin.controller.ts        # Add adminUpdateOrderStatusController()
├── middlewares/
│   └── admin.middleware.ts        # Add updateOrderStatusValidator()
└── routes/
    └── admin.routes.ts            # Add PUT /orders/:id/status route

fe/src/
├── components/admin/
│   └── UpdateOrderStatusModal.tsx # New component
├── pages/admin/
│   └── Orders.tsx                 # Update to integrate modal
├── services/
│   └── admin.service.ts           # Add updateOrderStatus()
└── utils/
    └── constants.ts               # Add UPDATE_ORDER_STATUS endpoint
```

---

## API Specification

### PUT /admin/orders/:id/status

**Description:** Update order status (admin only)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required): Order ID

**Request Body:**
```json
{
  "status": "pending" | "processing" | "shipping" | "completed" | "cancelled"
}
```

**Success Response (200):**
```json
{
  "message": "Đã cập nhật trạng thái đơn hàng thành completed",
  "data": {
    "order_id": "507f1f77bcf86cd799439011",
    "status": "completed"
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "message": "Invalid status"
}
```

**404 Not Found:**
```json
{
  "message": "Order not found"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied"
}
```

---

## UI/UX Requirements

### Modal Design
- **Size:** Medium (max-width: 500px)
- **Title:** "Cập nhật trạng thái đơn hàng"
- **Content:**
  - Order code display (read-only)
  - Current status display (badge)
  - Status select dropdown
  - Warning message nếu chuyển sang cancelled
- **Actions:**
  - Cancel button (outline style)
  - Update button (primary style)
- **Loading:** Disable buttons và show spinner khi đang update

### Status Options
- **pending** - Chờ xử lý (yellow badge)
- **processing** - Đang xử lý (blue badge)
- **shipping** - Đang giao (blue badge)
- **completed** - Hoàn thành (green badge)
- **cancelled** - Đã hủy (red badge)

### User Flow
1. User click button "Cập nhật trạng thái" trong action column
2. Modal mở với order info và current status
3. User select new status từ dropdown
4. User click "Cập nhật"
5. Show loading state
6. API call
7. On success:
   - Show success toast
   - Close modal
   - Refresh orders list
   - Update stats cards nếu cần
8. On error:
   - Show error toast
   - Keep modal open

---

## Notes

1. **Status Transition Validation:** Có thể thêm logic kiểm tra transition hợp lệ (ví dụ: không cho chuyển từ cancelled sang các status khác)

2. **Notification:** Có thể gửi email/notification cho customer khi status thay đổi (future enhancement)

3. **Audit Log:** Có thể thêm audit log để track ai đã thay đổi status khi nào (future enhancement)

4. **Bulk Update:** Có thể thêm chức năng update nhiều orders cùng lúc (future enhancement)

5. **Permission:** Đảm bảo chỉ admin mới có thể update order status

---

## Timeline Estimate

- **Phase 1 (Backend):** 2-3 hours
- **Phase 2 (Frontend Service):** 30 minutes
- **Phase 3 (Modal Component):** 2-3 hours
- **Phase 4 (Integration):** 1-2 hours
- **Phase 5 (Testing):** 1-2 hours

**Total:** ~7-11 hours

---

## Dependencies

- Backend: `mongodb`, `express`, existing admin middleware
- Frontend: `react`, `react-router-dom`, existing components (Modal, Select, Button), toast context

---

## Success Criteria

✅ Admin có thể update order status từ UI
✅ API validate đúng input
✅ UI hiển thị đúng current status
✅ Success/error notifications hoạt động đúng
✅ Orders list refresh sau khi update
✅ Stats cards update nếu cần
✅ Responsive design
✅ Dark mode support
✅ No console errors
✅ All tests pass

