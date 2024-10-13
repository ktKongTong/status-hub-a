import {generateId} from "lucia";

export const createUid =()=> {
  return generateId(15);
}