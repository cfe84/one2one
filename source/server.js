express = require("express");
bodyparser = require("body-parser");

PORT = process.env.PORT | 8080;

app = express();
app.use(bodyparser.json());

app.use(express.static("source/frontend"));

app.get("/principal", (req, res) => {
  res.write(JSON.stringify(
    {
      name: "not implemented"
    }));
  res.end();
});

app.get("/reportees/", (req, res) => {
  res.write('[{ "name": "jean", "id": 1}, { "name":"pierre", "id": 2}]');
  res.end();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));