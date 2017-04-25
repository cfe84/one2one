const should = require("should");

const jsonSerializer = require("../source/infrastructure/jsonSerializer");

describe("Serialize and deserialize correctly", () => {
  const entity = {
    a: 1,
    b: "2",
    c: null,
    d: true,
    e: [3,4]
  };

  const serializer = jsonSerializer();

  const serialized = serializer.serialize(entity);

  it("should serialize as a string", () => {
    serialized.should.be.type("string");
    serialized.length.should.be.aboveOrEqual(10);
  });

  const deserialized = serializer.deserialize(serialized);

  it("should keep the entity consistent", () => {
    should(deserialized).not.be.null();
    deserialized.should.be.type("object");
    deserialized.a.should.be.equal(entity.a);
    deserialized.b.should.be.equal(entity.b);
    should(entity.c).be.equal(entity.c);
    deserialized.d.should.be.equal(entity.d);
    deserialized.e.should.be.type(typeof entity.e);
    deserialized.e[0].should.be.equal(entity.e[0]);
    deserialized.e[1].should.be.equal(entity.e[1]);
  });
});