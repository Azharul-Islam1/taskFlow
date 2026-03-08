<template>
  <div class="auth-page">
    <!-- Animated background blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="auth-card">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">TaskFlow</span>
      </div>

      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-sub">Sign in to your workspace</p>

      <!-- Error Message -->
      <transition name="slide-down">
        <div v-if="authStore.error" class="error-banner">
          <span>⚠ {{ authStore.error }}</span>
        </div>
      </transition>

      <!-- Form -->
      <div class="form">
        <div class="field">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            @keyup.enter="handleLogin"
            :disabled="authStore.loading"
          />
        </div>

        <div class="field">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="handleLogin"
            :disabled="authStore.loading"
          />
        </div>

        <button class="btn-primary" @click="handleLogin" :disabled="authStore.loading">
          <span v-if="!authStore.loading">Sign In</span>
          <span v-else class="spinner"></span>
        </button>
      </div>

      <p class="switch-link">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  if (!email.value || !password.value) return
  const success = await authStore.login(email.value, password.value)
  if (success) router.push('/')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 8s ease-in-out infinite;
}
.blob-1 {
  width: 500px; height: 500px;
  background: var(--accent-primary);
  top: -100px; left: -100px;
  animation-delay: 0s;
}
.blob-2 {
  width: 400px; height: 400px;
  background: var(--accent-secondary);
  bottom: -100px; right: -100px;
  animation-delay: -3s;
}
.blob-3 {
  width: 300px; height: 300px;
  background: var(--accent-green);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -5s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
.auth-card {
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 48px 44px;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}
.logo-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 12px var(--accent-primary));
}
.logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.auth-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.auth-sub {
  color: var(--text-secondary);
  margin-bottom: 28px;
}
.error-banner {
  background: rgba(255, 101, 132, 0.1);
  border: 1px solid rgba(255, 101, 132, 0.3);
  color: var(--accent-secondary);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  margin-bottom: 16px;
  font-size: 13px;
}
.slide-down-enter-active { transition: all 0.25s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.field input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.field input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
}
.field input:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), #8b85ff);
  border: none;
  border-radius: var(--radius-sm);
  padding: 14px;
  color: white;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}
.btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.switch-link {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}
.switch-link a {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}
.switch-link a:hover { text-decoration: underline; }
</style>