import React, { useState } from 'react';
import { CreditCard, Lock, X } from 'lucide-react';

interface PaymentModalProps {
    trainingTitle: string;
    trainingPrice: number;
    onClose: () => void;
    onConfirm: (paymentData: PaymentData) => void;
}

export interface PaymentData {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}

export default function PaymentModal({ trainingTitle, trainingPrice, onClose, onConfirm }: PaymentModalProps) {
    const [paymentData, setPaymentData] = useState<PaymentData>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g);
        return chunks ? chunks.join(' ') : cleaned;
    };

    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const handleInputChange = (field: keyof PaymentData, value: string) => {
        let formattedValue = value;

        if (field === 'cardNumber') {
            formattedValue = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
        } else if (field === 'expiryDate') {
            formattedValue = formatExpiryDate(value.slice(0, 5));
        } else if (field === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setPaymentData(prev => ({ ...prev, [field]: formattedValue }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres requis)';
        }

        if (!paymentData.cardHolder.trim()) {
            newErrors.cardHolder = 'Nom du titulaire requis';
        }

        const expiryParts = paymentData.expiryDate.split('/');
        if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
            newErrors.expiryDate = 'Date invalide (MM/AA)';
        } else {
            const month = parseInt(expiryParts[0]);
            const year = parseInt('20' + expiryParts[1]);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            if (month < 1 || month > 12) {
                newErrors.expiryDate = 'Mois invalide (01-12)';
            } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiryDate = 'Carte expirée';
            }
        }

        if (paymentData.cvv.length !== 3) {
            newErrors.cvv = 'CVV invalide (3 chiffres)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setProcessing(true);

        // Simulation du traitement de paiement (2 secondes)
        setTimeout(() => {
            setProcessing(false);
            onConfirm(paymentData);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-lg relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Paiement sécurisé</h2>
                            <p className="text-blue-100 text-sm mt-1">Transaction protégée SSL</p>
                        </div>
                    </div>
                </div>

                {/* Formation Info */}
                <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-600">Formation</p>
                            <p className="font-semibold text-gray-900">{trainingTitle}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Montant</p>
                            <p className="text-2xl font-bold text-blue-600">{trainingPrice}€</p>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Card Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numéro de carte
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={paymentData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                    </div>

                    {/* Card Holder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titulaire de la carte
                        </label>
                        <input
                            type="text"
                            value={paymentData.cardHolder}
                            onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
                            placeholder="JEAN DUPONT"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.cardHolder && (
                            <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
                        )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date d'expiration
                            </label>
                            <input
                                type="text"
                                value={paymentData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                placeholder="MM/AA"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={paymentData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                    placeholder="123"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            </div>
                            {errors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                            )}
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                        <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-blue-900 font-medium">Paiement 100% sécurisé</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Vos informations bancaires sont cryptées et ne sont jamais stockées sur nos serveurs.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            disabled={processing}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Traitement...</span>
                                </div>
                            ) : (
                                `Payer ${trainingPrice}€`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
