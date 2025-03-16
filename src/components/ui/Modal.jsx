import Button from "./Button";

export default function Modal() {
    return (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-sm mx-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Confirm Deletion
            </h3>
            <p className='text-sm text-gray-500 mb-4'>
                Are you sure you want to sign-out?
            </p>
            <div className='flex justify-end gap-3'>
                <Button text='cancel' />
                <Button text="I'm Sure" />
            </div>
            </div>
        </div>
    )
    
}