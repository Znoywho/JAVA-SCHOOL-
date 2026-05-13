import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  AlertCircle, Bike, CheckCircle2, ClipboardCheck, FilePlus2,
  Gauge, Loader2, MessageCircle, Search, ShieldCheck, XCircle,
} from 'lucide-react';
import { getCurrentUser } from '../services/auth';
import {
  createInspectorReport, fetchInspectorReports, fetchProducts,
  formatPrice, updateInspectorReport,
  type InspectorReport, type InspectorReportStatus, type Product,
} from '../services/api';

const STATUS_OPTIONS: Array<{ value: InspectorReportStatus; label: string; color: string }> = [
  { value: 'APPROVED', label: 'Dat kiem dinh', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'PENDING', label: 'Can theo doi', color: 'bg-amber-100 text-amber-700' },
  { value: 'REJECTED', label: 'Khong dat', color: 'bg-red-100 text-red-700' },
];

export function InspectorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [reports, setReports] = useState<InspectorReport[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    productId: 0,
    scoreRating: 85,
    status: 'APPROVED' as InspectorReportStatus,
    reportDetails: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'INSPECTOR') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [reportData, productData] = await Promise.all([
        fetchInspectorReports(user.id),
        fetchProducts(0, 50),
      ]);
      setReports(reportData);
      setProducts(productData.products);
      setForm(prev => ({
        ...prev,
        productId: prev.productId || productData.products[0]?.id || 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const approved = reports.filter(report => report.status === 'APPROVED').length;
    const rejected = reports.filter(report => report.status === 'REJECTED').length;
    const avgScore = total ? Math.round(reports.reduce((sum, report) => sum + report.scoreRating, 0) / total) : 0;
    return { total, approved, rejected, avgScore };
  }, [reports]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) || String(product.id).includes(query)
  );

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      productId: products[0]?.id || 0,
      scoreRating: 85,
      status: 'APPROVED',
      reportDetails: '',
    });
  };

  const startEdit = (report: InspectorReport) => {
    setEditingId(report.id);
    setForm({
      productId: report.productId,
      scoreRating: report.scoreRating,
      status: report.status,
      reportDetails: report.reportDetails,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!form.productId) {
      showMessage('error', 'Chon xe can kiem dinh');
      return;
    }
    if (!form.reportDetails.trim()) {
      showMessage('error', 'Nhap noi dung bao cao kiem dinh');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        productId: form.productId,
        inspectorId: user.id,
        scoreRating: Number(form.scoreRating),
        reportDetails: form.reportDetails,
        status: form.status,
      };

      if (editingId) {
        await updateInspectorReport(editingId, payload);
        showMessage('success', 'Da cap nhat bao cao kiem dinh');
      } else {
        await createInspectorReport(payload);
        showMessage('success', 'Da tao bao cao kiem dinh');
      }
      resetForm();
      await loadData();
    } catch (err: any) {
      showMessage('error', err.message || 'Luu bao cao that bai');
    } finally {
      setSaving(false);
    }
  };

  const statusMeta = (status: string) => STATUS_OPTIONS.find(item => item.value === status) ?? STATUS_OPTIONS[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-blue-600">Inspector Workspace</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Quan ly bao cao kiem dinh</h1>
            <p className="text-gray-500 mt-2">Tao report cho tung inspector va theo doi trang thai truc quan cho moi bike.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/chat" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              <MessageCircle size={18} />
              Tin nhan buyer
            </Link>
            <Link to="/products" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-100">
              <Bike size={18} />
              Xem danh sach bike
            </Link>
          </div>
        </div>

        {message && (
          <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-lg border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tong report', value: stats.total, icon: ClipboardCheck, color: 'text-blue-600' },
            { label: 'Diem TB', value: `${stats.avgScore}/100`, icon: Gauge, color: 'text-violet-600' },
            { label: 'Dat', value: stats.approved, icon: ShieldCheck, color: 'text-emerald-600' },
            { label: 'Khong dat', value: stats.rejected, icon: XCircle, color: 'text-red-600' },
          ].map(item => (
            <div key={item.label} className="bg-white border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{item.label}</p>
                <item.icon size={20} className={item.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-lg p-5 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <FilePlus2 size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Cap nhat report' : 'Tao inspector report'}</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Tim bike</span>
                <div className="relative mt-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Nhap ten xe hoac ID"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Bike can kiem dinh</span>
                <select
                  value={form.productId}
                  onChange={event => setForm(prev => ({ ...prev, productId: Number(event.target.value) }))}
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {filteredProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      #{product.id} - {product.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Diem</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.scoreRating}
                    onChange={event => setForm(prev => ({ ...prev, scoreRating: Number(event.target.value) }))}
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Trang thai</span>
                  <select
                    value={form.status}
                    onChange={event => setForm(prev => ({ ...prev, status: event.target.value as InspectorReportStatus }))}
                    className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Noi dung bao cao</span>
                <textarea
                  value={form.reportDetails}
                  onChange={event => setForm(prev => ({ ...prev, reportDetails: event.target.value }))}
                  rows={6}
                  placeholder="Ghi nhan khung, phanh, truyen dong, banh xe, muc do hao mon..."
                  className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <FilePlus2 size={18} />}
                  {editingId ? 'Luu cap nhat' : 'Tao report'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50">
                    Huy
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Report cua inspector</h2>
              {loading && <Loader2 size={18} className="animate-spin text-blue-600" />}
            </div>
            <div className="divide-y divide-gray-100">
              {reports.length === 0 && !loading ? (
                <div className="p-8 text-center text-gray-500">Chua co report nao.</div>
              ) : reports.map(report => (
                <div key={report.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusMeta(report.status).color}`}>
                          {statusMeta(report.status).label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {report.createdAt ? new Date(report.createdAt).toLocaleDateString('vi-VN') : 'Moi tao'}
                        </span>
                      </div>
                      <Link to={`/products/${report.productId}`} className="block mt-2 text-base font-bold text-gray-900 hover:text-blue-600">
                        #{report.productId} - {report.productTitle || 'Bike'}
                      </Link>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.reportDetails}</p>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Diem kiem dinh</span>
                          <span className="font-bold text-gray-900">{Math.round(report.scoreRating)}/100</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${report.scoreRating >= 85 ? 'bg-emerald-500' : report.scoreRating >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, report.scoreRating))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(report)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-white"
                    >
                      Sua report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
