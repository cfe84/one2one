
const getUserFolder = (userId) => `${USER_FOLDER}${fileProvider.separator}${USER_PREFIX}${user.id}`;
const getUserProfileFilePath = (userId) => `${getUserFolder(user)}${fileProvider.separator}${USER_PROFILE_FILENAME}`;