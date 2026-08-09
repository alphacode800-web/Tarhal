import { useEffect, useMemo, useState } from 'react';
import {
  Megaphone,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  dataManager,
  type Advertisement,
  type AdPlacement,
  type AdStatus,
} from '@/services/dataManager';
import { AD_PLACEMENTS, getPlacementLabel } from '@/data/ads';

interface Props {
  getLocalizedText: (ar: string, en: string, fr: string) => string;
}

const emptyForm = (): Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  advertiserName: '',
  advertiserPhone: '',
  advertiserEmail: '',
  imageUrl: '',
  linkUrl: '',
  category: { ar: '', en: '', fr: '' },
  tags: [],
  placement: 'listing',
  status: 'pending',
  isActive: false,
  isFeatured: false,
});

export default function AdminAdsManagement({ getLocalizedText }: Props) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | AdStatus>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setAds(await dataManager.getAdsAsync());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? ads : ads.filter((a) => a.status === filter)),
    [ads, filter]
  );

  const stats = useMemo(
    () => ({
      total: ads.length,
      approved: ads.filter((a) => a.status === 'approved').length,
      pending: ads.filter((a) => a.status === 'pending').length,
      active: ads.filter((a) => a.isActive && a.status === 'approved').length,
    }),
    [ads]
  );

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setForm({
      title: { ...ad.title },
      description: { ...ad.description },
      advertiserName: ad.advertiserName,
      advertiserType: ad.advertiserType,
      advertiserPhone: ad.advertiserPhone || '',
      advertiserEmail: ad.advertiserEmail || '',
      imageUrl: ad.imageUrl || '',
      linkUrl: ad.linkUrl || '',
      videoUrl: ad.videoUrl || '',
      category: ad.category || { ar: '', en: '', fr: '' },
      adType: ad.adType || 'general',
      tags: ad.tags || [],
      specifications: ad.specifications || '',
      remainingQty: ad.remainingQty,
      productPrice: ad.productPrice,
      currency: ad.currency || 'SAR',
      discountPercent: ad.discountPercent,
      whatsappLink: ad.whatsappLink || '',
      shipping: ad.shipping || '',
      placement: ad.placement,
      positionLabel: ad.positionLabel || '',
      durationDays: ad.durationDays,
      adFee: ad.adFee,
      adFeeCurrency: ad.adFeeCurrency || 'SAR',
      submitVia: ad.submitVia,
      status: ad.status,
      isActive: ad.isActive,
      isFeatured: ad.isFeatured || false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.advertiserName.trim() || !form.title.ar.trim()) {
      setMsg(getLocalizedText('أكمل الحقول المطلوبة', 'Fill required fields', 'Champs requis'));
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      let ok = false;
      if (editingId) {
        ok = await dataManager.updateAdAsync(editingId, form);
      } else {
        ok = Boolean(await dataManager.addAdAsync(form));
      }
      if (ok) {
        setMsg(getLocalizedText('تم الحفظ', 'Saved', 'Enregistré'));
        setShowForm(false);
        await load();
      } else {
        setMsg(getLocalizedText('فشل الحفظ', 'Save failed', 'Échec'));
      }
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: AdStatus) => {
    await dataManager.updateAdAsync(id, {
      status,
      isActive: status === 'approved',
    });
    await load();
  };

  const toggleActive = async (ad: Advertisement) => {
    await dataManager.updateAdAsync(ad.id, { isActive: !ad.isActive });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm(getLocalizedText('حذف هذا الإعلان؟', 'Delete this ad?', 'Supprimer ?'))) return;
    await dataManager.deleteAdAsync(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950/80 rounded-3xl border border-orange-500/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-tarhal-orange to-amber-600 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-50">
                {getLocalizedText('إدارة الإعلانات', 'Ads Management', 'Gestion des annonces')}
              </h2>
              <p className="text-sm text-slate-400">
                {getLocalizedText(
                  'مراجعة، موافقة، ونشر إعلانات الشركاء والعملاء',
                  'Review, approve, and publish partner ads',
                  'Examiner et publier les annonces partenaires'
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} className="border-white/10 text-slate-200">
              <RefreshCw className="h-4 w-4 me-2" />
              {getLocalizedText('تحديث', 'Refresh', 'Actualiser')}
            </Button>
            <Button onClick={openNew} className="bg-tarhal-orange hover:bg-tarhal-orange-dark">
              <Plus className="h-4 w-4 me-2" />
              {getLocalizedText('إعلان جديد', 'New ad', 'Nouvelle annonce')}
            </Button>
          </div>
        </div>
        {msg && <p className="mt-3 text-sm text-emerald-400">{msg}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: getLocalizedText('الكل', 'Total', 'Total'), value: stats.total },
          { label: getLocalizedText('معتمد', 'Approved', 'Approuvées'), value: stats.approved },
          { label: getLocalizedText('قيد المراجعة', 'Pending', 'En attente'), value: stats.pending },
          { label: getLocalizedText('نشط الآن', 'Live', 'Actives'), value: stats.active },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-slate-950/70 border border-white/10 p-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold text-slate-50 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs border ${
              filter === f
                ? 'bg-tarhal-orange text-white border-tarhal-orange'
                : 'border-white/10 text-slate-300 hover:border-white/30'
            }`}
          >
            {f === 'all'
              ? getLocalizedText('الكل', 'All', 'Tous')
              : f === 'pending'
                ? getLocalizedText('قيد المراجعة', 'Pending', 'En attente')
                : f === 'approved'
                  ? getLocalizedText('معتمد', 'Approved', 'Approuvé')
                  : getLocalizedText('مرفوض', 'Rejected', 'Rejeté')}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 space-y-4">
          <h3 className="font-semibold text-slate-50">
            {editingId
              ? getLocalizedText('تعديل الإعلان', 'Edit ad', 'Modifier')
              : getLocalizedText('إضافة إعلان', 'Add ad', 'Ajouter')}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              placeholder={getLocalizedText('اسم المعلن *', 'Advertiser *', 'Annonceur *')}
              value={form.advertiserName}
              onChange={(e) => setForm({ ...form, advertiserName: e.target.value })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
            <Input
              placeholder={getLocalizedText('هاتف', 'Phone', 'Téléphone')}
              value={form.advertiserPhone}
              onChange={(e) => setForm({ ...form, advertiserPhone: e.target.value })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
            <Input
              placeholder="Email"
              value={form.advertiserEmail}
              onChange={(e) => setForm({ ...form, advertiserEmail: e.target.value })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
            <Input
              placeholder={getLocalizedText('رابط الصورة', 'Image URL', 'URL image')}
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
            <Input
              placeholder={getLocalizedText('عنوان عربي *', 'Arabic title *', 'Titre AR *')}
              value={form.title.ar}
              onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
            <Input
              placeholder="English title"
              value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
          </div>
          <Textarea
            rows={3}
            placeholder={getLocalizedText('الوصف', 'Description', 'Description')}
            value={form.description.ar}
            onChange={(e) =>
              setForm({
                ...form,
                description: { ar: e.target.value, en: e.target.value, fr: e.target.value },
              })
            }
            className="bg-slate-900/60 border-white/10 text-slate-100"
          />
          <div className="grid md:grid-cols-3 gap-3">
            <select
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacement })}
              className="rounded-xl bg-slate-900/60 border border-white/10 text-slate-100 text-sm px-3 py-2"
            >
              {AD_PLACEMENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ar}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as AdStatus })}
              className="rounded-xl bg-slate-900/60 border border-white/10 text-slate-100 text-sm px-3 py-2"
            >
              <option value="pending">{getLocalizedText('قيد المراجعة', 'Pending', 'En attente')}</option>
              <option value="approved">{getLocalizedText('معتمد', 'Approved', 'Approuvé')}</option>
              <option value="rejected">{getLocalizedText('مرفوض', 'Rejected', 'Rejeté')}</option>
            </select>
            <Input
              placeholder={getLocalizedText('رابط الوجهة', 'Link URL', 'Lien')}
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              className="bg-slate-900/60 border-white/10 text-slate-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              {getLocalizedText('نشط', 'Active', 'Actif')}
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <Switch checked={Boolean(form.isFeatured)} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
              {getLocalizedText('مميز', 'Featured', 'Mis en avant')}
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="bg-tarhal-orange hover:bg-tarhal-orange-dark">
              <Save className="h-4 w-4 me-2" />
              {getLocalizedText('حفظ', 'Save', 'Enregistrer')}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-white/10 text-slate-200">
              {getLocalizedText('إلغاء', 'Cancel', 'Annuler')}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-slate-400 text-sm">{getLocalizedText('جاري التحميل…', 'Loading…', 'Chargement…')}</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-400 text-sm">{getLocalizedText('لا توجد إعلانات', 'No ads', 'Aucune annonce')}</p>
        ) : (
          filtered.map((ad) => (
            <div
              key={ad.id}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 flex flex-col md:flex-row gap-4"
            >
              {ad.imageUrl ? (
                <img src={ad.imageUrl} alt="" className="w-full md:w-36 h-24 object-cover rounded-xl" />
              ) : (
                <div className="w-full md:w-36 h-24 rounded-xl bg-slate-800" />
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-slate-50 truncate">{ad.title.ar || ad.title.en}</h4>
                  <Badge
                    className={
                      ad.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : ad.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }
                  >
                    {ad.status}
                  </Badge>
                  {ad.isActive && (
                    <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30">live</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">{ad.advertiserName}</p>
                <p className="text-xs text-slate-500">{getPlacementLabel(ad.placement, 'ar')}</p>
                {(ad.adFee != null || ad.durationDays) && (
                  <p className="text-xs text-amber-400/90">
                    {ad.durationDays ? `${ad.durationDays} ${getLocalizedText('يوم', 'days', 'jours')} · ` : ''}
                    {ad.adFee != null ? `${ad.adFeeCurrency || 'SAR'} ${ad.adFee}` : ''}
                    {ad.advertiserType ? ` · ${ad.advertiserType}` : ''}
                    {ad.adType ? ` · ${ad.adType}` : ''}
                  </p>
                )}
                <p className="text-sm text-slate-300 line-clamp-2">{ad.description.ar}</p>
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                {ad.status !== 'approved' && (
                  <Button size="sm" onClick={() => setStatus(ad.id, 'approved')} className="bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5 me-1" />
                    {getLocalizedText('موافقة', 'Approve', 'Approuver')}
                  </Button>
                )}
                {ad.status !== 'rejected' && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(ad.id, 'rejected')} className="border-white/10 text-slate-200">
                    <XCircle className="h-3.5 w-3.5 me-1" />
                    {getLocalizedText('رفض', 'Reject', 'Rejeter')}
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => toggleActive(ad)} className="border-white/10 text-slate-200">
                  {ad.isActive ? <EyeOff className="h-3.5 w-3.5 me-1" /> : <Eye className="h-3.5 w-3.5 me-1" />}
                  {ad.isActive ? getLocalizedText('إخفاء', 'Hide', 'Masquer') : getLocalizedText('إظهار', 'Show', 'Afficher')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openEdit(ad)} className="border-white/10 text-slate-200">
                  {getLocalizedText('تعديل', 'Edit', 'Modifier')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(ad.id)} className="border-red-500/30 text-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
