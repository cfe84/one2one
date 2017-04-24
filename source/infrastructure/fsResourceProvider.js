const ENTITY_PREFIX = "entity-";

var fsResourceProvider = (fileProvider, serializer, basePath) => {
  const calculateEntityFilename = (entityId) => `${basePath}${fileProvider.separator}${ENTITY_PREFIX}${entityId}`;
  const loadEntity = async (filePath) => {
    const serializedEntity = await fileProvider.read(filePath);
    const entity = serializer.deserialize(serializedEntity);
    return entity;
  };
  const saveEntity = async (entity, path) => {
    if (!entity.id)
      throw Error("Entity id not set");
    const serializedEntity = serializer.serialize(entity);
    await fileProvider.write(path, serializedEntity);
  };
  return {
    list: async () => {
      fileList = await fileProvider.list(basePath);
      const isEntity = (fileName) => fileName.startsWith(ENTITY_PREFIX);
      const entityFileList = fileList.filter(isEntity);
      const entityFileNames = entityFileList.map(calculateEntityFilename);
      const entities = entityFileNames.map(async (entityFileName) => await loadEntity(entityFileName));
      return await entities;
    },
    load: async (id) => {
      const fileName = calculateEntityFilename(id);
      return await loadEntity(userFileName);
    },
    create: async (user) =>
    {
      const filename = calculateEntityFilename(user.id);
      if (await fileProvider.exists(filename))
        throw Error("Entity already exists");
      await saveEntity(user, filename);
    },
    update: async (user) => {
      const filename = calculateEntityFilename(user.id);
      if (! await fileProvider.exists(filename))
        throwError("Entity does not exist");
      await saveEntity(user, filename);
    }
  };
};

module.exports = fsResourceProvider;