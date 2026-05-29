import { FileX, Inbox, AlertCircle, Search } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No data available', 
  description = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  variant = 'default' // default, error, search
}) {
  const iconColors = {
    default: 'text-gray-400',
    error: 'text-red-400',
    search: 'text-blue-400'
  };

  const bgColors = {
    default: 'bg-gray-100',
    error: 'bg-red-50',
    search: 'bg-blue-50'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`w-16 h-16 rounded-full ${bgColors[variant]} flex items-center justify-center mb-4`}>
        <Icon className={`w-8 h-8 ${iconColors[variant]}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Specific empty state variants
export function NoInvoicesState({ onCreateInvoice }) {
  return (
    <EmptyState
      icon={FileX}
      title="No invoices yet"
      description="You haven't created any invoices. Start by creating your first invoice."
      actionLabel="Create Invoice"
      onAction={onCreateInvoice}
    />
  );
}

export function NoCustomersState({ onAddCustomer }) {
  return (
    <EmptyState
      icon={Inbox}
      title="No customers found"
      description="You don't have any customers yet. Add your first customer to get started."
      actionLabel="Add Customer"
      onAction={onAddCustomer}
    />
  );
}

export function NoSearchResultsState() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="We couldn't find any results matching your search. Try adjusting your filters."
      variant="search"
    />
  );
}

export function ErrorState({ onRetry }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description="We encountered an error while loading the data. Please try again."
      actionLabel="Retry"
      onAction={onRetry}
      variant="error"
    />
  );
}
