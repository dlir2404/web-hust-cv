'use client'
import React, { useState,FormEvent } from 'react';
import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import http from "@/app/utils/http";
import { message } from 'antd';
import {Form} from "react-bootstrap";

// Define the ForgetPassword component
const ForgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState(true);

    const handleEmailBlur = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        const isValid = emailRegex.test(email);
        setIsEmailValid(isValid);
    };

        const handleEmailSubmit = async () => {
        try {
            if (!email) {
                setError('Vui lòng nhập email');
                return;
            }else{
                setError('');
            }
            setLoading(true);
            const response = await http.axiosClient.post('/api/auth/forgotPassword', { email });
            console.log(response.data?.statusCode);
            if (response.data?.statusCode === 200) {
                setLoading(false);
                message.success('Mã xác nhận đã được gửi đến email của bạn')
                sessionStorage.setItem('email', email);
                setError('');
                setStep(2);
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 401){
                setLoading(false);
                message.error('Email không tồn tại');
            }
            // @ts-ignore
            else if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Email không tồn tại');
            } else {
                setLoading(false);
                setError('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (newPassword !== confirmNewPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
    }
    // Function to handle verification code submission
    const handleVerificationCodeSubmit = async () => {
        try {
            if (!verificationCode) {
                setError('Vui lòng nhập mã xác nhận');
                return;
            }else{
                setError('');
            }
            setLoading(true);
            let email = sessionStorage.getItem('email');
            const response = await http.axiosClient.post('/api/auth/checkCode', { email,verificationCode });
            console.log(response.data?.statusCode )
            if (response.data?.statusCode === 200) {
                message.success('Mã xác nhận chính xác bạn có thể đặt lại mật khẩu')
                setError('');
                setStep(3);
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Mã xác nhận không chính xác');
            } else {
                setLoading(false);
                setError('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };


    // Function to handle password submission
    const handlePasswordSubmit = async () => {
        try {
            if (!newPassword||!confirmNewPassword) {
                setError('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if(newPassword === confirmNewPassword){
                setError('');
            }else{
                setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }
            setLoading(true);
            let email = sessionStorage.getItem('email');
            const response = await http.axiosClient.put('/api/auth/resetPassword', {email, newPassword });
            if (response.data?.statusCode === 200) {
                sessionStorage.clear();
                message.success('Đặt lại mật khẩu thành công')
                setError('');
                router.push('/login');
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Mật khẩu tối thiểu 8 ký tự');
            } else {
                setLoading(false);
                setError('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };
    const handleLogin = () => {
        router.push('/login');
    };

    // JSX structure for the ForgetPassword component
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '100%' }}>
                {step === 1 && (
                    <>
                        <label>
                            Địa chỉ email:
                            <Input
                                type="text"
                                value={email}
                                placeholder="Nhập email"
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleEmailBlur}
                            />
                            {!isEmailValid && <p style={{ color: 'red' }}>Email không hợp lệ.</p>}
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <Button
                                type="primary"
                                onClick={handleEmailSubmit}
                                loading={loading}
                                style={{ backgroundColor: '#FF0000', borderColor: '#ff0000' }}
                            >
                                {loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <Button
                                    type="primary"
                                    onClick={handleLogin}
                                    style={{ backgroundColor: 'blue', borderColor: '#blue' }}
                                >
                                    Huỷ
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label>
                            Mã xác nhận:
                            <Input
                                type="text"
                                value={verificationCode}
                                placeholder="Nhập mã xác nhận"
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <Button
                                type="primary"
                                onClick={handleVerificationCodeSubmit}
                                loading={loading}
                                style={{ backgroundColor: '#FF0000', borderColor: '#ff0000' }}
                            >
                                {loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <Button
                                    type="primary"
                                    onClick={handleLogin}
                                    style={{ backgroundColor: 'blue', borderColor: '#blue' }}
                                >
                                    Huỷ
                                </Button>
                            </div>
                        </div>

                    </>
                )}

                {step === 3 && (
                    <>
                        <label>
                            Mật khẩu mới:
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                placeholder="New password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            Nhập lại mật khẩu mới:
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmNewPassword}
                                placeholder="Confirm new password"
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </label>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label=" Hiển thị mật khẩu"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)} />
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <Button
                                type="primary"
                                onClick={handlePasswordSubmit}
                                loading={loading}
                                style={{backgroundColor: '#FF0000', borderColor: '#ff0000'}}
                            >

                                { loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                                <Button
                                    type="primary"
                                    onClick={handleLogin}
                                    style={{backgroundColor: 'blue', borderColor: '#blue'}}
                                >
                                    Huỷ
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};

// Export the ForgetPassword component
export default ForgetPassword;
