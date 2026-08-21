import { useContext, useState, useEffect, createContext } from "react"

export const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const normalizeRole = (r) => 
        (r || "user").toString().trim().toLowerCase()
    

   const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/verify`, {
                method: "GET",
                credentials: 'include',
            })
            if (response.ok) {
                const data = await response.json()
                const role = normalizeRole(data?.user?.role)
                setUser({...data.user, role});
            } 
            else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async(credentials) => {
        try{
           const response = await fetch(`${process.env.REACT_APP_API_URL}/users/signin`, {
                method: "POST",
                headers:{
                   'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            })

            if (response.ok) {
                const data = await response.json()
                const role = normalizeRole(data?.user?.role)
                setUser({...data.user, role});
                return{ success: true, data}
            }
            else{
                const errorData = await response.json()
                 return{ success: false, error: errorData.message}
            }
        }
        catch(error){
           return{ success: false, error: "Login Failed"};
        }
    }

    const register = async(userData) => {
        try{
           const response = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                method: "POST",
                headers:{
                   'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            })

            if (response.ok) {
                const data = await response.json()
                const role = normalizeRole(data?.user?.role)
                setUser({...data.user, role});
                return{ success: true, data}
            }
            else{
                const errorData = await response.json()
                 return{ success: false, error: errorData.message}
            }
        }
        catch(error){
           return{ success: false, error: "Register Failed"};
        }
    }

    const logout = async()=> {
         try{
           const response = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
                method: "POST",
                credentials: 'include',
            })
 
        }
        catch(error){
           console.error('Logout request failed', error)
        }
        finally{
            setUser(null)
        }
    }


    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        refreshAuth: checkAuthStatus
    }


    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}