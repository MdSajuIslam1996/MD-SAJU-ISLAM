
import { useState, useEffect, useRef } from 'react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const recognitionRef = useRef<any | null>(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError('আপনার ব্রাউজার স্পিচ রিকগনিশন সমর্থন করে না।');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'bn-BD'; // Bengali (Bangladesh)
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            let errorMessage = 'একটি অজানা ত্রুটি ঘটেছে।';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'কোনো কথা শোনা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
                    break;
                case 'audio-capture':
                    errorMessage = 'মাইক্রোফোন চালু করা যায়নি। অনুমতি দেওয়া আছে কিনা তা পরীক্ষা করুন।';
                    break;
                case 'not-allowed':
                    errorMessage = 'মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে ব্রাউজার সেটিংসে অনুমতি দিন।';
                    break;
                case 'network':
                    errorMessage = 'নেটওয়ার্ক সমস্যা। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।';
                    break;
            }
            setError(errorMessage);
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const fullTranscript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');
            setTranscript(fullTranscript);
        };
        
        recognitionRef.current = recognition;

    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript(''); // Clear previous transcript
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
    };
};
