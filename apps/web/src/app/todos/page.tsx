export default function TodosPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Todo Management
          </h2>
          <p className="text-gray-600 mb-6">
            Todo list functionality will be implemented in the next task.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✓ Next.js App Router structure created</p>
            <p>✓ Tailwind CSS configured</p>
            <p>✓ Basic layout and navigation</p>
            <p>⏳ Todo CRUD operations (next task)</p>
            <p>⏳ Wallet integration (next task)</p>
            <p>⏳ Blockchain storage (next task)</p>
          </div>
        </div>
      </div>
    </div>
  );
}