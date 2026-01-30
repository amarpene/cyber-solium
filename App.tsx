import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Nis2Calculator } from './components/Nis2Calculator';
import { Iso27001Calculator } from './components/Iso27001Calculator';
import { Services } from './components/Services';
import { ServiceDetail } from './components/ServiceDetail';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Iso27001Dashboard } from './components/Iso27001Dashboard';
import { Trainings } from './components/Trainings';
import { TrainingDetail } from './components/TrainingDetail';
import { Blog } from './components/Blog';
import { BlogDetail } from './components/BlogDetail';
import { Chatbot } from './components/Chatbot';
import { CGU } from './components/CGU';

export type Page =
  | 'home'
  | 'nis2'
  | 'iso27001'
  | 'iso27001-dashboard'
  | 'dashboard'
  | 'trainings'
  | 'blog'
  | 'blog-article'
  | 'services'
  | 'service-compliance'
  | 'service-soc'
  | 'service-pentest'
  | 'service-infra'
  | 'service-avocats'
  | 'service-sante'
  | 'service-comptables'
  | 'training-nis2'
  | 'training-rgpd'
  | 'training-cyber'
  | 'training-incident';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [prefilledMessage, setPrefilledMessage] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const openBlogPost = (postId: number) => {
    setSelectedBlogId(postId);
    setCurrentPage('blog-article');
  };

  const handleOpenContact = (msg: string = '') => {
    setPrefilledMessage(msg);
    setShowContactModal(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen font-sans text-slate-50 selection:bg-cyan-500 selection:text-white overflow-x-hidden bg-slate-950 flex flex-col">
        {/* Global Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>

        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          onContactClick={() => handleOpenContact('Demande de Devis Général')}
          onAuthClick={() => setShowAuthModal(true)}
        />

        <main className="flex-grow relative z-10 pt-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentPage === 'home' && (
              <Home onNavigate={navigate} onContactRequest={handleOpenContact} />
            )}

            {currentPage === 'dashboard' && (
              <Dashboard onNavigate={navigate} onContactClick={handleOpenContact} type="nis2" />
            )}

            {currentPage === 'trainings' && (
              <Trainings onNavigate={navigate} />
            )}

            {currentPage === 'blog' && (
              <Blog onOpenPost={openBlogPost} />
            )}

            {currentPage === 'blog-article' && (
              <BlogDetail postId={selectedBlogId} onBack={() => setCurrentPage('blog')} />
            )}

            {currentPage === 'nis2' && (
              <section className="py-12 min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Audit de Conformité
                  </h1>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Outil officiel de pré-diagnostic NIS 2 & Hygiène Informatique.
                  </p>
                </div>
                <div className="w-full max-w-5xl">
                  <Nis2Calculator onContactRequest={handleOpenContact} />
                </div>
              </section>
            )}


            {currentPage === 'iso27001' && (
              <section className="py-12 min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Audit de Conformité ISO 27001
                  </h1>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Outil de pré-diagnostic ISO 27001 & SMSI.
                  </p>
                </div>
                <div className="w-full max-w-5xl">
                  <Iso27001Calculator onContactRequest={handleOpenContact} />
                </div>
                <div className="mt-8 text-center">
                  <button
                    className="inline-block px-6 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold transition-colors"
                    onClick={() => navigate('iso27001-dashboard')}
                  >
                    Voir le tableau de bord ISO 27001
                  </button>
                </div>
              </section>
            )}

            {currentPage === 'iso27001-dashboard' && (
              <Iso27001Dashboard onNavigate={navigate} />
            )}

            {currentPage === 'services' && (
              <Services onNavigate={navigate} onContactClick={() => handleOpenContact('Renseignement Services')} />
            )}


            {/* Pages Détails Génériques + Nouvelles Verticales Métiers */}
            {(
              currentPage === 'service-compliance' ||
              currentPage === 'service-soc' ||
              currentPage === 'service-pentest' ||
              currentPage === 'service-infra' ||
              currentPage === 'service-avocats' ||    // NOUVEAU
              currentPage === 'service-sante' ||      // NOUVEAU
              currentPage === 'service-comptables'    // NOUVEAU
            ) && (
                <ServiceDetail
                  type={currentPage}
                  onContactClick={handleOpenContact}
                  onNavigate={navigate}
                />
              )}

            {(
              currentPage === 'training-nis2' ||
              currentPage === 'training-rgpd' ||
              currentPage === 'training-cyber' ||
              currentPage === 'training-incident'
            ) && (
                <TrainingDetail
                  type={currentPage}
                  onContactClick={handleOpenContact}
                />
              )}

            {currentPage === 'iso27001' && (
              <section className="py-12 min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Audit de Conformité ISO 27001
                  </h1>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Outil de pré-diagnostic ISO 27001 & SMSI.
                  </p>
                </div>
                <div className="w-full max-w-5xl">
                  <Iso27001Calculator onContactRequest={handleOpenContact} />
                </div>
                <div className="mt-8 text-center">
                  <button
                    className="inline-block px-6 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold transition-colors"
                    onClick={() => navigate('iso27001-dashboard')}
                  >
                    Voir le tableau de bord ISO 27001
                  </button>
                </div>
              </section>
            )}

            {/* Auth Modal */}
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSuccess={() => navigate('dashboard')}
            />

            {/* Global Modal */}
            {showContactModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 relative shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-200">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                  <h3 className="text-2xl font-bold mb-2">Contact Rapide</h3>
                  <p className="text-slate-400 mb-6 text-sm">Laissez vos coordonnées pour recevoir votre rapport ou un devis.</p>
                  <ContactForm
                    initialMessage={prefilledMessage}
                    isModal={true}
                    onSuccess={() => setTimeout(() => setShowContactModal(false), 2000)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer onNavigate={navigate} onContactClick={() => handleOpenContact('Demande de contact depuis le footer')} />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => navigate('dashboard')}
      />

      {/* Global Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 relative shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-2">Contact Rapide</h3>
            <p className="text-slate-400 mb-6 text-sm">Laissez vos coordonnées pour recevoir votre rapport ou un devis.</p>
            <ContactForm
              initialMessage={prefilledMessage}
              isModal={true}
              onSuccess={() => setTimeout(() => setShowContactModal(false), 2000)}
            />
          </div>
        </div>
      )}
    </AuthProvider>
  );
};

export default App;