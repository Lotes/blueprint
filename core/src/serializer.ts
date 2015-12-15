import common = require('./common');

export enum NodeType {
    CONNECTABLE,
    INSTANCE,
    GROUP
}

export interface Constructable {
    definition: common.ActualParameters;
}

export interface Connection extends Constructable {
    'class': string;
    sourcePath: number[];
    destinationPath: number[];
}

export interface Node {
    type: NodeType;
}

export interface NodeDictionary {
    [name: string]: number[];
}

export interface ModuleInstance extends Node, Constructable {
    nodes: Node[];
    connections: Connection[];
    dictionary: NodeDictionary;
}

export interface Group extends Node {
    nodes: number[][];
}

export interface Connectable extends Node, Constructable {
    'class': string;
}