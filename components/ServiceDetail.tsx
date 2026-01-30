import React from 'react';
import { FileText, Shield, Monitor, Server, Check, ArrowRight, Activity, Zap, ListChecks, Package, CheckCircle2, GraduationCap, Scale, Stethoscope, Calculator, MousePointerClick, Smartphone, Wifi, KeyRound, Globe, Target } from 'lucide-react';
import { Page } from '../App';

interface ServiceDetailProps {
  type: Page;
  onContactClick: (msg: string) => void;
}

const SERVICE_DATA: Record<string, any> = {
  // --- SERVICES TRANSVERSES ---
  'service-compliance': {
    title: "Conformité NIS 2 & RGPD",
    subtitle: "Gouvernance & ANSSI",
    description: "La conformité n'est pas une option, c'est une survie. Nous alignons votre structure sur la directive européenne NIS 2 et les exigences de l'ANSSI pour les entités critiques.",
    icon: <FileText className="w-16 h-16 text-cyan-400" />,
    color: "cyan",
    heroImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Audit de Maturité (Gap Analysis)", desc: "Évaluation précise de l'écart entre votre situation actuelle et les 23 exigences de la directive NIS 2." },
      { title: "Rédaction PSSI", desc: "Politique de Sécurité des Systèmes d'Information formelle, validée par votre direction (Document obligatoire ANSSI)." },
      { title: "DPO & RSSI Externalisé", desc: "Mise à disposition d'un expert certifié pour piloter votre feuille de route sécurité à temps partagé." },
      { title: "Gestion de Crise", desc: "Création et test des procédures de notification CNIL/ANSSI et du plan de communication de crise." }
    ],
    process: [
      "Cartographie des actifs critiques (SI Essentiels)",
      "Analyse de risques EBIOS RM Simplifiée",
      "Définition de la feuille de route de remédiation",
      "Accompagnement mensuel à la mise en œuvre"
    ],
    deliverables: [
      "Rapport d'audit complet",
      "PSSI signée et chartes utilisateurs",
      "Registre des traitements RGPD à jour",
      "Attestation de conformité pour vos clients/assureurs"
    ],
    benefits: ["Évitez les sanctions pénales (Responsabilité Dirigeant)", "Maintenez vos contrats avec les grands comptes (OIV)", "Structurez durablement votre gouvernance"],
    cta: "Lancer mon audit de conformité"
  },
  'service-soc': {
    title: "SOC Managé & EDR",
    subtitle: "Surveillance Active 24/7",
    description: "L'Antivirus est mort. Vive l'EDR. Nous déployons une surveillance comportementale pilotée par IA et supervisée par nos analystes humains en France.",
    icon: <Shield className="w-16 h-16 text-emerald-400" />,
    color: "emerald",
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Déploiement EDR/XDR", desc: "Installation d'agents sentinelles sur tous vos postes et serveurs (Technologie certifiée Visa de Sécurité ANSSI disponible)." },
      { title: "Chasse aux Menaces (Threat Hunting)", desc: "Recherche proactive des signaux faibles d'intrusion et des mouvements latéraux dans votre réseau." },
      { title: "Isolation Automatique", desc: "Riposte immédiate : en cas d'attaque, la machine infectée est isolée du réseau en moins de 3 secondes." },
      { title: "Rapport Mensuel", desc: "Analyse détaillée des attaques bloquées, tentatives d'intrusion et score de santé de votre parc." }
    ],
    process: [
      "Déploiement des agents (sans redémarrage)",
      "Période d'apprentissage (Learning Mode - 14 jours)",
      "Passage en mode Blocage Actif",
      "Surveillance continue par notre SOC"
    ],
    deliverables: [
      "Accès au tableau de bord temps réel",
      "Rapports mensuels d'activité SOC",
      "Alertes SMS/Email critiques 24/7",
      "Assistance à la remédiation post-incident"
    ],
    benefits: ["Protection active contre les ransomwares Zero-Day", "Aucune compétence interne requise", "Coût divisé par 10 par rapport à un SOC interne"],
    cta: "Activer la surveillance SOC"
  },
  'service-pentest': {
    title: "Pentest & Audit Technique",
    subtitle: "Hacking Éthique Offensif",
    description: "La meilleure défense, c'est l'attaque contrôlée. Nos experts certifiés (OSCP, CEH) tentent de pénétrer votre système pour identifier les failles avant les criminels.",
    icon: <Target className="w-16 h-16 text-red-400" />,
    color: "red",
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Tests d'Intrusion (Black Box)", desc: "Simulation d'attaque réaliste sans aucune information préalable, comme un vrai pirate externe." },
      { title: "Audit Active Directory", desc: "Analyse approfondie de l'annuaire (AD), cible n°1 des attaquants pour élever leurs privilèges." },
      { title: "Campagne de Phishing", desc: "Test grandeur nature de la vigilance humaine avec de faux emails piégés hyper-réalistes." },
      { title: "Audit de Code & Web", desc: "Recherche de failles OWASP (Injection SQL, XSS) sur vos applications métiers et sites web." }
    ],
    process: [
      "Définition du périmètre et des règles d'engagement",
      "Phase de reconnaissance et scan de vulnérabilités",
      "Phase d'exploitation manuelle (Hacking)",
      "Rédaction du rapport et restitution"
    ],
    deliverables: [
      "Rapport Managérial (Synthèse risques business)",
      "Rapport Technique (Preuves d'exploitation)",
      "Plan de correction détaillé",
      "Certificat d'audit (après contre-audit)"
    ],
    benefits: ["Correction des failles critiques avant exploitation", "Preuve de sécurité pour vos clients", "Conformité aux exigences des cyber-assureurs"],
    cta: "Demander un devis de Pentest"
  },
  'service-infra': {
    title: "Infrastructure & Résilience",
    subtitle: "Architecture SecNumCloud",
    description: "Construire sur du sable numérique est suicidaire. Nous bâtissons des infrastructures souveraines, résilientes et certifiées pour garantir votre survie.",
    icon: <Server className="w-16 h-16 text-orange-400" />,
    color: "orange",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Sauvegardes Immuables", desc: "Technologie WORM (Write Once Read Many) : même un admin compromis ne peut pas effacer les backups. La seule parade absolue aux ransomwares." },
      { title: "PRA / PCA", desc: "Plan de Reprise d'Activité : Stratégie et moyens techniques pour redémarrer votre entreprise en moins de 4h." },
      { title: "Virtualisation Sécurisée", desc: "Segmentation réseau stricte (VLANs) pour empêcher la propagation latérale des virus entre services." },
      { title: "Cloud Souverain", desc: "Hébergement de vos données critiques en France sur des datacenters certifiés ISO 27001 et SecNumCloud." }
    ],
    process: [
      "Audit de l'architecture existante",
      "Design de la cible sécurisée (Security by Design)",
      "Migration et durcissement (Hardening)",
      "Tests de restauration (Crash Test)"
    ],
    deliverables: [
      "Schémas d'architecture réseau",
      "Documentation PRA/PCA testée",
      "Rapport de tests de restauration",
      "Contrat d'infogérance sécurisée"
    ],
    benefits: ["Garantie de continuité d'activité", "Souveraineté des données (Anti-Cloud Act)", "Réduction drastique des primes d'assurance"],
    cta: "Sécuriser mon infrastructure"
  },

  // --- NOUVEAU SERVICE FORMATION ---
  'service-training': {
    title: "Formation & sensibilisation",
    subtitle: "Le Pare-feu Humain",
    description: "90% des cyberattaques réussies commencent par une erreur humaine. La technologie ne suffit pas si vos équipes ouvrent la porte aux pirates. Nous transformons vos collaborateurs en sentinelles.",
    icon: <GraduationCap className="w-16 h-16 text-pink-400" />,
    color: "pink",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Simulations de Phishing", desc: "Envoi de faux emails piégés (Ransomware, Faux Président) pour tester la vigilance réelle de vos équipes sans risque." },
      { title: "Ateliers 'Hygiène Numérique'", desc: "Sessions pratiques : détection des arnaques, navigation sécurisée et protection des données personnelles." },
      { title: "Gestion des Mots de Passe", desc: "Fin des '123456'. Apprentissage des phrases de passe robustes et l'usage de coffres-forts (MFA, Keepass, Bitwarden)." },
      { title: "Sécurité Mobilité / Télétravail", desc: "Les bons réflexes hors du bureau : usage des VPN, dangers des Wi-Fi publics (Gares, Hôtels) et confidentialité visuelle." }
    ],
    process: [
      "Test de niveau initial (Campagne de Phishing à blanc)",
      "Analyse des profils à risque (RH, Compta, Direction)",
      "Déploiement du plan de formation personnalisé",
      "Tests récurrents pour mesurer la progression"
    ],
    deliverables: [
      "Rapport de vulnérabilité humaine",
      "Statistiques de clics par département",
      "Certificats de sensibilisation nominatifs",
      "Kit de communication interne (Affiches, Guides)"
    ],
    benefits: ["Réduction du risque de 90%", "Preuve de diligence pour les assurances (Cyber Risk)", "Culture de sécurité partagée par tous"],
    cta: "Lancer une campagne de test"
  },

  // --- VERTICALES MÉTIERS (Nouveaux) ---

  'service-avocats': {
    title: "Avocats & Cabinets",
    subtitle: "Secret & Recommandations CNB",
    description: "Le secret professionnel est absolu, mais vos emails ne le sont pas. Nous sécurisons les cabinets d'avocats selon les préconisations du CNB et de l'ANSSI.",
    icon: <Scale className="w-16 h-16 text-yellow-400" />,
    color: "yellow",
    heroImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Sécurisation RPVA", desc: "Durcissement technique des postes accédant au Réseau Privé Virtuel des Avocats et gestion stricte des Clés Avocat." },
      { title: "Chiffrement des Dossiers", desc: "Chiffrement de disque (BitLocker/FileVault) et conteneurs chiffrés pour les dossiers sensibles (Fusions/Acquisitions, Pénal)." },
      { title: "Messagerie Sécurisée", desc: "Solutions de mails chiffrés de bout en bout pour échanger avec vos clients VIP sans interception possible." },
      { title: "Mobilité Sécurisée", desc: "VPN chiffrés et MDM (Mobile Device Management) pour consulter vos dossiers au tribunal ou en déplacement en sécurité." }
    ],
    process: [
      "Audit flash de la sécurité du cabinet",
      "Sécurisation des postes et mobiles",
      "Formation au secret numérique",
      "Mise en place des outils de chiffrement"
    ],
    deliverables: [
      "Postes de travail durcis",
      "Solution de partage de fichiers sécurisée",
      "Charte informatique du cabinet",
      "Assistance VIP"
    ],
    benefits: ["Respect absolu du Secret Professionnel", "Protection contre l'espionnage industriel", "Conformité aux recommandations du CNB"],
    cta: "Auditer la sécurité de mon Cabinet"
  },

  'service-sante': {
    title: "Santé & Hôpitaux",
    subtitle: "HDS & Ségur Numérique",
    description: "La santé est un OSE (Opérateur de Services Essentiels) de fait. Nous appliquons les directives HDS et Ségur pour protéger les vies et les données.",
    icon: <Stethoscope className="w-16 h-16 text-teal-400" />,
    color: "teal",
    heroImage: "https://images.unsplash.com/photo-1516549655169-df83a063b36c?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Hébergement HDS", desc: "Migration et sécurisation des données patients vers des clouds obligatoirement certifiés Hébergeur de Données de Santé." },
      { title: "Protection IoT Médical", desc: "Segmentation réseau pour isoler les scanners, IRM et automates d'analyse (souvent vulnérables) du réseau bureautique." },
      { title: "Messagerie Santé (MSS)", desc: "Intégration et sécurisation des flux MSSanté pour les échanges entre professionnels." },
      { title: "Gestion des Identités (IAM)", desc: "Gestion stricte des cartes CPS et authentification forte pour l'accès aux DPI (Dossier Patient Informatisé)." }
    ],
    process: [
      "Cartographie des flux de données de santé",
      "Audit de conformité HDS",
      "Sécurisation des accès biomédicaux",
      "Sensibilisation du personnel soignant"
    ],
    deliverables: [
      "Contrat d'hébergement HDS",
      "Rapport d'audit Ségur",
      "Plan de continuité des soins (Mode dégradé)",
      "Architecture réseau segmentée"
    ],
    benefits: ["Conformité Ségur du Numérique", "Zéro interruption de soins", "Protection contre le vol de données médicales"],
    cta: "Diagnostic Cyber Santé"
  },

  'service-comptables': {
    title: "Experts-Comptables",
    subtitle: "Rigueur CSOEC & ANSSI",
    description: "Vous détenez les données financières et sociales de toute l'économie. Nous sécurisons votre cabinet pour garantir la confidentialité et la disponibilité en période fiscale.",
    icon: <Calculator className="w-16 h-16 text-blue-400" />,
    color: "blue",
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000",
    features: [
      { title: "Sanctuarisation Période Fiscale", desc: "Mesures de sécurité renforcées (Gèle des mises à jour, surveillance accrue) et astreinte technique de janvier à mai." },
      { title: "Accès JecDeclara / Impots", desc: "Sécurisation des tunnels de connexion et des certificats électroniques vers les services de l'État." },
      { title: "Protection Paie & Social", desc: "Chiffrement des bases de données RH et Paie (Données critiques au sens du RGPD)." },
      { title: "Sauvegarde Anti-Ransomware", desc: "Backup immuable externe pour restaurer les dossiers clients instantanément en cas de chantage." }
    ],
    process: [
      "Audit des flux de production comptable",
      "Mise en place du plan de continuité",
      "Sécurisation des accès distants (Télétravail)",
      "Tests de restauration avant période fiscale"
    ],
    deliverables: [
      "Plan de Reprise d'Activité validé",
      "Rapport de conformité RGPD (pour vos clients)",
      "Postes collaborateurs sécurisés",
      "Formation sécurité pour les collaborateurs"
    ],
    benefits: ["Continuité de service garantie", "Confiance de vos clients", "Conformité aux normes du CSOEC"],
    cta: "Sécuriser mon Cabinet Comptable"
  }
};

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ type, onContactClick }) => {
  const content = SERVICE_DATA[type];

  if (!content) return <div>Service non trouvé</div>;

  const colorClasses: Record<string, string> = {
    cyan: "from-cyan-500 to-blue-600 text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    emerald: "from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    red: "from-red-500 to-orange-600 text-red-400 border-red-500/30 bg-red-500/10",
    orange: "from-orange-500 to-yellow-600 text-orange-400 border-orange-500/30 bg-orange-500/10",
    yellow: "from-yellow-500 to-amber-600 text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    teal: "from-teal-500 to-cyan-600 text-teal-400 border-teal-500/30 bg-teal-500/10",
    blue: "from-blue-500 to-indigo-600 text-blue-400 border-blue-500/30 bg-blue-500/10",
    pink: "from-pink-500 to-fuchsia-600 text-pink-400 border-pink-500/30 bg-pink-500/10",
  };

  const gradient = colorClasses[content.color].split(' ')[0] + ' ' + colorClasses[content.color].split(' ')[1];
  const textColor = colorClasses[content.color].split(' ')[2];
  const borderColor = colorClasses[content.color].split(' ')[3];
  const bgColor = colorClasses[content.color].split(' ')[4];

  return (
    <section className="min-h-screen py-16 relative">
      {/* Background Image with Overlay */}
      <div className="absolute top-0 left-0 w-full h-[70vh] z-0">
        <img src={content.heroImage} alt="Service Hero" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-1.5 mb-6 border ${borderColor} ${bgColor}`}>
            <Activity className={`w-4 h-4 ${textColor}`} />
            <span className={`text-xs font-bold uppercase tracking-wide ${textColor}`}>{content.subtitle}</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
            {content.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed border-l-4 border-slate-700 pl-6">
            {content.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">

          {/* Left Column : Features, Process, Deliverables */}
          <div className="lg:col-span-2 space-y-16">

            {/* 1. Nos Interventions (Features) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Zap className={`w-8 h-8 mr-3 ${textColor}`} />
                Détails de l'Offre
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {content.features.map((feature: any, idx: number) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-colors group">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Méthodologie (Process) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <ListChecks className={`w-8 h-8 mr-3 ${textColor}`} />
                Notre Méthodologie
              </h2>
              <div className="relative">
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b ${gradient} opacity-30`}></div>
                <div className="space-y-8">
                  {content.process?.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start relative">
                      <div className={`w-8 h-8 rounded-full ${bgColor} border ${borderColor} flex items-center justify-center shrink-0 z-10 text-xs font-bold ${textColor}`}>
                        {idx + 1}
                      </div>
                      <div className="ml-6 bg-slate-900 border border-slate-800 p-4 rounded-xl w-full">
                        <span className="text-slate-200 font-medium">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Livrables (Deliverables) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Package className={`w-8 h-8 mr-3 ${textColor}`} />
                Livrables Concrets
              </h2>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.deliverables?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle2 className={`w-5 h-5 mr-3 ${textColor}`} />
                      <span className="text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Benefits) */}
          <div className="lg:col-span-1">
            <div className={`sticky top-32 p-8 rounded-3xl bg-gradient-to-br ${gradient} bg-opacity-5 border ${borderColor} backdrop-blur-sm`}>
              <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-lg border border-white/5">
                {content.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Pourquoi nous ?</h3>
              <ul className="space-y-4 mb-8">
                {content.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-white mr-3 shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm font-medium leading-tight">{benefit}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onContactClick(`Renseignement: ${content.title}`)}
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center group"
              >
                {content.cta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 opacity-70">
                Réponse garantie sous 2h ouvrées
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};