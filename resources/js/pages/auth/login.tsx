import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        console.log('🌐 Ziggy location:', window.location.origin);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => {
                console.log('✅ Post login: window.location.href =', window.location.href);

                // 🔒 Si por alguna razón el navegador tiene HTTP en la barra de direcciones
                if (window.location.protocol === 'http:') {
                    const secureUrl = window.location.href.replace('http:', 'https:');
                    console.log('🔁 Redirigiendo a HTTPS:', secureUrl);
                    window.location.href = secureUrl;
                }

                reset('password');
            },
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/logo/f_login.png')" }}
        >
            <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <img src="../../logo/1.png" alt="Logo" className="w-32" />
                </div>

                <h2 className="text-center text-xl font-bold mb-4 text-black">Iniciar Sesión</h2>

                <form className="space-y-6 text-[#000]" onSubmit={submit}>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="correo@ejemplo.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Tu contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                        />
                        <Label htmlFor="remember" className="text-sm text-[#000] hover:text-[#F6A42C]">
                            Recordarme
                        </Label>
                    </div>

                    <div className="flex items-center justify-between">
                        {canResetPassword && (
                            <TextLink href={route('password.request')} className="text-sm text-[#000] hover:text-[#F6A42C]">
                                ¿Olvidaste tu contraseña?
                            </TextLink>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#023039] hover:bg-[#01252d] text-white font-semibold py-2 rounded-full border border-[#F6A42C]"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Ingresar
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-500 mt-6">
                    ¿No tienes cuenta?{' '}
                    <TextLink href={route('register')} className="text-[#F6A42C] font-semibold">
                        Regístrate
                    </TextLink>
                </div>

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>
                )}
            </div>
        </div>
    );
}
