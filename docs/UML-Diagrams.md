# Architecture UML - Cyber Solution

## Diagramme de Classes

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string password_hash
        +string company_name
        +datetime created_at
        +register()
        +login()
        +logout()
    }

    class Company {
        +int id
        +int user_id
        +string name
        +string sector
        +string size
        +datetime created_at
    }

    class AuditResult {
        +int id
        +int user_id
        +string sector_name
        +string sector_type
        +string size
        +int readiness_score
        +string missing_items
        +datetime created_at
        +calculateScore()
        +generateRecommendations()
    }

    class TrainingModule {
        +int id
        +string title
        +string description
        +string category
        +int duration
        +string level
        +float price
        +string content
        +getModules()
        +getQuiz()
    }

    class UserTrainingProgress {
        +int id
        +int user_id
        +int training_id
        +int progress
        +boolean completed
        +string payment_status
        +datetime enrolled_at
        +datetime started_at
        +datetime completed_at
        +updateProgress()
        +markCompleted()
    }

    class ChatConversation {
        +int id
        +int user_id
        +string message
        +string response
        +datetime created_at
        +getAIResponse()
    }

    User "1" --> "*" Company : owns
    User "1" --> "*" AuditResult : performs
    User "1" --> "*" UserTrainingProgress : enrolls
    TrainingModule "1" --> "*" UserTrainingProgress : has
    User "1" --> "*" ChatConversation : interacts
```

## Diagramme de Séquence - Inscription et Audit

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Ouvre l'application
    F->>U: Affiche page d'accueil
    
    U->>F: Clique "S'inscrire"
    F->>U: Affiche formulaire inscription
    
    U->>F: Soumet formulaire (email, password, company)
    F->>B: POST /api/auth/register
    B->>DB: Vérifie email unique
    DB-->>B: Email disponible
    B->>B: Hash password (bcrypt)
    B->>DB: INSERT user
    DB-->>B: User créé (id)
    B->>B: Génère JWT token
    B-->>F: 201 Created + JWT token
    F->>F: Stocke token (localStorage)
    F-->>U: Redirige vers Dashboard
    
    U->>F: Navigue vers "Audit de Conformité"
    F->>U: Affiche Nis2Calculator (step: start)
    
    U->>F: Clique "Commencer l'audit"
    F->>U: Affiche sélection secteur
    
    U->>F: Sélectionne secteur (ex: Santé)
    F->>F: setStep('size')
    F->>U: Affiche sélection taille
    
    U->>F: Sélectionne taille (ex: Grande >250)
    F->>F: setStep('readiness')
    F->>U: Affiche checklist 16 mesures
    
    U->>F: Coche mesures implémentées
    F->>F: Calcule readinessScore
    F->>F: setStep('result')
    
    F->>B: POST /api/audit/save + JWT
    B->>B: Vérifie token JWT
    B->>DB: INSERT audit_results
    DB-->>B: Audit enregistré
    B-->>F: 201 Created
    
    F->>F: dispatchEvent('auditCompleted')
    F-->>U: Affiche résultats (score, niveau, recommandations)
    
    U->>F: Navigue vers Dashboard
    F->>B: GET /api/audit/history + JWT
    B->>DB: SELECT audits WHERE user_id
    DB-->>B: Liste audits
    B-->>F: Audits JSON
    F-->>U: Affiche stats mises à jour
```

## Diagramme de Séquence - Inscription Formation avec Paiement

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant PM as PaymentModal
    participant B as Backend
    participant DB as Database
    
    U->>F: Clique "Formations"
    F->>B: GET /api/trainings + JWT
    B->>DB: SELECT training_modules
    DB-->>B: Liste formations
    B-->>F: Formations JSON
    F-->>U: Affiche catalogue formations
    
    U->>F: Clique "Inscrire mon entreprise - 299€"
    F->>PM: Affiche modal paiement
    PM-->>U: Formulaire carte bancaire
    
    U->>PM: Remplit formulaire (carte, date, CVV)
    PM->>PM: Valide formulaire (regex, dates)
    
    U->>PM: Clique "Payer 299€"
    PM->>PM: Simule traitement (2s)
    PM->>F: onConfirm(paymentData)
    
    F->>B: POST /api/trainings/:id/enroll + JWT
    B->>DB: INSERT user_training_progress
    DB-->>B: Inscription créée
    B-->>F: 201 Created
    
    F->>B: POST /api/trainings/:id/confirm-payment + JWT
    B->>DB: UPDATE payment_status = 'paid'
    DB-->>B: Paiement confirmé
    B-->>F: 200 OK
    
    F->>F: Ferme modal
    F->>B: GET /api/trainings/user/progress + JWT
    B->>DB: SELECT progress WHERE user_id
    DB-->>B: Progress JSON
    B-->>F: Progress data
    F-->>U: Affiche "Accéder au contenu"
    
    U->>F: Clique "Accéder au contenu"
    F->>F: setViewingTrainingId(id)
    F->>U: Affiche TrainingContent (modules, quiz)
