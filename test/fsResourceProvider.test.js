const should = require("should");
const sinon = require("sinon");
const resourceProvider = require("../source/infrastructure/fsResourceProvider");
const jsonSerializer = require("../source/infrastructure/jsonSerializer");


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
    },
    subdir: async (path) => {
      throw Error("Fake: subdir was called");
    }
  }
};

const serializer = jsonSerializer();

describe("File system entity provider", () => {

  describe("Triggers exceptions when entity id is missing", () => {
    const fileProvider = fakeFileProvider();
    const entityProvider = resourceProvider(fileProvider, serializer);
    const entity = {
      name: "Someone"
    };
    it("should throw when id is not set", () => should(entityProvider.save(entity)).be.rejected("Entity id not set"));
    it("should not change parameter", () => entity.name.should.be.equal("Someone"));
    it("should throw when called on non existing entity", () => should(entityProvider.load("1234")).be.rejected("Fake: read was called"));
  });

  describe("Saves entity", () => {
    const fileProvider = fakeFileProvider();
    let writtenFileName = undefined;
    let writtenEntity = undefined;
    let called = 0;
    fileProvider.write = async (fileName, entity) => {
      called++;
      writtenEntity = entity;
      writtenFileName = fileName;
    };
    const entityProvider = resourceProvider(fileProvider, serializer);
    const entity = {
      id: "1234",
      name: "Someone"
    };
    it("should return success", () => should(entityProvider.save(entity)).not.be.rejected());
    it("should have been called once", () => called.should.equal(1));
    it("should save to a file called entity-xxx.json", () => should(writtenFileName.should.be.equal("entity-1234.json")));
    it("should serialize using serializer", () => should(writtenEntity.should.be.equal(serializer.serialize(entity))));
  });

  describe("Loads entity", () => {
    const fileProvider = fakeFileProvider();
    const entityProvider = resourceProvider(fileProvider, serializer);
    let readFileName = undefined;
    let readEntity = undefined;
    const entity = {
      id: "1234",
      name: "Someone"
    };
    let called = 0;
    fileProvider.read = async (fileName) => {
      called++;
      readFileName = fileName;
      return serializer.serialize(entity);
    };

    it("should return success", async () => should(readEntity = await entityProvider.load(entity.id)).not.be.undefined());
    it("should have been called once", () => called.should.equal(1));
    it("should read the file called entity-xxx.json", () => should(readFileName.should.be.equal("entity-1234.json")));
    it("should deserialize using serializer", () => {
      should(readEntity.name.should.be.equal(entity.name));
      should(readEntity.id.should.be.equal(entity.id));
    });
  });

  describe("Lists entities", async () => {
    const fileProvider = fakeFileProvider();
    const files = ["entity-1234.json", "entity-5678.json", "entity-0919", "something-else"];
    const entities = {
      "entity-1234.json": {
        id: "1234",
        name: "Someone"
      },
      "entity-5678.json": {
        id: "5678",
        blerh: "Something"
      }
    };
    let calledList = 0;
    fileProvider.list = async () => {
      calledList ++;
      return files;
    };
    let calledLoad = 0;
    fileProvider.read = async (fileName) => {
      calledLoad++;
      const entity = entities[fileName];
      const entityExists = entity !== undefined;
      if (!entityExists) {
        throw Error(`File does not exist: ${fileName}`);
      }
      return serializer.serialize(entity);
    };
    const entityProvider = resourceProvider(fileProvider, serializer);

    let readEntities = undefined;

    it("should return success", async () => should(readEntities = await entityProvider.list()).not.be.undefined());
    it("should called list once", () => calledList.should.equal(1));
    it("should called load twice", () => calledLoad.should.equal(2));
    it("should have found two entities", () => readEntities.length.should.be.equal(2));
    it("should have loaded these two entities", () => {
      const entity1234 = readEntities.filter((entity) => entity.id === "1234")[0];
      const entity5678 = readEntities.filter((entity) => entity.id === "5678")[0];
      entity1234.name.should.be.equal("Someone");
      entity5678.blerh.should.be.equal("Something");
    });
  });

  describe("Return sub resources", () => {
    const fileProvider = fakeFileProvider();
    const subResourceFileProvider = fakeFileProvider();
    const entityProvider = resourceProvider(fileProvider, serializer);

    const SUBRESOURCENAME = "dsfdfssdrehrnmismvcxi sdfsfsfsd";
    const ERROR = "There is an error";
    const subresourceEntity = {
      id: "1332",
      name: "sometefkndnmvfd dsfdf df"
    }
    let calledSubdir = 0;
    fileProvider.subdir = async (name) => {
      calledSubdir++;
      if (name === SUBRESOURCENAME)
        return subResourceFileProvider;
      throw Error(ERROR)
    };
    let calledSubresourceRead = 0;
    let subresourceReadFileName = undefined;
    subResourceFileProvider.read = async (otherName) => {
      calledSubresourceRead++;
      subresourceReadFileName = otherName;
      return serializer.serialize(subresourceEntity)
    };

    let subresourceProvider = undefined;
    let retrievedSubresourceEntity = undefined;

    it("should return a sub resource provider", async () => should(subresourceProvider = await entityProvider.subResource(SUBRESOURCENAME)).not.be.undefined());
    it("should return a sub resource entity", async () => should(retrievedSubresourceEntity = await subresourceProvider.load(subresourceEntity.id)).not.be.undefined());
    it("should load the sub resource entity correctly", () => {
      retrievedSubresourceEntity.name.should.be.equal(subresourceEntity.name);
      retrievedSubresourceEntity.id.should.be.equal(subresourceEntity.id);
      calledSubresourceRead.should.be.equal(1);
    });

    it("should fail if the sub-resource does not exist", () => should(entityProvider.subResource("Something stupid")).be.rejected(ERROR));
  });
});