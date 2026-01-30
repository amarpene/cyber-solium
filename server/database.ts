import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'cyber-solution.db'));

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    company_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sector TEXT,
    size TEXT,
    nis2_status TEXT,
    compliance_score INTEGER DEFAULT 0,
    admin_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS training_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    duration INTEGER,
    level TEXT,
    price REAL NOT NULL DEFAULT 0,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_training_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    training_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT 0,
    payment_status TEXT DEFAULT 'pending',
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (training_id) REFERENCES training_modules(id)
  );

  CREATE TABLE IF NOT EXISTS audit_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_id INTEGER,
    sector_name TEXT,
    sector_type TEXT,
    company_size TEXT,
    readiness_score INTEGER,
    missing_items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );

  CREATE TABLE IF NOT EXISTS chat_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_id INTEGER,
    messages TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

    CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        cover_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        frequency TEXT NOT NULL DEFAULT 'monthly',
        consent BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Insertion de modules de formation par défaut
const insertTraining = db.prepare(`
  INSERT OR IGNORE INTO training_modules (id, title, description, category, duration, level, price, content)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const trainings = [
    {
        id: 1,
        title: "Introduction à NIS2",
        description: "Comprendre les fondamentaux de la directive NIS2 et son impact sur votre entreprise. Formation essentielle pour les DSI et RSSI.",
        category: "NIS2",
        duration: 45,
        level: "Débutant",
        price: 299,
        content: JSON.stringify({
            modules: [
                {
                    title: "Module 1 : Contexte et Enjeux",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "1.1 Historique de la directive NIS",
                            content: "La directive NIS (Network and Information Security) a été adoptée en 2016 pour renforcer la cybersécurité au niveau européen. NIS2, adoptée en 2022 et applicable depuis octobre 2024, élargit considérablement son champ d'application.\n\n**Points clés :**\n- NIS1 (2016) : 7 secteurs critiques\n- NIS2 (2024) : 18 secteurs + critères de taille\n- Objectif : résilience face aux cyberattaques\n- Sanctions renforcées jusqu'à 10M€"
                        },
                        {
                            title: "1.2 Périmètre d'application",
                            content: "**Qui est concerné ?**\n\n**Entités Essentielles (EE) :**\n- Énergie, Transport, Santé, Banque\n- Eau, Numérique, Administration\n- Espace\n\n**Entités Importantes (EI) :**\n- Services postaux, Déchets, Chimie\n- Agroalimentaire, Industrie\n- Fournisseurs numériques\n\n**Critères de taille :**\n- ≥ 50 employés OU\n- ≥ 10M€ de chiffre d'affaires\n\nCertaines activités critiques sont concernées quelle que soit la taille."
                        }
                    ]
                },
                {
                    title: "Module 2 : Obligations Réglementaires",
                    duration: "15 min",
                    lessons: [
                        {
                            title: "2.1 Gouvernance de la sécurité",
                            content: "**Obligations de gouvernance NIS2 :**\n\n1. **Responsabilité de la direction**\n   - Le conseil d'administration est responsable\n   - Formation obligatoire des dirigeants\n   - Responsabilité pénale personnelle\n\n2. **Politique de sécurité (PSSI)**\n   - Document écrit et approuvé\n   - Analyse de risques documentée\n   - Revue annuelle obligatoire\n\n3. **Désignation d'un RSSI**\n   - Responsable Sécurité SI identifié\n   - Rattachement direct à la direction\n   - Ressources allouées"
                        },
                        {
                            title: "2.2 Mesures techniques obligatoires",
                            content: "**10 mesures de cybersécurité imposées :**\n\n1. Analyse des risques cyber\n2. Gestion des incidents de sécurité\n3. Continuité des activités (PCA/PRA)\n4. Sécurité de la chaîne d'approvisionnement\n5. Sécurité de l'acquisition, du développement\n6. Évaluation de l'efficacité des mesures\n7. Pratiques d'hygiène informatique\n8. Formation en cybersécurité\n9. Cryptographie et chiffrement\n10. Sécurité des ressources humaines"
                        }
                    ]
                },
                {
                    title: "Module 3 : Sanctions et Contrôles",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "3.1 Sanctions administratives",
                            content: "**Amendes maximales :**\n\n**Entités Essentielles :**\n- Jusqu'à 10 000 000 € OU\n- 2% du chiffre d'affaires annuel mondial\n(Le montant le plus élevé)\n\n**Entités Importantes :**\n- Jusqu'à 7 000 000 € OU\n- 1,4% du CA annuel mondial\n\n**Sanctions complémentaires :**\n- Publication des sanctions\n- Suspension temporaire d'activité\n- Retrait d'autorisation\n- Responsabilité pénale des dirigeants"
                        },
                        {
                            title: "3.2 Signalement des incidents",
                            content: "**Obligations de notification :**\n\n**Délai 24h :** Alerte précoce à l'ANSSI\n- Incident en cours\n- Impact potentiel significatif\n\n**Délai 72h :** Notification détaillée\n- Nature de l'incident\n- Mesures prises\n- Impact réel\n\n**Rapport final :** Sous 1 mois\n- Analyse complète\n- Causes profondes\n- Mesures correctives\n\n⚠️ Non-respect = sanctions lourdes"
                        }
                    ]
                },
                {
                    title: "Module 4 : Plan d'Action",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "4.1 Démarche de mise en conformité",
                            content: "**Étapes clés :**\n\n**Phase 1 : Diagnostic (1 mois)**\n- Audit de conformité\n- Identification des écarts\n- Priorisation des actions\n\n**Phase 2 : Planification (2 semaines)**\n- Plan d'action détaillé\n- Budget et ressources\n- Planning de déploiement\n\n**Phase 3 : Mise en œuvre (3-6 mois)**\n- Déploiement des mesures techniques\n- Rédaction de la documentation\n- Formation des équipes\n\n**Phase 4 : Maintien (continu)**\n- Audits réguliers\n- Mise à jour des procédures\n- Veille réglementaire"
                        }
                    ]
                }
            ],
            quiz: [
                {
                    question: "Quelle est la sanction maximale pour une Entité Essentielle ?",
                    options: ["1M€", "5M€", "10M€ ou 2% CA", "20M€"],
                    correct: 2
                },
                {
                    question: "Dans quel délai faut-il notifier un incident majeur ?",
                    options: ["6h", "24h", "72h", "7 jours"],
                    correct: 1
                }
            ]
        })
    },
    {
        id: 2,
        title: "RGPD : Les Essentiels",
        description: "Les bases du Règlement Général sur la Protection des Données. Obligatoire pour toute entreprise manipulant des données personnelles.",
        category: "RGPD",
        duration: 60,
        level: "Débutant",
        price: 349,
        content: JSON.stringify({
            modules: [
                {
                    title: "Module 1 : Principes du RGPD",
                    duration: "15 min",
                    lessons: [
                        {
                            title: "1.1 Qu'est-ce qu'une donnée personnelle ?",
                            content: "**Définition :**\nToute information se rapportant à une personne physique identifiée ou identifiable.\n\n**Exemples :**\n- Identité : nom, prénom, date de naissance\n- Contact : email, téléphone, adresse\n- Identification : numéro client, plaque d'immatriculation\n- Localisation : adresse IP, données GPS\n- Données sensibles : santé, origine, religion\n\n**Données sensibles (interdites sauf exception) :**\n- Origine raciale ou ethnique\n- Opinions politiques\n- Convictions religieuses\n- Santé\n- Vie sexuelle\n- Données biométriques"
                        },
                        {
                            title: "1.2 Les 6 principes fondamentaux",
                            content: "**1. Licéité, loyauté, transparence**\nTraitement légal, honnête et transparent\n\n**2. Limitation des finalités**\nObjectifs déterminés, explicites et légitimes\n\n**3. Minimisation des données**\nSeules les données nécessaires\n\n**4. Exactitude**\nDonnées à jour et correction possible\n\n**5. Limitation de la conservation**\nDurée définie et justifiée\n\n**6. Intégrité et confidentialité**\nSécurité appropriée des données"
                        }
                    ]
                },
                {
                    title: "Module 2 : Droits des Personnes",
                    duration: "15 min",
                    lessons: [
                        {
                            title: "2.1 Les 8 droits fondamentaux",
                            content: "**Droits des personnes concernées :**\n\n1. **Droit à l'information**\n   Être informé de l'utilisation des données\n\n2. **Droit d'accès**\n   Obtenir copie de ses données\n\n3. **Droit de rectification**\n   Corriger des données inexactes\n\n4. **Droit à l'effacement**\n   Demander la suppression (\"droit à l'oubli\")\n\n5. **Droit à la limitation**\n   Limiter le traitement\n\n6. **Droit à la portabilité**\n   Récupérer ses données dans un format structuré\n\n7. **Droit d'opposition**\n   S'opposer au traitement\n\n8. **Droits liés aux décisions automatisées**\n   Ne pas faire l'objet d'une décision 100% automatique"
                        },
                        {
                            title: "2.2 Répondre aux demandes",
                            content: "**Délais de réponse :**\n- **1 mois** pour répondre (délai normal)\n- **+2 mois** si demande complexe (justification requise)\n\n**Procédure :**\n1. Vérifier l'identité du demandeur\n2. Identifier toutes les données concernées\n3. Préparer la réponse (format lisible)\n4. Répondre dans les délais\n5. Documenter la demande\n\n**Gratuité :**\nLes demandes sont gratuites (sauf abus manifeste)\n\n⚠️ Non-réponse = plainte CNIL possible"
                        }
                    ]
                },
                {
                    title: "Module 3 : Obligations de l'Entreprise",
                    duration: "20 min",
                    lessons: [
                        {
                            title: "3.1 Le registre des traitements",
                            content: "**Document OBLIGATOIRE**\n\nPour chaque traitement, documenter :\n\n1. **Finalité du traitement**\n   Objectif précis et légitime\n\n2. **Catégories de données**\n   Types de données collectées\n\n3. **Catégories de personnes**\n   Clients, salariés, prospects...\n\n4. **Destinataires**\n   Qui accède aux données\n\n5. **Durée de conservation**\n   Combien de temps\n\n6. **Mesures de sécurité**\n   Techniques et organisationnelles\n\n7. **Transferts hors UE**\n   Si applicable, avec garanties"
                        },
                        {
                            title: "3.2 La sécurité des données",
                            content: "**Mesures techniques obligatoires :**\n\n**Sécurité physique :**\n- Contrôle d'accès aux locaux\n- Protection des serveurs\n- Destruction sécurisée des supports\n\n**Sécurité logique :**\n- Authentification forte\n- Chiffrement des données sensibles\n- Pseudonymisation quand possible\n- Sauvegardes régulières\n- Antivirus et pare-feu\n\n**Sécurité organisationnelle :**\n- Politique de mots de passe\n- Habilitations et profils\n- Clauses de confidentialité\n- Sensibilisation du personnel\n\n**En cas de violation :**\nNotification CNIL sous 72h si risque"
                        },
                        {
                            title: "3.3 Le DPO (Délégué à la Protection des Données)",
                            content: "**Nomination OBLIGATOIRE pour :**\n- Organismes publics\n- Traitement à grande échelle\n- Données sensibles à grande échelle\n- Surveillance régulière et systématique\n\n**Missions du DPO :**\n1. Informer et conseiller\n2. Contrôler la conformité\n3. Point de contact CNIL\n4. Coopérer avec l'autorité\n5. Tenir le registre\n\n**Statut :**\n- Interne ou externe\n- Expertise en protection des données\n- Indépendance et moyens\n- Pas de conflit d'intérêts"
                        }
                    ]
                },
                {
                    title: "Module 4 : Sanctions et Conformité",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "4.1 Sanctions de la CNIL",
                            content: "**Sanctions administratives :**\n\n**Niveau 1 (violations mineures) :**\nJusqu'à 10M€ ou 2% CA annuel mondial\n\n**Niveau 2 (violations graves) :**\nJusqu'à 20M€ ou 4% CA annuel mondial\n\n**Records en France :**\n- Google : 90M€ (2020)\n- Amazon : 746M€ (2021)\n- Microsoft : 60M€ (2022)\n\n**Sanctions complémentaires :**\n- Avertissement public\n- Limitation temporaire du traitement\n- Suspension des flux de données\n- Publication de la sanction\n\n⚠️ Impact réputationnel majeur"
                        }
                    ]
                }
            ],
            quiz: [
                {
                    question: "Quelle est la sanction maximale du RGPD ?",
                    options: ["10M€", "20M€ ou 4% CA", "50M€", "100M€"],
                    correct: 1
                },
                {
                    question: "Délai pour répondre à une demande d'accès ?",
                    options: ["7 jours", "15 jours", "1 mois", "3 mois"],
                    correct: 2
                }
            ]
        })
    },
    {
        id: 3,
        title: "Cybersécurité : Bonnes Pratiques",
        description: "Hygiène informatique et protection contre les cybermenaces. Formation pratique pour responsables IT.",
        category: "Cybersécurité",
        duration: 30,
        level: "Débutant",
        price: 199,
        content: JSON.stringify({
            modules: [
                {
                    title: "Module 1 : Menaces Cyber",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "1.1 Panorama des cyberattaques 2026",
                            content: "**Principales menaces :**\n\n**1. Ransomware (+47% en 2025)**\n- Chiffrement des données\n- Demande de rançon\n- Double extorsion (vol + chiffrement)\n- Impact moyen : 2-10M€\n\n**2. Phishing (85% des incidents)**\n- Email frauduleux\n- Vol de credentials\n- Installation de malware\n- Spear phishing ciblé\n\n**3. Attaques sur la supply chain**\n- Compromission des fournisseurs\n- Backdoors dans les logiciels\n- Exemple : SolarWinds, Kaseya\n\n**4. Attaques DDoS**\n- Saturation des serveurs\n- Interruption de service\n- Demande de rançon\n\n**Coût moyen d'une attaque : 4,45M$** (IBM 2025)"
                        },
                        {
                            title: "1.2 Ingénierie sociale",
                            content: "**Techniques de manipulation :**\n\n**1. Prétexte (Pretexting)**\nSe faire passer pour quelqu'un d'autre\n\n**2. Appât (Baiting)**\nClé USB piégée laissée en évidence\n\n**3. Échange de service (Quid pro quo)**\nOffrir de l'aide contre des infos\n\n**4. Urgence**\nCréer la pression pour court-circuiter la réflexion\n\n**Signes d'alerte :**\n- Demande inhabituelle\n- Urgence injustifiée\n- Fautes d'orthographe\n- Expéditeur suspect\n- Pièce jointe inattendue\n- Lien raccourci\n\n**Réflexe : VÉRIFIER avant de cliquer**"
                        }
                    ]
                },
                {
                    title: "Module 2 : Hygiène Informatique",
                    duration: "15 min",
                    lessons: [
                        {
                            title: "2.1 Gestion des mots de passe",
                            content: "**Règles d'or :**\n\n1. **Complexité minimale**\n   - 12 caractères minimum\n   - Majuscules + minuscules + chiffres + symboles\n   - Pas de mots du dictionnaire\n\n2. **Unicité**\n   Un mot de passe différent par service\n   Jamais de réutilisation\n\n3. **Gestionnaire de mots de passe**\n   - Keepass, Bitwarden, 1Password\n   - Stockage chiffré\n   - Génération automatique\n\n4. **Authentification multi-facteurs (MFA)**\n   - Obligatoire pour les comptes sensibles\n   - Application d'authentification (pas SMS)\n   - Clés de sécurité physiques (FIDO2)\n\n5. **Renouvellement**\n   - En cas de fuite de données\n   - Tous les 6-12 mois pour comptes critiques"
                        },
                        {
                            title: "2.2 Mises à jour et patchs",
                            content: "**Pourquoi c'est CRITIQUE :**\n\n80% des cyberattaques exploitent des vulnérabilités connues et patchées.\n\n**Bonnes pratiques :**\n\n1. **Automatisation**\n   - Windows Update automatique\n   - Mises à jour auto des applications\n   - Patch management centralisé (WSUS)\n\n2. **Priorisation**\n   - Patchs de sécurité critiques : sous 72h\n   - Patchs importants : sous 1 semaine\n   - Tests en environnement de préproduction\n\n3. **Inventaire**\n   - Liste de tous les logiciels\n   - Détection des versions obsolètes\n   - Outils : GLPI, OCS Inventory\n\n4. **Fin de vie (EOL)**\n   - Windows 7, 8 : fin de support\n   - Migrer impérativement\n   - Pas de patch = faille permanente"
                        },
                        {
                            title: "2.3 Sauvegardes (règle 3-2-1)",
                            content: "**Stratégie de sauvegarde :**\n\n**Règle 3-2-1 :**\n- **3** copies de vos données\n- Sur **2** supports différents\n- **1** copie hors site (cloud ou externe)\n\n**Fréquence :**\n- Données critiques : quotidien\n- Données importantes : hebdomadaire\n- Archives : mensuel\n\n**Tests de restauration :**\n- Test trimestriel OBLIGATOIRE\n- Chronométrer le temps de restauration\n- Documenter la procédure\n\n**Protection contre les ransomwares :**\n- Sauvegardes IMMUABLES (WORM)\n- Offline ou air-gapped\n- Versionning (historique 30 jours)\n- Chiffrement des sauvegardes\n\n**Solutions :**\nVeeam, Acronis, Commvault, Azure Backup"
                        }
                    ]
                },
                {
                    title: "Module 3 : Protections Techniques",
                    duration: "5 min",
                    lessons: [
                        {
                            title: "3.1 EDR/XDR - Antivirus nouvelle génération",
                            content: "**Différence Antivirus vs EDR :**\n\n**Antivirus traditionnel :**\n- Signatures de virus\n- Réactif\n- Détection à 60-70%\n\n**EDR (Endpoint Detection & Response) :**\n- Analyse comportementale\n- Intelligence artificielle\n- Détection à 95%+\n- Réponse automatique\n- Investigation forensique\n\n**XDR (Extended Detection & Response) :**\n- EDR + réseau + cloud + email\n- Corrélation des événements\n- Vue globale\n\n**Solutions recommandées :**\n- CrowdStrike Falcon\n- Microsoft Defender for Endpoint\n- SentinelOne\n- Trend Micro Vision One\n\n💰 **Coût :** 5-15€/poste/mois"
                        }
                    ]
                }
            ],
            quiz: [
                {
                    question: "Quelle est la règle de sauvegarde recommandée ?",
                    options: ["1-1-1", "2-1-1", "3-2-1", "5-3-2"],
                    correct: 2
                }
            ]
        })
    },
    {
        id: 4,
        title: "NIS2 Avancé : Mise en Conformité",
        description: "Stratégies et outils pour une conformité NIS2 complète. Formation expert pour DSI/RSSI en charge de la conformité.",
        category: "NIS2",
        duration: 90,
        level: "Avancé",
        price: 599,
        content: JSON.stringify({
            modules: [
                {
                    title: "Module 1 : PSSI - Politique de Sécurité",
                    duration: "25 min",
                    lessons: [
                        {
                            title: "1.1 Structure d'une PSSI conforme",
                            content: "**Contenu OBLIGATOIRE d'une PSSI NIS2 :**\n\n**1. Périmètre et objectifs**\n- Actifs critiques identifiés\n- Niveau de sécurité cible\n- Engagement de la direction\n\n**2. Organisation de la sécurité**\n- Rôles et responsabilités\n- RSSI désigné\n- Comité de sécurité\n\n**3. Gestion des risques**\n- Méthodologie (EBIOS RM, ISO 27005)\n- Cartographie des risques\n- Plan de traitement des risques\n\n**4. Règles de sécurité**\n- Contrôle d'accès\n- Gestion des identités\n- Classification des données\n- Sécurité physique\n- Sécurité réseau\n\n**5. Gestion des incidents**\n- Procédures de détection\n- Escalade\n- Notification ANSSI\n\n**6. Continuité d'activité**\n- PCA/PRA\n- Tests réguliers"
                        },
                        {
                            title: "1.2 Analyse de risques EBIOS Risk Manager",
                            content: "**Méthodologie EBIOS RM (ANSSI) :**\n\n**Atelier 1 : Cadrage**\n- Missions essentielles\n- Biens supports\n- Événements redoutés\n- Valeurs métier\n\n**Atelier 2 : Sources de risque**\n- Identification des attaquants\n- Objectifs visés\n- Modes opératoires\n\n**Atelier 3 : Scénarios stratégiques**\n- Chemins d'attaque\n- Vraisemblance\n- Gravité\n\n**Atelier 4 : Scénarios opérationnels**\n- Scénarios techniques détaillés\n- Vraisemblance x Gravité = Risque\n\n**Atelier 5 : Plan de traitement**\n- Réduire\n- Éviter\n- Transférer (assurance)\n- Accepter\n\n📄 Livrable : Rapport d'analyse de risques"
                        }
                    ]
                },
                {
                    title: "Module 2 : Gestion des Incidents",
                    duration: "20 min",
                    lessons: [
                        {
                            title: "2.1 SOC et détection 24/7",
                            content: "**SOC (Security Operations Center) :**\n\n**Rôle du SOC :**\n1. Surveillance continue (24/7/365)\n2. Détection des anomalies\n3. Qualification des alertes\n4. Réponse aux incidents (niveau 1)\n5. Escalade si nécessaire\n\n**Outils du SOC :**\n- **SIEM** (Security Information and Event Management)\n  - Splunk, QRadar, Sentinel\n  - Corrélation des logs\n  - Alertes automatiques\n\n- **EDR/XDR**\n  - Protection des endpoints\n  - Télémétrie enrichie\n\n- **Threat Intelligence**\n  - Indicateurs de compromission (IoC)\n  - Flux de menaces\n\n**Options :**\n- SOC interne (coût : 500K€+/an)\n- SOC externalisé (MSSP) : 2-10K€/mois\n- SOC hybride"
                        },
                        {
                            title: "2.2 Plan de réponse aux incidents",
                            content: "**Phases de gestion d'incident :**\n\n**1. Préparation**\n- Équipe CSIRT constituée\n- Procédures documentées\n- Outils prêts (forensique)\n\n**2. Détection et analyse**\n- Identifier l'incident\n- Qualifier la gravité\n- Collecter les preuves\n\n**3. Confinement**\n- Isolation des systèmes compromis\n- Blocage de la menace\n- Préservation des preuves\n\n**4. Éradication**\n- Suppression du malware\n- Fermeture des backdoors\n- Changement des credentials\n\n**5. Récupération**\n- Restauration des systèmes\n- Tests de bon fonctionnement\n- Surveillance renforcée\n\n**6. Leçons apprises**\n- Débriefing\n- Amélioration continue\n- Mise à jour des procédures\n\n**Délais NIS2 :**\n- Alerte précoce : 24h\n- Notification : 72h\n- Rapport final : 1 mois"
                        }
                    ]
                },
                {
                    title: "Module 3 : Continuité d'Activité",
                    duration: "25 min",
                    lessons: [
                        {
                            title: "3.1 PCA - Plan de Continuité d'Activité",
                            content: "**Objectifs du PCA :**\nMaintenir les activités essentielles en cas de sinistre majeur.\n\n**Étapes de construction :**\n\n**1. Bilan d'Impact sur l'Activité (BIA)**\n- Identifier processus critiques\n- RTO (Recovery Time Objective) : temps max d'interruption\n- RPO (Recovery Point Objective) : perte de données max\n\n**2. Stratégies de continuité**\n- Site de secours (hot, warm, cold)\n- Travail dégradé (mode papier)\n- Externalisation temporaire\n\n**3. Procédures de basculement**\n- Activation du PCA\n- Rôles et responsabilités\n- Checklist étape par étape\n\n**4. Plan de communication**\n- Communication interne\n- Communication clients\n- Communication presse/régulateurs\n\n**5. Tests réguliers**\n- Test annuel OBLIGATOIRE\n- Exercice de crise\n- Mise à jour post-test"
                        },
                        {
                            title: "3.2 PRA - Plan de Reprise d'Activité",
                            content: "**PRA SI (Système d'Information) :**\n\n**Architectures de haute disponibilité :**\n\n**1. Réplication synchrone**\n- Copie en temps réel\n- RPO = 0\n- RTO < 1h\n- Coût élevé\n\n**2. Réplication asynchrone**\n- Copie différée (quelques minutes)\n- RPO = 5-15 min\n- RTO = 1-4h\n- Coût moyen\n\n**3. Sauvegarde + restauration**\n- RPO = 24h\n- RTO = 4-24h\n- Coût faible\n\n**Solutions cloud :**\n- Azure Site Recovery\n- AWS Disaster Recovery\n- Zerto, Veeam\n\n**Tests de PRA :**\n- Test technique (restauration)\n- Test fonctionnel (utilisateurs)\n- Test complet (bascule réelle)\n\n📊 Objectif NIS2 : RTO < 24h pour activités critiques"
                        }
                    ]
                },
                {
                    title: "Module 4 : Sécurité de la Chaîne d'Approvisionnement",
                    duration: "20 min",
                    lessons: [
                        {
                            title: "4.1 Gestion des risques fournisseurs",
                            content: "**Obligation NIS2 :**\nMaîtriser les risques liés aux prestataires IT.\n\n**Processus de qualification :**\n\n**1. Évaluation initiale**\n- Questionnaire de sécurité\n- Certifications (ISO 27001, SOC 2)\n- Audit si criticité élevée\n\n**2. Clauses contractuelles**\n- Niveau de service (SLA)\n- Obligations de sécurité\n- Droit d'audit\n- Notification des incidents\n- Responsabilités en cas de faille\n\n**3. Surveillance continue**\n- Revue annuelle\n- Suivi des incidents\n- Évaluation de performance\n\n**4. Gestion de fin de relation**\n- Restitution/destruction des données\n- Transfert de connaissance\n- Révocation des accès\n\n**Fournisseurs critiques à auditer :**\n- Hébergeurs (cloud, datacenter)\n- Infogérance (MSP)\n- Développeurs d'applications\n- Mainteneurs SI"
                        }
                    ]
                }
            ],
            quiz: [
                {
                    question: "Quelle méthodologie d'analyse de risques recommande l'ANSSI ?",
                    options: ["MEHARI", "EBIOS RM", "OCTAVE", "FAIR"],
                    correct: 1
                },
                {
                    question: "Délai de notification d'incident majeur à l'ANSSI ?",
                    options: ["12h", "24h", "72h", "7 jours"],
                    correct: 1
                }
            ]
        })
    },
    {
        id: 5,
        title: "Gestion des Incidents de Sécurité",
        description: "Procédures de détection, réponse et récupération. Formation critique pour la gestion de crise cyber.",
        category: "Cybersécurité",
        duration: 75,
        level: "Intermédiaire",
        price: 449,
        content: JSON.stringify({
            modules: [
                {
                    title: "Module 1 : Détection des Incidents",
                    duration: "20 min",
                    lessons: [
                        {
                            title: "1.1 Indicateurs de compromission",
                            content: "**Signes d'une cyberattaque :**\n\n**Indicateurs techniques :**\n- Connexions inhabituelles (horaires, géo)\n- Processus suspects (noms aléatoires)\n- Consommation CPU/réseau anormale\n- Création de comptes non autorisés\n- Modifications de fichiers système\n- Communications vers des IP suspectes\n\n**Indicateurs métier :**\n- Lenteurs inexpliquées\n- Fichiers inaccessibles\n- Comportement anormal des applications\n- Plaintes utilisateurs\n\n**Sources de détection :**\n1. SIEM (corrélation logs)\n2. EDR (comportement endpoints)\n3. IDS/IPS (trafic réseau)\n4. Threat Intelligence\n5. Alertes utilisateurs\n\n**Faux positifs :**\n- Triage nécessaire (90% de faux positifs)\n- Tuning des règles\n- Machine Learning pour améliorer"
                        },
                        {
                            title: "1.2 Outils de détection (SIEM)",
                            content: "**SIEM (Security Information and Event Management) :**\n\n**Fonctions principales :**\n1. **Collecte des logs**\n   - Serveurs, firewall, AD, applications\n   - Agents ou syslog\n   - Rétention 6-12 mois (NIS2)\n\n2. **Normalisation**\n   - Format unifié\n   - Enrichissement (géolocalisation, IoC)\n\n3. **Corrélation**\n   - Règles de détection\n   - Use cases (ex: brute force)\n   - Séquences d'événements\n\n4. **Alertes**\n   - Notification temps réel\n   - Priorisation (criticité)\n   - Workflow d'investigation\n\n**Solutions du marché :**\n- **Splunk** : leader, puissant, cher\n- **Microsoft Sentinel** : cloud natif\n- **IBM QRadar** : complet\n- **Elastic SIEM** : open source\n- **Wazuh** : gratuit\n\n💰 Coût : 50-500€/Go de logs/mois"
                        }
                    ]
                },
                {
                    title: "Module 2 : Gestion de Crise Cyber",
                    duration: "25 min",
                    lessons: [
                        {
                            title: "2.1 Cellule de crise",
                            content: "**Composition de la cellule de crise :**\n\n**Rôles OBLIGATOIRES :**\n\n1. **Directeur de crise**\n   - DG ou DSI\n   - Décisions stratégiques\n   - Point de contact direction\n\n2. **Responsable Technique (RSSI)**\n   - Coordination équipe IT\n   - Analyse technique\n   - Plan de remédiation\n\n3. **Responsable Communication**\n   - Communication interne\n   - Communication externe/presse\n   - Relations régulateurs\n\n4. **Juriste**\n   - Obligations légales\n   - Notifications (CNIL, ANSSI)\n   - Responsabilités\n\n5. **RH** (si données personnelles)\n   - Information du personnel\n   - Gestion du stress\n\n6. **Expert forensique** (externe si besoin)\n   - Investigation\n   - Collecte de preuves\n   - Rapport d'incident\n\n**Salle de crise :**\n- Lieu physique dédié\n- Moyens de communication sécurisés\n- Documentation accessible"
                        },
                        {
                            title: "2.2 Procédure d'escalade",
                            content: "**Niveaux de gravité des incidents :**\n\n**Niveau 1 - Mineur**\n- Impact limité\n- Pas d'interruption de service\n- Résolution : équipe IT\n- Délai : < 4h\n\n**Niveau 2 - Significatif**\n- Impact modéré\n- Service dégradé\n- Escalade : RSSI informé\n- Délai : < 8h\n\n**Niveau 3 - Majeur**\n- Impact important\n- Interruption partielle\n- Escalade : Direction informée\n- Cellule de crise en alerte\n- Délai : < 24h\n\n**Niveau 4 - Critique**\n- Impact majeur\n- Arrêt complet ou vol massif de données\n- Cellule de crise activée\n- Notification ANSSI sous 24h\n- Communication externe\n\n**Matrice d'escalade :**\n```\nGravité x Urgence = Priorité\n\nCritique + Urgent = P1 (immédiat)\nMajeur + Urgent = P2 (2h)\nSignificatif = P3 (8h)\nMineur = P4 (24h)\n```"
                        },
                        {
                            title: "2.3 Communication de crise",
                            content: "**Messages types à préparer :**\n\n**1. Communication INTERNE**\n\n**Phase 1 - Alerte (J+0) :**\n\"Un incident de sécurité est en cours. Par précaution :\n- Ne pas utiliser [système X]\n- Signaler tout comportement anormal\n- Ne pas communiquer en externe\"\n\n**Phase 2 - Gestion (J+1 à J+7) :**\nPoints réguliers (matin/soir)\n- État d'avancement\n- Services disponibles\n- Consignes\n\n**Phase 3 - Retour à la normale :**\nDébriefing et leçons apprises\n\n**2. Communication EXTERNE**\n\n**Clients :**\n- Transparence sur l'incident\n- Impact sur les services\n- Mesures prises\n- Contact dédié\n\n**Presse (si nécessaire) :**\n- Communiqué officiel\n- Porte-parole unique\n- Messages clés préparés\n- Pas de spéculation technique\n\n**Régulateurs (ANSSI, CNIL) :**\n- Notification dans les délais\n- Rapport détaillé\n- Mesures correctives\n\n⚠️ Ne JAMAIS :\n- Minimiser l'incident\n- Mentir ou cacher des faits\n- Accuser sans preuve\n- Communiquer sans validation"
                        }
                    ]
                },
                {
                    title: "Module 3 : Investigation Forensique",
                    duration: "20 min",
                    lessons: [
                        {
                            title: "3.1 Collecte de preuves",
                            content: "**Principes forensiques :**\n\n**1. Préservation**\n- Ne pas modifier les preuves\n- Copie bit-à-bit (image disque)\n- Hash cryptographique (intégrité)\n- Chaîne de custody\n\n**2. Collection**\n- Mémoire RAM (volatile)\n- Disques durs\n- Logs systèmes\n- Trafic réseau (PCAP)\n- Logs applicatifs\n\n**3. Analyse**\n- Timeline des événements\n- Identification du vecteur d'attaque\n- Périmètre de compromission\n- Attribution (si possible)\n\n**Outils forensiques :**\n- **FTK (Forensic Toolkit)** : analyse disque\n- **Volatility** : analyse mémoire\n- **Wireshark** : analyse réseau\n- **Autopsy** : open source\n- **Magnet AXIOM** : complet\n\n**Documentation :**\n- Horodatage de chaque action\n- Photos/screenshots\n- Rapport détaillé\n- Utilisable en justice"
                        },
                        {
                            title: "3.2 Analyse post-incident",
                            content: "**Rapport d'incident (structure) :**\n\n**1. Résumé exécutif**\n- Date et heure\n- Type d'incident\n- Impact\n- État actuel\n\n**2. Chronologie**\n- Ligne de temps détaillée\n- Actions des attaquants\n- Actions de réponse\n\n**3. Analyse technique**\n- Vecteur d'attaque\n- Vulnérabilités exploitées\n- Outils utilisés\n- Données compromises\n\n**4. Impact**\n- Systèmes affectés\n- Données perdues/volées\n- Coûts (estimation)\n- Temps d'interruption\n\n**5. Réponse**\n- Actions de confinement\n- Éradication\n- Récupération\n- Timeline\n\n**6. Leçons apprises**\n- Ce qui a bien fonctionné\n- Ce qui a échoué\n- Failles de sécurité identifiées\n\n**7. Recommandations**\n- Mesures correctives immédiates\n- Améliorations long terme\n- Formation nécessaire\n- Investissements requis\n\n**8. Annexes**\n- IoC (Indicateurs de compromission)\n- Logs pertinents\n- Captures d'écran\n\n📄 Délai de remise : 1 mois (NIS2)"
                        }
                    ]
                },
                {
                    title: "Module 4 : Exercices Pratiques",
                    duration: "10 min",
                    lessons: [
                        {
                            title: "4.1 Simulation de crise (Tabletop)",
                            content: "**Exercice Tabletop :**\n\nSimulation d'incident sur table, sans technique.\n\n**Scénario type :**\n\n**T+0 (Lundi 9h) :**\nVotre antivirus détecte un ransomware sur 5 postes. Les fichiers sont chiffrés. Un message de rançon demande 500K€ en Bitcoin.\n\n**Questions à traiter :**\n\n1. **Qui alertez-vous ?**\n   - DSI, RSSI, DG ?\n   - Quand activez-vous la cellule de crise ?\n\n2. **Actions immédiates ?**\n   - Isoler les postes ?\n   - Couper internet ?\n   - Identifier l'étendue ?\n\n3. **Communication ?**\n   - Que dire aux utilisateurs ?\n   - Quand prévenir les clients ?\n   - Notification ANSSI ?\n\n4. **Décisions ?**\n   - Payer la rançon ?\n   - Restaurer les sauvegardes ?\n   - Faire appel à un expert ?\n\n5. **Après ?**\n   - Comment éviter la récidive ?\n   - Quelles leçons ?\n\n**Objectif :**\nTester les réflexes et la coordination, pas la technique.\n\n**Fréquence recommandée :** 2x/an"
                        }
                    ]
                }
            ],
            quiz: [
                {
                    question: "Combien de temps pour notifier un incident majeur à l'ANSSI ?",
                    options: ["6h", "24h", "72h", "1 semaine"],
                    correct: 1
                },
                {
                    question: "Quel outil collecte et corrèle les logs de sécurité ?",
                    options: ["Firewall", "SIEM", "Antivirus", "VPN"],
                    correct: 1
                }
            ]
        })
    }
];

// Insertion d'articles de blog par défaut
const insertBlogPost = db.prepare(`
    INSERT OR IGNORE INTO blog_posts (id, title, excerpt, content, category, cover_image, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const blogPosts = [
];

for (const post of blogPosts) {
    insertBlogPost.run(
        post.id,
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.cover_image,
        post.created_at
    );
}

trainings.forEach(training => {
    try {
        insertTraining.run(
            training.id,
            training.title,
            training.description,
            training.category,
            training.duration,
            training.level,
            training.price,
            training.content
        );
    } catch (err) {
        // Ignore si déjà existant
    }
});


export default db;
