
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Stethoscope, ArrowLeft, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';

// Helper to convert Persian/Arabic digits to English
const toEnglishDigits = (str: string) => {
  return str
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

const Login: React.FC = () => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  // OTP State as array of 5 strings
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { dispatch, state } = useApp();
  const navigate = useNavigate();

  // --- Mobile Input Logic ---
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = toEnglishDigits(e.target.value);
    // Allow only digits
    if (/^\d*$/.test(val)) {
      setMobile(val);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 11) {
      setError('شماره موبایل باید ۱۱ رقم باشد');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await api.auth.requestOtp(mobile, state.networkDelay);
      setStep('otp');
      // Reset OTP state when switching steps
      setOtp(new Array(5).fill(''));
    } catch (err) {
      setError('خطا در برقراری ارتباط');
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP Input Logic ---
  
  const submitOtp = async (code: string) => {
    if (code.length !== 5) {
      setError('کد تایید باید ۵ رقم باشد');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const user = await api.auth.verifyOtp(code, state.networkDelay);
      dispatch({ type: 'LOGIN', payload: user });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
      // Clear inputs on error for better UX, or keep them? Let's keep them but focus first
      // setOtp(new Array(5).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    await submitOtp(code);
  };

  const handleOtpChange = (index: number, value: string) => {
    const val = toEnglishDigits(value);
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    // Take the last character if user somehow types multiple chars in one box
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Move focus to next input if value is entered
    if (val && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all filled to submit automatically
    const fullCode = newOtp.join('');
    if (fullCode.length === 5 && index === 4 && val) {
      submitOtp(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to previous input on Backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleanData = toEnglishDigits(pastedData).replace(/\D/g, '').slice(0, 5);

    if (cleanData) {
      const newOtp = [...otp];
      for (let i = 0; i < cleanData.length; i++) {
        newOtp[i] = cleanData[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty box or the last one
      const nextIndex = Math.min(cleanData.length, 4);
      inputRefs.current[nextIndex]?.focus();

      if (cleanData.length === 5) {
        submitOtp(cleanData);
      }
    }
  };

  // Auto focus first OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="bg-primary-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Stethoscope className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">سامانه اهدای عضو</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">شناسایی و مدیریت هوشمند کیس‌های اهدای عضو</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">ورود به حساب کاربری</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">شماره موبایل</label>
                <input
                  type="tel"
                  placeholder="09xxxxxxxxx"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-left ltr font-mono text-lg"
                  value={mobile}
                  onChange={handleMobileChange}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'ارسال کد تایید'}
              </button>
              
              {state.appMode === 'development' && (
                 <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                    <strong>Dev Hint:</strong> Use any number.
                 </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
               <button 
                type="button" 
                onClick={() => setStep('mobile')}
                className="text-gray-500 text-sm flex items-center gap-1 mb-2 hover:text-gray-800 dark:hover:text-gray-300"
               >
                 <ArrowLeft size={14} /> بازگشت
               </button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">کد تایید را وارد کنید</h2>
              <p className="text-sm text-gray-500 mb-4">کد ارسال شده به {mobile}</p>
              
              {/* Split OTP Inputs */}
              <div className="flex justify-between gap-2" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="tel"
                    maxLength={1}
                    className="w-12 h-14 sm:w-14 sm:h-16 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-2xl font-bold dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 mt-6"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'تایید و ورود'}
              </button>
              
               {state.appMode === 'development' && (
                 <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200 space-y-1">
                    <p><strong>Active:</strong> 12345</p>
                    <p><strong>Pending:</strong> 11111</p>
                    <p><strong>Unregistered:</strong> 00000</p>
                 </div>
              )}
            </form>
          )}
        </div>
      </div>
      
      <Footer className="w-full" />
    </div>
  );
};

export default Login;
