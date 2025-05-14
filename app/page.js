export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center mb-8">
        Event Space Marketplace
      </h1>
      <p className="text-xl text-center mb-8">
        Find the perfect space for your next event
      </p>
      <div className="flex gap-4">
        <a href="/auth/register" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Get Started
        </a>
        <a href="/venues" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
          Browse Spaces
        </a>
      </div>
    </main>
  )
}