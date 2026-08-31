import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/categories/crud');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/categories/crud', {
        action: 'create',
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
      });

      if (res.data.success) {
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories();
      }
    } catch (err: any) {
      alert('Error creating category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete category?')) {
      await api.post('/admin/categories/crud', { action: 'delete', id });
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Category Taxonomy Management</h1>
        <p className="text-gray-400 text-xs mt-1">Manage project domain categories stored dynamically in MongoDB.</p>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Add New Category</h3>
        <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-300 mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="AI / Machine Learning"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
              }}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-300 mb-1">Description</label>
            <input
              type="text"
              placeholder="AI & intelligent model projects"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-gray-100"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-surface/90 border border-border/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Loading categories...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-background border-b border-border/60 text-gray-400 font-mono">
              <tr>
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-gray-200">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-surface-hover">
                  <td className="p-3.5 font-bold text-white">{c.name}</td>
                  <td className="p-3.5 font-mono text-accent-400">{c.slug}</td>
                  <td className="p-3.5 text-gray-400">{c.description || '-'}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteCategory(c._id)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
