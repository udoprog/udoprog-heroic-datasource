/// <reference path="common.d.ts" />
export declare class HeroicQueryCtrl {
    private uiSegmentSrv;
    private templateSrv;
    static templateUrl: string;
    private testFilter;
    target: any;
    datasource: any;
    panelCtrl: any;
    panel: any;
    hasRawMode: boolean;
    error: string;
    constructor($scope: any, $injector: any, uiSegmentSrv: any, templateSrv: any);
    validateQuery($scope: any, query: String): void;
    addTag(key: String, value: String): void;
    getNextQueryLetter(): any;
    removeQuery(): void;
    duplicateQuery(): void;
    moveQuery(direction: any): void;
    refresh(): void;
    toggleHideQuery(): void;
}
