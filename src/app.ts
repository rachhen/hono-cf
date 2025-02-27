import configureOpenAPI from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import index from "./routes/index.route";
import tasks from "./routes/tasks/tasks.index";

const app = createApp();

configureOpenAPI(app);

app.route("/", index).route("/", tasks);

export default app;
