// components/questions/components/GlobalBulkEditPanel.jsx - CLEAN VERSION
import React, { useState } from 'react';
import { ChevronDown, AlertCircle, Users, Edit3, Globe, Zap, Check, X } from 'lucide-react';
import { Select, Checkbox, TextEditor } from './SharedComponents';
import { AVAILABLE_TAGS } from '../constants/questionConstants';

const GlobalBulkEditPanel = ({ 
  globalBulkChanges, 
  pendingChanges, 
  onGlobalBulkChange, 
  onGlobalTagOperation, 
  onApplyGlobalChanges,
  questionCount 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basicSettings: true,
    tagsManagement: false,
    feedback: false,
    metadata: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, isExpanded, onToggle, icon: Icon, count }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count && (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
            {count}
          </span>
        )}
      </div>
      <ChevronDown 
        size={18} 
        className={`transform transition-transform duration-200 text-gray-500 ${
          isExpanded ? 'rotate-0' : '-rotate-90'
        }`}
      />
    </button>
  );

  const CATEGORIES = [
    { value: 'course-1', label: 'Introduction to Programming' },
    { value: 'course-2', label: 'Data Structures' },
    { value: 'course-3', label: 'Database Systems' },
    { value: 'course-4', label: 'Web Development' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            <Zap size={24} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Global Bulk Edit</h2>
            <p className="text-gray-600 mt-1">Apply changes to all {questionCount} questions at once</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Settings Section */}
        <div className="border border-gray-200 rounded-lg">
          <SectionHeader
            title="Basic Settings"
            isExpanded={expandedSections.basicSettings}
            onToggle={() => toggleSection('basicSettings')}
            icon={Edit3}
            count="Core Fields"
          />
          
          {expandedSections.basicSettings && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Question Status
                  </label>
                  <Select
                    value={globalBulkChanges.status}
                    onChange={(value) => onGlobalBulkChange('status', value)}
                    options={[
                      { value: '', label: 'No change' },
                      { value: 'Draft', label: 'Draft' },
                      { value: 'Ready', label: 'Ready' },
                      { value: 'Archived', label: 'Archived' }
                    ]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Default Mark
                  </label>
                  <input
                    type="number"
                    value={globalBulkChanges.defaultMark}
                    onChange={(e) => onGlobalBulkChange('defaultMark', e.target.value)}
                    placeholder="No change"
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Category
                  </label>
                  <Select
                    value={globalBulkChanges.category}
                    onChange={(value) => onGlobalBulkChange('category', value)}
                    options={[
                      { value: '', label: 'No change' },
                      ...CATEGORIES
                    ]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Penalty Factor (0-1)
                  </label>
                  <input
                    type="number"
                    value={globalBulkChanges.penaltyFactor}
                    onChange={(e) => onGlobalBulkChange('penaltyFactor', e.target.value)}
                    placeholder="No change"
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Show Instructions
                  </label>
                  <Select
                    value={globalBulkChanges.showInstructions === null ? '' : globalBulkChanges.showInstructions.toString()}
                    onChange={(value) => onGlobalBulkChange('showInstructions', value === '' ? null : value === 'true')}
                    options={[
                      { value: '', label: 'No change' },
                      { value: 'true', label: 'Yes' },
                      { value: 'false', label: 'No' }
                    ]}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tags Management Section */}
        <div className="border border-gray-200 rounded-lg">
          <SectionHeader
            title="Tags Management"
            isExpanded={expandedSections.tagsManagement}
            onToggle={() => toggleSection('tagsManagement')}
            icon={Users}
            count={`+${globalBulkChanges.tags.add.length} -${globalBulkChanges.tags.remove.length}`}
          />
          
          {expandedSections.tagsManagement && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Add Tags to All Questions</h4>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => onGlobalTagOperation('add', tag)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          globalBulkChanges.tags.add.includes(tag)
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                        {globalBulkChanges.tags.add.includes(tag) && (
                          <Check size={14} className="ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Remove Tags from All Questions</h4>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => onGlobalTagOperation('remove', tag)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                          globalBulkChanges.tags.remove.includes(tag)
                            ? 'bg-gray-700 text-white border-gray-700'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                        {globalBulkChanges.tags.remove.includes(tag) && (
                          <X size={14} className="ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="border border-gray-200 rounded-lg">
          <SectionHeader
            title="Feedback Messages"
            isExpanded={expandedSections.feedback}
            onToggle={() => toggleSection('feedback')}
            icon={AlertCircle}
            count="Standardize"
          />
          
          {expandedSections.feedback && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    General Feedback
                  </label>
                  <TextEditor
                    value={globalBulkChanges.generalFeedback}
                    onChange={(value) => onGlobalBulkChange('generalFeedback', value)}
                    placeholder="Leave empty for no change"
                    minHeight="100px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Feedback for Correct Answers
                  </label>
                  <TextEditor
                    value={globalBulkChanges.feedbackCorrect}
                    onChange={(value) => onGlobalBulkChange('feedbackCorrect', value)}
                    placeholder="Leave empty for no change"
                    minHeight="100px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Feedback for Incorrect Answers
                  </label>
                  <TextEditor
                    value={globalBulkChanges.feedbackIncorrect}
                    onChange={(value) => onGlobalBulkChange('feedbackIncorrect', value)}
                    placeholder="Leave empty for no change"
                    minHeight="100px"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Section */}
        <div className="border border-gray-200 rounded-lg">
          <SectionHeader
            title="Metadata"
            isExpanded={expandedSections.metadata}
            onToggle={() => toggleSection('metadata')}
            icon={Globe}
            count="System Fields"
          />
          
          {expandedSections.metadata && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Version
                  </label>
                  <input
                    type="text"
                    value={globalBulkChanges.version}
                    onChange={(e) => onGlobalBulkChange('version', e.target.value)}
                    placeholder="e.g., v2.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Modified By
                  </label>
                  <input
                    type="email"
                    value={globalBulkChanges.modifiedBy}
                    onChange={(e) => onGlobalBulkChange('modifiedBy', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Changes Preview and Actions */}
        <div className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Changes Summary</h3>
          </div>
          <div className="p-6">
            {Object.keys(pendingChanges).length > 0 ? (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  The following changes will be applied:
                </p>
                {Object.values(pendingChanges).map((change, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-sm text-gray-500 mb-2">No changes selected</p>
                <p className="text-xs text-gray-400">
                  Configure the settings above to see a preview of changes
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {Object.keys(pendingChanges).length > 0 && (
                  <span>
                    Ready to apply <span className="font-semibold">{Object.keys(pendingChanges).length}</span> change{Object.keys(pendingChanges).length !== 1 ? 's' : ''} to <span className="font-semibold">{questionCount}</span> question{questionCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={onApplyGlobalChanges}
                disabled={Object.keys(pendingChanges).length === 0}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  Object.keys(pendingChanges).length > 0
                    ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Apply Global Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalBulkEditPanel;