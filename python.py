import os

def create_directory_structure():
    # Define the folder structure
    folders = {
        'controllers': [
            'authController.js',
            'userController.js',
            'systemSettingsController.js',
            'activityController.js',
            'activityLogController.js',
            'classController.js',
            'studentController.js',
            'awardController.js',
            'badgeAwardController.js',
            'eventController.js',
            'sessionController.js',
            'reportController.js',
            'importController.js'
        ],
        'models': [
            'User.js',
            'SystemSettings.js',
            'Activity.js',
            'ActivityLog.js',
            'Class.js',
            'Student.js',
            'Award.js',
            'BadgeAward.js',
            'Event.js',
            'Session.js'
        ]
    }

    # Create directories and files
    for folder, files in folders.items():
        # Create folder if it doesn't exist
        os.makedirs(folder, exist_ok=True)
        
        # Create each file in the folder
        for file_name in files:
            file_path = os.path.join(folder, file_name)
            # Create empty file
            with open(file_path, 'w') as f:
                f.write('')  # Create empty file
            print(f'Created: {file_path}')

if __name__ == '__main__':
    create_directory_structure()