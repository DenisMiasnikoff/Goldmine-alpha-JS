'use client';

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast"; // Fixed: removed '/headless'
import { signup as signupApi } from "@/services/apiAuth"; // Added missing import

import styles from "./RegisterForm.module.scss";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  // Added getValues for the password confirmation fix
  const router=useRouter();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  
  const { mutate, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success('Welcome onboard! Account made.');
      setTimeout(()=>{
        router.push("/dashboard");
      },2500)
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    // Kept your original container class
    <div className={styles.container}>
      
      {/* Connected the form submission to React Hook Form */}
      <form className={styles.formCard} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.logo}>Goldmine</h1>
        <h2 className={styles.heading}>Create your account</h2>
        
        {/* Separated into groups so your errors and labels stack correctly */}
        <div className={styles.group}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input 
            type="text" 
            placeholder="Username" 
            className={styles.input} 
            id="username" 
            {...register('username', { required: 'Username is required' })} 
          />
          {errors?.username && <span className={styles.error}>{errors.username.message}</span>}
        </div>

        <div className={styles.group}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.input} 
            id="email" 
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
            })} 
          />
          {errors?.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

       <div className={styles.group}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input 
            type="password" // Fixed: Changed from text to password
            placeholder="Password" 
            className={styles.input} 
            id="password" 
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} 
          />
          {errors?.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>

        <div className={styles.group}>
          <label htmlFor="confirmpassword" className={styles.label}>Confirm Password</label>
          <input 
            type="password" // Fixed: Changed from text to password
            placeholder="Confirm Password" 
            className={styles.input} 
            id="confirmpassword" 
            {...register('confirmpassword', { 
              required: 'Please confirm password',
              validate: (value) => value === getValues('password') || 'Passwords do not match'
            })} 
          />
          {errors?.confirmpassword && <span className={styles.error}>{errors.confirmpassword.message}</span>}
        </div>

        {/* Kept your original orange variant and added the loading disable state */}
        <Button type="submit" variant="orange" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register \u2192'}
        </Button>
      </form>
    </div>
  );
}