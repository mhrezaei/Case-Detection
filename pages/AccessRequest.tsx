
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Send, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const AccessRequest: React.FC = () => {
  const { state, dispatch } = useApp();
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SUBMIT_ACCESS_REQUEST', payload: { description } });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">عدم دسترسی</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            شماره موبایل <span className="font-mono font-bold mx-1 text-gray-800 dark:text-gray-200">{state.user?.mobile}</span> در لیست کاربران مجاز سامانه یافت نشد.
            اگر از کادر درمان هستید، لطفاً درخواست خود را ارسال کنید.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">توضیحات (سمت، محل خدمت و دلیل درخواست)</label>
              <textarea
                required
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="مثال: سوپروایزر بخش ICU بیمارستان نمازی..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2"
            >
              {isLoading ? 'در حال ارسال...' : <><Send size={18} /> ارسال درخواست عضویت</>}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            <button onClick={() => dispatch({ type: 'LOGOUT' })} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center gap-1 mx-auto">
              <ArrowRight size={14} /> بازگشت به صفحه ورود
            </button>
          </div>
        </div>
      </div>
      <Footer className="w-full" />
    </div>
  );
};

export default AccessRequest;
