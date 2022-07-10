import * as express from "express";
import { User } from "./user";

export interface AppRequest extends express.Request {
    api: boolean;
    user?: User;
}