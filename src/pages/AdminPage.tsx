import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { 
  updateWidgetContent,
  Widget 
} from '../features/widgets/widgetsSlice'
import { RootState } from '../store/store'
import { FaEdit } from 'react-icons/fa'

// Widget edit modal component
const EditWidgetModal = ({ 
  widget, 
  onSave, 
  onClose 
}: { 
  widget: Widget | null, 
  onSave: (id: string, title: string, description: string) => void, 
  onClose: () => void 
}) => {
  const [title, setTitle] = useState(widget?.title || '')
  const [description, setDescription] = useState(widget?.description || '')
  
  const handleSave = () => {
    if (widget) {
      onSave(widget.id, title, description)
    }
    onClose()
  }
  
  if (!widget) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Widget</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Widget title"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Widget description"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

const AdminPage = () => {
  const dispatch = useDispatch()
  const widgets = useSelector((state: RootState) => state.widgets.widgets)
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  const handleEditWidget = (widget: Widget) => {
    setSelectedWidget(widget)
  }
  
  const handleSaveWidget = (id: string, title: string, description: string) => {
    dispatch(updateWidgetContent({ id, title, description }))
    setSelectedWidget(null)
  }
  
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Widget Management</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Manage the widgets displayed on the dashboard. Edit their titles and descriptions to customize the user experience.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Widget Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {widgets.map((widget) => (
                  <tr key={widget.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                      {widget.type.replace(/-/g, ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {widget.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs truncate">
                        {widget.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <button
                        onClick={() => handleEditWidget(widget)}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 mr-3"
                        title="Edit widget"
                      >
                        <FaEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Admin Panel</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to the admin panel. Here you can manage the application settings and user permissions.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">User Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage user accounts and permissions</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Store Configuration</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Configure store settings and integrations</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">System Settings</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage system-wide settings and configurations</p>
            </div>
          </div>
        </div>
      </div>
      
      {selectedWidget && (
        <EditWidgetModal
          widget={selectedWidget}
          onSave={handleSaveWidget}
          onClose={() => setSelectedWidget(null)}
        />
      )}
    </div>
  )
}

export default AdminPage 