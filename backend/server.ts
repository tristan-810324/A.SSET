import { app } from './src/app.js';
import { env } from './src/config/env.js';

app.listen(env.PORT, () => {
  console.log(`A.SSET API listening on port ${env.PORT}`);
});
