import { auth } from "./src/lib/auth";

async function test() {
  const session = await auth();
  console.log(session);
}

test();
