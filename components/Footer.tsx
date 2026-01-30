import React, { useState } from 'react';
import { Linkedin, Twitter, Mail, MapPin } from 'lucide-react';
import logo from '../logo.png';
import { Page } from '../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onContactClick }) => {
  const [modal, setModal] = useState<null | 'cgu' | 'cgv' | 'privacy' | 'legal'>(null);
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-slate-900/60 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 border border-slate-800">
                <img src={logo} alt="Cyber Solium" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                Cyber <span className="text-cyan-400">Solium</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
              Nous sommes l'élite de la cybersécurité française. Partenaire stratégique des OIV, OSE et des professions réglementées pour une souveraineté numérique totale.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Expertises</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => onNavigate('nis2')} className="hover:text-cyan-400 transition-colors">Audit NIS 2</button></li>
              <li><button onClick={() => onNavigate('service-soc')} className="hover:text-cyan-400 transition-colors">SOC & EDR</button></li>
              <li><button onClick={() => onNavigate('service-compliance')} className="hover:text-cyan-400 transition-colors">Conformité RGPD</button></li>
              <li><button onClick={() => onNavigate('service-pentest')} className="hover:text-cyan-400 transition-colors">Pentest</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Agence</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">Accueil</button></li>
              <li><button onClick={onContactClick} className="hover:text-cyan-400 transition-colors">Contact</button></li>
              <li className="flex items-start pt-4 border-t border-slate-900 mt-4">
                <Mail className="w-5 h-5 mr-3 text-cyan-500 shrink-0" />
                <span className="break-all">contact@cybersolution.fr</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-cyan-500 shrink-0" />
                <span>59 Av. de Fes<br />34090 Montpellier</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2026 Cyber Solium. Excellence & Souveraineté.</p>
          <div className="space-x-3 mt-4 md:mt-0 flex">
            <button onClick={() => setModal('cgu')} className="hover:text-cyan-400 transition-colors underline">CGU</button>
            <button onClick={() => setModal('cgv')} className="hover:text-cyan-400 transition-colors underline">CGV</button>
            <button onClick={() => setModal('privacy')} className="hover:text-cyan-400 transition-colors underline">Politique de confidentialité</button>
            <button onClick={() => setModal('legal')} className="hover:text-cyan-400 transition-colors underline">Mentions légales</button>
          </div>
        </div>

        {/* Modal Popups */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>
              <h2 className="text-2xl font-bold mb-4">
                {modal === 'cgu' && 'Conditions Générales d’Utilisation'}
                {modal === 'cgv' && 'Conditions Générales de Vente'}
                {modal === 'privacy' && 'Politique de confidentialité'}
                {modal === 'legal' && 'Mentions légales'}
              </h2>
              <div className="text-slate-300 text-sm max-h-[60vh] overflow-y-auto whitespace-pre-line">
                {modal === 'cgu' && (
                  <>
                    Conditions Générales d’Utilisation (CGU) – Cyber Solium
                    1. Objet
                    Les présentes CGU encadrent l’accès et l’utilisation de la plateforme SaaS d’accompagnement à la conformité RGPD/NIS 2.
                    2. Accès au service
                    • Compte utilisateur requis.
                    • Authentification forte et respect des politiques internes de sécurité.
                    • Disponibilité cible &gt; 99% (hors maintenance planifiée).
                    3. Description des fonctionnalités
                    • Diagnostic de conformité, recommandations, plan d’actions, rapports et gestion des utilisateurs (voir documentation).
                    4. Obligations de l’utilisateur
                    • Fournir des informations exactes, licites et non confidentielles sans autorisation.
                    • Respecter les lois applicables et ne pas tenter de porter atteinte au service.
                    • Sauvegarder ses contenus exportés.
                    5. Propriété intellectuelle
                    • La plateforme, son code et ses contenus (hors données client) sont protégés.
                    • Les rapports générés pour le client lui sont concédés pour un usage interne.
                    6. Données personnelles
                    • Voir Politique de confidentialité RGPD.
                    • Paramètres de consentement et droits disponibles depuis le compte.
                    7. Sécurité et confidentialité
                    • Engagements de sécurité (MFA, chiffrement, journaux).
                    • Politique de divulgation responsable pour les vulnérabilités.
                    8. Support et maintenance
                    • Horaires et délais de réponse (à définir).
                    • Mises à jour régulières et correctifs de sécurité.
                    9. Limitation de responsabilité
                    • Le service fournit des recommandations; l’implémentation reste sous la responsabilité du client.
                    • Aucune garantie d’obtention de certifications officielles; assistance à la conformité seulement.
                    10. Suspension / Résiliation
                    • En cas de manquement grave (sécurité, fraude, non-paiement).
                    • Effets de la résiliation : suppression/retour des données selon RGPD.
                    11. Droit applicable / Juridiction
                    • Droit français – Tribunaux compétents au siège du fournisseur (ou clause d’arbitrage si prévue).
                  </>
                )}
                {modal === 'cgv' && (
                  <>
                    Conditions Générales de Vente (CGV) – Cyber Solium
                    1. Champ d’application
                    Les présentes CGV s’appliquent à toutes les prestations d’audit, de formation et d’abonnement SaaS proposées aux clients professionnels.
                    2. Offres et tarifs
                    • Audit Flash NIS2 : 6 500 € – 5 jours.
                    • Audit complet + 3 mois de suivi : 20 000 €.
                    • SOC/EDR 24/7 : 1 500 €/mois/client.
                    • Formations NIS2 : 4 000 € la session.
                    Les prix s’entendent hors taxes; devis et bon de commande prévalent.
                    3. Commande et paiement
                    • Commande via devis signé / bon de commande.
                    • Facturation à l’acceptation et échéancier (30% à la commande, solde à livraison, ou mensuel pour les abonnements).
                    • Retard de paiement : pénalités légales + indemnité forfaitaire.
                    4. Exécution des prestations
                    • Obligations de moyens; calendrier précisé au devis.
                    • Prérequis côté client (accès, informations, référents).
                    • Livrables : rapports, tableaux de bord, attestations de formation si applicable.
                    5. Abonnements et renouvellement
                    • Durée initiale 12 mois, renouvellement tacite, modalités de résiliation avec préavis de 2 mois.
                    • Ajustement tarifaire annuel possible avec notification préalable.
                    6. Confidentialité et sécurité
                    • Clause de confidentialité réciproque; obligations de sécurité conformément au RGPD et aux bonnes pratiques NIS 2.
                    7. Propriété intellectuelle
                    • Droits sur le logiciel et les méthodologies; licence d’usage non exclusive pour le client.
                    • Les livrables d’audit sont réservés à l’usage interne du client.
                    8. Garanties et responsabilité
                    • Pas de garantie de certification NIS 2; assistance à la mise en conformité.
                    • Limitation de responsabilité : plafonnée aux montants payés sur les 12 derniers mois; exclusion des dommages indirects.
                    9. Force majeure
                    • Événements imprévisibles et irrésistibles suspendent les obligations.
                    10. Droit applicable / litiges
                    • Droit français; juridiction au siège social du fournisseur; médiation préalable si prévue.
                    11. Données personnelles (clause RGPD dans CGV)
                    • Avenant RGPD (DPA) annexé pour les traitements confiés; registre des traitements mis à disposition sur demande.
                  </>
                )}
                {modal === 'privacy' && (
                  <>
                    Politique de conformité RGPD – CyberSolium
                    **Objet**: Définir les engagements et mesures de conformité au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés pour la plateforme d’accompagnement à la conformité RGPD / NIS 2.
                    **Champ d’application** : Tous les traitements de données à caractère personnel réalisés pour le compte des clients (B2B) et dans le cadre de l’exploitation du service (SaaS).
                    1. Bases légales et finalités
                    • Exécution du contrat (fourniture du service, gestion du compte, support).
                    • Intérêt légitime (sécurisation, lutte contre la fraude, amélioration du service).
                    • Obligations légales (comptabilité, sécurité des réseaux et des systèmes).
                    • Consentement (prospection par e-mail non essentielle, cookies non nécessaires).
                    2. Catégories de données
                    • Données d’identité (nom, prénom, entreprise).
                    • Coordonnées professionnelles (e-mail, téléphone, adresse).
                    • Métadonnées d’usage (logs, journaux d’accès, préférences).
                    • Contenus saisis dans les questionnaires de diagnostic et d’audit (non obligatoirement personnels).
                    3. Durées de conservation
                    • Données de compte : durée du contrat + 3 ans.
                    • Logs de sécurité : 12 mois (sauf obligation supérieure).
                    • Facturation : 10 ans (obligation légale).
                    • Prospection : 3 ans à compter du dernier contact actif.
                    4. Mesures de sécurité
                    • Hébergement en Union européenne, cloisonnement par client, chiffrement en transit (TLS 1.2+) et au repos.
                    • Authentification forte (MFA), gestion des rôles et des droits (RBAC).
                    • Sauvegardes chiffrées, PRA/PCA, journalisation et détection d’incidents.
                    • Tests de sécurité, audits réguliers, durcissement des environnements.
                    5. Sous-traitants et transferts
                    • Contrats de sous-traitance conformes à l’art. 28 RGPD (DPA), liste tenue à jour.
                    • Pas de transferts hors UE sans garanties adéquates (clauses contractuelles types).
                    6. Droits des personnes
                    • Accès, rectification, effacement, limitation, opposition, portabilité.
                    • Point de contact : DPO (à renseigner).
                    • Droit de réclamation auprès de la CNIL.
                    7. Privacy by design / by default
                    • Minimisation des données, paramétrages par défaut protecteurs, revue des finalités.
                    • Registre des traitements, EIVP (DPIA) lorsque nécessaire.
                    8. Cookies & traceurs
                    • Bandeau et gestion des consentements pour les cookies non essentiels.
                    • Mesure d’audience configurée en mode exempté si possible (sans identifiant cross-site).
                    9. Violations de données
                    • Procédure de notification à la CNIL sous 72h et aux personnes concernées lorsque le risque est élevé.
                    • Journal d’incident et plan de remédiation.
                    10. Responsabilités
                    • Le client est responsable des contenus qu’il saisit.
                    • Le fournisseur (nous) agit en tant que sous-traitant pour les données des utilisateurs finaux et responsable de traitement pour les données de compte et de prospection.
                    Annexes :
                    • Registre des traitements (modèle).
                    • Politique de gestion des accès.
                    • Modèle d’avenant RGPD (DPA).
                    • Liste des sous-traitants.
                  </>
                )}
                {modal === 'legal' && (
                  <>
                    Mentions légales – CYBER SOLUTION
                    1. Éditeur du site
                    Nom commercial: CYBERSOLIUM
                    Raison sociale: CYBER SOLIUM
                    Forme juridique:
                    Adresse du siège: 59 Av. de Fes 34090 Montpellier
                    SIRET: [À compléter]
                    Téléphone: +335(0)708045569
                    Email de contact: contact@cybersolium.fr
                    Directeur de la publication: BRUNEAU Emmanuel
                    2. Hébergement
                    Le site est hébergé sur une infrastructure européenne souveraine conforme RGPD et NIS2.
                    Hébergeur: [à définir]
                    Adresse: [à définir]
                    Téléphone: [à définir]
                    3. Activité du site
                    Diagnostic de conformité NIS2, Audits Flash, Audit Complet, Audit multi-normes, SOC/EDR 24/7, Formations cybersécurité.
                    4. Propriété intellectuelle
                    Tout le contenu du site est la propriété exclusive de [Ta société], sauf mention contraire. Toute reproduction sans autorisation est interdite.
                    5. Données personnelles (RGPD)
                    Responsable du traitement: PENE Amar
                    DPO: amar.pene@cybersolution.fr
                    Droits RGPD: accès, rectification, effacement, opposition, limitation, portabilité.
                    6. Cookies et traceurs
                    Cookies techniques obligatoires et cookies analytiques soumis au consentement.
                    7. Sécurité & conformité NIS2
                    MFA, chiffrement TLS, journalisation, segmentation, PRA/PCA.
                    8. Responsabilité
                    Les recommandations fournies n’engagent pas la conformité finale de l’organisation cliente.
                    9. Liens hypertextes
                    Cyber Solutiòn n’est pas responsable du contenu de sites tiers.
                    10. Conditions contractuelles
                    L'utilisation du site implique l’acceptation des CGU, CGV et de la Politique RGPD.
                    11. Droit applicable – Litiges
                    Droit français. Tribunaux compétents : ceux du siège social de [Ta société].
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};