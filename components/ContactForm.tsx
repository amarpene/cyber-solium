import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ContactFormProps {
  initialMessage?: string;
  isModal?: boolean;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialMessage = '', isModal = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: initialMessage,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      if (onSuccess) onSuccess();
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="text-white w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Message envoyé !</h3>
        <p className="text-emerald-400">Un de nos experts vous rappellera sous 24h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Nom complet</label>
          <input 
            required
            type="text" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            placeholder="Jean Dupont"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Société</label>
          <input 
            required
            type="text" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            placeholder="Votre Entreprise"
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email professionnel</label>
          <input 
            required
            type="email" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            placeholder="jean@entreprise.com"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Téléphone</label>
          <input 
            required
            type="tel" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Votre besoin</label>
        <textarea 
          rows={3}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Je souhaite vérifier ma conformité NIS 2..."
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center ${
          isModal ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
        }`}
      >
        {status === 'submitting' ? (
          <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Envoi...</>
        ) : (
          "Être rappelé gratuitement"
        )}
      </button>
      
      <p className="text-xs text-slate-500 text-center mt-2">
        Vos données sont sécurisées et ne seront jamais partagées.
      </p>
    </form>
  );
};