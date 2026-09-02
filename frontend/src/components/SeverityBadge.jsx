import React from 'react';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const SeverityBadge = ({ status }) => {
  const styles = {
    Critical: "bg-red-100 text-red-800 border-red-500",
    Warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    Normal: "bg-green-100 text-green-800 border-green-500"
  };

  const Icon = status === 'Critical' ? XCircle : (status === 'Warning' ? AlertTriangle : CheckCircle);

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border ${styles[status]} font-medium text-sm`}>
      <Icon className="w-4 h-4 mr-2" />
      {status}
    </div>
  );
};

export default SeverityBadge;