import React, { useState } from 'react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

export default function AnalysisEditor({ analysis, onSave, onCancel }) {
  const [summary, setSummary] = useState(analysis.summary);
  const [keyPoints, setKeyPoints] = useState([...analysis.keyPoints]);
  const [actionItems, setActionItems] = useState(
    analysis.actionItems.map((item) => ({ ...item }))
  );
  const [changeDescription, setChangeDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const handleRemoveKeyPoint = (index) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleKeyPointChange = (index, value) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
  };

  const handleAddActionItem = () => {
    setActionItems([
      ...actionItems,
      {
        task: '',
        owner: 'Unassigned',
        deadline: 'Not specified',
        priority: 'Medium',
        status: 'Pending',
      },
    ]);
  };

  const handleRemoveActionItem = (index) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleActionItemChange = (index, field, value) => {
    const updated = [...actionItems];
    updated[index] = { ...updated[index], [field]: value };
    setActionItems(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const filteredKeyPoints = keyPoints.filter((kp) => kp.trim().length > 0);
      const filteredActionItems = actionItems.filter((ai) => ai.task.trim().length > 0);

      await onSave({
        summary,
        keyPoints: filteredKeyPoints,
        actionItems: filteredActionItems,
        changeDescription: changeDescription || 'Manual edit',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Edit Analysis</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || summary.trim().length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Change Description</label>
        <input
          type="text"
          value={changeDescription}
          onChange={(e) => setChangeDescription(e.target.value)}
          placeholder="Briefly describe what you changed..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Key Points</label>
          <button
            onClick={handleAddKeyPoint}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Add Point
          </button>
        </div>
        <div className="space-y-2">
          {keyPoints.map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={point}
                onChange={(e) => handleKeyPointChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Key point..."
              />
              <button
                onClick={() => handleRemoveKeyPoint(index)}
                className="p-2 text-red-400 hover:text-red-600"
                aria-label="Remove key point"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Action Items</label>
          <button
            onClick={handleAddActionItem}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Add Action Item
          </button>
        </div>
        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <button
                  onClick={() => handleRemoveActionItem(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                  aria-label="Remove action item"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Task</label>
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => handleActionItemChange(index, 'task', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the task..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Owner</label>
                    <input
                      type="text"
                      value={item.owner}
                      onChange={(e) => handleActionItemChange(index, 'owner', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Deadline</label>
                    <input
                      type="text"
                      value={item.deadline}
                      onChange={(e) => handleActionItemChange(index, 'deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="YYYY-MM-DD or Not specified"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Priority</label>
                    <select
                      value={item.priority}
                      onChange={(e) => handleActionItemChange(index, 'priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                      value={item.status}
                      onChange={(e) => handleActionItemChange(index, 'status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
