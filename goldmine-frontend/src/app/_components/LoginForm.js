'use client';

import { useActionState, startTransition } from "react";
import { useRouter } from "next/navigation"; // Corrected import
import { useForm } from "react-hook-form";
import { loginAction } from "../_lib/actions";
import styles from "../_components/RegisterForm.module.scss";
import Button from "./Button/Button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginForm() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [state, formAction, isPending] = useActionState(loginAction, null);

    // This function runs ONLY if validation passes
    function onSubmit(data) {
        // We manually trigger the Server Action
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        
        startTransition(() => {
            formAction(formData);
        });
    }

    return (
      <div className={styles.container}>
        {/* We use onSubmit to validate first, then it triggers the action */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
          <h1 className={styles.logo}>Goldmine</h1>
          <h2 className={styles.heading}>Login to your account</h2>

          <div className={styles.group}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="miner@goldmine.com" 
              className={styles.input} 
              {...register('email', { required: 'Email is required' })} 
            />
            {errors?.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          <div className={styles.group}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className={styles.input} 
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 8, message: 'Minimum 8 characters' } 
              })} 
            />
            {errors?.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>

          <Button type="submit" variant="orange" disabled={isPending}>
            {isPending ? 'Unlocking Vault...' : 'Login \u2192'}
          </Button>

          {state?.error && <p className={styles.error}>🚨 {state.error}</p>}

          <div className={styles.group}>
            <h3>Don`t have an account? <Link href="/register">Register</Link></h3>
          </div>
        </form>
      </div>
    );
}