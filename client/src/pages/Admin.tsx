import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { promptsApi, adminApi } from '../services/api';
import type { Prompt, AdminUser, AdminStats, AdminReading } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, FileText, Loader2, Menu, X, Save, Check,
  Users, BarChart3, ScrollText, Search, Shield
} from 'lucide-react';

type Tab = 'prompts' | 'users' | 'analytics';

export default function Admin() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [readings, setReadings] = useState<AdminReading[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userSort, setUserSort] = useState<'name' | 'readings'>('name');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [promptsData, usersData, statsData, readingsData] = await Promise.all([
        promptsApi.getAll(),
        adminApi.getUsers(),
        adminApi.getStats(),
        adminApi.getReadings()
      ]);
      setPrompts(promptsData);
      setUsers(usersData);
      setStats(statsData);
      setReadings(readingsData);
      if (promptsData.length > 0 && !selectedPrompt) {
        selectPrompt(promptsData[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
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
      console.error('Failed to save:', error);
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
      const data = await promptsApi.getAll();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to create:', error);
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
      console.error('Failed to delete:', error);
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users;
    
    if (userSearch.trim()) {
      const search = userSearch.toLowerCase();
      result = result.filter(u => 
        u.firstName?.toLowerCase().includes(search) ||
        u.lastName?.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search)
      );
    }
    
    if (userSort === 'name') {
      result = [...result].sort((a, b) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (userSort === 'readings') {
      result = [...result].sort((a, b) => {
        const countA = readings.filter(r => (typeof r.user === 'string' ? r.user : r.user?._id) === a._id).length;
        const countB = readings.filter(r => (typeof r.user === 'string' ? r.user : r.user?._id) === b._id).length;
        return countB - countA;
      });
    }
    
    return result;
  }, [users, userSearch, userSort, readings]);

  const getUserReadingsCount = (userId: string) => {
    return readings.filter(r => 
      (typeof r.user === 'string' ? r.user : r.user?._id) === userId
    ).length;
  };

  const getAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-16 flex flex-col">
      <div className="bg-[#1a0f2e] border-b border-purple-500/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <h1 className="text-lg font-bold text-amber-400">{t('admin.title')}</h1>
          </div>
          <div className="flex gap-1 bg-black/30 rounded-lg p-1">
            {(['prompts', 'users', 'analytics'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'prompts' && <ScrollText className="w-4 h-4" />}
                {tab === 'users' && <Users className="w-4 h-4" />}
                {tab === 'analytics' && <BarChart3 className="w-4 h-4" />}
                <span className="hidden sm:inline">{t(`admin.tabs.${tab}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'prompts' && (
        <div className="flex-1 flex overflow-hidden">
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden fixed top-36 left-4 z-30 p-2 bg-purple-600 rounded-lg text-white"
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
            fixed md:relative inset-y-0 left-0 z-50 md:z-auto top-0 md:top-0
            w-72 bg-[#1a0f2e] border-r border-purple-500/20
            transform transition-transform duration-300 md:transform-none
            ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col
          `}>
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between md:hidden">
              <h2 className="text-lg font-bold text-amber-400">{t('admin.tabs.prompts')}</h2>
              <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-white">
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
              {prompts.length === 0 && (
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
                    <button onClick={() => setShowCreateForm(false)} className="flex-1 text-gray-400 hover:text-white py-2 text-sm">
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
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || editContent === selectedPrompt.content}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        saved ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white disabled:opacity-50'
                      }`}
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <><Check className="w-5 h-5" />{t('profile.saved')}</> : <><Save className="w-5 h-5" />{t('admin.save')}</>}
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
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="flex-1 overflow-auto p-4 bg-[#0f0a1a]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder={t('admin.users.search')}
                  className="w-full bg-white/5 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-gray-500 text-sm">{t('admin.users.total')}: {users.length}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">{t('admin.users.sortBy')}:</span>
                  <button
                    onClick={() => setUserSort('name')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      userSort === 'name' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('admin.users.byName')}
                  </button>
                  <button
                    onClick={() => setUserSort('readings')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      userSort === 'readings' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('admin.users.byReadings')}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredUsers.map(u => (
                <div key={u._id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
                      {u.firstName?.[0] || u.username[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {u.firstName} {u.lastName}
                        {u.role === 'admin' && <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">admin</span>}
                      </div>
                      <div className="text-gray-400 text-sm">@{u.username} · {u.email}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {u.gender && <span className="mr-3">{t(`profile.${u.gender}`)}</span>}
                        {u.birthDate && <span className="mr-3">{getAge(u.birthDate)} {t('admin.analytics.years')}</span>}
                        <span>{t('admin.users.registered')}: {new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">{getUserReadingsCount(u._id)}</div>
                    <div className="text-gray-500 text-xs">{t('admin.users.readings')}</div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>{t('admin.users.noResults')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && stats && (
        <div className="flex-1 overflow-auto p-4 bg-[#0f0a1a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400">{stats.totalUsers}</div>
                <div className="text-gray-400 text-sm">{t('admin.analytics.totalUsers')}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.totalReadings}</div>
                <div className="text-gray-400 text-sm">{t('admin.analytics.totalReadings')}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{stats.genderStats.female}</div>
                <div className="text-gray-400 text-sm">{t('profile.female')}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.genderStats.male}</div>
                <div className="text-gray-400 text-sm">{t('profile.male')}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{t('admin.analytics.readingTypes')}</h3>
                <p className="text-gray-500 text-xs mb-3">{t('admin.analytics.uniqueUsers')}</p>
                <div className="space-y-3">
                  {Object.entries(stats.uniqueUsersByType || {}).map(([type, count]) => (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{t(`history.types.${type}`)}</span>
                        <span className="text-gray-400">{count} {t('admin.analytics.people')} / {stats.readingTypes[type]} {t('admin.analytics.requests')}</span>
                      </div>
                      <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500"
                          style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{t('admin.analytics.requestsByGender')}</h3>
                <div className="space-y-3">
                  {Object.entries(stats.readingsByGender || {}).map(([gender, count]) => (
                    <div key={gender}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{t(`profile.${gender}`)}</span>
                        <span className="text-gray-400">{count} {t('admin.analytics.requests')}</span>
                      </div>
                      <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${gender === 'female' ? 'bg-pink-500' : gender === 'male' ? 'bg-blue-500' : 'bg-purple-500'}`}
                          style={{ width: `${stats.totalReadings ? (count / stats.totalReadings) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{t('admin.analytics.requestsByAge')}</h3>
                <div className="space-y-3">
                  {Object.entries(stats.readingsByAge || {}).map(([group, count]) => (
                    <div key={group}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{group}</span>
                        <span className="text-gray-400">{count} {t('admin.analytics.requests')}</span>
                      </div>
                      <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-500"
                          style={{ width: `${stats.totalReadings ? (count / stats.totalReadings) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-4">{t('admin.analytics.dailyActivity')}</h3>
                <div className="flex items-end gap-1 h-32">
                  {(() => {
                    const days = [];
                    const now = new Date();
                    for (let i = 29; i >= 0; i--) {
                      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                      const key = d.toISOString().split('T')[0];
                      days.push({ date: key, count: stats.dailyReadings[key] || 0 });
                    }
                    const max = Math.max(...days.map(d => d.count), 1);
                    return days.map((day, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-600 to-amber-500 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${(day.count / max) * 100}%`, minHeight: day.count > 0 ? '4px' : '2px' }}
                        title={`${day.date}: ${day.count}`}
                      />
                    ));
                  })()}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>30 {t('admin.analytics.daysAgo')}</span>
                  <span>{t('common.today')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h2 className="text-xl font-bold text-amber-400 mb-3">{t('admin.confirmDelete')}</h2>
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
