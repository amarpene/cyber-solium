# Wireframes Mermaid - Cyber Solution Platform

Ce fichier contient les wireframes sous forme de diagrammes Mermaid interactifs pour une meilleure visualisation.

## Navigation Globale

```mermaid
graph TB
    Home[Page Accueil]
    Auth[Modal Auth]
    Dash[Dashboard]
    Audit[Audit NIS2]
    Train[Catalogue Formations]
    Content[Contenu Formation]
    CGU[Page CGU]
    
    Home -->|Commencer Audit| Audit
    Home -->|Se connecter| Auth
    Home -->|Voir Formations| Train
    Auth -->|Login Success| Dash
    Dash -->|Nouvel Audit| Audit
    Dash -->|Mes Formations| Train
    Train -->|Inscrire| Content
    Content -->|Terminer| Dash
    Audit -->|Résultats| Dash
    Home -->|Footer| CGU
    
    style Home fill:#3b82f6
    style Dash fill:#10b981
    style Audit fill:#f59e0b
    style Train fill:#8b5cf6
```

---

## Flow Audit NIS2

```mermaid
graph LR
    Start[Étape 1: Start<br/>Introduction audit]
    Sector[Étape 2: Secteur<br/>Santé, Énergie, Finance...]
    Size[Étape 3: Taille<br/>Micro, PME, Grande]
    Check[Étape 4: Checklist<br/>16 mesures NIS2]
    Result[Étape 5: Résultats<br/>Score et recommandations]
    
    Start -->|Commencer| Sector
    Sector -->|Sélectionner secteur| Size
    Size -->|Sélectionner taille| Check
    Check -->|Cocher mesures| Result
    Result -->|Sauvegarder| Dashboard[Dashboard]
    Result -->|Refaire| Start
    
    style Start fill:#e0f2fe
    style Sector fill:#dbeafe
    style Size fill:#bfdbfe
    style Check fill:#93c5fd
    style Result fill:#60a5fa
    style Dashboard fill:#10b981
```

---

## Structure Page Accueil

```mermaid
graph TB
    subgraph Navbar
        Logo[Logo Cyber Solution]
        Nav[Navigation: Accueil, Services, Contact]
        AuthBtn[Boutons: Connexion, Inscription]
    end
    
    subgraph Hero
        Title[Titre: Conformité NIS2 et RGPD Simplifiée]
        Subtitle[Sous-titre: Audit gratuit 10 min]
        CTA1[CTA: Commencer Audit Gratuit]
        CTA2[CTA: Voir les Formations]
    end
    
    subgraph Services
        S1[Audit Conformité<br/>Gratuit et rapide]
        S2[Formations Certifiantes<br/>199-599 EUR]
        S3[Chatbot IA Expert<br/>Assistance 24/7]
    end
    
    subgraph Sectors
        Sec1[Santé]
        Sec2[Énergie]
        Sec3[Finance]
        Sec4[Transport]
        Sec5[Numérique]
    end
    
    subgraph Footer
        Links[CGU, Mentions Légales, RGPD]
        Copyright[Copyright 2026]
    end
    
    Navbar --> Hero
    Hero --> Services
    Services --> Sectors
    Sectors --> Footer
    
    style Hero fill:#dbeafe
    style Services fill:#fef3c7
    style Sectors fill:#ddd6fe
```

---

## Structure Dashboard

```mermaid
graph TB
    subgraph Header
        UserInfo[Utilisateur: jean.dupont@company.fr]
        Logout[Bouton Déconnexion]
    end
    
    subgraph KPIs
        KPI1[Audits Réalisés: 3<br/>+1 ce mois]
        KPI2[Score Moyen: 75%<br/>Moyen]
        KPI3[Meilleur Score: 88%<br/>Excellent]
    end
    
    subgraph History
        H1[28/01/2026 - 88% - Conforme]
        H2[20/01/2026 - 75% - Non conforme]
        H3[15/01/2026 - 62% - Non conforme]
    end
    
    subgraph Trainings
        T1[Introduction NIS2 - 100% - Terminée]
        T2[RGPD Essentiels - 65% - En cours]
    end
    
    subgraph QuickActions
        A1[Nouvel Audit]
        A2[Formations]
        A3[Chatbot]
        A4[Certificats]
    end
    
    Header --> KPIs
    KPIs --> History
    History --> Trainings
    Trainings --> QuickActions
    
    A1 -.->|Navigation| AuditPage[Page Audit]
    A2 -.->|Navigation| TrainPage[Page Formations]
    A3 -.->|Ouvrir| ChatbotModal[Chatbot Modal]
    
    style KPI1 fill:#bfdbfe
    style KPI2 fill:#fcd34d
    style KPI3 fill:#86efac
    style T2 fill:#fde047
```

