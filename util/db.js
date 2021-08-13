// TODO: is module or import better here?
import {connectToDatabase} from "./couchbase";

export async function executeUpsert(key, val, scopeName, collectionName) {
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result = await collection.upsert(key, val);
  console.log("YOOOOO");
  console.log(result);
  // TODO: handle errs
  // TODO: how and what should we return here?
  return val;
}

export async function executeRead(key, scopeName, collectionName) {
  // TODO: need to fix the default collection here and export others from conn to db
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result = await collection.get(key);

  // TODO: err handling here
  return result.content;
}

export async function executeDelete(key, scopeName, collectionName) {
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result;
  await collection.remove(key).then(() => {
    result = `Successfully Removed: ${key}`
  }).catch((err) => {
    result = `Error: ${err.message}`;
  });

  return result;
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
  // console.log(rows);
  return rows;
}

