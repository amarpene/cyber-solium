// Route pour générer et télécharger le certificat ISO 27001
app.get('/api/certificate-iso27001/:auditId', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const auditId = req.params.auditId;

        // Récupérer l'audit et les infos utilisateur
        const audit: any = db.prepare(`
      SELECT * FROM audit_results WHERE id = ? AND user_id = ? AND audit_type = 'iso27001'
    `).get(auditId, userId);

        if (!audit) {
            return res.status(404).json({ error: 'Audit ISO 27001 non trouvé' });
        }

        const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        // Calculer le score
        const scorePercent = Math.round((audit.readiness_score / 14) * 100); // 14 mesures ISO
        let niveau = 'Prioritaire';
        let couleur = '#ef4444'; // Rouge

        if (scorePercent >= 80) {
            niveau = 'Certification prête';
            couleur = '#10b981'; // Vert
        } else if (scorePercent >= 60) {
            niveau = 'À renforcer';
            couleur = '#f59e0b'; // Jaune
        }

        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Headers pour le téléchargement
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificat_ISO27001_${user.company_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

        // Pipe le PDF vers la réponse
        doc.pipe(res);

        // === EN-TÊTE ===
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 60, 45, { width: 46, height: 46 });
        }

        doc.fontSize(28)
            .fillColor('#06b6d4')
            .text("CERTIFICAT D'AUDIT ISO 27001", { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(14)
            .fillColor('#64748b')
            .text('Système de Management de la Sécurité de l’Information', { align: 'center' })
            .moveDown(2);

        // === BORDURE DÉCORATIVE ===
        doc.rect(50, 130, 495, 620)
            .lineWidth(2)
            .strokeColor(couleur)
            .stroke();

        doc.rect(55, 135, 485, 610)
            .lineWidth(1)
            .strokeColor('#e2e8f0')
            .stroke();

        doc.moveDown(1);

        // === INFORMATIONS ENTREPRISE ===
        doc.fontSize(12)
            .fillColor('#334155')
            .text('Délivré à :', 80, 160, { continued: false })
            .moveDown(0.3);

        doc.fontSize(18)
            .fillColor('#0f172a')
            .font('Helvetica-Bold')
            .text(user.company_name, { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .fillColor('#64748b')
            .text(`Contact : ${user.email}`, { align: 'center' })
            .moveDown(2);

        // === SCORE ET NIVEAU ===
        const centerX = 300;
        const circleY = 300;
        const radius = 60;

        // Cercle de fond
        doc.circle(centerX, circleY, radius)
            .lineWidth(8)
            .strokeColor('#e2e8f0')
            .stroke();

        // Cercle de progression
        doc.circle(centerX, circleY, radius)
            .lineWidth(8)
            .strokeColor(couleur)
            .stroke();

        // Score au centre
        doc.fontSize(32)
            .fillColor(couleur)
            .font('Helvetica-Bold')
            .text(`${scorePercent}%`, centerX - 50, circleY - 15, { width: 100, align: 'center' });

        doc.moveDown(5);

        // Badge de niveau
        doc.fontSize(16)
            .fillColor(couleur)
            .font('Helvetica-Bold')
            .text(`Niveau : ${niveau}`, { align: 'center' })
            .moveDown(1.5);

        // === DÉTAILS DE L'AUDIT ===
        doc.fontSize(12)
            .fillColor('#334155')
            .font('Helvetica')
            .text('Détails de l\'évaluation :', 80, 430)
            .moveDown(0.5);

        const detailsY = 450;
        doc.fontSize(10)
            .fillColor('#64748b')
            .text(`Périmètre : ${audit.sector_name || 'Non renseigné'}`, 80, detailsY)
            .text(`Type d'organisation : ${audit.sector_type || 'Non renseigné'}`, 80, detailsY + 20)
            .text(`Taille de l'entreprise : ${audit.company_size === 'large' ? 'Grande entreprise' : audit.company_size === 'medium' ? 'ETI' : 'PME'}`, 80, detailsY + 40)
            .text(`Mesures de sécurité en place : ${audit.readiness_score} / 14`, 80, detailsY + 60)
            .text(`Date de l'audit : ${new Date(audit.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`, 80, detailsY + 80);

        // === RECOMMANDATIONS ===
        doc.moveDown(3);
        doc.fontSize(12)
            .fillColor('#334155')
            .font('Helvetica-Bold')
            .text('Recommandations :', 80, 580);

        doc.fontSize(9)
            .fillColor('#64748b')
            .font('Helvetica');

        if (scorePercent >= 80) {
            doc.text('• Maintenir le niveau de conformité actuel', 80, 600)
                .text('• Planifier des audits de suivi réguliers', 80, 615)
                .text('• Former continuellement les équipes', 80, 630);
        } else if (scorePercent >= 60) {
            doc.text('• Identifier et corriger les écarts prioritaires', 80, 600)
                .text('• Compléter les formations manquantes', 80, 615)
                .text('• Établir un plan d\'action avec échéances', 80, 630);
        } else {
            doc.text('• Structurer le SMSI en priorité', 80, 600)
                .text('• Contacter un expert ISO 27001', 80, 615)
                .text('• Mettre en place un plan de remédiation urgent', 80, 630)
                .text('• Former l\'équipe de direction à la sécurité', 80, 645);
        }

        // === PIED DE PAGE ===
        doc.fontSize(8)
            .fillColor('#94a3b8')
            .text("Ce certificat atteste de la réalisation d'un audit ISO 27001 à la date indiquée.", 80, 700, { align: 'center', width: 450 })
            .text('Il ne constitue pas une certification officielle.', { align: 'center' })
            .moveDown(0.5)
            .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} par Cyber Solium`, { align: 'center' })
            .moveDown(0.3)
            .fillColor('#06b6d4')
            .text('www.cyber-solium.fr', { align: 'center', link: 'https://www.cyber-solium.fr' });

        // Finaliser le PDF
        doc.end();

    } catch (error) {
        console.error('Erreur génération certificat ISO 27001:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du certificat ISO 27001' });
    }
});
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_a_changer_en_production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logoPath = join(__dirname, '..', 'logo.png');

app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, companyName } = req.body;

        if (!email || !password || !companyName) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        let result;
        try {
            result = db.prepare(
                'INSERT INTO users (email, password, company_name) VALUES (?, ?, ?)'
            ).run(email, hashedPassword, companyName);
        } catch (dbError: any) {
            if (dbError?.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }
            console.error('Erreur DB inscription:', dbError);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        const token = jwt.sign({ userId: result.lastInsertRowid, email }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            message: 'Compte créé avec succès',
            token,
            user: { id: result.lastInsertRowid, email, companyName }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Mettre à jour last_login
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                companyName: user.company_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Routes des formations
app.get('/api/trainings', authenticateToken, (req, res) => {
    try {
        const trainings = db.prepare('SELECT * FROM training_modules ORDER BY category, level').all();
        res.json(trainings);
    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/trainings/:id', authenticateToken, (req, res) => {
    try {
        const training = db.prepare('SELECT * FROM training_modules WHERE id = ?').get(req.params.id);
        if (!training) {
            return res.status(404).json({ error: 'Formation non trouvée' });
        }
        res.json(training);
    } catch (error) {
        console.error('Erreur lors de la récupération de la formation:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/trainings/user/progress', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const progress = db.prepare(`
      SELECT tp.*, tm.title, tm.category, tm.duration, tm.level
      FROM user_training_progress tp
      JOIN training_modules tm ON tp.training_id = tm.id
      WHERE tp.user_id = ?
      ORDER BY tp.started_at DESC
    `).all(userId);
        res.json(progress);
    } catch (error) {
        console.error('Erreur lors de la récupération de la progression:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/trainings/:id/start', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const trainingId = req.params.id;

        // Vérifier si déjà commencé
        const existing = db.prepare(
            'SELECT * FROM user_training_progress WHERE user_id = ? AND training_id = ?'
        ).get(userId, trainingId);

        if (existing) {
            return res.json({ message: 'Formation déjà commencée', progress: existing });
        }

        const result = db.prepare(
            'INSERT INTO user_training_progress (user_id, training_id, payment_status, enrolled_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
        ).run(userId, trainingId, 'pending');

        res.json({ message: 'Formation démarrée', id: result.lastInsertRowid });
    } catch (error) {
        console.error('Erreur lors du démarrage de la formation:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Endpoint pour inscrire/valider une formation pour l'entreprise
app.post('/api/trainings/:id/enroll', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const trainingId = req.params.id;

        // Vérifier si déjà inscrit
        const existing = db.prepare(
            'SELECT * FROM user_training_progress WHERE user_id = ? AND training_id = ?'
        ).get(userId, trainingId);

        if (existing) {
            return res.status(400).json({ error: 'Déjà inscrit à cette formation' });
        }

        // Récupérer les infos de la formation
        const training: any = db.prepare('SELECT * FROM training_modules WHERE id = ?').get(trainingId);

        if (!training) {
            return res.status(404).json({ error: 'Formation non trouvée' });
        }

        // Inscrire l'utilisateur (en attente de paiement)
        const result = db.prepare(
            'INSERT INTO user_training_progress (user_id, training_id, payment_status, enrolled_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
        ).run(userId, trainingId, 'pending');

        res.json({
            message: 'Inscription réussie',
            id: result.lastInsertRowid,
            training: training.title,
            price: training.price
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Endpoint pour confirmer le paiement (simulation)
app.post('/api/trainings/:id/confirm-payment', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const trainingId = req.params.id;

        const updated = db.prepare(
            'UPDATE user_training_progress SET payment_status = ?, started_at = CURRENT_TIMESTAMP WHERE user_id = ? AND training_id = ?'
        ).run('paid', userId, trainingId);

        if (updated.changes === 0) {
            return res.status(404).json({ error: 'Inscription non trouvée' });
        }

        res.json({ message: 'Paiement confirmé, formation accessible' });
    } catch (error) {
        console.error('Erreur confirmation paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.put('/api/trainings/progress/:id', authenticateToken, (req: any, res) => {
    try {
        const { progress, completed } = req.body;
        const progressId = req.params.id;
        const userId = req.user.userId;

        let query = 'UPDATE user_training_progress SET progress = ?';
        const params: any[] = [progress];

        if (completed) {
            query += ', completed = 1, completed_at = CURRENT_TIMESTAMP';
        }

        query += ' WHERE id = ? AND user_id = ?';
        params.push(progressId, userId);

        db.prepare(query).run(...params);

        res.json({ message: 'Progression mise à jour' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Routes des audits
app.post('/api/audit/save', authenticateToken, (req: any, res) => {
    try {
        const { sectorName, sectorType, size, readinessScore, missingItems } = req.body;
        const userId = req.user.userId;

        const result = db.prepare(`
      INSERT INTO audit_results (user_id, sector_name, sector_type, company_size, readiness_score, missing_items)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, sectorName, sectorType, size, readinessScore, JSON.stringify(missingItems));

        res.json({ message: 'Audit sauvegardé', id: result.lastInsertRowid });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'audit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/audit/history', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const audits: any[] = db.prepare(`
      SELECT * FROM audit_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `).all(userId);

        res.json(audits.map((audit: any) => ({
            ...audit,
            missing_items: JSON.parse(audit.missing_items || '[]')
        })));
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route du chatbot (simplifié - base de connaissances statique)
app.post('/api/chatbot', (req, res) => {
    try {
        const { message, sessionId } = req.body;

        // Base de connaissances simplifiée
        const responses = getAIResponse(message.toLowerCase());

        // Sauvegarder la conversation
        const existing: any = db.prepare('SELECT * FROM chat_conversations WHERE session_id = ?').get(sessionId);

        if (existing) {
            const messages = JSON.parse(existing.messages);
            messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
            messages.push({ role: 'assistant', content: responses, timestamp: new Date().toISOString() });

            db.prepare('UPDATE chat_conversations SET messages = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?')
                .run(JSON.stringify(messages), sessionId);
        } else {
            const messages = [
                { role: 'user', content: message, timestamp: new Date().toISOString() },
                { role: 'assistant', content: responses, timestamp: new Date().toISOString() }
            ];
            db.prepare('INSERT INTO chat_conversations (session_id, messages) VALUES (?, ?)')
                .run(sessionId, JSON.stringify(messages));
        }

        res.json({ response: responses });
    } catch (error) {
        console.error('Erreur chatbot:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

function getAIResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Détection de mots-clés multiples pour une meilleure contextualisation
    const keywords = {
        nis2: ['nis2', 'nis 2', 'nis-2', 'directive nis'],
        rgpd: ['rgpd', 'gdpr', 'données personnelles', 'protection des données'],
        cyber: ['cyberattaque', 'ransomware', 'phishing', 'piratage', 'hack', 'sécurité informatique'],
        audit: ['audit', 'évaluation', 'diagnostic', 'test', 'analyse'],
        formation: ['formation', 'sensibilisation', 'apprentissage', 'cours', 'module'],
        urgent: ['urgent', 'rapide', 'vite', 'immédiat'],
        secteur: ['secteur', 'industrie', 'domaine', 'activité'],
        sanction: ['sanction', 'amende', 'pénalité', 'condamnation'],
        app: ['application', 'plateforme', 'app', 'site', 'fonctionnement', 'comment utiliser', 'comment ça marche', 'tableau de bord', 'dashboard'],
        blog: ['blog', 'newsletter', 'article', 'actu', 'actualité', 'abonnement']
    };

    const hasKeyword = (category: keyof typeof keywords) =>
        keywords[category].some(kw => lowerMessage.includes(kw));

    // === Aide sur l'application ===
    if (hasKeyword('app')) {
        return "🧭 **Fonctionnement de Cyber Solium**\n\nVoici les étapes principales :\n1. **Créer un compte / Se connecter**\n2. **Audit NIS2** : lancez l'audit (16 mesures) pour obtenir un score\n3. **Tableau de bord** : suivez votre score, vos mesures en place et vos actions\n4. **Services** : découvrez nos offres DSI/RSSI\n5. **Formations** : choisissez un module et consultez son détail\n6. **Blog** : lisez les articles et inscrivez‑vous à la newsletter mensuelle\n\n💡 Dites‑moi ce que vous cherchez (audit, tableau de bord, formations, blog) et je vous guide étape par étape.";
    }

    if (hasKeyword('blog')) {
        return "📰 **Blog & Newsletter**\n\n• Consultez les articles dans l'onglet **Blog**\n• Chaque article s’ouvre avec son contenu complet\n• Inscription newsletter : email + consentement (envoi **mensuel**)\n\nSouhaitez‑vous recevoir les actualités par email ?";
    }

    // === NIS2 - Réponses enrichies ===
    if (hasKeyword('nis2')) {
        // Question sur la définition
        if (lowerMessage.includes('c\'est quoi') || lowerMessage.includes('qu\'est-ce') || lowerMessage.includes('définition')) {
            return "📋 **La Directive NIS2 en bref**\n\nNIS2 (Network and Information Security) est LA directive européenne de cybersécurité qui s'applique depuis octobre 2024. Elle vise à renforcer la résilience numérique des secteurs critiques en Europe.\n\n🎯 **Points clés :**\n• Obligation légale pour 18 secteurs d'activité\n• S'applique aux entreprises de +50 employés ou +10M€ de CA\n• Sanctions jusqu'à 10M€ ou 2% du CA mondial\n• Responsabilité personnelle des dirigeants\n\n💡 **Astuce :** Utilisez notre audit gratuit pour savoir si vous êtes concerné !";
        }

        // Question sur les secteurs
        if (hasKeyword('secteur') || lowerMessage.includes('concerne') || lowerMessage.includes('qui doit')) {
            return "🏢 **Secteurs concernés par NIS2**\n\n**Entités Essentielles (EE) - Haute criticité :**\n🔴 Énergie, Transports, Santé, Banque, Eau, Numérique, Télécoms, Administration, Espace\n\n**Entités Importantes (EI) - Criticité importante :**\n🟠 Services postaux, Déchets, Chimie, Agroalimentaire, Industrie, Recherche, Fournisseurs web\n\n📊 **Critères de taille :**\n• ≥50 employés OU ≥10M€ de CA\n• Certaines activités sont concernées quelle que soit la taille\n\n✅ **Mon conseil :** Faites le test d'éligibilité maintenant (3 minutes) pour connaître votre statut exact.";
        }

        // Question sur les obligations
        if (lowerMessage.includes('obligation') || lowerMessage.includes('faire') || lowerMessage.includes('mettre en place')) {
            return "✅ **Les 10 obligations NIS2 essentielles**\n\n**1. Gouvernance**\n• Analyse des risques documentée (PSSI)\n• Responsabilité du dirigeant engagée\n• Formation du conseil d'administration\n\n**2. Technique**\n• Antivirus EDR/XDR managé 24/7\n• Double authentification (MFA) obligatoire\n• Chiffrement des données sensibles\n• Sauvegardes immuables externalisées\n\n**3. Organisationnel**\n• Plan de Continuité d'Activité (PCA) testé\n• Astreinte cyber 24/7 ou SOC externalisé\n• Gestion des incidents sous 24h\n• Signalement ANSSI des incidents majeurs\n\n**4. Chaîne d'approvisionnement**\n• Audits de sécurité des fournisseurs\n• Clauses contractuelles de cybersécurité\n\n⏱️ **Vous manquez de temps ?** Nos experts peuvent tout mettre en place pour vous en 3-6 mois.";
        }

        // Question sur les sanctions
        if (hasKeyword('sanction') || lowerMessage.includes('risque') || lowerMessage.includes('pénalité')) {
            return "⚖️ **Sanctions NIS2 - Ce que vous risquez**\n\n**Amendes administratives :**\n🔴 Entités Essentielles : jusqu'à 10M€ ou 2% du CA mondial\n🟠 Entités Importantes : jusqu'à 7M€ ou 1,4% du CA mondial\n\n**Sanctions complémentaires :**\n• Responsabilité PÉNALE du dirigeant\n• Interdiction temporaire d'exercer\n• Publication des sanctions (atteinte à la réputation)\n• Suspension des activités\n\n📰 **Cas réels 2025 :**\n• Un hôpital sanctionné à 2,5M€ pour défaut de sauvegardes\n• Un fournisseur d'énergie : 8M€ pour absence de PCA\n\n🛡️ **La bonne nouvelle ?** La conformité coûte 10x moins cher qu'une amende. Commencez votre audit maintenant.";
        }

        // Question sur les délais
        if (lowerMessage.includes('délai') || lowerMessage.includes('temps') || hasKeyword('urgent')) {
            return "⏰ **Calendrier de mise en conformité NIS2**\n\n**Échéances légales :**\n✅ 17 octobre 2024 : Directive applicable\n⚠️ Janvier 2026 : Contrôles actifs en France\n🔴 Vous êtes EN RETARD si vous n'avez rien fait\n\n**Planning de mise en conformité :**\n📅 **Express (3 mois) :** Mesures critiques uniquement\n📅 **Standard (6 mois) :** Conformité complète\n📅 **Approfondi (12 mois) :** Conformité + optimisation\n\n🚨 **Agissez MAINTENANT :**\n1. Audit gratuit (15 min)\n2. Rendez-vous expert (1h)\n3. Plan d'action sur mesure\n4. Mise en œuvre accompagnée\n\n💡 Chaque mois de retard augmente votre exposition aux sanctions.";
        }

        // Réponse générique NIS2
        return "🛡️ **NIS2 - Directive de Cybersécurité Européenne**\n\nJe peux vous aider sur plusieurs aspects :\n\n🔍 **Comprendre NIS2**\n• Qui est concerné (secteurs et tailles)\n• Quelles sont les obligations\n• Quelles sanctions en cas de non-conformité\n\n✅ **Se mettre en conformité**\n• Lancer un audit (15 min)\n• Obtenir un plan d'action personnalisé\n• Délais et coûts de mise en conformité\n\n💼 **Nos solutions**\n• Gouvernance & conformité\n• SOC/EDR managé 24/7\n• Pentest & audit technique\n• Résilience & continuité\n\n❓ Quelle information vous intéresse ?";
    }

    // === RGPD - Réponses enrichies ===
    if (hasKeyword('rgpd')) {
        if (lowerMessage.includes('c\'est quoi') || lowerMessage.includes('définition')) {
            return "🔒 **Le RGPD expliqué simplement**\n\nLe RGPD (Règlement Général sur la Protection des Données) est LE texte européen qui protège les données personnelles depuis 2018.\n\n📊 **Principes clés :**\n• Consentement explicite requis\n• Droit d'accès, rectification, suppression\n• Obligation de sécuriser les données\n• Notification des violations sous 72h\n\n⚠️ **Attention :** RGPD et NIS2 sont complémentaires. Si vous traitez des données ET êtes dans un secteur critique, vous devez respecter les deux !\n\n🎯 **En pratique :** Registre des traitements, politique de confidentialité, sécurisation des bases de données.";
        }

        if (hasKeyword('sanction')) {
            return "⚖️ **Sanctions RGPD - Les chiffres qui font peur**\n\n**Amendes maximales :**\n🔴 Jusqu'à 20M€ ou 4% du CA annuel mondial\n(Le montant le plus élevé est retenu)\n\n**Records en Europe (2025) :**\n• Amazon : 746M€\n• Meta : 1,2 milliard €\n• Google : 90M€\n\n**Sanctions en France (CNIL) :**\n• Moyenne : 500K€ - 3M€ pour les grandes entreprises\n• Publication des sanctions → impact réputationnel\n\n💡 **Le coût de la conformité ?** Entre 5K€ et 50K€ selon la taille. Toujours moins qu'une amende.";
        }

        if (lowerMessage.includes('dpo') || lowerMessage.includes('délégué')) {
            return "👤 **Le DPO (Data Protection Officer)**\n\n**Obligatoire pour :**\n✅ Tous les organismes publics\n✅ Entreprises traitant des données sensibles à grande échelle\n✅ Surveillance régulière et systématique\n\n**Missions du DPO :**\n• Conseiller sur la conformité RGPD\n• Tenir le registre des traitements\n• Point de contact avec la CNIL\n• Sensibiliser les équipes\n\n💼 **Nos solutions :**\n• DPO externalisé (à partir de 500€/mois)\n• Formation DPO certifiante\n• Audit RGPD complet\n\n📞 Besoin d'un DPO ? Contactez-nous pour un devis.";
        }

        return "🔒 **RGPD - Protection des Données Personnelles**\n\nJe peux répondre à vos questions sur :\n\n📋 **Comprendre le RGPD**\n• Principes et obligations\n• Qui est concerné\n• Sanctions et risques\n\n✅ **Se mettre en conformité**\n• Registre des traitements\n• Politique de confidentialité\n• Sécurisation des données\n• Rôle du DPO\n\n🔗 **RGPD + NIS2**\n• Articulation des deux réglementations\n• Conformité globale\n\n❓ Que souhaitez-vous savoir ?";
    }

    // === Cyberattaques ===
    if (hasKeyword('cyber')) {
        return "🚨 **Cybermenaces - Ce que vous devez savoir**\n\n**Principales attaques en 2026 :**\n🔴 Ransomware : +47% vs 2025 (chiffrement + fuite de données)\n🟠 Phishing : 85% des incidents commencent par un email\n🟡 Attaques sur la supply chain : fournisseurs compromis\n\n**Impact moyen d'une cyberattaque :**\n💰 Coût direct : 200K€ - 4M€\n⏱️ Arrêt d'activité : 3-21 jours\n📉 Perte de clients : 30-60%\n⚖️ + Sanctions RGPD/NIS2\n\n**Protection efficace (ce que nous faisons) :**\n✅ EDR/XDR managé 24/7 (détection en temps réel)\n✅ Sauvegardes immuables (récupération garantie)\n✅ Formation anti-phishing (sensibilisation)\n✅ Tests d'intrusion réguliers\n✅ SOC avec astreinte\n\n🛡️ **Déjà victime ?** Contactez-nous en urgence. Réponse sous 2h.";
    }

    // === Formations ===
    if (hasKeyword('formation')) {
        return "🎓 **Formations Cybersécurité & Conformité**\n\n**Modules disponibles :**\n• NIS2 : Mise en conformité opérationnelle\n• RGPD : Les essentiels\n• Cybersécurité : Bonnes pratiques\n• Gestion des incidents\n\nChaque formation dispose d’une **page détail** (programme, livrables, prix) avec un **paiement fictif** pour la démo.\n\nSouhaitez‑vous la liste complète ou une recommandation selon votre rôle ?";
    }

    // === Audit ===
    if (hasKeyword('audit')) {
        return "🔍 **Audit de Conformité NIS2**\n\n**Notre outil d'audit gratuit :**\n⏱️ Durée : 15 minutes\n📊 Analyse : 16 mesures de sécurité\n🎯 Résultat : Score + statut (EE/EI/Hors périmètre)\n📄 Rapport : Plan d'action personnalisé\n\n**Ce que vous obtenez :**\n✅ Score de conformité (0-100%)\n✅ Identification des failles critiques\n✅ Priorisation des actions\n✅ Estimation budgétaire\n✅ Certificat téléchargeable\n\n**Étapes suivantes :**\n1️⃣ Audit gratuit en ligne\n2️⃣ RDV avec un expert (offert)\n3️⃣ Devis sur mesure\n4️⃣ Mise en conformité accompagnée\n\n🚀 **Lancez votre audit maintenant !** (Bouton en haut à droite)";
    }

    // === Prix et tarifs ===
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût') || lowerMessage.includes('combien')) {
        return "💰 **Nos Tarifs - Transparence totale**\n\n**Audit & Diagnostic :**\n🆓 Audit en ligne : GRATUIT\n🆓 Premier RDV expert : GRATUIT\n💶 Audit complet sur site : 1.500€ - 5.000€\n\n**Mise en conformité NIS2 (forfaits) :**\n📦 PME (<50 pers.) : 15K€ - 35K€\n📦 ETI (50-250 pers.) : 35K€ - 80K€\n📦 Grande entreprise : Sur devis\n\n**Services managés (mensuel) :**\n🛡️ SOC + EDR 24/7 : 800€ - 3.000€/mois\n👤 DPO externalisé : 500€ - 1.500€/mois\n📚 Formations : 150€ - 500€/pers.\n\n**🎁 Offre de lancement 2026 :**\nAudit + Plan d'action : -50% (au lieu de 3K€)\n\n📞 Devis personnalisé gratuit sous 24h.";
    }

    // === Contact ===
    if (lowerMessage.includes('contact') || lowerMessage.includes('rdv') || lowerMessage.includes('rendez-vous') || lowerMessage.includes('appel')) {
        return "📞 **Nous Contacter**\n\n**Moyens de contact :**\n📧 Email : Formulaire sur le site (réponse sous 2h)\n☎️ Urgence cyber : Disponible 24/7\n📅 Rendez-vous : Gratuit et sans engagement\n\n**Ce qui nous différencie :**\n✅ Experts certifiés (CISSP, ISO 27001)\n✅ Réponse rapide (sous 2h ouvrées)\n✅ Premier RDV toujours gratuit\n✅ Devis transparent sous 24h\n\n**Prochaines étapes :**\n1️⃣ Cliquez sur 'Contact' (menu en haut)\n2️⃣ Remplissez le formulaire (2 min)\n3️⃣ Recevez votre devis personnalisé\n\n💡 **Astuce :** Faites d'abord l'audit gratuit, vous aurez un devis plus précis ensuite !";
    }

    // === Salutations ===
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('bonsoir')) {
        return "👋 **Bonjour ! Je suis l'Assistant Cyber Solium**\n\nJe suis là pour vous guider dans votre mise en conformité NIS2 et RGPD.\n\n**Je peux vous aider sur :**\n🛡️ La directive NIS2 (obligations, secteurs, sanctions)\n🔒 Le RGPD (conformité, DPO, sanctions)\n🚨 Les cybermenaces (ransomware, phishing)\n🎓 Nos formations certifiantes\n🔍 L'audit de conformité gratuit\n💰 Les tarifs et devis\n\n**Questions fréquentes :**\n• \"Mon entreprise est-elle concernée par NIS2 ?\"\n• \"Quelles sont les obligations NIS2 ?\"\n• \"Combien coûte la mise en conformité ?\"\n• \"Comment se protéger d'un ransomware ?\"\n\n💬 Posez-moi votre question !";
    }

    // === Réponse par défaut (améliorée) ===
    return "🤖 **Je suis là pour vous aider !**\n\nJe réponds clairement à :\n\n🛡️ **NIS2** — secteurs, obligations, sanctions, délais\n🔒 **RGPD** — bases, droits, DPO, sanctions\n🚨 **Cybersécurité** — ransomware, phishing, bonnes pratiques\n🎓 **Formations** — modules, prix, livrables\n🧭 **Application** — audit, tableau de bord, blog, newsletter\n\n💡 Exemples :\n• \"Mon entreprise est-elle concernée par NIS2 ?\"\n• \"Comment fonctionne l'audit NIS2 ?\"\n• \"Quels sont les droits RGPD ?\"\n• \"Comment m'inscrire à la newsletter ?\"\n\nDites‑moi votre question et je vous guide.";
}

// Route pour générer et télécharger le certificat NIS2
app.get('/api/certificate/:auditId', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const auditId = req.params.auditId;

        // Récupérer l'audit et les infos utilisateur
        const audit: any = db.prepare(`
      SELECT * FROM audit_results WHERE id = ? AND user_id = ?
    `).get(auditId, userId);

        if (!audit) {
            return res.status(404).json({ error: 'Audit non trouvé' });
        }

        const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        // Calculer le score
        const scorePercent = Math.round((audit.readiness_score / 16) * 100);
        let niveau = 'Critique';
        let couleur = '#ef4444'; // Rouge

        if (scorePercent >= 80) {
            niveau = 'Excellent';
            couleur = '#10b981'; // Vert
        } else if (scorePercent >= 60) {
            niveau = 'Correct';
            couleur = '#f59e0b'; // Jaune
        }

        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Headers pour le téléchargement
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificat_NIS2_${user.company_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

        // Pipe le PDF vers la réponse
        doc.pipe(res);

        // === EN-TÊTE ===
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 60, 45, { width: 46, height: 46 });
        }

        doc.fontSize(28)
            .fillColor('#06b6d4')
            .text('CERTIFICAT D\'AUDIT NIS2', { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(14)
            .fillColor('#64748b')
            .text('Directive Network and Information Security', { align: 'center' })
            .moveDown(2);

        // === BORDURE DÉCORATIVE ===
        doc.rect(50, 130, 495, 620)
            .lineWidth(2)
            .strokeColor(couleur)
            .stroke();

        doc.rect(55, 135, 485, 610)
            .lineWidth(1)
            .strokeColor('#e2e8f0')
            .stroke();

        doc.moveDown(1);

        // === INFORMATIONS ENTREPRISE ===
        doc.fontSize(12)
            .fillColor('#334155')
            .text('Délivré à :', 80, 160, { continued: false })
            .moveDown(0.3);

        doc.fontSize(18)
            .fillColor('#0f172a')
            .font('Helvetica-Bold')
            .text(user.company_name, { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(11)
            .font('Helvetica')
            .fillColor('#64748b')
            .text(`Contact : ${user.email}`, { align: 'center' })
            .moveDown(2);

        // === SCORE ET NIVEAU ===
        const centerX = 300;
        const circleY = 300;
        const radius = 60;

        // Cercle de fond
        doc.circle(centerX, circleY, radius)
            .lineWidth(8)
            .strokeColor('#e2e8f0')
            .stroke();

        // Cercle de progression
        const startAngle = -90;
        const endAngle = startAngle + (360 * scorePercent / 100);
        doc.circle(centerX, circleY, radius)
            .lineWidth(8)
            .strokeColor(couleur)
            .stroke();

        // Score au centre
        doc.fontSize(32)
            .fillColor(couleur)
            .font('Helvetica-Bold')
            .text(`${scorePercent}%`, centerX - 50, circleY - 15, { width: 100, align: 'center' });

        doc.moveDown(5);

        // Badge de niveau
        doc.fontSize(16)
            .fillColor(couleur)
            .font('Helvetica-Bold')
            .text(`Niveau : ${niveau}`, { align: 'center' })
            .moveDown(1.5);

        // === DÉTAILS DE L'AUDIT ===
        doc.fontSize(12)
            .fillColor('#334155')
            .font('Helvetica')
            .text('Détails de l\'évaluation :', 80, 430)
            .moveDown(0.5);

        const detailsY = 450;
        doc.fontSize(10)
            .fillColor('#64748b')
            .text(`Secteur d'activité : ${audit.sector_name}`, 80, detailsY)
            .text(`Type d'entité : ${audit.sector_type === 'critical' ? 'Entité Essentielle (EE)' : audit.sector_type === 'important' ? 'Entité Importante (EI)' : 'Hors périmètre'}`, 80, detailsY + 20)
            .text(`Taille de l'entreprise : ${audit.company_size === 'large' ? 'Grande entreprise' : audit.company_size === 'medium' ? 'ETI' : 'PME'}`, 80, detailsY + 40)
            .text(`Mesures de sécurité en place : ${audit.readiness_score} / 16`, 80, detailsY + 60)
            .text(`Date de l'audit : ${new Date(audit.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`, 80, detailsY + 80);

        // === RECOMMANDATIONS ===
        doc.moveDown(3);
        doc.fontSize(12)
            .fillColor('#334155')
            .font('Helvetica-Bold')
            .text('Recommandations :', 80, 580);

        doc.fontSize(9)
            .fillColor('#64748b')
            .font('Helvetica');

        if (scorePercent >= 80) {
            doc.text('• Maintenir le niveau de conformité actuel', 80, 600)
                .text('• Planifier des audits de suivi réguliers', 80, 615)
                .text('• Former continuellement les équipes', 80, 630);
        } else if (scorePercent >= 60) {
            doc.text('• Identifier et corriger les failles prioritaires', 80, 600)
                .text('• Compléter les formations manquantes', 80, 615)
                .text('• Établir un plan d\'action avec échéances', 80, 630);
        } else {
            doc.text('• Réaliser un audit complet approfondi immédiatement', 80, 600)
                .text('• Contacter un expert en cybersécurité', 80, 615)
                .text('• Mettre en place un plan de remédiation urgent', 80, 630)
                .text('• Former l\'équipe de direction aux risques cyber', 80, 645);
        }

        // === PIED DE PAGE ===
        doc.fontSize(8)
            .fillColor('#94a3b8')
            .text('Ce certificat atteste de la réalisation d\'un audit de conformité NIS2 à la date indiquée.', 80, 700, { align: 'center', width: 450 })
            .text('Il ne constitue pas une certification officielle.', { align: 'center' })
            .moveDown(0.5)
            .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} par Cyber Solium`, { align: 'center' })
            .moveDown(0.3)
            .fillColor('#06b6d4')
            .text('www.cyber-solium.fr', { align: 'center', link: 'https://www.cyber-solium.fr' });

        // Finaliser le PDF
        doc.end();

    } catch (error) {
        console.error('Erreur génération certificat:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du certificat' });
    }
});

// Route pour générer le certificat de formation
app.get('/api/training-certificate/:trainingId', authenticateToken, (req: any, res) => {
    try {
        const userId = req.user.userId;
        const trainingId = req.params.trainingId;

        // Vérifier que l'utilisateur a bien complété la formation
        const progress: any = db.prepare(`
      SELECT utp.*, tm.title, tm.category, tm.duration, tm.price
      FROM user_training_progress utp
      JOIN training_modules tm ON utp.training_id = tm.id
      WHERE utp.training_id = ? AND utp.user_id = ? AND utp.payment_status = 'paid'
    `).get(trainingId, userId);

        if (!progress) {
            return res.status(404).json({ error: 'Formation non trouvée ou non payée' });
        }

        const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Headers pour le téléchargement
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificat_Formation_${progress.title.replace(/\s+/g, '_')}_${user.company_name.replace(/\s+/g, '_')}.pdf`);

        // Pipe le PDF vers la réponse
        doc.pipe(res);

        // === EN-TÊTE ===
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 60, 40, { width: 46, height: 46 });
        }

        doc.fontSize(32)
            .fillColor('#2563eb')
            .text('CERTIFICAT DE FORMATION', { align: 'center' })
            .moveDown(0.3);

        doc.fontSize(12)
            .fillColor('#64748b')
            .text('Formation Professionnelle Continue', { align: 'center' })
            .moveDown(2);

        // === BORDURE DÉCORATIVE ===
        doc.rect(50, 120, 495, 640)
            .lineWidth(3)
            .strokeColor('#2563eb')
            .stroke();

        doc.rect(55, 125, 485, 630)
            .lineWidth(1)
            .strokeColor('#e2e8f0')
            .stroke();

        // === CORPS DU CERTIFICAT ===
        doc.fontSize(16)
            .fillColor('#1e293b')
            .text('Il est certifié que', 80, 180, { align: 'center', width: 450 })
            .moveDown(1.5);

        doc.fontSize(26)
            .fillColor('#2563eb')
            .font('Helvetica-Bold')
            .text(user.company_name, { align: 'center' })
            .moveDown(0.5);

        doc.fontSize(14)
            .fillColor('#64748b')
            .font('Helvetica')
            .text(`Représentée par : ${user.email}`, { align: 'center' })
            .moveDown(2);

        doc.fontSize(16)
            .fillColor('#1e293b')
            .text('a suivi avec succès la formation', { align: 'center' })
            .moveDown(1);

        // === NOM DE LA FORMATION (encadré) ===
        doc.rect(100, doc.y, 400, 80)
            .fillColor('#eff6ff')
            .fillAndStroke('#2563eb', '#2563eb');

        doc.fontSize(20)
            .fillColor('#1e3a8a')
            .font('Helvetica-Bold')
            .text(progress.title, 110, doc.y + 25, { align: 'center', width: 380 })
            .moveDown(3);

        doc.font('Helvetica');

        // === DÉTAILS DE LA FORMATION ===
        const detailsY = doc.y + 20;

        doc.fontSize(12)
            .fillColor('#64748b')
            .text('Catégorie:', 120, detailsY, { continued: true })
            .fillColor('#1e293b')
            .text(` ${progress.category}`, { align: 'left' });

        doc.fillColor('#64748b')
            .text('Durée:', 120, detailsY + 25, { continued: true })
            .fillColor('#1e293b')
            .text(` ${progress.duration} minutes`, { align: 'left' });

        doc.fillColor('#64748b')
            .text('Date de complétion:', 120, detailsY + 50, { continued: true })
            .fillColor('#1e293b')
            .text(` ${new Date().toLocaleDateString('fr-FR')}`, { align: 'left' });

        // === SCORE (si progression > 0) ===
        if (progress.progress > 0) {
            const scoreY = detailsY + 90;
            doc.fontSize(14)
                .fillColor('#2563eb')
                .font('Helvetica-Bold')
                .text(`Progression : ${progress.progress}%`, 120, scoreY);
            doc.font('Helvetica');
        }

        // === SIGNATURE ET CACHET ===
        const signatureY = 600;

        // Ligne de signature
        doc.moveTo(350, signatureY)
            .lineTo(480, signatureY)
            .strokeColor('#94a3b8')
            .stroke();

        doc.fontSize(10)
            .fillColor('#64748b')
            .text('Directeur de Formation', 350, signatureY + 10)
            .text('Cyber Solium', 350, signatureY + 25);

        // === MENTIONS LÉGALES ===
        doc.fontSize(8)
            .fillColor('#94a3b8')
            .text('Ce certificat atteste de la participation et de la réussite à cette formation professionnelle.', 80, 680, { align: 'center', width: 450 })
            .moveDown(0.3)
            .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} par Cyber Solium`, { align: 'center' })
            .moveDown(0.2)
            .fillColor('#2563eb')
            .text('www.cyber-solium.fr', { align: 'center', link: 'https://www.cyber-solium.fr' });

        // Numéro de certificat
        const certNumber = `CERT-${trainingId}-${userId}-${Date.now().toString(36).toUpperCase()}`;
        doc.fontSize(7)
            .fillColor('#cbd5e1')
            .text(`Certificat N° ${certNumber}`, 80, 730, { align: 'center', width: 450 });

        // Finaliser le PDF
        doc.end();

    } catch (error) {
        console.error('Erreur génération certificat formation:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du certificat' });
    }
});

// === BLOG & NEWSLETTER ===
app.get('/api/blog/posts', (req, res) => {
    try {
        const posts = db.prepare(`
            SELECT id, title, excerpt, category, cover_image, created_at
            FROM blog_posts
            ORDER BY datetime(created_at) DESC, id DESC
        `).all();
        res.json(posts);
    } catch (error) {
        console.error('Erreur chargement blog:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des articles' });
    }
});

app.get('/api/blog/posts/:id', (req, res) => {
    try {
        const post = db.prepare(`
            SELECT id, title, excerpt, content, category, cover_image, created_at
            FROM blog_posts
            WHERE id = ?
        `).get(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Article introuvable' });
        }

        res.json(post);
    } catch (error) {
        console.error('Erreur chargement article:', error);
        res.status(500).json({ error: 'Erreur lors du chargement de l\'article' });
    }
});

app.post('/api/newsletter/subscribe', (req, res) => {
    try {
        const { email, frequency = 'monthly', consent = true } = req.body || {};

        if (!email) {
            return res.status(400).json({ error: 'Email requis' });
        }

        const insert = db.prepare(`
            INSERT OR IGNORE INTO newsletter_subscribers (email, frequency, consent)
            VALUES (?, ?, ?)
        `);

        insert.run(email, frequency, consent ? 1 : 0);

        res.json({ success: true, message: 'Inscription enregistrée (envoi mensuel).' });
    } catch (error) {
        console.error('Erreur inscription newsletter:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

app.get('/api/blog/external/thn', async (req, res) => {
    try {
        const response = await fetch('https://feeds.feedburner.com/TheHackersNews');
        if (!response.ok) {
            return res.status(502).json({ error: 'Flux externe indisponible' });
        }

        const xml = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const data: any = parser.parse(xml);
        const rawItems = data?.rss?.channel?.item || [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        const posts = items.slice(0, 10).map((item: any, index: number) => ({
            id: `thn-${index}-${item?.pubDate || ''}`,
            title: item?.title || 'Article The Hacker News',
            excerpt: (item?.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
            category: 'Cybersécurité',
            cover_image: item?.enclosure?.['@_url'] || null,
            created_at: item?.pubDate || new Date().toISOString(),
            external_url: item?.link || null,
            source: 'The Hacker News'
        }));

        res.json(posts);
    } catch (error) {
        console.error('Erreur chargement THN:', error);
        res.status(500).json({ error: 'Erreur lors du chargement du flux externe' });
    }
});

app.get('/api/blog/external/cyber-fr', async (req, res) => {
    try {
        const response = await fetch('https://news.google.com/rss/search?q=cybers%C3%A9curit%C3%A9&hl=fr&gl=FR&ceid=FR:fr');
        if (!response.ok) {
            return res.status(502).json({ error: 'Flux externe indisponible' });
        }

        const xml = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false });
        const data: any = parser.parse(xml);
        const rawItems = data?.rss?.channel?.item || [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        const posts = items.slice(0, 100).map((item: any, index: number) => ({
            id: `gn-fr-${index}-${item?.pubDate || ''}`,
            title: item?.title || 'Actualité cybersécurité',
            excerpt: (item?.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
            category: 'Cybersécurité',
            cover_image: item?.enclosure?.['@_url'] || null,
            created_at: item?.pubDate || new Date().toISOString(),
            external_url: item?.link || null,
            source: 'Google News (FR)'
        }));

        res.json(posts);
    } catch (error) {
        console.error('Erreur chargement cyber FR:', error);
        res.status(500).json({ error: 'Erreur lors du chargement du flux externe' });
    }
});

app.get('/api/blog/feed', async (req, res) => {
    try {
        const localPosts = db.prepare(`
            SELECT id, title, excerpt, category, cover_image, created_at
            FROM blog_posts
            ORDER BY datetime(created_at) DESC, id DESC
        `).all();

        let externalPosts: any[] = [];
        try {
            const response = await fetch('https://news.google.com/rss/search?q=cybers%C3%A9curit%C3%A9&hl=fr&gl=FR&ceid=FR:fr');
            if (response.ok) {
                const xml = await response.text();
                const parser = new XMLParser({ ignoreAttributes: false });
                const data: any = parser.parse(xml);
                const rawItems = data?.rss?.channel?.item || [];
                const items = Array.isArray(rawItems) ? rawItems : [rawItems];
                externalPosts = items.slice(0, 100).map((item: any, index: number) => ({
                    id: `gn-fr-${index}-${item?.pubDate || ''}`,
                    title: item?.title || 'Actualité cybersécurité',
                    excerpt: (item?.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
                    category: 'Cybersécurité',
                    cover_image: item?.enclosure?.['@_url'] || null,
                    created_at: item?.pubDate || new Date().toISOString(),
                    external_url: item?.link || null,
                    source: 'Google News (FR)'
                }));
            }
        } catch (error) {
            console.error('Flux externe indisponible:', error);
        }

        const combined = [...localPosts, ...externalPosts];

        if (combined.length === 0) {
            return res.json([
                {
                    id: 'fallback-1',
                    title: 'ISO 27001 : démarrer le SMSI en 5 étapes',
                    excerpt: 'Un guide rapide pour structurer votre système de management de la sécurité de l’information.',
                    category: 'Conformité',
                    cover_image: null,
                    created_at: new Date().toISOString(),
                    external_url: null,
                    source: 'Cyber Solium'
                },
                {
                    id: 'fallback-2',
                    title: 'Phishing : les erreurs qui coûtent cher',
                    excerpt: 'Comment réduire le risque humain et mettre en place des réflexes efficaces.',
                    category: 'Cybersécurité',
                    cover_image: null,
                    created_at: new Date().toISOString(),
                    external_url: null,
                    source: 'Cyber Solium'
                }
            ]);
        }

        res.json(combined.slice(0, 100));
    } catch (error) {
        console.error('Erreur chargement feed:', error);
        res.status(500).json({ error: 'Erreur lors du chargement du blog' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
