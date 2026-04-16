import React from "react";
import { useApplicationStore, ApplicationStatus } from "../store/useApplicationStore";
import { Trash2 } from "lucide-react";

export const ApplicationsDashboard: React.FC = () => {
  const { applications, removeApplication, updateStatus } =
    useApplicationStore();

  return (
    <div className="p-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        My Applications
      </h2>
      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50"
          >
            <div>
              <h3 className="font-semibold text-slate-900">{app.jobTitle}</h3>
              <p className="text-sm text-white0">{app.company}</p>
              <p className="text-xs text-slate-500">
                Applied: {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={app.status}
                onChange={(e) =>
                  updateStatus(app.id, e.target.value as ApplicationStatus)
                }
                className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={() => removeApplication(app.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
