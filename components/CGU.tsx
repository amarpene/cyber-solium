import React from 'react';
import { FileText, Scale, Shield } from 'lucide-react';

export const CGU: React.FC = () => {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                        <Scale className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Conditions Générales d'Utilisation
                    </h1>
                    <p className="text-slate-400">
                        Dernière mise à jour : 28 janvier 2026
                    </p>
                </div>

                <div className="glass-panel rounded-2xl p-8 md:p-12 border border-slate-700/50 space-y-8">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-400" />
                            1. Objet
                        </h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et l'utilisation de la plateforme Cyber Solium (ci-après "la Plateforme"), éditée par Cyber Solium SAS, société par actions simplifiée au capital de 50 000 euros, immatriculée au RCS de Paris sous le numéro 123 456 789.
                            </p>
                            <p>
                                La Plateforme propose des services de conseil en cybersécurité, des outils d'audit de conformité NIS2 et RGPD, ainsi que des formations professionnelles en sécurité informatique destinés aux entreprises (ci-après "les Services").
                            </p>
                            <p>
                                L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU par l'Utilisateur.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Définitions</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p><strong className="text-white">Plateforme :</strong> désigne le site web accessible à l'adresse cyber-solution.fr et l'ensemble des services proposés.</p>
                            <p><strong className="text-white">Utilisateur :</strong> désigne toute personne physique agissant pour le compte d'une personne morale (entreprise, association, administration) qui accède et utilise la Plateforme.</p>
                            <p><strong className="text-white">Client :</strong> désigne l'Utilisateur ayant souscrit à des Services payants.</p>
                            <p><strong className="text-white">Compte :</strong> désigne l'espace personnel sécurisé permettant à l'Utilisateur d'accéder aux Services.</p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Inscription et Compte Utilisateur</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <h3 className="text-xl font-semibold text-white mt-4">3.1 Création du Compte</h3>
                            <p>
                                L'accès aux Services nécessite la création d'un Compte. L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour. Toute information erronée ou frauduleuse pourra entraîner la suspension ou la suppression du Compte.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">3.2 Identifiants</h3>
                            <p>
                                L'Utilisateur est seul responsable de la confidentialité de ses identifiants (email et mot de passe). Toute utilisation du Compte est réputée avoir été effectuée par l'Utilisateur. En cas de perte ou de vol des identifiants, l'Utilisateur doit immédiatement en informer Cyber Solium.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">3.3 Utilisation Professionnelle</h3>
                            <p>
                                La Plateforme est exclusivement destinée à un usage professionnel. L'Utilisateur garantit agir au nom et pour le compte d'une personne morale légalement constituée.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-400" />
                            4. Services Proposés
                        </h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <h3 className="text-xl font-semibold text-white mt-4">4.1 Services Gratuits</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Outil d'audit de pré-diagnostic NIS2</li>
                                <li>Chatbot d'assistance technique</li>
                                <li>Documentation et ressources informatives</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mt-4">4.2 Services Payants</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Formations professionnelles certifiantes (NIS2, RGPD, Cybersécurité)</li>
                                <li>Audits de conformité approfondis</li>
                                <li>Services de conseil personnalisés</li>
                                <li>Accompagnement à la mise en conformité</li>
                            </ul>

                            <p className="mt-4">
                                Les tarifs des Services payants sont indiqués en euros TTC et peuvent être modifiés à tout moment. Les prix applicables sont ceux en vigueur au moment de la commande.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Commande et Paiement</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <h3 className="text-xl font-semibold text-white mt-4">5.1 Processus de Commande</h3>
                            <p>
                                La commande d'un Service payant s'effectue en ligne via la Plateforme. L'Utilisateur sélectionne le Service souhaité, vérifie les informations de commande et procède au paiement.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">5.2 Modes de Paiement</h3>
                            <p>
                                Les paiements sont acceptés par carte bancaire (Visa, Mastercard, American Express). Les transactions sont sécurisées et cryptées. Aucune information bancaire n'est conservée sur nos serveurs.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">5.3 Confirmation</h3>
                            <p>
                                Une confirmation de commande est envoyée par email à l'Utilisateur. L'accès au Service payant est immédiat après validation du paiement.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">5.4 Facturation</h3>
                            <p>
                                Une facture conforme à la réglementation en vigueur est adressée à l'Utilisateur par email. Les factures sont également disponibles dans l'espace personnel.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Droit de Rétractation</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Conformément aux articles L221-18 et suivants du Code de la consommation, pour les professionnels bénéficiant de la protection consumériste, l'Utilisateur dispose d'un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sauf pour les formations dont l'exécution a commencé avec l'accord exprès de l'Utilisateur.
                            </p>
                            <p>
                                Pour exercer ce droit, l'Utilisateur doit notifier Cyber Solium par email à contact@cyber-solution.fr en indiquant clairement sa décision de se rétracter.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Propriété Intellectuelle</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                L'ensemble du contenu de la Plateforme (textes, images, vidéos, logos, bases de données, code source, etc.) est la propriété exclusive de Cyber Solium ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
                            </p>
                            <p>
                                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments de la Plateforme, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Cyber Solium.
                            </p>
                            <p>
                                L'Utilisateur dispose d'un droit d'usage strictement personnel et non exclusif sur les contenus des formations auxquelles il a souscrit. Ce droit ne peut être cédé ou transféré à des tiers.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Protection des Données Personnelles</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Cyber Solium s'engage à protéger les données personnelles de ses Utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">8.1 Données Collectées</h3>
                            <p>Les données collectées incluent :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Informations d'identification (nom, prénom, email)</li>
                                <li>Informations sur l'entreprise (raison sociale, secteur d'activité)</li>
                                <li>Données de navigation (logs, cookies)</li>
                                <li>Résultats des audits et progressions dans les formations</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mt-4">8.2 Finalités</h3>
                            <p>Les données sont utilisées pour :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>La gestion des Comptes et l'accès aux Services</li>
                                <li>La personnalisation de l'expérience utilisateur</li>
                                <li>L'envoi de communications relatives aux Services</li>
                                <li>L'amélioration de la Plateforme</li>
                                <li>Le respect des obligations légales et réglementaires</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mt-4">8.3 Droits des Utilisateurs</h3>
                            <p>
                                Conformément au RGPD, l'Utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition sur ses données personnelles. Pour exercer ces droits : dpo@cyber-solution.fr
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">8.4 Conservation</h3>
                            <p>
                                Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées, et conformément aux obligations légales (minimum 3 ans pour les données comptables).
                            </p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Obligations de l'Utilisateur</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>L'Utilisateur s'engage à :</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Utiliser la Plateforme conformément à sa destination et de manière loyale</li>
                                <li>Ne pas porter atteinte aux droits de Cyber Solium ou de tiers</li>
                                <li>Ne pas diffuser de contenus illicites, offensants ou contraires aux bonnes mœurs</li>
                                <li>Ne pas tenter d'accéder de manière non autorisée à la Plateforme ou à ses systèmes</li>
                                <li>Ne pas utiliser de robots, scripts ou outils automatisés pour accéder à la Plateforme</li>
                                <li>Ne pas copier, reproduire ou distribuer les contenus protégés</li>
                                <li>Maintenir la confidentialité de ses identifiants</li>
                            </ul>
                            <p className="mt-4">
                                Toute violation de ces obligations pourra entraîner la suspension ou la résiliation immédiate du Compte, sans préjudice des dommages et intérêts que pourrait réclamer Cyber Solium.
                            </p>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Responsabilité</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <h3 className="text-xl font-semibold text-white mt-4">10.1 Disponibilité</h3>
                            <p>
                                Cyber Solium s'efforce d'assurer l'accessibilité de la Plateforme 24h/24 et 7j/7, mais ne peut garantir une disponibilité absolue. La Plateforme pourra être temporairement inaccessible pour des raisons de maintenance, de mise à jour ou de force majeure.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">10.2 Limitation de Responsabilité</h3>
                            <p>
                                Les Services fournis par Cyber Solium constituent des outils d'aide à la décision et de formation. Ils ne se substituent pas à un conseil juridique ou à un audit de sécurité complet réalisé par un expert certifié.
                            </p>
                            <p>
                                Cyber Solium ne pourra être tenu responsable :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme</li>
                                <li>Des décisions prises par l'Utilisateur sur la base des informations fournies</li>
                                <li>Des dommages résultant d'une utilisation non conforme aux CGU</li>
                                <li>De l'utilisation frauduleuse du Compte par un tiers</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-white mt-4">10.3 Garanties</h3>
                            <p>
                                Les informations fournies sur la Plateforme le sont à titre indicatif. Cyber Solium met tout en œuvre pour fournir des informations précises et à jour, mais ne peut garantir l'exactitude, la complétude ou l'actualité des contenus.
                            </p>
                        </div>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Résiliation</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <h3 className="text-xl font-semibold text-white mt-4">11.1 Par l'Utilisateur</h3>
                            <p>
                                L'Utilisateur peut à tout moment supprimer son Compte en adressant une demande à contact@cyber-solution.fr. La suppression entraîne la perte définitive de l'accès aux Services et aux données associées.
                            </p>

                            <h3 className="text-xl font-semibold text-white mt-4">11.2 Par Cyber Solium</h3>
                            <p>
                                Cyber Solium se réserve le droit de suspendre ou de résilier le Compte d'un Utilisateur en cas de :
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Violation des présentes CGU</li>
                                <li>Utilisation frauduleuse de la Plateforme</li>
                                <li>Non-paiement des Services commandés</li>
                                <li>Inactivité prolongée du Compte (plus de 2 ans)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Modifications des CGU</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Cyber Solium se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la Plateforme. L'Utilisateur est invité à consulter régulièrement les CGU.
                            </p>
                            <p>
                                En cas de modification substantielle, Cyber Solium informera les Utilisateurs par email. La poursuite de l'utilisation de la Plateforme après notification vaut acceptation des nouvelles CGU.
                            </p>
                        </div>
                    </section>

                    {/* Section 13 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">13. Droit Applicable et Juridiction</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                Les présentes CGU sont régies par le droit français.
                            </p>
                            <p>
                                En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'efforceront de trouver une solution amiable. À défaut, le litige sera porté devant les tribunaux compétents de Paris.
                            </p>
                            <p>
                                Conformément à l'article L612-1 du Code de la consommation, pour les professionnels bénéficiant de la protection consumériste, il est rappelé que l'Utilisateur a la possibilité de recourir gratuitement à un médiateur de la consommation en cas de litige : Médiateur de la Consommation - mediateur@cyber-solution.fr
                            </p>
                        </div>
                    </section>

                    {/* Section 14 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
                        <div className="text-slate-300 space-y-3 leading-relaxed">
                            <p>Pour toute question relative aux présentes CGU ou à l'utilisation de la Plateforme :</p>
                            <div className="bg-slate-800/50 p-6 rounded-lg mt-4 space-y-2">
                                <p><strong className="text-white">Cyber Solium SAS</strong></p>
                                <p>Siège social : 123 Avenue de la Cybersécurité, 75001 Paris, France</p>
                                <p>RCS Paris : 123 456 789</p>
                                <p>Capital social : 50 000 €</p>
                                <p>Email : <a href="mailto:contact@cyber-solution.fr" className="text-blue-400 hover:underline">contact@cyber-solution.fr</a></p>
                                <p>Téléphone : +33 1 23 45 67 89</p>
                                <p>DPO : <a href="mailto:dpo@cyber-solution.fr" className="text-blue-400 hover:underline">dpo@cyber-solution.fr</a></p>
                            </div>
                        </div>
                    </section>

                    {/* Acceptation */}
                    <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-slate-300 text-center">
                            <strong className="text-white">L'utilisation de la Plateforme Cyber Solium implique l'acceptation pleine et entière des présentes Conditions Générales d'Utilisation.</strong>
                        </p>
                        <p className="text-slate-400 text-center mt-2 text-sm">
                            Date d'entrée en vigueur : 28 janvier 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