---

## Flow Authentification

```mermaid
stateDiagram-v2
    [*] --> ModalClosed
    ModalClosed --> ModalOpen: Click Connexion/Inscription
    
    state ModalOpen {
        [*] --> LoginTab
        LoginTab --> RegisterTab: Switch Tab
        RegisterTab --> LoginTab: Switch Tab
        
        state LoginTab {
            [*] --> EnterEmail
            EnterEmail --> EnterPassword
            EnterPassword --> SubmitLogin
        }
        
        state RegisterTab {
            [*] --> EnterEmailReg
            EnterEmailReg --> EnterPasswordReg
            EnterPasswordReg --> EnterCompany
            EnterCompany --> AcceptCGU
            AcceptCGU --> SubmitRegister
        }
    }
    
    ModalOpen --> Validating: Submit
    Validating --> Error: Invalid Credentials
    Validating --> Success: Valid Credentials
    Error --> ModalOpen: Show Error Message
    Success --> Dashboard: Redirect
    Dashboard --> [*]
    
    ModalOpen --> ModalClosed: Click Close
    ModalClosed --> [*]
```

---

## Structure Checklist Audit (Étape 4)

```mermaid
graph TB
    subgraph Security[Sécurité Technique]
        S1[MFA Authentification]
        S2[Chiffrement données]
        S3[Segmentation réseau]
        S4[Antivirus EDR/XDR]
    end
    
    subgraph Governance[Gouvernance]
        G1[PSSI formalisée]
        G2[Analyse risques]
        G3[RSSI désigné]
        G4[Gestion incidents]
    end
    
    subgraph HR[Ressources Humaines]
        H1[Formation annuelle]
        H2[Sensibilisation phishing]
        H3[Charte SI signée]
    end
    
    subgraph Continuity[Continuité et Sauvegarde]
        C1[PCA testé]
        C2[Sauvegardes 3-2-1]
        C3[Tests restauration]
    end
    
    subgraph Monitoring[Surveillance]
        M1[SOC/SIEM]
        M2[Registre RGPD]
    end
    
    Security --> Score[Calcul Score<br/>9/16 = 56%]
    Governance --> Score
    HR --> Score
    Continuity --> Score
    Monitoring --> Score
    
    Score -->|< 50%| Danger[Danger Critique]
    Score -->|50-80%| Warning[Non Conforme]
    Score -->|> 80%| Success[Conforme]
    
    style Score fill:#fbbf24
    style Danger fill:#ef4444
    style Warning fill:#f59e0b
    style Success fill:#10b981
```

---

## Flow Formation avec Paiement

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant Cat as Catalogue Formations
    participant Modal as Modal Paiement
    participant Backend as Serveur Backend
    participant Content as Contenu Formation
    
    User->>Cat: Consulter formations
    Cat-->>User: Afficher 5 formations
    User->>Cat: Click "Inscrire mon Entreprise"
    Cat->>Modal: Ouvrir modal paiement
    
    User->>Modal: Entrer infos carte
    User->>Modal: Accepter CGV
    User->>Modal: Click "Payer 299€"
    
    Modal->>Modal: Validation formulaire
    Modal-->>User: Afficher spinner (2s)
    
    Modal->>Backend: POST /api/trainings/enroll
    Backend->>Backend: Simuler paiement
    Backend-->>Modal: 200 OK enrollment_id
    
    Modal-->>User: Afficher succès
    Modal->>Content: Rediriger vers formation
    Content-->>User: Afficher Module 1 Leçon 1
    
    User->>Backend: Dispatch event trainingStarted
    Backend->>Backend: Sauvegarder progression