```

## Diagramme d'Activité - Workflow Audit NIS2

```mermaid
flowchart TD
    Start([User connecté]) --> SelectAudit[Sélectionne Audit NIS2]
    SelectAudit --> ChooseSector{Choix du secteur}
    
    ChooseSector -->|Santé| SetHealthSector[sector = Santé, type = critical]
    ChooseSector -->|Énergie| SetEnergySector[sector = Énergie, type = critical]
    ChooseSector -->|Finance| SetFinanceSector[sector = Finance, type = critical]
    ChooseSector -->|Numérique| SetDigitalSector[sector = Numérique, type = important]
    ChooseSector -->|Autre| SetOtherSector[sector = Autre, type = excluded]
    
    SetHealthSector --> ChooseSize
    SetEnergySector --> ChooseSize
    SetFinanceSector --> ChooseSize
    SetDigitalSector --> ChooseSize
    SetOtherSector --> ChooseSize
    
    ChooseSize{Taille entreprise?}
    ChooseSize -->|< 50 employés| SizeTiny[size = Micro]
    ChooseSize -->|50-250| SizeSmall[size = PME]
    ChooseSize -->|> 250| SizeLarge[size = Grande]
    
    SizeTiny --> CheckCriteria{Secteur critique?}
    SizeSmall --> CheckReadiness
    SizeLarge --> CheckReadiness
    
    CheckCriteria -->|Oui| CheckReadiness[Afficher checklist 16 mesures]
    CheckCriteria -->|Non| NotApplicable[Hors périmètre NIS2]
    
    CheckReadiness --> UserChecks[User coche mesures en place]
    UserChecks --> CalcScore[Calcul score sur 16 mesures]
    
    CalcScore --> EvalScore{Score >= 80%?}
    
    EvalScore -->|Oui| Compliant[CONFORME - Niveau Excellent - Risque Faible]
    EvalScore -->|Non| CheckMedium{Score >= 60%?}
    
    CheckMedium -->|Oui| Partial[NON CONFORME - Niveau Moyen - Risque Élevé - Amendes 7M EUR]
    CheckMedium -->|Non| Critical[DANGER CRITIQUE - Niveau Critique - Risque Maximal - Amendes 10M EUR]
    
    Compliant --> SaveAudit[Sauvegarder audit en BDD]
    Partial --> SaveAudit
    Critical --> SaveAudit
    NotApplicable --> SaveAudit
    
    SaveAudit --> DispatchEvent[Dispatch event auditCompleted]
    DispatchEvent --> UpdateDashboard[Dashboard se met à jour]
    UpdateDashboard --> End([Fin])
```

## Diagramme de Composants

```mermaid
graph TB
    subgraph "Frontend - React 19 + TypeScript"
        App[App.tsx - Router and State]
        
        subgraph "Pages"
            Home[Home.tsx]
            Dashboard[Dashboard.tsx]
            Trainings[Trainings.tsx]
            Nis2[Nis2Calculator.tsx]
            Services[Services.tsx]
            CGU[CGU.tsx]
        end
        
        subgraph "Components"
            Navbar[Navbar.tsx]
            Footer[Footer.tsx]
            Chatbot[Chatbot.tsx]
            PaymentModal[PaymentModal.tsx]
            TrainingContent[TrainingContent.tsx]
        end
        
        subgraph "Contexts"
            AuthContext[AuthContext.tsx - JWT and User State]
        end
    end
    
    subgraph "Backend - Express + TypeScript"
        Server[index.ts - Express Server]
        
        subgraph "Routes"
            AuthRoutes[Auth Routes - register, login]
            AuditRoutes[Audit Routes - save, history]
            TrainingRoutes[Training Routes - list, enroll, progress]
            ChatRoutes[Chat Routes - AI responses]
            CertRoutes[Certificate Routes - PDF generation]
        end
        
        subgraph "Middleware"
            JWT[authenticateToken - JWT Verification]
        end
        
        Database[(database.ts - SQLite Schema)]
    end
    
    subgraph "Database - SQLite"
        UsersTable[(users)]
        AuditsTable[(audit_results)]
        TrainingsTable[(training_modules)]
        ProgressTable[(user_training_progress)]
        ChatTable[(chat_conversations)]
    end
    
    App --> Home
    App --> Dashboard
    App --> Trainings
    App --> Nis2
    App --> Services
    App --> CGU
    
    Home --> Navbar
    Dashboard --> AuthContext
    Trainings --> PaymentModal
    Trainings --> TrainingContent
    
    Dashboard --> Server
    Trainings --> Server
    Nis2 --> Server
    Chatbot --> Server
    
    Server --> AuthRoutes
    Server --> AuditRoutes
    Server --> TrainingRoutes
    Server --> ChatRoutes
    Server --> CertRoutes
    
    AuthRoutes --> JWT
    AuditRoutes --> JWT
    TrainingRoutes --> JWT
    
    Server --> Database
    Database --> UsersTable
    Database --> AuditsTable
    Database --> TrainingsTable
    Database --> ProgressTable
    Database --> ChatTable
```

## Diagramme de Déploiement

```mermaid
graph TB
    subgraph "Client Browser"
        Browser[Web Browser - Chrome, Firefox, Edge]
        LocalStorage[localStorage - JWT Token]
    end
    
    subgraph "Development Server"
        FrontendServer[Vite Dev Server - Port 3000 - React App]
        BackendServer[Node.js Express - Port 3001 - REST API]
        SQLiteDB[(SQLite Database - cyber-solution.db)]
    end
    
    Browser -->|HTTP/HTTPS| FrontendServer
    Browser -->|API Calls with JWT| BackendServer
    Browser -.->|Store/Read| LocalStorage
    
    FrontendServer -->|Proxy API| BackendServer
    BackendServer -->|SQL Queries| SQLiteDB
    
    BackendServer -->|Generate PDF| PDFKit[PDFKit Library]
    BackendServer -->|Hash Passwords| Bcrypt[bcryptjs]
    BackendServer -->|JWT Sign/Verify| JWTLib[jsonwebtoken]
```
