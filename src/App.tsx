import { Outlet } from '@tanstack/react-router'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Scorekeeper</h1>
      </header>
      <main className="">
        <Outlet />
      </main>
    </div>
  )
}

export default App