export default function Footer() {
  return (
    <div className='mt-20 bg-slate-50 py-10'>
      <div className='customer-page-container'>
        <div className='grid grid-cols-12 gap-x-12 text-[15px]'>
          <div className='col-span-3'>
            <h3 className='mb-6 text-lg font-bold'>Thông tin bổ sung</h3>
            <ul className='flex flex-col gap-3 font-normal'>
              <li className='flex gap-x-3'>
                <span>phamphuloc.work@gmail.com</span>
              </li>
              <li>
                <span>+84 123 456 789</span>
              </li>
              <li>
                <span>HCM City, Vietnam</span>
              </li>
              <li>linkedin.com/in/pham-phu-loc-123456789</li>
            </ul>
          </div>
          <div className='col-span-3'>
            <h3 className='mb-6 text-lg font-bold capitalize'>Về cosmetic shop</h3>
            <ul className='flex list-disc flex-col gap-3 pl-5 font-normal'>
              <li>Giới thiệu</li>
              <li>Tuyển dụng</li>
              <li>Liên hệ</li>
              <li>Tin tức / Blog</li>
              <li>Hệ thống cửa hàng</li>
            </ul>
          </div>
          <div className='col-span-3'>
            <h3 className='mb-6 text-lg font-bold'>Hỗ trợ khách hàng</h3>
            <ul className='flex list-disc flex-col gap-3 pl-5 font-normal'>
              <li>Các câu hỏi thường gặp</li>
              <li>Hướng dẫn đặt hàng</li>
              <li>Phương thức vận chuyển</li>
              <li>Phương thức thanh toán</li>
            </ul>
          </div>
          <div className='col-span-3'>
            <h3 className='mb-6 text-lg font-bold'>Chính sách và Điều khoản</h3>
            <ul className='flex list-disc flex-col gap-3 pl-5 font-normal'>
              <li>Chính sách đổi hàng</li>
              <li>Chính sách bảo mật thanh toán</li>
              <li>Chính sách bảo mật thông tin cá nhân</li>
              <li>Chính sách giải quyết khiếu nại</li>
              <li>Điều khoản sử dụng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
