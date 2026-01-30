import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle, Award, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Lesson {
    title: string;
    content: string;
}

interface Module {
    title: string;
    duration: string;
    lessons: Lesson[];
}

interface Quiz {
    question: string;
    options: string[];
    correct: number;
}

interface TrainingContentData {
    modules: Module[];
    quiz: Quiz[];
}

interface TrainingContentProps {
    trainingId: number;
    onBack?: () => void;
}

export default function TrainingContent({ trainingId, onBack }: TrainingContentProps) {
    const { token } = useAuth();
    const [training, setTraining] = useState<any>(null);
    const [contentData, setContentData] = useState<TrainingContentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    useEffect(() => {
        fetchTrainingContent();
    }, [trainingId]);

    const fetchTrainingContent = async () => {
        try {
            const response = await fetch(`/api/trainings/${trainingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTraining(data);

                if (data.content) {
                    const parsed = JSON.parse(data.content);
                    setContentData(parsed);
                    setQuizAnswers(new Array(parsed.quiz?.length || 0).fill(-1));
                }
            }
        } catch (error) {
            console.error('Error fetching training:', error);
        } finally {
            setLoading(false);
        }
    };

    const markLessonComplete = (moduleIdx: number, lessonIdx: number) => {
        const key = `${moduleIdx}-${lessonIdx}`;
        setCompletedLessons(prev => new Set([...prev, key]));
    };

    const handleNextLesson = () => {
        const currentModule = contentData?.modules[activeModule];
        if (!currentModule) return;

        markLessonComplete(activeModule, activeLesson);

        if (activeLesson < currentModule.lessons.length - 1) {
            setActiveLesson(activeLesson + 1);
        } else if (activeModule < (contentData?.modules.length || 0) - 1) {
            setActiveModule(activeModule + 1);
            setActiveLesson(0);
        } else {
            // All lessons completed, show quiz
            setShowQuiz(true);
        }
    };

    const handleQuizAnswer = (questionIdx: number, answerIdx: number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[questionIdx] = answerIdx;
        setQuizAnswers(newAnswers);
    };

    const submitQuiz = () => {
        if (!contentData?.quiz) return;

        let correct = 0;
        contentData.quiz.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correct) {
                correct++;
            }
        });

        setQuizScore(Math.round((correct / contentData.quiz.length) * 100));
        setQuizSubmitted(true);
    };

    const downloadCertificate = async () => {
        try {
            const response = await fetch(`/api/training-certificate/${trainingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificat-formation-${training.title.replace(/\s+/g, '-')}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error downloading certificate:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la formation...</p>
                </div>
            </div>
        );
    }

    if (!training || !contentData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Formation introuvable</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const currentModule = contentData.modules[activeModule];
    const currentLesson = currentModule?.lessons[activeLesson];
    const totalLessons = contentData.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedCount = completedLessons.size;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => onBack?.()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{training.title}</h1>
                                <p className="text-sm text-gray-600">{training.category} • {training.duration} min</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Progression</p>
                                <p className="text-lg font-bold text-blue-600">{progressPercent}%</p>
                            </div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Modules */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                Modules
                            </h2>
                            <div className="space-y-2">
                                {contentData.modules.map((module, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() => {
                                                setActiveModule(idx);
                                                setActiveLesson(0);
                                                setShowQuiz(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${activeModule === idx && !showQuiz
                                                ? 'bg-blue-50 border-2 border-blue-600'
                                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-900">{module.title}</p>
                                                    <div className="flex items-center text-xs text-gray-600 mt-1">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                                {module.lessons.every((_, lessonIdx) =>
                                                    completedLessons.has(`${idx}-${lessonIdx}`)
                                                ) && (
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                                                    )}
                                            </div>
                                        </button>
                                    </div>
                                ))}
                                {contentData.quiz && contentData.quiz.length > 0 && (
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${showQuiz
                                            ? 'bg-blue-50 border-2 border-blue-600'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">Quiz Final</p>
                                                <p className="text-xs text-gray-600 mt-1">{contentData.quiz.length} questions</p>
                                            </div>
                                            {quizSubmitted && (
                                                <Award className="w-5 h-5 text-yellow-600" />
                                            )}
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {!showQuiz ? (
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <div className="mb-6">
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                            Module {activeModule + 1} / {contentData.modules.length}
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span>Leçon {activeLesson + 1} / {currentModule.lessons.length}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                        {currentLesson.content.split('\n').map((line, idx) => {
                                            if (line.startsWith('**') && line.endsWith('**')) {
                                                return (
                                                    <h3 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                                                        {line.replace(/\*\*/g, '')}
                                                    </h3>
                                                );
                                            } else if (line.startsWith('###')) {
                                                return (
                                                    <h4 key={idx} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                                                        {line.replace(/###/g, '')}
                                                    </h4>
                                                );
                                            } else if (line.startsWith('- ')) {
                                                return (
                                                    <li key={idx} className="ml-6 mb-1">
                                                        {line.substring(2)}
                                                    </li>
                                                );
                                            } else if (line.trim() === '') {
                                                return <br key={idx} />;
                                            } else {
                                                return <p key={idx} className="mb-3">{line}</p>;
                                            }
                                        })}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                                    <button
                                        onClick={() => {
                                            if (activeLesson > 0) {
                                                setActiveLesson(activeLesson - 1);
                                            } else if (activeModule > 0) {
                                                setActiveModule(activeModule - 1);
                                                setActiveLesson(contentData.modules[activeModule - 1].lessons.length - 1);
                                            }
                                        }}
                                        disabled={activeModule === 0 && activeLesson === 0}
                                        className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Précédent
                                    </button>

                                    <button
                                        onClick={handleNextLesson}
                                        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                                    >
                                        {activeLesson === currentModule.lessons.length - 1 &&
                                            activeModule === contentData.modules.length - 1 ? (
                                            <>
                                                Passer au Quiz
                                                <Award className="w-5 h-5 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                Suivant
                                                <PlayCircle className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Quiz Section */
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <div className="text-center mb-8">
                                    <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Final</h2>
                                    <p className="text-gray-600">Testez vos connaissances</p>
                                </div>

                                {!quizSubmitted ? (
                                    <div className="space-y-6">
                                        {contentData.quiz.map((question, qIdx) => (
                                            <div key={qIdx} className="border border-gray-200 rounded-lg p-6">
                                                <h3 className="font-semibold text-gray-900 mb-4">
                                                    Question {qIdx + 1}: {question.question}
                                                </h3>
                                                <div className="space-y-2">
                                                    {question.options.map((option, oIdx) => (
                                                        <label
                                                            key={oIdx}
                                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${quizAnswers[qIdx] === oIdx
                                                                ? 'border-blue-600 bg-blue-50'
                                                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`question-${qIdx}`}
                                                                checked={quizAnswers[qIdx] === oIdx}
                                                                onChange={() => handleQuizAnswer(qIdx, oIdx)}
                                                                className="w-4 h-4 text-blue-600"
                                                            />
                                                            <span className="ml-3 text-gray-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={submitQuiz}
                                            disabled={quizAnswers.includes(-1)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Valider mes réponses
                                        </button>
                                    </div>
                                ) : (
                                    /* Quiz Results */
                                    <div className="text-center">
                                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${quizScore >= 80 ? 'bg-green-100' : quizScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                                            }`}>
                                            <span className={`text-5xl font-bold ${quizScore >= 80 ? 'text-green-600' : quizScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {quizScore}%
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {quizScore >= 80 ? 'Excellent !' : quizScore >= 60 ? 'Bien joué !' : 'À revoir'}
                                        </h3>
                                        <p className="text-gray-600 mb-8">
                                            {quizScore >= 80
                                                ? 'Vous maîtrisez parfaitement le sujet !'
                                                : quizScore >= 60
                                                    ? 'Vous avez une bonne compréhension, continuez !'
                                                    : 'Nous vous conseillons de revoir le contenu.'}
                                        </p>

                                        {quizScore >= 60 && (
                                            <button
                                                onClick={downloadCertificate}
                                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                                            >
                                                <Download className="w-6 h-6 mr-3" />
                                                Télécharger mon certificat
                                            </button>
                                        )}

                                        <div className="mt-6">
                                            <button
                                                onClick={() => {
                                                    setQuizSubmitted(false);
                                                    setQuizAnswers(new Array(contentData.quiz.length).fill(-1));
                                                    setQuizScore(0);
                                                }}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Refaire le quiz
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
