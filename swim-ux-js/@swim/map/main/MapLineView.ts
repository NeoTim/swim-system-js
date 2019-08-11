// Copyright 2015-2019 SWIM.AI inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {PointR2, BoxR2, SegmentR2} from "@swim/math";
import {AnyLength, Length} from "@swim/length";
import {AnyColor, Color} from "@swim/color";
import {RenderingContext} from "@swim/render";
import {MemberAnimator, ViewInit, RenderView, StrokeViewInit, StrokeView} from "@swim/view";
import {AnyLngLat, LngLat} from "./LngLat";
import {MapGraphicView} from "./MapGraphicView";
import {MapGraphicViewController} from "./MapGraphicViewController";

export type AnyMapLineView = MapLineView | MapLineViewInit;

export interface MapLineViewInit extends ViewInit, StrokeViewInit {
  start?: AnyLngLat;
  end?: AnyLngLat;
  hitWidth?: number;
}

export class MapLineView extends MapGraphicView implements StrokeView {
  /** @hidden */
  _viewController: MapGraphicViewController<MapLineView> | null;
  /** @hidden */
  _startPoint: PointR2;
  /** @hidden */
  _endPoint: PointR2;
  /** @hidden */
  _hitWidth: number;

  constructor(start: LngLat = LngLat.origin(), end: LngLat = LngLat.origin()) {
    super();
    this.start.setState(start);
    this.end.setState(end);
    this._startPoint = PointR2.origin();
    this._endPoint = PointR2.origin();
    this._hitWidth = 0;
  }

  get viewController(): MapGraphicViewController<MapLineView> | null {
    return this._viewController;
  }

  @MemberAnimator(LngLat)
  start: MemberAnimator<this, LngLat, AnyLngLat>;

  @MemberAnimator(LngLat)
  end: MemberAnimator<this, LngLat, AnyLngLat>;

  @MemberAnimator(Color, "inherit")
  stroke: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Length, "inherit")
  strokeWidth: MemberAnimator<this, Length, AnyLength>;

  hitWidth(): number;
  hitWidth(hitWidth: number): this;
  hitWidth(hitWidth?: number): number | this {
    if (hitWidth === void 0) {
      return this._hitWidth;
    } else {
      this._hitWidth = hitWidth;
      return this;
    }
  }

  protected onAnimate(t: number): void {
    const oldStart = this.start.value!;
    this.start.onFrame(t);
    const newStart = this.start.value!;
    const oldEnd = this.end.value!;
    this.end.onFrame(t);
    const newEnd = this.end.value!;
    this.stroke.onFrame(t);
    this.strokeWidth.onFrame(t);

    if (this._dirtyProjection || oldStart !== newStart || oldEnd !== newEnd) {
      this.projectGeometry();
    }
  }

  protected onRender(context: RenderingContext): void {
    context.save();
    const bounds = this._bounds;
    const anchor = this._anchor;
    this.renderLine(context, bounds, anchor);
    context.restore();
  }

  protected renderLine(context: RenderingContext, bounds: BoxR2, anchor: PointR2): void {
    const stroke = this.stroke.value;
    if (stroke) {
      const strokeWidth = this.strokeWidth.value;
      if (strokeWidth) {
        const start = this._startPoint;
        const end = this._endPoint;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        const size = Math.min(bounds.width, bounds.height);
        context.lineWidth = strokeWidth.pxValue(size);
        context.strokeStyle = stroke.toString();
        context.stroke();
      }
    }
  }

  protected onCull(): void {
    const bounds = this._bounds;
    const start = this._startPoint;
    const end = this._endPoint;
    const invalid = !isFinite(start.x) || isFinite(start.y)
                 || !isFinite(end.x) || !isFinite(end.y);
    const culled = invalid || !bounds.intersectsSegment(new SegmentR2(start.x, start.y, end.x, end.y));
    this.setCulled(culled);
  }

  protected projectGeometry(): void {
    const start = this.project(this.start.value!);
    const end = this.project(this.end.value!);
    const anchor = new PointR2((start.x + end.x) / 2, (start.y + end.y) / 2);
    this._startPoint = start;
    this._endPoint = end;
    this._hitBounds = new BoxR2(Math.min(start.x, end.x), Math.min(start.y, end.y),
                                Math.max(start.x, end.x), Math.max(start.y, end.y));
    this.setAnchor(anchor);
  }

  hitTest(x: number, y: number, context: RenderingContext): RenderView | null {
    let hit = super.hitTest(x, y, context);
    if (hit === null) {
      context.save();
      const pixelRatio = this.pixelRatio;
      x *= pixelRatio;
      y *= pixelRatio;
      const bounds = this._bounds;
      const anchor = this._anchor;
      hit = this.hitTestLine(x, y, context, bounds, anchor);
      context.restore();
    }
    return hit;
  }

  protected hitTestLine(x: number, y: number, context: RenderingContext,
                        bounds: BoxR2, anchor: PointR2): RenderView | null {
    const start = this._startPoint;
    const end = this._endPoint;

    let hitWidth = this._hitWidth;
    const strokeWidth = this.strokeWidth.value;
    if (strokeWidth) {
      const size = Math.min(bounds.width, bounds.height);
      hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
    }

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineWidth = hitWidth;
    if (context.isPointInStroke(x, y)) {
      return this;
    }
    return null;
  }

  static fromAny(line: AnyMapLineView): MapLineView {
    if (line instanceof MapLineView) {
      return line;
    } else if (typeof line === "object" && line) {
      const view = new MapLineView();
      if (line.key !== void 0) {
        view.key(line.key);
      }
      if (line.start !== void 0) {
        view.start(line.start);
      }
      if (line.end !== void 0) {
        view.end(line.end);
      }
      if (line.stroke !== void 0) {
        view.stroke(line.stroke);
      }
      if (line.strokeWidth !== void 0) {
        view.strokeWidth(line.strokeWidth);
      }
      if (line.hitWidth !== void 0) {
        view.hitWidth(line.hitWidth);
      }
      return view;
    }
    throw new TypeError("" + line);
  }
}
