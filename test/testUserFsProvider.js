should = require("should");
userProvider = require("../source/infrastructure/fsResourceProvider");
jsonSerializer = require("../source/infrastructure/jsonSerializer");

const fakeFileProvider = () => {
  return {
    list: async (path) => {
      throw Error("Fake: list was called");
    },
    read: async (path) => {
      throw Error("Fake: read was called");
    },
    write: async (path) => {
      throw Error("Fake: write was called");
    }
  }
};

const serializer = jsonSerializer();

describe("User file system provider", () => {
  it("should crash when creating without user id", () => {
    const fileProvider = fakeFileProvider();
    const userProvider = userProvider(fileProvider, serializer);

    const user = {
      name: "Someone"
    };

    userProvider.create(user);
  });
  it("should crash when updating without user id");
  it("should crash when creating with existing user id");
  it("should crash when updating with not existing user id");
});