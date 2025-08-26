import React from 'react'

const AdminLogin = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form className="mt-4">
        <div>
          <label htmlFor="username" className="block">Username</label>
          <input type="text" id="username" className="border p-2 w-full" />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block">Password</label>
          <input type="password" id="password" className="border p-2 w-full" />
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin
