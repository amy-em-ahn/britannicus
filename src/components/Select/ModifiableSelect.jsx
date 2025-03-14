import React, { useState, useRef, useEffect } from 'react';
import Button from '../../components/ui/Button';
import OutlineButton from '../../components/ui/OutlineButton';
import { TiDelete } from 'react-icons/ti';
import { TbEdit } from 'react-icons/tb';

const ModifiableSelect = ({
  name,
  value,
  onChange,
  required,
  disabled,
  children,
  allowCustomOption = false
}) => {
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [customOptions, setCustomOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [message, setMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, option: null });

  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get all options including default children and custom options
  const getAllOptions = () => {
    const defaultOptions = React.Children.toArray(children)
      .filter(
        (child) => child.props && child.props.value && !child.props.disabled
      )
      .map((child) => ({
        value: child.props.value,
        label: child.props.children
      }));

    const custom = customOptions.map((option) => ({
      value: option,
      label: option,
      isCustom: true
    }));

    return [...defaultOptions, ...custom];
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCustomOptions([...customOptions, newOption.trim()]);
      // Automatically select the new option
      const event = {
        target: {
          name,
          value: newOption.trim()
        }
      };
      onChange(event);
      setNewOption('');
      setIsAddingOption(false);

      // Show success message
      setMessage(`Option "${newOption.trim()}" has been added successfully`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const confirmDeleteOption = (option) => {
    setDeleteModal({ show: true, option });
  };

  const handleDeleteOption = () => {
    const optionToDelete = deleteModal.option;

    if (optionToDelete) {
      if (optionToDelete.isCustom) {
        // Remove from custom options if it's a custom option
        setCustomOptions(
          customOptions.filter((opt) => opt !== optionToDelete.value)
        );
      }

      // If currently selected option is being deleted, reset value
      if (value === optionToDelete.value) {
        const event = {
          target: {
            name,
            value: ''
          }
        };
        onChange(event);
      }

      // Show deletion message
      setMessage(
        `Option "${optionToDelete.label}" has been deleted successfully`
      );
      setTimeout(() => setMessage(''), 3000);
    }

    setDeleteModal({ show: false, option: null });
  };

  const startEditing = (option) => {
    setEditingOption(option);
    setEditingValue(option.label);
  };

  const saveEdit = () => {
    if (editingValue.trim() && editingOption) {
      if (editingOption.isCustom) {
        // Update in custom options
        const updatedOptions = customOptions.map((opt) =>
          opt === editingOption.value ? editingValue : opt
        );
        setCustomOptions(updatedOptions);

        // If currently selected, update the value
        if (value === editingOption.value) {
          const event = {
            target: {
              name,
              value: editingValue
            }
          };
          onChange(event);
        }
      }

      // Show success message
      setMessage(
        `Option "${editingOption.label}" has been updated to "${editingValue}"`
      );
      setTimeout(() => setMessage(''), 3000);
    }

    setEditingOption(null);
    setEditingValue('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectStyles = `block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none bg-white ${
    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  }`;

  return (
    <div>
      {/* Success/error message */}
      {message && (
        <div className='mb-2 p-2 text-sm text-green-700 bg-green-100 rounded-md'>
          {message}
        </div>
      )}

      {!isAddingOption ? (
        <div className='relative'>
          {/* Use a div that looks like a select but can be controlled for dropdown */}
          <div
            ref={selectRef}
            className={selectStyles}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {/* Display the current selected value */}
            {getAllOptions().find((opt) => opt.value === value)?.label ||
              // If no selection, show the first disabled option as placeholder
              React.Children.toArray(children).find(
                (child) => child.props && child.props.disabled
              )?.props.children ||
              'Select an option'}
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-500'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>

          {allowCustomOption && (
            <div className='absolute inset-y-0 right-10 flex items-center'>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingOption(true);
                }}
                className='flex items-center text-blue-500 hover:text-blue-700'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-xs' style={{ fontSize: '11px' }}>
                  Add option
                </span>
              </button>
            </div>
          )}

          {/* Hidden actual select for form submission */}
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className='hidden'
          >
            {children}
            {customOptions.map((option, index) => (
              <option key={`custom-${index}`} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Custom dropdown */}
          {isOpen && !disabled && (
            <div
              ref={dropdownRef}
              className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto'
            >
              {/* Show all options including default and custom */}
              {getAllOptions().map((option, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between hover:bg-gray-100 border-b border-gray-100'
                >
                  {editingOption && editingOption.value === option.value ? (
                    <div className='flex-grow p-2'>
                      <input
                        type='text'
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className='w-full border border-gray-300 rounded px-2 py-1 text-sm'
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className='flex-grow p-2 cursor-pointer'
                        onClick={() => {
                          const event = {
                            target: {
                              name,
                              value: option.value
                            }
                          };
                          onChange(event);
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                      <div className='flex items-center pr-2'>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(option);
                          }}
                          className='text-gray-500 hover:text-blue-500 px-1'
                        >
                          <TbEdit size={20} />
                        </button>
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteOption(option);
                          }}
                          className='text-gray-500 hover:text-red-500 px-1'
                        >
                          <TiDelete size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add the disabled "Add New Option" at the bottom */}
              {allowCustomOption && (
                <div className='p-2 text-gray-400 border-t'>
                  --- Add New Option ---
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className='flex items-center'>
          <input
            type='text'
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder='Enter new option'
            className='block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-l-md'
            autoFocus
          />
          <div className='flex'>
            <Button
              icon='FaCheck'
              className='py-1 px-2 rounded-none'
              onClick={handleAddOption}
            />
            <OutlineButton
              icon='FaTimes'
              className='rounded-l-none py-1 px-2'
              onClick={() => setIsAddingOption(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm mx-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Confirm Deletion
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
              Are you sure you want to delete "{deleteModal.option?.label}"?
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                onClick={() => setDeleteModal({ show: false, option: null })}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
                onClick={handleDeleteOption}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifiableSelect;
