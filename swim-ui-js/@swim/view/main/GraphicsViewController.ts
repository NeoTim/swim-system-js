// Copyright 2015-2020 SWIM.AI inc.
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

import {PointR2, BoxR2} from "@swim/math";
import {ViewController} from "./ViewController";
import {RenderedViewContext} from "./RenderedViewContext";
import {RenderedViewController} from "./RenderedViewController";
import {GraphicsView} from "./GraphicsView";
import {GraphicsViewObserver} from "./GraphicsViewObserver";
import {CanvasView} from "./CanvasView";

export class GraphicsViewController<V extends GraphicsView = GraphicsView> extends ViewController<V> implements RenderedViewController<V>, GraphicsViewObserver<V> {
  get canvasView(): CanvasView | null {
    const view = this._view;
    return view ? view.canvasView : null;
  }

  viewWillAnimate(viewContext: RenderedViewContext, view: V): void {
    // hook
  }

  viewDidAnimate(viewContext: RenderedViewContext, view: V): void {
    // hook
  }

  viewWillRender(viewContext: RenderedViewContext, view: V): void {
    // hook
  }

  viewDidRender(viewContext: RenderedViewContext, view: V): void {
    // hook
  }

  get hidden(): boolean {
    const view = this._view;
    return view ? view.hidden : false;
  }

  viewWillSetHidden(hidden: boolean, view: V): boolean | void {
    // hook
  }

  viewDidSetHidden(hidden: boolean, view: V): void {
    // hook
  }

  get culled(): boolean {
    const view = this._view;
    return view ? view.culled : false;
  }

  viewWillSetCulled(culled: boolean, view: V): boolean | void {
    // hook
  }

  viewDidSetCulled(culled: boolean, view: V): void {
    // hook
  }

  get bounds(): BoxR2 {
    const view = this._view;
    return view ? view.bounds : BoxR2.empty();
  }

  viewWillSetBounds(bounds: BoxR2, view: V): BoxR2 | void {
    // hook
  }

  viewDidSetBounds(newBounds: BoxR2, oldBounds: BoxR2, view: V): void {
    // hook
  }

  get anchor(): PointR2 {
    const view = this._view;
    return view ? view.anchor : PointR2.origin();
  }

  viewWillSetAnchor(anchor: PointR2, view: V): PointR2 | void {
    // hook
  }

  viewDidSetAnchor(newAnchor: PointR2, oldAnchor: PointR2, view: V): void {
    // hook
  }
}
