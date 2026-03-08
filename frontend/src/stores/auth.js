import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('tf_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('tf_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/auth/login', { email, password })
      _setSession(data.token, data.user)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      _setSession(data.token, data.user)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('tf_token')
    localStorage.removeItem('tf_user')
  }

  // Private helper
  function _setSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('tf_token', newToken)
    localStorage.setItem('tf_user', JSON.stringify(newUser))
  }

  return { token, user, loading, error, isAuthenticated, login, register, logout }
})