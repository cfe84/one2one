const ENTITY_PREFIX = "entity-";
const ENTITY_EXTENSION = ".json";

var fsResourceProvider = (fileProvider, serializer) => {
  const calculateEntityFilename = (entityId) => `${ENTITY_PREFIX}${entityId}${ENTITY_EXTENSION}`;

  const loadEntity = async (filePath) => {
    let serializedEntity = undefined;
    try {
      serializedEntity = await fileProvider.read(filePath);
    }
    catch(error) {
      throw error;
    }
    const entity = serializer.deserialize(serializedEntity);
    return entity;
  };

  const validateEntity = (entity) => {
    if (!entity.id)
      throw Error("Entity id not set");
  };

  return {

    list: async () => {
      fileList = await fileProvider.list();
      const isEntity = (fileName) => fileName.startsWith(ENTITY_PREFIX) && fileName.endsWith(ENTITY_EXTENSION);
      const entityFileList = fileList.filter(isEntity);
      res = [];
      for (let index in entityFileList) {
        try {
          const entity = await loadEntity(entityFileList[index]);
          res.push(entity);
        }
        catch(error) {
          throw error;
        }
      }
      return res;
    },

    load: async (id) => {
      const fileName = calculateEntityFilename(id);
      return await loadEntity(fileName);
    },

    save: async (entity) =>
    {
      validateEntity(entity);
      const filename = calculateEntityFilename(entity.id);
      const serializedEntity = serializer.serialize(entity);
      await fileProvider.write(filename, serializedEntity);
    },

    subResource: async (resourceName) =>
    {
      try {
        const subDirectory = await fileProvider.subdir(resourceName);
        const subResourceProvider = fsResourceProvider(subDirectory, serializer);
        return subResourceProvider;
      }
      catch(error)
      {
        throw error;
      }
    }
  };
};

module.exports = fsResourceProvider;