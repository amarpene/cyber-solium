import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface BlogPost {
    id: number | string;
    title: string;
    excerpt: string;
    category: string;
    cover_image?: string;
    created_at: string;
    external_url?: string | null;
    source?: string;
}

interface BlogProps {
    onOpenPost: (postId: number) => void;
}

const FALLBACK_POSTS: BlogPost[] = [
    {
        id: 'fallback-iso',
        title: 'ISO 27001 : structurer votre SMSI en 5 étapes',
        excerpt: 'Une feuille de route simple pour cadrer la gouvernance, les risques et les contrôles clés.',
        category: 'Conformité',
        created_at: new Date().toISOString(),
        external_url: null,
        source: 'Cyber Solium'
    },
    {
        id: 'fallback-phishing',
        title: 'Phishing : réduire le risque humain rapidement',
        excerpt: 'Sensibilisation ciblée, MFA, et procédures d’escalade : les actions qui ont le plus d’impact.',
        category: 'Cybersécurité',
        created_at: new Date().toISOString(),
        external_url: null,
        source: 'Cyber Solium'
    }
];

export const Blog: React.FC<BlogProps> = ({ onOpenPost }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [frequency, setFrequency] = useState('monthly');
    const [consent, setConsent] = useState(true);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const safeJson = async (res: Response) => {
            const text = await res.text();
            return text ? JSON.parse(text) : null;
        };

        const loadPosts = async () => {
            try {
                const res = await fetch('/api/blog/feed');
                let data: BlogPost[] = res.ok ? await safeJson(res) : [];

                if (!data || data.length === 0) {
                    const localRes = await fetch('/api/blog/posts');
                    if (localRes.ok) {
                        data = await safeJson(localRes) || [];
                    }
                }

                if (!data || data.length === 0) {
                    data = FALLBACK_POSTS;
                }

                setPosts(data);
            } catch (error) {
                console.error('Erreur chargement blog:', error);
                setPosts(FALLBACK_POSTS);
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, frequency, consent })
            });

            if (!res.ok) {
                const err = await res.json();
                setStatus('error');
                setMessage(err.error || 'Erreur lors de l\'inscription');
                return;
            }

            setStatus('success');
            setMessage('Inscription enregistrée. Envoi mensuel des actualités.');
            setEmail('');
        } catch (error) {
            setStatus('error');
            setMessage('Erreur lors de l\'inscription');
        }
    };

    return (
        <section className="min-h-screen py-16 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-500/20">
                        Newsletter & Blog
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
                        Actualités <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Cybersécurité</span>
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
                        Articles, bonnes pratiques et nouveautés. Inscrivez-vous pour recevoir un récapitulatif mensuel.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="text-center py-16">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                                <p className="text-slate-400">Chargement des articles...</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {posts.map(post => (
                                    <article
                                        key={post.id}
                                        onClick={() => {
                                            if (post.external_url) {
                                                window.open(post.external_url, '_blank', 'noopener,noreferrer');
                                            } else {
                                                onOpenPost(Number(post.id));
                                            }
                                        }}
                                        className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-cyan-500/40 transition-all"
                                    >
                                        {post.cover_image && (
                                            <div className="h-40 overflow-hidden">
                                                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                                                {post.category}{post.source ? ` • ${post.source}` : ''}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center text-sm font-semibold text-cyan-400">
                                                Lire l'article
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-28 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <BookOpen className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold text-white">Newsletter mensuelle</h2>
                            </div>
                            <p className="text-slate-400 text-sm mb-6">
                                Recevez les derniers articles, nouveautés et promotions. Envoi 1 fois / mois.
                            </p>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            placeholder="vous@entreprise.fr"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Fréquence</label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="weekly">Hebdomadaire</option>
                                        <option value="biweekly">Toutes les 2 semaines</option>
                                        <option value="monthly">Mensuelle</option>
                                    </select>
                                </div>

                                <label className="flex items-start gap-2 text-xs text-slate-400">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(e) => setConsent(e.target.checked)}
                                        className="mt-0.5"
                                    />
                                    J’accepte de recevoir des emails de Cyber Solium.
                                </label>

                                {status === 'success' && (
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        {message}
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all"
                                >
                                    S’inscrire
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
