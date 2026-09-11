import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Send, 
  Clock, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Building, 
  Users 
} from 'lucide-react';

export default function CommunicationPage() {
  const { t } = useTranslation();
  const { isAdmin, isOrg, isSubOrg, entityId } = useAuth();
  const { messages, organizations, subOrganizations, addMessage, accessControl } = useData();

  const [messageText, setMessageText] = useState('');
  const [targetScope, setTargetScope] = useState('ALL');
  const [scheduleTime, setScheduleTime] = useState('');

  // Check if current user has permission to compose broadcasts
  const canSend = isAdmin || Boolean(accessControl?.sendMessage?.[entityId]);

  // Scoped messages
  let scopedMessages = [...messages];
  if (isOrg) scopedMessages = scopedMessages.filter(m => m.orgId === entityId || m.target === 'All Organizations');

  const currentSubOrganization = subOrganizations.find(s => s.id === entityId);
  const availableTargets = isAdmin
    ? organizations.concat(subOrganizations)
    : subOrganizations.filter(s => s.orgId === entityId);
  const effectiveTargetScope = isAdmin
    ? targetScope
    : targetScope === 'ALL'
      ? availableTargets[0]?.id || ''
      : targetScope;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let targetName = isSubOrg
      ? `All Beneficiaries of ${currentSubOrganization?.name || 'this sub-organization'}`
      : 'All Organizations';
    if (!isSubOrg && effectiveTargetScope !== 'ALL') {
      const org = organizations.find(o => o.id === effectiveTargetScope);
      const sub = subOrganizations.find(s => s.id === effectiveTargetScope);
      targetName = org?.name || sub?.name || 'Selected Unit';
    }

    addMessage({
      message: messageText.trim(),
      datetime: scheduleTime || new Date().toISOString().slice(0, 16),
      target: targetName,
      orgId: isAdmin ? 'GLOBAL' : entityId
    });

    setMessageText('');
    setScheduleTime('');
  };

  const charCount = messageText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('Communication & Advisories')}</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">{t('Broadcast weather warnings, agronomy alerts & SMS notices.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Advisory Box - Only rendered if user has permission */}
        {canSend && (
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-brand-blue" />
              <span>{t('Compose Broadcast')}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('Broadcast Target')}</label>
                {isSubOrg ? (
                  <div className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-gray-50 text-gray-700">
                    {t('All beneficiaries in')} {currentSubOrganization?.shortName || t('this sub-organization')}
                  </div>
                ) : (
                  <select
                    value={effectiveTargetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-brand-blue bg-white cursor-pointer"
                  >
                    {isAdmin && <option value="ALL">{t('All Organizations & Beneficiaries')}</option>}
                    {availableTargets.map(target => (
                      <option key={target.id} value={target.id}>{target.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('Advisory Message Content')}</label>
                <textarea
                  required
                  rows={5}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t('Type SMS or alert advisory broadcast...')}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-brand-blue bg-white resize-none"
                ></textarea>
                <div className="flex justify-between items-center text-[11px] text-gray-400 font-semibold mt-1">
                  <span>{t('{{count}} characters', { count: charCount })}</span>
                  <span>{smsSegments} {smsSegments > 1 ? t('SMS Segments') : t('SMS Segment')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{t('Schedule Broadcast Date & Time')}</label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-brand-blue bg-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-blue hover:bg-brand-greenHover-blue-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('Schedule Broadcast')}</span>
              </button>
            </form>
          </div>
        )}

        {/* Message Logs - Dynamically expands to span 3 columns when Compose box is hidden */}
        <div className={`${canSend ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5`}>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>{t('Advisory Dispatch History')}</span>
          </h2>

          <div className="divide-y divide-gray-100">
            {scopedMessages.map((msg) => (
              <div key={msg.id} className="py-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-0.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                    {t('Target:')} {msg.target}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    msg.status === 'Delivered' ? 'bg-green-50 text-brand-green' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-medium">{msg.message}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('Scheduled:')} {msg.datetime.replace('T', ' ')}</span>
                </p>
              </div>
            ))}

            {scopedMessages.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">
                {t('No advisory broadcasts logged yet.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
