jsonSerializer = () => {
  return {
    serialize: (object) => JSON.stringify(object),
    deserialize: (serializedObject) => JSON.parse(serializedObject)
  };
};

module.exports = jsonSerializer;