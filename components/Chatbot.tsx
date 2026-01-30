import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant Cyber Solium. Je peux répondre à vos questions sur NIS2, le RGPD, la cybersécurité, nos formations et nos services. Comment puis-je vous aider ?',
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    sessionId
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur de communication avec le serveur');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erreur chatbot:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "Qu'est-ce que NIS2 ?",
        "Mon entreprise est-elle concernée ?",
        "Quelles sont les formations disponibles ?",
        "Comment obtenir un devis ?"
    ];

    return (
        <>
            {/* Bouton flottant */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center group transition-all duration-300 hover:scale-110"
                >
                    <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
                </button>
            )}

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] glass-panel rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col animate-in zoom-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-cyan-900/30 to-blue-900/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Assistant Cyber</h3>
                                <p className="text-xs text-slate-400">En ligne</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                    ? 'bg-cyan-600'
                                    : 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-700'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-cyan-400" />
                                    )}
                                </div>
                                <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-3 rounded-2xl max-w-[85%] ${msg.role === 'user'
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-700">
                                    <Bot className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Questions rapides (affichées au début) */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 space-y-2">
                            <p className="text-xs text-slate-400 font-medium">Questions fréquentes :</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInputMessage(question);
                                            setTimeout(() => handleSend(), 100);
                                        }}
                                        className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Posez votre question..."
                                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputMessage.trim() || isLoading}
                                className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
