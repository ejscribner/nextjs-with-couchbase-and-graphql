// TODO: is module or import better here?
import {connectToDatabase} from "./couchbase";

export async function executeUpsert(key, val) {
  const { collection } = await connectToDatabase();
  let result = await collection.upsert(key, val);
  console.log(result);
  // TODO: handle errs
  // TODO: how and what should we return here?
  return val;
}

export async function executeRead(key) {
  // TODO: need to fix the default collection here and export others from conn to db
  const { collection } = await connectToDatabase();
  let result = await collection.get(key);

  // TODO: err handling here
  return result.content;
}

export async function executeQuery(queryString) {
  const { cluster } = await connectToDatabase();
  let result, rows = null;
  try {
    result = await cluster.query(queryString);
    rows = result.rows;
  } catch (e) {
    console.log('Error Querying \n', e);
  }

  return rows;
}

