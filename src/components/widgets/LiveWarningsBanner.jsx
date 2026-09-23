import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AlertTriangle, Send } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

export default function LiveWarningsBanner({ onNavigate }) {
  const { t } = useTranslation();
  const { isOrg, isSubOrg, entityId } = useAuth();
  const { warnings = [] } = useData();

  // Scoped warnings filter based on user role
  let scopedWarnings = [...warnings];
  if (isOrg) {
    scopedWarnings = scopedWarnings.filter((w) => w.orgId === entityId);
  } else if (isSubOrg) {
    scopedWarnings = scopedWarnings.filter((w) => w.subOrgId === entityId);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
      <div className="relative px-4 py-3 border-b border-gray-100 bg-orange-50 flex justify-between items-center">
        <InfoTooltip
          className="absolute top-1 right-1"
          text={t('The number of active warnings that need attention in your current agricultural network.')}
        />
        <h3 className="font-bold text-orange-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span>{t("Today's Recommendations")}</span>
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {scopedWarnings.length > 0 ? (
          scopedWarnings.map((w) => (
            <div
              key={w.id}
              className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50/80 transition gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                    w.type === "Critical"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {w.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate && onNavigate("messages")}
                className="px-3 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('Send Advisory SMS')}</span>
              </button>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-400 font-medium text-sm">
            {t('No active actionable warnings in your network.')}
          </div>
        )}
      </div>
    </div>
  );
}