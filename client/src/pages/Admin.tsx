import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { promptsApi } from '../services/api';
import type { Prompt } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FileText, Loader2, Menu, X, Save, Check } from 'lucide-react';

export default function Admin() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadPrompts();
  }, [user, navigate]);

  const loadPrompts = async () => {
    try {
      const data = await promptsApi.getAll();
      setPrompts(data);
      if (data.length > 0 && !selectedPrompt) {
        selectPrompt(data[0]);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setEditContent(prompt.content);
    setShowSidebar(false);
    setSaved(false);
    setShowCreateForm(false);
  };

  const handleSave = async () => {
    if (!selectedPrompt) return;
    setIsSaving(true);

    try {
      await promptsApi.update(selectedPrompt._id, editContent);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      const updatedPrompts = prompts.map(p => 
        p._id === selectedPrompt._id ? { ...p, content: editContent } : p
      );
      setPrompts(updatedPrompts);
    } catch (error) {
      console.error('Failed to save prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newPromptName.trim()) return;
    setIsSaving(true);

    try {
      await promptsApi.create(newPromptName, '');
      setNewPromptName('');
      setShowCreateForm(false);
      await loadPrompts();
    } catch (error) {
      console.error('Failed to create prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPrompt) return;

    try {
      await promptsApi.delete(selectedPrompt._id);
      setShowDeleteConfirm(false);
      const remaining = prompts.filter(p => p._id !== selectedPrompt._id);
      setPrompts(remaining);
      if (remaining.length > 0) {
        selectPrompt(remaining[0]);
      } else {
        setSelectedPrompt(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 flex">
      <button
        onClick={() => setShowSidebar(true)}
        className="md:hidden fixed top-20 left-4 z-30 p-2 bg-purple-600 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        w-72 bg-[#1a0f2e] border-r border-purple-500/20
        transform transition-transform duration-300 md:transform-none
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-400">{t('admin.title')}</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {prompts.map((prompt) => (
            <button
              key={prompt._id}
              onClick={() => selectPrompt(prompt)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all ${
                selectedPrompt?._id === prompt._id
                  ? 'bg-purple-600/30 text-amber-400 border border-purple-500/50'
                  : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
              }`}
            >
              <div className="font-medium">{prompt.name}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {prompt.content.substring(0, 50)}...
              </div>
            </button>
          ))}

          {prompts.length === 0 && !showCreateForm && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('admin.empty')}</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-purple-500/20">
          {showCreateForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newPromptName}
                onChange={(e) => setNewPromptName(e.target.value)}
                placeholder="taro, love, money..."
                className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 text-gray-400 hover:text-white py-2 text-sm"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newPromptName.trim() || isSaving}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {t('admin.create')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold py-3 rounded-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              {t('admin.create')}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0f0a1a]">
        {selectedPrompt ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-[#1a0f2e]/50">
              <div className="ml-10 md:ml-0">
                <h1 className="text-xl font-bold text-amber-400">{selectedPrompt.name}</h1>
                <p className="text-gray-500 text-sm">{t('admin.content')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                  title={t('admin.delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || editContent === selectedPrompt.content}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white disabled:opacity-50'
                  }`}
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : saved ? (
                    <>
                      <Check className="w-5 h-5" />
                      {t('profile.saved')}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {t('admin.save')}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-full bg-black/30 border border-purple-500/30 rounded-xl p-4 text-gray-200 font-mono text-sm focus:outline-none focus:border-purple-400 resize-none"
                placeholder="You are a mystical tarot reader..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('admin.emptySub')}</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-6 py-3 rounded-xl transition-all"
              >
                {t('admin.create')}
              </button>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold text-amber-400 mb-3">
                {t('admin.confirmDelete')}
              </h2>
              <p className="text-gray-400 mb-6">{t('admin.confirmDeleteSub')}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-purple-500/50 hover:border-purple-400 text-purple-400 font-semibold py-3 rounded-lg transition-colors"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
