// Fichier supprimé : contenu et références notariat retirés du site
import React from 'react';
import { ShieldAlert, Check, Stamp, Lock, FileSignature, Landmark, ShieldCheck, ServerCrash, MousePointerClick, FileText } from 'lucide-react';

interface NotaryProps {
  onContactClick: () => void;
}

export const NotarySolutions: React.FC<NotaryProps> = ({ onContactClick }) => {
  return (
    <section className="min-h-screen py-16 relative">
      {/* Background decoration specific to Notaries */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero Section of Notary Page */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1 relative animate-in slide-in-from-left duration-700">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.2)] group">
              <img
                src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000"
                alt="Étude notariale"
                className="w-full h-auto opacity-80 grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-slate-900/90 backdrop-blur-md border border-purple-500/50 p-6 rounded-xl shadow-2xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <ShieldAlert className="text-purple-400 w-6 h-6 animate-pulse" />
                    <span className="text-white font-bold text-lg">Priorité CSN & ANSSI</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Les notaires gèrent des flux financiers majeurs.
                    <br /><strong>Le RGSN impose désormais des standards de niveau militaire.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-in slide-in-from-right duration-700">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 rounded-full px-4 py-1.5 mb-8 border border-purple-500/30">
              <Stamp className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Verticale Juridique</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Conformité RGSN & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Exigence ANSSI.</span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              En tant qu'Officier Public, votre SI doit être inviolable. Nous appliquons strictement le <strong>Règlement Général de Sécurité du Notariat</strong> (basé sur les guides ANSSI) pour sécuriser vos accès Réal, Micen et iNot.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onContactClick}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 transform hover:scale-105"
              >
                Audit de Conformité RGSN
              </button>
            </div>
          </div>
        </div>

        {/* SECTION SPÉCIALE : RÉFORME ANTIVIRUS / EDR */}
        <div className="mb-24 relative">
          <div className="absolute inset-0 bg-purple-600/5 blur-[100px] rounded-full"></div>
          <div className="relative bg-slate-900 border border-purple-500/30 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ServerCrash className="w-64 h-64 text-purple-500" />
            </div>

            <div className="relative z-10">
              <div className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
                Nouvelle Directive de Sécurité
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                L'Antivirus Classique ne suffit plus.<br />
                <span className="text-red-500 underline decoration-red-500/30">L'EDR est la norme ANSSI.</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    Face à la professionnalisation des cyberattaques, le CSN et les cyber-assureurs s'alignent sur les recommandations de l'ANSSI : abandon des antivirus à signatures.
                  </p>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    <strong>La norme actuelle est l'EDR (Endpoint Detection & Response).</strong> Une intelligence artificielle comportementale exigée pour protéger la Minute Électronique et les fonds clients.
                  </p>
                  <button onClick={onContactClick} className="flex items-center text-purple-400 font-bold hover:text-white transition-colors">
                    <MousePointerClick className="w-5 h-5 mr-2" />
                    Vérifier si votre étude est équipée d'un EDR conforme
                  </button>
                </div>

                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-800">
                  <h4 className="text-white font-bold mb-4 flex items-center">Comparatif Technique</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Détection virus connus</span>
                      <div className="flex space-x-2 text-xs font-bold">
                        <span className="text-slate-500">Antivirus: OUI</span>
                        <span className="text-emerald-500">EDR: OUI</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Détection Ransomware inconnu (Zero-Day)</span>
                      <div className="flex space-x-2 text-xs font-bold">
                        <span className="text-red-500">Antivirus: NON</span>
                        <span className="text-emerald-500">EDR: OUI</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Blocage exfiltration données (DLP)</span>
                      <div className="flex space-x-2 text-xs font-bold">
                        <span className="text-red-500">Antivirus: NON</span>
                        <span className="text-emerald-500">EDR: OUI</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                      <span className="text-slate-400 text-sm">Surveillance humaine (SOC)</span>
                      <div className="flex space-x-2 text-xs font-bold">
                        <span className="text-red-500">Antivirus: NON</span>
                        <span className="text-emerald-500">EDR: OUI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
            <Check className="w-6 h-6 text-purple-400 mr-3" />
            Pack "Office Notarial Sécurisé" (Validé RGSN)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "EDR Certifié (Conforme prérequis Assurances)",
              "Sécurisation du boîtier Réal & Tunnels VPN",
              "MFA Hardware (Clé FIDO2) pour accès distants",
              "Cloisonnement du réseau (Wi-Fi public vs privé)",
              "Sauvegardes immuables (Protection contre chiffrement)",
              "Scan de vulnérabilités récurrent",
              "Formation 'Phishing Spécial Notaires' (Fraude au Président)",
              "Attestation de conformité pour votre assureur (RCP)"
            ].map((item, i) => (
              <li key={i} className="flex items-center bg-slate-900/60 p-4 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                <div className="mr-4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-200 font-medium">{item}</span>
              </li>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};