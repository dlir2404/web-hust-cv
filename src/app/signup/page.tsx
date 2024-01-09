'use client';

import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import http from "@/app/utils/http";
import { message } from 'antd';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [isEmployerOption, setIsEmployerOption] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessWebsite, setBusinessWebsite] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'update';
    const router = useRouter();
    const openMessageSuccess = (text:string) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type:'success',
                content: text,
                duration: 2,
            });
        }, 500);
    };
    const openMessageError = (text:string) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type:'error',
                content: text,
                duration: 2,
            });
        }, 500);
    };

    const handleIsEmployerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEmployerOption(event.target.checked);
    };

    const isEmailValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailBlur = () => {
        if (!isEmailValid()) {
            setError('Địa chỉ email không hợp lệ');
        } else {
            setError('');
        }
    };
    const handleSignup = async () => {
        let response = null ;
        try {
            if (!email || !password || !username) {
                setError('Vui lòng nhập đầy đủ thông tin');
                setLoading(false);
                return;
            }

            setLoading(true);

            let role_id = 2; // Default role for job seeker
            let business_id = null;

            if (isEmployerOption) {
                role_id = 1;
                try {
                    const businessResponse = await http.axiosClient.post('/api/business', {
                        businessName,
                        businessAddress,
                        businessWebsite,
                    });
                    business_id = businessResponse.data?.id;
                } catch (businessError) {
                    setError('Đã xảy ra lỗi khi tạo doanh nghiệp');
                    setLoading(false);
                    return;
                }
            }


            try {
            const response = await http.axiosClient.post('/api/users', {
                    username,
                    email,
                    password,
                    phoneNumber,
                    birthDay,
                    role_id,
                    business_id,
                });
                openMessageSuccess('Đăng ký thành công')
                router.push('/login');
                setLoading(false);
            }catch (e) {
                setError('Email đã tồn tại');
                setLoading(false);
                return;
            }
        } catch (e) {
            setError('Đã xảy ra lỗi khi xử lý đăng ký');
            setLoading(false);
        }
    };
    const handleLogin = () => {
        router.push('/login');
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center' }}>Đăng Ký</h2>
                <label>
                    Username:
                    <Input
                        type="text"
                        value={username}
                        placeholder="Nhập username"
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                </label>
                <br />
                <label>
                    Địa chỉ email:
                    <Input
                        type="text"
                        value={email}
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                </label>
                <br />
                <label>
                    Mật khẩu:
                    <Input
                        type="password"
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                </label>
                <br />
                <label>
                    Số điện thoại:
                    <Input
                        type="text"
                        value={phoneNumber}
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                </label>
                <br />
                <label>
                    Ngày sinh:
                    <Input
                        type="text"
                        value={birthDay}
                        placeholder="Nhập ngày sinh"
                        onChange={(e) => setBirthDay(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />
                </label>
                <br />
                {/* Employer option */}
                <div style={{ marginBottom: '20px' }}>
                    <label>
                        Bạn có phải nhà tuyển dụng không?
                        <input
                            type="checkbox"
                            checked={isEmployerOption}
                            onChange={handleIsEmployerChange}
                            style={{ marginLeft: '5px' }}
                        />
                    </label>
                </div>
                {/* Render additional fields if isEmployerOption is true */}
                {isEmployerOption && (
                    <>
                        <label>
                            Tên công ty:
                            <Input
                                type="text"
                                value={businessName}
                                placeholder="Nhập tên công ty"
                                onChange={(e) => setBusinessName(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                        </label>
                        <br />
                        <label>
                            Địa chỉ công ty:
                            <Input
                                type="text"
                                value={businessAddress}
                                placeholder="Nhập địa chỉ công ty"
                                onChange={(e) => setBusinessAddress(e.target.value)}
                                style={{ marginBottom: '20px' }}
                            />
                        </label>
                        <br />
                        <label>
                            Website công ty:
                            <Input
                                type="text"
                                value={businessWebsite}
                                placeholder="Nhập website công ty"
                                onChange={(e) => setBusinessWebsite(e.target.value)}
                                onBlur={handleEmailBlur}
                            />
                        </label>
                        <br />
                    </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Button
                        type="primary"
                        onClick={handleSignup}
                        loading={loading}
                        style={{ backgroundColor: '#FF0000', borderColor: '#ff0000' }}
                    >
                        {loading ? 'Đang đăng kí...' : 'Đăng kí'}
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );

};

export default Signup;
