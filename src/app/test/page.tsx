export default function TestPage() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Test Page</h1>
          <p className='text-gray-600 mb-6'>
            This is a simple test page to verify the server is working.
          </p>
          <div className='space-y-4'>
            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
              ✅ Server is working!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
