import express from "express";
import routes from "./adapters/inbound/http/routes";
import compliance from "./adapters/inbound/http/compliance";
import banking from "./adapters/inbound/http/banking";

const app = express();
app.use(express.json());
app.use(routes);
app.use(compliance);
app.use(banking);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`FuelEU backend listening on http://localhost:${PORT}`);
});
