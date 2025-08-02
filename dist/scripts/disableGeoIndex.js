"use strict";
// scripts/disableGeoIndex.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableGeoIndex = void 0;
const rider_model_1 = require("../app/modules/rider/rider.model");
const disableGeoIndex = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rider_model_1.Ride.collection.dropIndex('pickupLocation_2dsphere');
        yield rider_model_1.Ride.collection.dropIndex('destinationLocation_2dsphere');
        console.log('Geospatial indexes dropped');
    }
    catch (error) {
        console.log('No geospatial indexes to drop:', error);
    }
});
exports.disableGeoIndex = disableGeoIndex;
