import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../auth/AuthContext";

function Login() {

    const [form, setForm] = useState({email: "", password: ""})
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth();

    const onSubmit = async(e) => {
        e.preventDefault()
        setErr("")
        setLoading(true)
        try{
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/signin`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if(!res.ok) throw new Error(data?.message || "Login failed");

            const role = data?.role || "user"

            const redirect = data?.redirect || (role === "admin" ? "/admin" : "/")

            navigate(redirect, {replace:true})
        }
        catch(error){
           setErr(error.message)
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className='max-w-md mx-auto py-10 mt-40'>
        <h1 className='text-2xl font-bold mb-6'>Login</h1>

        <form onSubmit={onSubmit} className='space-y-4'>
            <input
            className='w-full border p-2 rounded'
            placeholder='Email'
            name='email'
            type='email'
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />

            <input
            className='w-full border p-2 rounded'
            placeholder='Password'
            name='password'
            type='password'
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            />

            {err && <p className='text-red-500 text-sm'>{err}</p>}

            <button disabled={loading}>
                {loading ? "..." : "Login"}
            </button>
        </form>
    </div>

  )
}

export default Login