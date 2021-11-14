/* SystemJS module definition */
declare var module: {
  id: string;
};
declare module '*';
declare module 'clappr';
declare module 'c3';
declare module 'd3';
/**
 * Added JQuery plugin definition here.
 */
// Datatable
declare namespace JQuery.dataTable {
  interface DataTableStatic {
    (options?: any): any;
  }
}
// Unslider
declare namespace JQuery.unslider {
  interface UnsliderStatic {
    (options?: any): any;
  }
}
// VectorMap
declare namespace JQuery.vectorMap {
  interface VectorMapStatic {
    (options: any): any;
  }
}
// Fullscreen
declare namespace JQuery.fullScreen {
  interface FullScreenStatic {
    (options?: any): any;
  }
  interface ToggleFullScreenStatic {
    (): any;
  }
}
interface JQuery {
  dataTable: JQuery.dataTable.DataTableStatic;
  unslider: JQuery.unslider.UnsliderStatic;
  vectorMap: JQuery.vectorMap.VectorMapStatic;
  fullScreen: JQuery.fullScreen.FullScreenStatic;
  toggleFullScreen: JQuery.fullScreen.ToggleFullScreenStatic;
}
