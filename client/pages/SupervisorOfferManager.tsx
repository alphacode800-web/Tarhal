import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { dataManager, type TourOffer } from '@/services/dataManager';
import { supervisorManager } from '@/services/supervisorManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Film, Upload, X } from 'lucide-react';

const SupervisorOfferManager: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { mode, offerId } = useParams();
  const [supervisor, setSupervisor] = useState(supervisorManager.getCurrentSupervisor());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<Partial<TourOffer>>({
    countryId: '',
    title: { ar: '', en: '', fr: '' },
    description: { ar: '', en: '', fr: '' },
    price: 500,
    currency: 'USD',
    durationDays: 3,
    isFeatured: false,
    imageUrl: '',
    videos: [],
    isActive: true
  });
  const [videoUrl, setVideoUrl] = useState('');

  const content = {
    ar: {
      addOffer: 'إضافة عرض سياحي جديد',
      editOffer: 'تعديل العرض السياحي',
      basicInfo: 'المعلومات الأساسية',
      titleAr: 'عنوان العرض (عربي)',
      titleEn: 'عنوان العرض (إنجليزي)',
      titleFr: 'عنوان العرض (فرنسي)',
      descAr: 'الوصف (عربي)',
      descEn: 'الوصف (إنجليزي)',
      descFr: 'الوصف (فرنسي)',
      price: 'السعر',
      currency: 'العملة',
      duration: 'المدة بالأيام',
      featured: 'عرض مميز',
      active: 'نشط',
      imageUrl: 'رابط الصورة',
      videoUrlLabel: 'روابط الفيديو',
      addVideo: 'إضافة فيديو',
      uploadVideo: 'رفع فيديو',
      add: 'إضافة',
      save: 'حفظ',
      back: 'العودة للوحة التحكم',
      required: 'يرجى ملء الحقول المطلوبة',
      offerAdded: 'تم إضافة العرض بنجاح',
      offerUpdated: 'تم تحديث العرض بنجاح'
    },
    en: {
      addOffer: 'Add New Tour Offer',
      editOffer: 'Edit Tour Offer',
      basicInfo: 'Basic Information',
      titleAr: 'Title (Arabic)',
      titleEn: 'Title (English)',
      titleFr: 'Title (French)',
      descAr: 'Description (Arabic)',
      descEn: 'Description (English)',
      descFr: 'Description (French)',
      price: 'Price',
      currency: 'Currency',
      duration: 'Duration (days)',
      featured: 'Featured offer',
      active: 'Active',
      imageUrl: 'Image URL',
      videoUrlLabel: 'Video Links',
      addVideo: 'Add Video',
      uploadVideo: 'Upload Video',
      add: 'Add',
      save: 'Save',
      back: 'Back to Dashboard',
      required: 'Please fill the required fields',
      offerAdded: 'Offer added successfully',
      offerUpdated: 'Offer updated successfully'
    },
    fr: {
      addOffer: 'Ajouter une offre touristique',
      editOffer: 'Modifier l\'offre touristique',
      basicInfo: 'Informations de base',
      titleAr: 'Titre (Arabe)',
      titleEn: 'Titre (Anglais)',
      titleFr: 'Titre (Français)',
      descAr: 'Description (Arabe)',
      descEn: 'Description (Anglais)',
      descFr: 'Description (Français)',
      price: 'Prix',
      currency: 'Devise',
      duration: 'Durée (jours)',
      featured: 'Offre en vedette',
      active: 'Actif',
      imageUrl: 'URL de l\'image',
      videoUrlLabel: 'Liens vidéo',
      addVideo: 'Ajouter une vidéo',
      uploadVideo: 'Téléverser une vidéo',
      add: 'Ajouter',
      save: 'Enregistrer',
      back: 'Retour au tableau de bord',
      required: 'Veuillez remplir les champs requis',
      offerAdded: 'Offre ajoutée avec succès',
      offerUpdated: 'Offre mise à jour avec succès'
    }
  };

  const text = content[language];

  useEffect(() => {
    if (!supervisorManager.isLoggedIn() || !supervisor) {
      navigate('/supervisor/login');
      return;
    }

    if (mode === 'add' && supervisor.permissions?.canAddOffers === false) {
      navigate('/supervisor/dashboard');
      return;
    }

    if (mode === 'edit' && supervisor.permissions?.canEditOffers === false) {
      navigate('/supervisor/dashboard');
      return;
    }

    (async () => {
      // Load offers for this country and prefill when editing
      await dataManager.ensureMinimumOffersForCountries(10, [supervisor.countryId]);
      const offers = dataManager.getOffersByCountry(supervisor.countryId);

      if (mode === 'edit' && offerId) {
        const currentOffer = offers.find((o) => o.id === offerId);
        if (currentOffer) {
          setFormData({ ...currentOffer, videos: currentOffer.videos || [] });
        } else {
          setError('Offer not found');
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          countryId: supervisor.countryId
        }));
      }
    })();
  }, [mode, offerId, supervisor, navigate]);

  const handleInputChange = (
    field: keyof TourOffer,
    value: any,
    lang?: 'ar' | 'en' | 'fr'
  ) => {
    setFormData((prev) => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...(prev[field] as any),
            [lang]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    if (error) setError('');
  };

  const validate = () => {
    if (!formData.title?.ar || !formData.description?.ar) {
      setError(text.required);
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError(text.required);
      return false;
    }
    if (!formData.durationDays || formData.durationDays <= 0) {
      setError(text.required);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisor) return;
    if (!validate()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: Omit<TourOffer, 'id' | 'createdAt' | 'updatedAt'> = {
        countryId: supervisor.countryId,
        title: formData.title as TourOffer['title'],
        description: formData.description as TourOffer['description'],
        price: Number(formData.price),
        currency: formData.currency || 'USD',
        durationDays: Number(formData.durationDays),
        isFeatured: Boolean(formData.isFeatured),
        imageUrl: formData.imageUrl,
        videos: (formData.videos || []).filter(Boolean),
        isActive: formData.isActive ?? true
      };

      let successResult = false;

      if (mode === 'edit' && offerId) {
        successResult = await dataManager.updateOfferAsync(offerId, payload);
        if (successResult) {
          supervisorManager.logActivity(
            supervisor.id,
            'offer_updated',
            'country',
            offerId,
            {
              ar: `تم تحديث العرض: ${payload.title.ar}`,
              en: `Updated offer: ${payload.title.en}`,
              fr: `Offre mise à jour: ${payload.title.fr}`
            }
          );
        }
      } else {
        const created = await dataManager.addOfferAsync(payload);
        successResult = Boolean(created);
        if (successResult && created) {
          supervisorManager.logActivity(
            supervisor.id,
            'offer_added',
            'country',
            created.id,
            {
              ar: `تم إضافة عرض جديد: ${created.title.ar}`,
              en: `New offer added: ${created.title.en}`,
              fr: `Nouvelle offre ajoutée: ${created.title.fr}`
            }
          );
        }
      }

      if (successResult) {
        setSuccess(mode === 'edit' ? text.offerUpdated : text.offerAdded);
        await dataManager.ensureMinimumOffersForCountries(10, [supervisor.countryId]);
        setTimeout(() => {
          navigate('/supervisor/dashboard');
        }, 1200);
      } else {
        setError('Failed to save offer');
      }
    } catch (err) {
      setError('An error occurred while saving the offer');
    } finally {
      setIsLoading(false);
    }
  };

  if (!supervisor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/supervisor/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {text.back}
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? text.editOffer : text.addOffer}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{text.basicInfo}</CardTitle>
            <CardDescription>
              {mode === 'edit' ? text.editOffer : text.addOffer}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{text.titleAr}</label>
                  <Input
                    value={formData.title?.ar || ''}
                    onChange={(e) => handleInputChange('title', e.target.value, 'ar')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.titleEn}</label>
                  <Input
                    value={formData.title?.en || ''}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.titleFr}</label>
                  <Input
                    value={formData.title?.fr || ''}
                    onChange={(e) => handleInputChange('title', e.target.value, 'fr')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{text.descAr}</label>
                  <Textarea
                    value={formData.description?.ar || ''}
                    onChange={(e) => handleInputChange('description', e.target.value, 'ar')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.descEn}</label>
                  <Textarea
                    value={formData.description?.en || ''}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.descFr}</label>
                  <Textarea
                    value={formData.description?.fr || ''}
                    onChange={(e) => handleInputChange('description', e.target.value, 'fr')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{text.price}</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.price ?? 0}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.currency}</label>
                  <Input
                    value={formData.currency || 'USD'}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.duration}</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.durationDays ?? 1}
                    onChange={(e) => handleInputChange('durationDays', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{text.imageUrl}</label>
                  <Input
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-3">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Film className="h-4 w-4 text-pink-600" />
                  {text.videoUrlLabel}
                </label>
                <div className="flex gap-3">
                  <Input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://video-url"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!videoUrl) return;
                      setFormData({
                        ...formData,
                        videos: [...(formData.videos || []), videoUrl],
                      });
                      setVideoUrl('');
                    }}
                  >
                    {text.add}
                  </Button>
                  <label className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {text.uploadVideo}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { isValidVideoFile, getFileSizeMB, uploadVideoToServer } = await import('@/utils/videoUtils');
                          if (!isValidVideoFile(file)) {
                            alert('Unsupported video format');
                            return;
                          }
                          if (getFileSizeMB(file) > 180) {
                            alert('Video too large (max 180MB)');
                            return;
                          }
                          const url = await uploadVideoToServer(file);
                          setFormData({
                            ...formData,
                            videos: [...(formData.videos || []), url],
                          });
                        } catch (error) {
                          console.error(error);
                          alert('Failed to upload video');
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>

                {formData.videos && formData.videos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="relative border rounded-xl p-2 bg-gray-50">
                        <video src={video} controls className="w-full h-40 rounded-lg bg-black" />
                        <button
                          onClick={() => {
                            const updated = formData.videos?.filter((_, i) => i !== index) || [];
                            setFormData({ ...formData, videos: updated });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          title="Remove video"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isFeatured || false}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <span className="text-sm font-medium">{text.featured}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive ?? true}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <span className="text-sm font-medium">{text.active}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={() => navigate('/supervisor/dashboard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {text.back}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {text.save}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupervisorOfferManager;
