import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    residency_status: string;
    age: number;
    contact_number: string;
    address: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    // Step management
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        residency_status: '',
        age: 0,
        contact_number: '',
        address: '',
        password_confirmation: '',
    });

    const nextStep = () => {
        // Validate current step before proceeding
        // if (currentStep === 1) {
        //     if (!data.name || !data.email) {
        //         return;
        //     }
        // } else if (currentStep === 2) {
        //     if (!data.age || !data.contact_number || !data.address || !data.residency_status) {
        //         return;
        //     }
        // }
        
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Step titles for the progress indicator
    const stepTitles = [
        "Account Info",
        "Personal Details",
        "Security"
    ];

    return (
        <AuthLayout 
            title="Create an account" 
            description={`Step ${currentStep} of ${totalSteps}: ${stepTitles[currentStep-1]}`}
        >
            <Head title="Register" />
            
            {/* Progress indicator */}
            <div className="flex justify-between mb-6">
                {[...Array(totalSteps)].map((_, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index + 1 === currentStep 
                                ? 'bg-primary text-primary-foreground' 
                                : index + 1 < currentStep 
                                    ? 'bg-primary/80 text-primary-foreground' 
                                    : 'bg-muted text-muted-foreground'
                        }`}>
                            {index + 1}
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`h-1 w-36 ${
                                index + 1 < currentStep ? 'bg-primary/80' : 'bg-muted'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            
            <form className="flex flex-col gap-6" onSubmit={submit}>
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-left-5 duration-300">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        
                        
                        <Button 
                            type="button" 
                            className="mt-2 w-full" 
                            tabIndex={4} 
                            onClick={nextStep}
                        >
                            Continue
                        </Button>
                    </div>
                )}
                
                {/* Step 2: Personal Details */}
                {currentStep === 2 && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-right-5 duration-300">
                        <div className="grid gap-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                required
                                tabIndex={1}
                                value={data.age || ''}
                                onChange={(e) => setData('age', Number(e.target.value))}
                                disabled={processing}
                                placeholder="Your age"
                            />
                            <InputError message={errors.age} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <Input
                                id="contact_number"
                                type="tel"
                                required
                                tabIndex={2}
                                autoComplete="tel"
                                value={data.contact_number || ''}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                disabled={processing}
                                placeholder="Your contact number"
                            />
                            <InputError message={errors.contact_number} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                type="text"
                                required
                                tabIndex={3}
                                autoComplete="street-address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                disabled={processing}
                                placeholder="Your address"
                            />
                            <InputError message={errors.address} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="residency_status">Residency Status</Label>
                            <Input
                                id="residency_status"
                                type="text"
                                required
                                tabIndex={4}
                                value={data.residency_status}
                                onChange={(e) => setData('residency_status', e.target.value)}
                                disabled={processing}
                                placeholder="Your residency status"
                            />
                            <InputError message={errors.residency_status} />
                        </div>
                        
                        <div className="flex gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="mt-2 w-full" 
                                tabIndex={5} 
                                onClick={prevStep}
                            >
                                Back
                            </Button>
                            <Button 
                                type="button" 
                                className="mt-2 w-full" 
                                tabIndex={6} 
                                onClick={nextStep}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                )}
                
                {/* Step 3: Security */}
                {currentStep === 3 && (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-right-5 duration-300">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={1}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="mt-2 w-full" 
                                tabIndex={3} 
                                onClick={prevStep}
                            >
                                Back
                            </Button>
                            <Button 
                                type="submit" 
                                className="mt-2 w-full" 
                                tabIndex={4} 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Create account
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}