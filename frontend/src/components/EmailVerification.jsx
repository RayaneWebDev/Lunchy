import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { IoMdClose } from "react-icons/io";
import SummaryApi from '../common/index';

const EmailVerification = ({ setShowEmailVerif, setShowResetPwd }) => {
    const [timerCount, setTimer] = useState(60);
    const [disable, setDisable] = useState(true);
    const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (disable && timerCount > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else {
            setDisable(false);
        }
        return () => clearInterval(interval);
    }, [disable, timerCount]);

    const resendOTP = async () => {
        setDisable(true);
        setTimer(60);

        try {
            const response = await fetch(SummaryApi.sendOtp.url, {
                method: SummaryApi.sendOtp.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email : localStorage.getItem("email")}),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Un nouveau code a été envoyé !");
                localStorage.setItem("otpToken", data.otpToken);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Erreur lors de l'envoi du nouvel OTP");
        }
    };

    const verifyOTP = async () => {
        const otpCode = OTPinput.join("");
        const otpToken = localStorage.getItem("otpToken");

        if (otpCode.length !== 4) {
            toast.error("Veuillez entrer un OTP valide");
            return;
        }

        try {
            const response = await fetch(SummaryApi.otpVerification.url, {
                method: SummaryApi.otpVerification.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otpToken, otp: otpCode }),
            });

            const data = await response.json();
            if (data.success) {
              setShowEmailVerif(false);
              setShowResetPwd(true);
              toast.success("Code validé avec succès !");
              localStorage.removeItem("otpToken");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Erreur lors de la vérification de l'OTP");
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // Accepter uniquement les chiffres

        const newOTP = [...OTPinput];
        newOTP[index] = value;
        setOTPinput(newOTP);

        if (value !== "" && index < 3) {
            inputRefs.current[index + 1].focus(); // Passer au champ suivant
        }
    };

   



    return (
        <div className="login-popup">
            <div className="login-popup-container w-[330px] bg-white flex flex-col gap-[25px] px-6 py-[25px] md:px-[30px] rounded-[8px] text-[14px]">
                <div className="login-popup-title flex justify-between items-center text-black">
                    <h2 className="font-bold text-[18px]">Vérification de votre email</h2>
                    <IoMdClose onClick={() => setShowEmailVerif(false)} className="cursor-pointer" size={20} />
                </div>
                <p className='text-gray-500 text-xs'>Vérifiez votre boite email</p>


                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {OTPinput.map((_, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            maxLength="1"
                            className="w-16 h-16 flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                            type="text"
                            value={OTPinput[index]}
                            onChange={(e) => handleChange(e, index)}
                        />
                    ))}
                </div>

                <div className="flex flex-col space-y-5">
                    <div>
                        <button
                            onClick={verifyOTP}
                            className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-primary hover:bg-primary-hover border-none text-white text-sm shadow-sm"
                        >
                            Vérifier votre compte
                        </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-[12px] font-medium space-x-1 text-gray-500">
                        <p>Vous n'avez pas reçu le code ?</p>
                        <button
                            className="flex flex-row items-center"
                            style={{
                                color: disable ? "gray" : "blue",
                                cursor: disable ? "none" : "pointer",
                                textDecorationLine: disable ? "none" : "underline",
                            }}
                            onClick={!disable ? resendOTP : undefined}
                            disabled={disable}
                        >
                            {disable ? `Renvoyez dans ${timerCount}s` : "Renvoyer le code"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EmailVerification;
