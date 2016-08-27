import POGOProtos from "pokemongo-protobuf";

import print from "./print";
import CFG from "../cfg";

import {
  _toCC,
  validUsername
} from "./utils";

/**
 * @param {Request} req
 * @param {String} type
 * @return {Buffer}
 */
export function parseMessage(req, type) {
  let proto = `POGOProtos.Networking.Requests.Messages.${type}Message`;
  if (req.request_message) {
    try {
      return (this.parseProtobuf(req.request_message, proto));
    } catch (e) {
      print(`Failed to parse ${type}: ${e}`, 31);
    }
  }
  return void 0;
}

/**
 * @param  {Player} player
 * @param  {Request} req
 * @return {Buffer}
 */
export function processResponse(player, req) {

  let buffer = null;

  let cc = _toCC(req.request_type);
  let msg = this.parseMessage(req, cc);

  return new Promise((resolve) => {

    try {
      switch (req.request_type) {
        case "GET_PLAYER":
          player.getPacket("GET_PLAYER", msg).then((result) => {
            resolve(result);
          });
          return void 0;
        break;
        case "CHECK_CHALLENGE":
          player.world.getPacket("CHECK_CHALLENGE", msg).then((result) => {
            resolve(result);
          });
          return void 0;
        break;
        default:
          print(`Unknown request: ${req.request_type}`, 31);
        break;
      };
    } catch (e) {
      print(`Response error: ${e}`, 31);
    };

    resolve(buffer);

  });

}