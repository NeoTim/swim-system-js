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

import {ViewContext} from "./ViewContext";
import {View} from "./View";

export interface ViewObserver<V extends View = View> {
  viewWillSetKey?(key: string | null, view: V): void;

  viewDidSetKey?(key: string | null, view: V): void;

  viewWillSetParentView?(parentView: View | null, view: V): void;

  viewDidSetParentView?(parentView: View | null, view: V): void;

  viewWillInsertChildView?(childView: View, targetView: View | null | undefined, view: V): void;

  viewDidInsertChildView?(childView: View, targetView: View | null | undefined, view: V): void;

  viewWillRemoveChildView?(childView: View, view: V): void;

  viewDidRemoveChildView?(childView: View, view: V): void;

  viewWillMount?(view: V): void;

  viewDidMount?(view: V): void;

  viewWillUnmount?(view: V): void;

  viewDidUnmount?(view: V): void;

  viewWillUpdate?(viewContext: ViewContext, view: V): void;

  viewDidUpdate?(viewContext: ViewContext, view: V): void;

  viewWillCompute?(viewContext: ViewContext, view: V): void;

  viewDidCompute?(viewContext: ViewContext, view: V): void;

  viewWillLayout?(viewContext: ViewContext, view: V): void;

  viewDidLayout?(viewContext: ViewContext, view: V): void;

  viewWillScroll?(viewContext: ViewContext, view: V): void;

  viewDidScroll?(viewContext: ViewContext, view: V): void;

  viewWillUpdateChildViews?(viewContext: ViewContext, view: V): void;

  viewDidUpdateChildViews?(viewContext: ViewContext, view: V): void;
}
