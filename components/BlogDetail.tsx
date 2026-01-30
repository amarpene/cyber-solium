import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface BlogDetailProps {
    postId: number | null;
    onBack: () => void;
}

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    cover_image?: string;
    created_at: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ postId, onBack }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (!postId) return;
            try {
                const res = await fetch(`/api/blog/posts/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (error) {
                console.error('Erreur chargement article:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [postId]);

    return (
        <section className="min-h-screen py-16 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={onBack}
                    className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour aux articles
                </button>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-slate-400">Chargement de l'article...</p>
                    </div>
                ) : post ? (
                    <article className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                        {post.cover_image && (
                            <div className="h-64 overflow-hidden">
                                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-8">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                                <span className="inline-flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    {post.category}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                        </div>
                    </article>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-400">Article introuvable.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
