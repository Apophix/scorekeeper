import { Outlet } from '@tanstack/react-router'

interface AppProps {
  children: React.ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Flip7 Scorekeeper</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}

export default App