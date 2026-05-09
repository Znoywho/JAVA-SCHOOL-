import { Shield, Truck } from 'lucide-react';

export function Services() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inspection Service */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative h-full flex flex-col justify-end p-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <Shield className="text-white" size={28} />
            </div>
            <h3 className="text-white text-3xl font-bold mb-2">Kiểm định chuyên nghiệp</h3>
            <p className="text-white/80 text-base">
              Đội ngũ chuyên gia kiểm tra khung, phanh, truyền động. Đảm bảo an toàn tuyệt đối cho mỗi chiếc xe.
            </p>
          </div>
        </div>

        {/* Shipping */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative h-full flex flex-col justify-end p-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <Truck className="text-white" size={28} />
            </div>
            <h3 className="text-white text-3xl font-bold mb-2">Giao hàng toàn quốc</h3>
            <p className="text-white/80 text-base">
              Đóng gói cẩn thận, vận chuyển an toàn. Giao hàng nhanh chóng đến tận tay bạn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
