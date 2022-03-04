import {connectToDatabase} from "./couchbase";
import {PlanningFailureError} from "couchbase";

export async function executeUpsert(key, val, scopeName, collectionName) {
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result;

  try {
    await collection.upsert(key, val).then(() => {
      result = val;
    });
  } catch (e) {
    console.error('Error Upserting \n', e.message);
    return e;
  }

  return result;
}

export async function executeRead(key, scopeName, collectionName) {
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result;

  try {
    result = await collection.get(key);
  } catch (e) {
    console.error('Error Reading \n', e.message);
    return e;
  }

  return result.content;
}

export async function executeDelete(key, scopeName, collectionName) {
  const { bucket } = await connectToDatabase();
  const collection = bucket.scope(scopeName).collection(collectionName);
  let result;

  try {
    await collection.remove(key);
    result = `Successfully Removed: ${key}`
  } catch (e) {
    console.error('Error Deleting: \n', e.message)
    return e;
  }

  return result;
}

export async function executeQuery(queryString) {
  const { cluster } = await connectToDatabase();
  let result, rows = null;

  try {
    result = await cluster.query(queryString);
    rows = result.rows;
  } catch (e) {
    console.error('Error Querying: \n', e.message);
    if (e instanceof PlanningFailureError) {
      // need to build an index
      console.log('Building Primary Index for Hotel Bookings');
      const hotelBookingIndex = `CREATE PRIMARY INDEX ON \`${process.env.COUCHBASE_BUCKET}\`.bookings.hotel;`
      try {
        await cluster.query(hotelBookingIndex)
        console.log('Index Created');
      } catch (e) {
        console.error('Error building index');
      }

    }
    return e;
  }

  return rows;
}

