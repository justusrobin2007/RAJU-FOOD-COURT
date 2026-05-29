'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  PackagePlus, CheckCircle, XCircle, Trash2, ShieldAlert,
  List, Upload, X, LogOut, Pencil, Eye, EyeOff, Search,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type TabType = 'reviews' | 'add-menu' | 'manage-menu' | 'gallery';

const CATEGORIES = [
  'Classic Dosa', 'Rava Specials', 'Uttapam', 'Family Dosa', 'Fusion Dosa',
  'Fry Varieties', 'Idli & Vada', 'Rice & Pulav', 'Pav Bhaji', 'Paneer Special',
  'Veg Special', 'Special Sabji', 'Kofta', 'Rice & Biryani', 'Roti & Naan',
  'Dal', 'Beverages', 'Extras',
];

interface EditState {
  name: string;
  price: string;
  description: string;
  category: string;
  spiceLevel: number;
  isBestseller: boolean;
  image: string;
  newImageFile: File | null;
  newImagePreview: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState<TabType>('manage-menu');
  const [reviews, setReviews]         = useState<any[]>([]);
  const [menuItems, setMenuItems]     = useState<any[]>([]);
  const [authChecked, setAuthChecked] = useState(false);

  // Add-menu form state
  const [name, setName]             = useState('');
  const [price, setPrice]           = useState('');
  const [desc, setDesc]             = useState('');
  const [cat, setCat]               = useState('Classic Dosa');
  const [spice, setSpice]           = useState(0);
  const [bestseller, setBestseller] = useState(false);
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setPreview]  = useState<string>('');
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [successMsg, setSuccess]    = useState('');
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const editImageRef                = useRef<HTMLInputElement>(null);

  // Gallery state
  const [galleryPhotos, setGalleryPhotos]   = useState<any[]>([]);
  const [galleryFile, setGalleryFile]       = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Manage-menu per-item state
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editState, setEditState]       = useState<EditState | null>(null);
  const [editSaving, setEditSaving]     = useState(false);
  const [togglingId, setTogglingId]     = useState<string | null>(null);
  const [menuSearch, setMenuSearch]     = useState('');
  const [menuFilter, setMenuFilter]     = useState('All');

  const fetchData = async () => {
    try {
      const [rRes, mRes, gRes] = await Promise.all([
        fetch('/api/reviews'),
        fetch('/api/menu?all=true'),
        fetch('/api/gallery'),
      ]);
      if (rRes.ok) setReviews(await rRes.json());
      if (mRes.ok) setMenuItems(await mRes.json());
      if (gRes.ok) setGalleryPhotos(await gRes.json());
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => {
        if (res.status === 401) router.replace('/admin/login');
        else { setAuthChecked(true); fetchData(); }
      })
      .catch(() => { setAuthChecked(true); fetchData(); });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  // ── Image helpers ──────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Add menu item ──────────────────────────────────────────
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !desc || !imageFile) {
      alert('Please fill in all fields and select an image.');
      return;
    }
    setSaving(true);
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      setUploading(false);
      if (!uploadRes.ok) throw new Error('Image upload failed');
      const { url: imageUrl } = await uploadRes.json();

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description: desc, price, category: cat,
          image: imageUrl, spiceLevel: spice, isBestseller: bestseller,
        }),
      });
      if (res.ok) {
        setSuccess('Menu item added successfully!');
        setName(''); setPrice(''); setDesc(''); setCat('Classic Dosa');
        setSpice(0); setBestseller(false);
        clearImage();
        fetchData();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      alert('Failed to add menu item.');
      console.error(err);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ── Delete menu item ───────────────────────────────────────
  const handleDeleteMenuItem = async (id: string, itemName: string) => {
    if (!confirm(`Delete "${itemName}"? This cannot be undone.`)) return;
    const res = await fetch('/api/menu', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  // ── Toggle isActive (optimistic) ──────────────────────────
  const handleToggleActive = async (id: string, current: boolean) => {
    // Optimistic update
    setMenuItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, isActive: !current } : item)
    );
    setTogglingId(id);
    try {
      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !current }),
      });
      if (!res.ok) {
        // Revert on failure
        setMenuItems((prev) =>
          prev.map((item) => item.id === id ? { ...item, isActive: current } : item)
        );
      }
    } catch {
      setMenuItems((prev) =>
        prev.map((item) => item.id === id ? { ...item, isActive: current } : item)
      );
    } finally {
      setTogglingId(null);
    }
  };

  // ── Open inline edit ───────────────────────────────────────
  const openEdit = (item: any) => {
    setEditingId(item.id);
    setEditState({
      name: item.name,
      price: String(item.price),
      description: item.description,
      category: item.category,
      spiceLevel: item.spiceLevel ?? 0,
      isBestseller: item.isBestseller ?? false,
      image: item.image,
      newImageFile: null,
      newImagePreview: '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  // ── Save edit ──────────────────────────────────────────────
  const handleSaveEdit = async (id: string) => {
    if (!editState) return;
    setEditSaving(true);
    try {
      let imageUrl = editState.image;

      // Upload new image if one was selected
      if (editState.newImageFile) {
        const formData = new FormData();
        formData.append('file', editState.newImageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      const res = await fetch('/api/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editState.name,
          price: parseFloat(editState.price),
          description: editState.description,
          category: editState.category,
          spiceLevel: editState.spiceLevel,
          isBestseller: editState.isBestseller,
          image: imageUrl,
        }),
      });
      if (res.ok) { cancelEdit(); fetchData(); }
      else alert('Failed to save changes.');
    } catch { alert('Failed to save changes.'); }
    finally { setEditSaving(false); }
  };

  // ── Review moderation ──────────────────────────────────────
  const handleApproveReview = async (id: string) => {
    await fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApproved: true }),
    });
    fetchData();
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  // ── Gallery handlers ──────────────────────────────────────
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryFile(file);
    setGalleryPreview(URL.createObjectURL(file));
  };

  const handleAddGalleryPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) { alert('Please select a photo.'); return; }
    setGalleryUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', galleryFile);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, caption: galleryCaption }),
      });
      if (res.ok) {
        setGalleryFile(null);
        setGalleryPreview('');
        setGalleryCaption('');
        if (galleryInputRef.current) galleryInputRef.current.value = '';
        fetchData();
      }
    } catch (err) { alert('Failed to upload photo.'); console.error(err); }
    finally { setGalleryUploading(false); }
  };

  const handleDeleteGalleryPhoto = async (id: string) => {
    if (!confirm('Remove this photo from the gallery?')) return;
    const res = await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchData();
  };

  const TABS: { key: TabType; label: string; count?: number }[] = [
    { key: 'manage-menu', label: 'Menu Items',        count: menuItems.length },
    { key: 'add-menu',    label: 'Add New Item' },
    { key: 'gallery',     label: 'Gallery',           count: galleryPhotos.length },
    { key: 'reviews',     label: 'Review Moderation', count: reviews.filter((r) => !r.isApproved).length },
  ];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron/30 border-t-saffron rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 bg-charcoal md:pt-28 md:pb-24 md:min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] ambient-glow-saffron rounded-full filter blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] ambient-glow-maroon rounded-full filter blur-3xl opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-saffron" />
            </div>
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-cream">Admin Dashboard</h1>
              <p className="text-xs text-cream/40 uppercase tracking-widest mt-0.5">Raju Madras Cafe — Branch Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/20 text-cream/50 hover:border-maroon/50 hover:text-maroon transition-all duration-200 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gold/10 pb-0 mb-10 overflow-x-auto">
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-xs uppercase tracking-wider py-3 px-6 rounded-t-xl border-b-2 transition-all duration-200 cursor-pointer font-semibold whitespace-nowrap flex items-center gap-2 ${
                activeTab === key
                  ? 'border-saffron text-saffron bg-saffron/5'
                  : 'border-transparent text-cream/50 hover:text-cream hover:border-gold/30'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-saffron text-charcoal' : 'bg-gold/15 text-gold'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Manage Menu Tab ── */}
        {activeTab === 'manage-menu' && (
          <div>
            {/* Header + search + filter */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-cream">
                  Current Menu Items
                  <span className="ml-3 text-sm font-normal text-cream/40 font-sans">
                    {(() => {
                      const filtered = menuItems.filter(i =>
                        (menuFilter === 'All' || i.category === menuFilter) &&
                        (i.name.toLowerCase().includes(menuSearch.toLowerCase()) || i.category.toLowerCase().includes(menuSearch.toLowerCase()))
                      );
                      return `${filtered.length} of ${menuItems.length}`;
                    })()}
                  </span>
                </h2>
              </div>

              {/* Search + filter row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Search by name or category…"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="form-input w-full"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  {menuSearch && (
                    <button onClick={() => setMenuSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category filter */}
                <select
                  value={menuFilter}
                  onChange={(e) => setMenuFilter(e.target.value)}
                  className="form-input sm:w-56 shrink-0"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Status filter toggle */}
                <div className="flex gap-2 shrink-0">
                  {['All', 'Active', 'Hidden'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setMenuFilter(s === menuFilter ? 'All' : s)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        menuFilter === s
                          ? 'bg-saffron border-saffron text-charcoal'
                          : 'border-gold/20 text-cream/50 hover:border-saffron/50 hover:text-cream'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {menuItems.length === 0 ? (
              <div className="p-16 border border-gold/10 bg-charcoal-light/10 rounded-2xl text-center">
                <List className="w-10 h-10 text-cream/15 mx-auto mb-3" />
                <p className="text-cream/40 text-sm">No menu items yet. Add your first item using the "Add New Item" tab.</p>
              </div>
            ) : (() => {
              const filtered = menuItems.filter(i => {
                const matchSearch = menuSearch === '' ||
                  i.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                  i.category.toLowerCase().includes(menuSearch.toLowerCase());
                const matchCat = menuFilter === 'All' || menuFilter === 'Active' || menuFilter === 'Hidden' || i.category === menuFilter;
                const matchStatus = menuFilter === 'Active' ? i.isActive !== false
                  : menuFilter === 'Hidden' ? i.isActive === false
                  : true;
                return matchSearch && matchCat && matchStatus;
              });

              if (filtered.length === 0) return (
                <div className="p-16 border border-gold/10 bg-charcoal-light/10 rounded-2xl text-center">
                  <Search className="w-10 h-10 text-cream/15 mx-auto mb-3" />
                  <p className="text-cream/40 text-sm">No items match your search.</p>
                  <button onClick={() => { setMenuSearch(''); setMenuFilter('All'); }} className="mt-3 text-xs text-saffron hover:underline cursor-pointer">Clear filters</button>
                </div>
              );

              return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item) => {
                  const isEditing = editingId === item.id;
                  const isActive  = item.isActive !== false; // default true if undefined

                  return (
                    <div
                      key={item.id}
                      className={`glassmorphism rounded-2xl overflow-hidden border transition-colors duration-200 ${
                        isActive ? 'border-gold/10 hover:border-gold/22' : 'border-cream/5 opacity-70'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-40 w-full">
                        <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                        {item.isBestseller && (
                          <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider bg-saffron text-charcoal px-2 py-0.5 rounded-full">
                            Bestseller
                          </span>
                        )}
                        {/* Active / Hidden badge */}
                        <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-cream/10 text-cream/40 border border-cream/15'
                        }`}>
                          {isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>

                      <div className="p-4">
                        {/* View mode */}
                        {!isEditing && (
                          <>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-playfair text-sm font-bold text-cream leading-snug">{item.name}</h3>
                              <span className="font-mono text-sm font-bold text-gold shrink-0">{formatPrice(item.price)}</span>
                            </div>
                            <p className="text-[11px] text-cream/45 mb-1">{item.category}</p>
                            <p className="text-[11px] text-cream/55 font-light leading-relaxed line-clamp-2 mb-4">{item.description}</p>

                            {/* Controls row */}
                            <div className="flex items-center gap-2">
                              {/* Active toggle */}
                              <div className="flex items-center gap-2 flex-1">
                                <button
                                  type="button"
                                  disabled={togglingId === item.id}
                                  onClick={() => handleToggleActive(item.id, isActive)}
                                  className={`relative w-10 h-6 rounded-full border transition-all duration-300 cursor-pointer shrink-0 disabled:opacity-50 ${
                                    isActive
                                      ? 'bg-green-500/80 border-green-500/60'
                                      : 'bg-charcoal-light border-gold/20'
                                  }`}
                                  title={isActive ? 'Click to hide from menu' : 'Click to show on menu'}
                                >
                                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isActive ? 'left-4' : 'left-0.5'}`} />
                                </button>
                                <span className="text-[10px] text-cream/40 font-medium">
                                  {isActive ? <Eye className="w-3 h-3 inline text-green-400" /> : <EyeOff className="w-3 h-3 inline text-cream/30" />}
                                </span>
                              </div>

                              {/* Edit button */}
                              <button
                                onClick={() => openEdit(item)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gold/20 text-gold/70 hover:bg-gold/10 hover:text-gold hover:border-gold/40 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" /> Edit
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteMenuItem(item.id, item.name)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-maroon/30 text-maroon/70 hover:bg-maroon hover:text-cream hover:border-maroon text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}

                        {/* Inline edit form */}
                        {isEditing && editState && (
                          <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-saffron font-semibold mb-2">Editing Item</p>

                            {/* Image change */}
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1.5">Photo</label>
                              <div className="relative rounded-xl overflow-hidden border border-gold/15 aspect-video mb-2">
                                <Image
                                  src={editState.newImagePreview || editState.image}
                                  alt="Item"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => editImageRef.current?.click()}
                                  className="absolute inset-0 flex items-center justify-center bg-charcoal/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <div className="flex flex-col items-center gap-1 text-cream">
                                    <Upload className="w-5 h-5" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Change Photo</span>
                                  </div>
                                </button>
                              </div>
                              <input
                                ref={editImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file || !editState) return;
                                  setEditState({
                                    ...editState,
                                    newImageFile: file,
                                    newImagePreview: URL.createObjectURL(file),
                                  });
                                }}
                              />
                            </div>

                            {/* Name */}
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1">Name</label>
                              <input
                                type="text"
                                value={editState.name}
                                onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                                className="form-input text-xs py-2"
                              />
                            </div>

                            {/* Price + Category */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1">Price (₹)</label>
                                <input
                                  type="number" min="1"
                                  value={editState.price}
                                  onChange={(e) => setEditState({ ...editState, price: e.target.value })}
                                  className="form-input text-xs py-2"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1">Category</label>
                                <select
                                  value={editState.category}
                                  onChange={(e) => setEditState({ ...editState, category: e.target.value })}
                                  className="form-input text-xs py-2"
                                >
                                  {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1">Description</label>
                              <textarea
                                rows={2}
                                value={editState.description}
                                onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                                className="form-input text-xs py-2 resize-none"
                              />
                            </div>

                            {/* Spice level */}
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-gold/70 font-semibold block mb-1">Spice Level</label>
                              <div className="flex gap-1.5">
                                {[0, 1, 2, 3].map((lvl) => (
                                  <button
                                    key={lvl} type="button"
                                    onClick={() => setEditState({ ...editState, spiceLevel: lvl })}
                                    className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                      editState.spiceLevel === lvl
                                        ? 'bg-saffron border-saffron text-charcoal'
                                        : 'border-gold/20 text-cream/50 hover:border-saffron/50'
                                    }`}
                                  >
                                    {lvl === 0 ? 'None' : '🌶'.repeat(lvl)}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Bestseller toggle */}
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => setEditState({ ...editState, isBestseller: !editState.isBestseller })}
                                className={`w-9 h-5 rounded-full border transition-all duration-200 relative cursor-pointer ${
                                  editState.isBestseller ? 'bg-saffron border-saffron' : 'bg-charcoal-light border-gold/20'
                                }`}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${editState.isBestseller ? 'left-4' : 'left-0.5'}`} />
                              </button>
                              <span className="text-[10px] text-cream/60">Mark as Bestseller</span>
                            </div>

                            {/* Save / Cancel */}
                            <div className="flex gap-2 pt-1">
                              <button
                                type="button"
                                disabled={editSaving}
                                onClick={() => handleSaveEdit(item.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-saffron text-charcoal text-[10px] font-bold uppercase tracking-wider hover:bg-saffron/90 transition-all cursor-pointer disabled:opacity-60"
                              >
                                {editSaving
                                  ? <><span className="w-3 h-3 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Saving…</>
                                  : <><CheckCircle className="w-3 h-3" /> Save Changes</>
                                }
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded-xl border border-gold/20 text-cream/50 hover:text-cream hover:border-gold/40 text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              );
            })()}
          </div>
        )}

        {/* ── Add Menu Item Tab ── */}
        {activeTab === 'add-menu' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="font-playfair text-2xl font-bold text-cream mb-8">Add New Menu Item</h2>

            {successMsg && (
              <div className="flex items-center gap-2.5 bg-leaf/10 border border-leaf/30 text-cream text-sm p-4 rounded-xl mb-6">
                <CheckCircle className="w-4 h-4 text-leaf-light shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAddMenuItem} className="glassmorphism p-8 rounded-2xl space-y-5">

              {/* Image upload */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-2">
                  Dish Photo <span className="text-saffron">*</span>
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gold/15 aspect-video">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-charcoal/80 border border-gold/20 rounded-full flex items-center justify-center text-cream hover:text-saffron transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gold/20 hover:border-saffron/50 rounded-xl p-8 flex flex-col items-center gap-3 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center group-hover:bg-saffron/15 transition-colors">
                      <Upload className="w-5 h-5 text-saffron" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-cream/70">Click to upload image</p>
                      <p className="text-xs text-cream/35 mt-1">JPG, PNG, WEBP — from your computer</p>
                    </div>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">
                  Item Name <span className="text-saffron">*</span>
                </label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ghee Podi Roast Dosa"
                  className="form-input"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">
                    Price (₹) <span className="text-saffron">*</span>
                  </label>
                  <input
                    type="number" required min="1" value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 199"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">Category</label>
                  <select value={cat} onChange={(e) => setCat(e.target.value)} className="form-input">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">
                  Description <span className="text-saffron">*</span>
                </label>
                <textarea
                  required rows={3} value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the dish, ingredients, and cooking style…"
                  className="form-input resize-none"
                />
              </div>

              {/* Spice + Bestseller */}
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">Spice Level</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((lvl) => (
                      <button
                        key={lvl} type="button"
                        onClick={() => setSpice(lvl)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          spice === lvl
                            ? 'bg-saffron border-saffron text-charcoal'
                            : 'border-gold/20 text-cream/50 hover:border-saffron/50'
                        }`}
                      >
                        {lvl === 0 ? 'None' : '🌶'.repeat(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pb-1">
                  <button
                    type="button"
                    onClick={() => setBestseller(!bestseller)}
                    className={`w-10 h-6 rounded-full border transition-all duration-200 relative cursor-pointer ${
                      bestseller ? 'bg-saffron border-saffron' : 'bg-charcoal-light border-gold/20'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${bestseller ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  <label className="text-xs text-cream/70 cursor-pointer" onClick={() => setBestseller(!bestseller)}>
                    Mark as Bestseller
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-premium-filled w-full py-3.5 rounded-xl text-xs mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <><span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Uploading image…</>
                ) : saving ? (
                  <><span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Saving…</>
                ) : (
                  <><PackagePlus className="w-4 h-4" /> Add to Menu</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Reviews Moderation Tab ── */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="font-playfair text-2xl font-bold text-cream mb-6">Review Moderation</h2>

            {/* Pending */}
            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                Pending Approval ({reviews.filter((r) => !r.isApproved).length})
              </h3>
              {reviews.filter((r) => !r.isApproved).length === 0 ? (
                <div className="p-10 border border-gold/10 bg-charcoal-light/10 rounded-2xl text-center text-cream/35 text-sm">
                  No reviews pending approval.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.filter((r) => !r.isApproved).map((rev) => (
                    <div key={rev.id} className="glassmorphism p-5 rounded-2xl border border-gold/10 flex justify-between items-start gap-6">
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center gap-3">
                          <h3 className="font-playfair font-bold text-cream text-sm">{rev.name}</h3>
                          <span className="text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs text-cream/65 font-light leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="w-9 h-9 border border-leaf/30 text-leaf-light hover:bg-leaf hover:text-cream rounded-full flex items-center justify-center transition-all cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="w-9 h-9 border border-maroon/30 text-maroon hover:bg-maroon hover:text-cream rounded-full flex items-center justify-center transition-all cursor-pointer"
                          title="Delete"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
                Published Reviews ({reviews.filter((r) => r.isApproved).length})
              </h3>
              {reviews.filter((r) => r.isApproved).length === 0 ? (
                <div className="p-10 border border-gold/10 bg-charcoal-light/10 rounded-2xl text-center text-cream/35 text-sm">
                  No approved reviews yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.filter((r) => r.isApproved).map((rev) => (
                    <div key={rev.id} className="glassmorphism p-5 rounded-2xl border border-gold/10 flex justify-between items-start gap-6">
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center gap-3">
                          <h3 className="font-playfair font-bold text-cream text-sm">{rev.name}</h3>
                          <span className="text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full">{'★'.repeat(rev.rating)}</span>
                          <span className="text-[9px] text-leaf-light bg-leaf/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Published</span>
                        </div>
                        <p className="text-xs text-cream/55 font-light leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="w-9 h-9 border border-maroon/30 text-maroon/70 hover:bg-maroon hover:text-cream rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Gallery Tab ── */}
        {activeTab === 'gallery' && (
          <div>
            <h2 className="font-playfair text-2xl font-bold text-cream mb-8">Gallery Management</h2>

            {/* Upload form */}
            <form onSubmit={handleAddGalleryPhoto} className="glassmorphism p-6 rounded-2xl mb-8">
              <h3 className="font-playfair text-base font-bold text-cream mb-5">Add New Photo</h3>
              <div className="flex flex-col md:flex-row gap-5 items-start">

                {/* File picker */}
                <div className="w-full md:w-64 shrink-0">
                  {galleryPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gold/15 aspect-video">
                      <Image src={galleryPreview} alt="Preview" fill unoptimized className="object-cover" />
                      <button
                        type="button"
                        onClick={() => { setGalleryFile(null); setGalleryPreview(''); if (galleryInputRef.current) galleryInputRef.current.value = ''; }}
                        className="absolute top-2 right-2 w-7 h-7 bg-charcoal/80 border border-gold/20 rounded-full flex items-center justify-center text-cream hover:text-saffron cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gold/20 hover:border-saffron/50 rounded-xl p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer group aspect-video justify-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center group-hover:bg-saffron/15 transition-colors">
                        <Upload className="w-5 h-5 text-saffron" />
                      </div>
                      <p className="text-xs font-semibold text-cream/60">Click to select photo</p>
                    </button>
                  )}
                  <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleGalleryFileChange} className="hidden" />
                </div>

                {/* Caption + submit */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-gold font-semibold block mb-1.5">Caption (optional)</label>
                    <input
                      type="text"
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                      placeholder="e.g. Ghee Podi Roast Dosa"
                      className="form-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={galleryUploading || !galleryFile}
                    className="btn-premium-filled py-3 rounded-xl text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {galleryUploading
                      ? <><span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> Uploading…</>
                      : <><Upload className="w-4 h-4" /> Add to Gallery</>
                    }
                  </button>
                </div>
              </div>
            </form>

            {/* Existing photos grid */}
            {galleryPhotos.length === 0 ? (
              <div className="p-16 border border-gold/10 bg-charcoal-light/10 rounded-2xl text-center">
                <p className="text-cream/40 text-sm">No photos in the gallery yet. Upload your first photo above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative rounded-xl overflow-hidden border border-gold/10 group aspect-square">
                    <Image src={photo.url} alt={photo.caption || 'Gallery'} fill unoptimized className="object-cover" />
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                      {photo.caption && (
                        <p className="text-xs text-cream font-semibold text-center line-clamp-2">{photo.caption}</p>
                      )}
                      <button
                        onClick={() => handleDeleteGalleryPhoto(photo.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon/80 border border-maroon text-cream text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-maroon transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
