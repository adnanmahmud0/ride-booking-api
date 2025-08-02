"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIDE_STATUSES = void 0;
var RIDE_STATUSES;
(function (RIDE_STATUSES) {
    RIDE_STATUSES["requested"] = "requested";
    RIDE_STATUSES["accepted"] = "accepted";
    RIDE_STATUSES["in_transit"] = "in_transit";
    RIDE_STATUSES["completed"] = "completed";
    RIDE_STATUSES["cancelled"] = "cancelled";
    RIDE_STATUSES["rejected"] = "rejected";
})(RIDE_STATUSES || (exports.RIDE_STATUSES = RIDE_STATUSES = {}));
