export function Services() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bikesupport */}
        <div className="relative rounded-lg overflow-hidden aspect-[16/9] group cursor-pointer">
          <img
            src="figma:asset/service-support.jpg"
            alt="Bikesupport"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%23333' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white'%3EBikesupport%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-white text-4xl font-bold mb-2">Bikesupport</h3>
            <p className="text-white/90 text-lg">Dịch vụ bảo trì và sửa chữa chuyên nghiệp</p>
          </div>
        </div>

        {/* Shipping */}
        <div className="relative rounded-lg overflow-hidden aspect-[16/9] group cursor-pointer">
          <img
            src="figma:asset/service-shipping.jpg"
            alt="Shipping"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%23555' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white'%3EShipping%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h3 className="text-white text-4xl font-bold mb-2">Shipping</h3>
            <p className="text-white/90 text-lg">Giao hàng toàn quốc, nhanh chóng an toàn</p>
          </div>
        </div>
      </div>
    </section>
  );
}
