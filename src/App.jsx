import { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const App = () => {

  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData] = useContext(AuthContext)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (loggedInUser) {
      try {
        const session = JSON.parse(loggedInUser)
        if (session.role === 'admin' || session.role === 'employee') {
          setUser(session.role)
          setLoggedInUserData(session.data ?? null)
        } else {
          localStorage.removeItem('loggedInUser')
        }
      } catch {
        localStorage.removeItem('loggedInUser')
      }
    }

  }, [])


  const handleLogin = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    const adminUsers = JSON.parse(localStorage.getItem('admin') || '[]')
    const admin = adminUsers.find(
      (account) => normalizedEmail === account.email.toLowerCase() && password === account.password
    )

    if (admin) {
      setUser('admin')
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ role: 'admin', data: admin })
      )
      setLoggedInUserData(null)
      return
    }

    const employee = userData?.find(
      (employee) => normalizedEmail === employee.email.toLowerCase() && password === employee.password
    )
    if (employee) {
      setUser('employee')
      setLoggedInUserData(employee)
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ role: 'employee', data: employee })
      )
    } else {
      alert("Invalid Credentials")
    }
  }



  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user == 'admin' ? <AdminDashboard changeUser={setUser} /> : (user == 'employee' ? <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> : null)}
    </>
  )
}

export default App