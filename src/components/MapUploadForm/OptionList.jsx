import React, { useState } from 'react';
import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';
import Button from '../ui/Button';

const OptionsList = ({ options, setOptions, title }) => {
  const [editingOption, setEditingOption] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOption, setNewOption] = useState('');

  const startEditing = (option) => {
    setEditingOption(option);
    setNewOptionValue(option);
  };

  const finishEditing = () => {
    if (newOptionValue.trim() !== '') {
      setOptions(
        options.map((o) => (o === editingOption ? newOptionValue : o))
      );
    }
    setEditingOption('');
    setNewOptionValue('');
  };

  const deleteOption = (option) => {
    setOptions(options.filter((o) => o !== option));
  };

  const addNewOption = () => {
    if (newOption.trim() !== '' && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption('');
      setShowAddForm(false);
    }
  };

  const inputStyles =
    'block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';

  return (
    <div>
      <div className='flex justify-between items-center mb-1'>
        <h3 className='text-sm font-medium text-gray-500'>{title} Options</h3>
        <button
          type='button'
          onClick={() => setShowAddForm(!showAddForm)}
          className='text-blue-600 text-sm flex items-center'
        >
          <FaPlus className='mr-1' /> {showAddForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {showAddForm && (
        <div className='mb-2 flex gap-2'>
          <input
            type='text'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={`Enter new ${title.toLowerCase()}`}
            className={inputStyles}
          />
          <Button
            type='button'
            text='Add'
            onClick={addNewOption}
            className='whitespace-nowrap'
          />
        </div>
      )}

      <div className='max-h-48 overflow-y-auto border rounded-md p-2 mb-3'>
        {options.map((option, idx) => (
          <div
            key={idx}
            className='flex justify-between items-center py-1 border-b last:border-b-0'
          >
            {editingOption === option ? (
              <div className='flex flex-1'>
                <input
                  type='text'
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  className='flex-1 border border-gray-300 rounded px-2 py-1 mr-2 text-sm'
                />
                <button
                  type='button'
                  onClick={finishEditing}
                  className='text-green-500 px-2'
                >
                  ✓
                </button>
              </div>
            ) : (
              <>
                <span className='text-sm'>{option}</span>
                <div>
                  <button
                    type='button'
                    onClick={() => startEditing(option)}
                    className='text-gray-500 hover:text-blue-500 px-1'
                  >
                    <FaPencilAlt size={12} />
                  </button>
                  <button
                    type='button'
                    onClick={() => deleteOption(option)}
                    className='text-gray-500 hover:text-red-500 px-1'
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsList;