```

---

## Structure Contenu Formation

```mermaid
graph LR
    subgraph Sidebar[Sidebar Navigation]
        M1[Module 1<br/>Leçon 1 ✅<br/>Leçon 2 ✅]
        M2[Module 2<br/>Leçon 1 🔄<br/>Leçon 2 ⭕]
        M3[Module 3<br/>Leçon 1 ⭕<br/>Leçon 2 ⭕<br/>Leçon 3 ⭕]
        M4[Module 4<br/>Leçon 1 ⭕<br/>Leçon 2 ⭕]
        Quiz[Quiz Final 📝]
    end
    
    subgraph Content[Zone Contenu]
        Title[Titre Leçon]
        Text[Contenu Markdown]
        Images[Images/Schémas]
        KeyPoints[Points Clés]
        NavButtons[Navigation Précédent/Suivant]
    end
    
    subgraph QuizView[Vue Quiz]
        Q1[Question 1/10]
        Options[4 options à choix unique]
        Progress[Progression 0/10]
        NextBtn[Bouton Question Suivante]
    end
    
    M1 -.-> Content
    M2 -.-> Content
    M3 -.-> Content
    M4 -.-> Content
    Quiz -.-> QuizView
    
    QuizView -->|Score > 80%| Certificate[Certificat Disponible]
    QuizView -->|Score < 80%| Retry[Refaire Quiz]
    
    style M2 fill:#fef3c7
    style Certificate fill:#86efac
```

---

## Flow Chatbot

```mermaid
stateDiagram-v2
    [*] --> Minimized: Initial State
    
    Minimized --> Opened: Click Bubble
    Opened --> Minimized: Click Minimize
    Opened --> [*]: Click Close
    
    state Opened {
        [*] --> Welcome: Show Welcome Message
        Welcome --> Idle: Wait User Input
        
        Idle --> Typing: User Types Question
        Typing --> Sending: Click Send / Enter
        Sending --> Processing: API Call
        Processing --> Responding: Bot Typing...
        Responding --> DisplayAnswer: Show Response
        DisplayAnswer --> Idle: Wait Next Input
        
        Idle --> Suggestion: Click Suggestion
        Suggestion --> Processing: Load Context
    }
    
    note right of Processing
        POST /api/chat/message
        { message, conversationId }
    end note
    
    note right of Responding
        Simulate typing 1-2s
        Stream response
    end note
```

---

## Architecture Responsive

```mermaid
graph TB
    subgraph Mobile[Mobile < 768px]
        M1[Navbar: Hamburger Menu]
        M2[Cards: 1 colonne verticale]
        M3[Dashboard Stats: Stacked]
        M4[Chatbot: Full Screen]
        M5[Sidebar: Drawer coulissant]
    end
    
    subgraph Tablet[Tablet 768-1024px]
        T1[Navbar: Liens visibles]
        T2[Cards: 2 colonnes]
        T3[Dashboard Stats: 2 cols + 1 centré]
        T4[Audit Checklist: 2 colonnes]
    end
    
    subgraph Desktop[Desktop > 1024px]
        D1[Layout complet 1400px max]
        D2[Cards: 3 colonnes]
        D3[Dashboard Stats: 3 colonnes]
        D4[Sidebar: Toujours visible]
    end
    
    Mobile -->|Breakpoint 768px| Tablet
    Tablet -->|Breakpoint 1024px| Desktop
    
    style Mobile fill:#fef3c7
    style Tablet fill:#dbeafe
    style Desktop fill:#d1fae5
```

---

## États Modal Paiement

```mermaid
stateDiagram-v2
    [*] --> Idle: Catalogue Formations
    
    Idle --> ModalOpen: Click Inscrire
    
    state ModalOpen {
        [*] --> FormDisplay
        
        FormDisplay --> FormValidation: User Fills Fields
        FormValidation --> FormError: Invalid Data
        FormValidation --> FormValid: All Valid
        
        FormError --> FormDisplay: Show Error Messages
        FormValid --> Processing: Click Payer
        
        Processing --> Success: Payment OK (2s)
        Processing --> Error: Payment Failed
        
        Error --> FormDisplay: Show Error + Retry
        Success --> RedirectContent: Navigate to Training
    }
    
    ModalOpen --> Idle: Click Cancel / Close
    RedirectContent --> TrainingPage: Open Content
    TrainingPage --> [*]
    
    note right of Processing
        Validation carte:
        - Numéro 16 chiffres
        - CVV 3 chiffres  
        - Date future
        - Nom non vide
    end note
    
    note right of Success
        🔒 Paiement fictif
        Simulation 2s
        enrollment_id généré
    end note
```

---

## Composants Palette Couleurs

```mermaid
graph LR
    subgraph Primary[Couleurs Primaires]
        Blue[Bleu #2563eb<br/>Boutons principaux]
        Slate[Slate #475569<br/>Texte secondaire]
    end
    
    subgraph Status[Couleurs Statut]
        Success[Vert #10b981<br/>Conforme, Succès]
        Warning[Orange #f59e0b<br/>Non conforme]
        Danger[Rouge #ef4444<br/>Critique]
        Neutral[Gris #64748b<br/>Neutre]
    end
    
    subgraph Backgrounds[Arrière-plans]
        Light[Clair #f8fafc<br/>Body background]
        Medium[Moyen #e2e8f0<br/>Cards, sections]
        Dark[Foncé #1e293b<br/>Header, footer]
    end
    
    Primary --> Components[Composants UI]
    Status --> Feedback[Feedback visuel]
    Backgrounds --> Layout[Structure layout]
    
    style Blue fill:#2563eb,color:#fff
    style Success fill:#10b981,color:#fff
    style Warning fill:#f59e0b,color:#fff
    style Danger fill:#ef4444,color:#fff
    style Light fill:#f8fafc
    style Dark fill:#1e293b,color:#fff
```

---

## Hiérarchie Typographie

```mermaid
graph TB
    H1[H1: 2.5rem 40px<br/>font-bold<br/>Titres principaux]
    H2[H2: 2rem 32px<br/>font-bold<br/>Sections principales]
    H3[H3: 1.5rem 24px<br/>font-semibold<br/>Sous-sections]
    H4[H4: 1.25rem 20px<br/>font-semibold<br/>Titres cards]
    
    Large[Body Large: 1.125rem 18px<br/>Texte important]
    Normal[Body Normal: 1rem 16px<br/>Texte standard]
    Small[Body Small: 0.875rem 14px<br/>Métadonnées]
    Tiny[Body Tiny: 0.75rem 12px<br/>Labels, badges]
    
    H1 --> H2 --> H3 --> H4
    H4 --> Large --> Normal --> Small --> Tiny
    
    Font[Font Family:<br/>Inter, system-ui, sans-serif]
    LineHeight[Line Height:<br/>1.5 normal, 1.2 headings]
    
    Tiny --> Font
    Tiny --> LineHeight
    
    style H1 fill:#3b82f6,color:#fff
    style Normal fill:#f1f5f9
```

---

## Interactions Animations

```mermaid
graph LR
    subgraph Hover[États Hover]
        H1[Boutons: Darkening + scale 1.05]
        H2[Cards: Elevation shadow]
        H3[Links: Underline animation]
    end
    
    subgraph Transitions[Transitions]
        T1[Modal: Fade in + scale 0.9]
        T2[Sidebar: Slide from left]
        T3[Chatbot: Slide bottom-right]
        T4[Pages: Fade cross]
    end
    
    subgraph Loading[États Loading]
        L1[Skeleton screens pour listes]
        L2[Spinner pour formulaires]
        L3[Progress bar pour audits]
        L4[Shimmer effect pour images]
    end
    
    subgraph Validation[Validation]
        V1[Real-time sur blur]
        V2[Messages sous champs]
        V3[Couleurs Rouge/Vert]
        V4[Icônes Erreur/Valide]
    end
    
    Hover --> UX[Expérience Utilisateur]
    Transitions --> UX
    Loading --> UX
    Validation --> UX
    
    style UX fill:#10b981,color:#fff
```

---

## Notes d'Implémentation

**Pour générer les diagrammes:**
1. Copier un bloc Mermaid
2. Coller dans https://mermaid.live
3. Exporter en PNG/SVG

**Types de diagrammes utilisés:**
- `graph TB/LR` - Organigrammes directionnels
- `stateDiagram-v2` - Machines à états
- `sequenceDiagram` - Diagrammes de séquence

**Avantages Mermaid vs ASCII:**
- ✅ Rendu visuel professionnel
- ✅ Export PNG/SVG/PDF
- ✅ Intégration Markdown
- ✅ Éditable et versionnable
- ✅ Animations possibles

**Référence complète:**
- Wireframes ASCII détaillés: `Wireframes.md`
- Wireframes Mermaid interactifs: `Wireframes-Mermaid.md` (ce fichier)
