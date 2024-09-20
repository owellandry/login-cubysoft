import React from "react";

interface VerificationFormProps {
  onVerifyCode: () => void;
  loading: boolean;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  inputsRef: React.RefObject<HTMLInputElement[]>;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  onVerifyCode,
  loading,
  code,
  setCode,
  email,
  inputsRef,
}) => {
  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = code.split('');
      newCode[index] = value;
      setCode(newCode.join(''));

      if (value !== '' && inputsRef.current && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      } else if (value === '' && inputsRef.current && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (el && inputsRef.current) {
      inputsRef.current[index] = el;
    }
  };

  const isCodeComplete = code.length === 6 && !code.split('').includes('');

  return (
    <>
      <h1 className="text-3xl font-extrabold mb-6 text-center text-green-400 animate-pulse">Ingresa el código</h1>
      <p className="text-gray-400 text-center mb-4">Código enviado a {email}</p>
      <div className="flex justify-between">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={code[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-center border border-gray-700 bg-gray-900 text-white rounded-lg shadow-inner focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400 transition duration-300"
            ref={(el) => setInputRef(el, index)}
          />
        ))}
      </div>
      <button
        onClick={onVerifyCode}
        disabled={!isCodeComplete || loading}
        className={`w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
          !isCodeComplete || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Verificar Código
      </button>
    </>
  );
};

export default VerificationForm;
