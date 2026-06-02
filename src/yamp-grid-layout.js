import { GridLayout } from "@lit-labs/virtualizer/layouts/grid.js";

export class YampGridLayout extends GridLayout {
  constructor(hostSink, config) {
    super(hostSink, config);
    this._columns = config?.columns || 4;
    this.flex = { preserve: "aspect-ratio" };
    this.justify = "start";
    const widthStr = config?.itemSize?.width || 150;
    const heightStr = config?.itemSize?.height || 195;
    const initialWidth = parseInt(widthStr) || 150;
    const initialHeight = parseInt(heightStr) || 195;
    this._aspectRatio = initialHeight / initialWidth;
    this._extraHeight = initialHeight - initialWidth;
  }

  set columns(val) {
    if (val !== this._columns) {
      this._columns = val;
      this._triggerReflow();
    }
  }

  get columns() {
    return this._columns;
  }

  set itemSize(dims) {
    super.itemSize = dims;
    if (dims) {
      const width = parseInt(dims.width) || 150;
      const height = parseInt(dims.height) || 195;
      this._aspectRatio = height / width;
      this._extraHeight = height - width;
    }
  }

  _updateLayout() {
    const justify = this.justify;
    const [padding1Start, padding1End] = this._padding1;
    const [padding2Start, padding2End] = this._padding2;
    const usePaddingAndGap2 = this.flex || ["start", "center", "end"].includes(justify);

    const padding2StartVal = padding2Start === Infinity ? this._gap2 : padding2Start;
    const padding2EndVal = padding2End === Infinity ? this._gap2 : padding2End;

    const availableSpace = this._viewDim2 - padding2StartVal - padding2EndVal;

    if (availableSpace > 0) {
      const gap2Val = usePaddingAndGap2 ? this._gap2 : 0;
      const calculatedWidth = (availableSpace - (this._columns - 1) * gap2Val) / this._columns;

      const isVertical = this.direction !== "horizontal";
      if (isVertical) {
        const itemWidth = Math.max(10, Math.floor(calculatedWidth));
        this._itemSize.width = itemWidth;
        this._itemSize.height = Math.max(10, Math.floor(itemWidth + this._extraHeight));
      } else {
        const itemHeight = Math.max(10, Math.floor(calculatedWidth));
        this._itemSize.height = itemHeight;
        this._itemSize.width = Math.max(10, Math.floor(itemHeight - this._extraHeight));
      }
    }

    super._updateLayout();
  }
}

export const yampGrid = (config) =>
  Object.assign(
    {
      type: YampGridLayout,
    },
    config
  );
