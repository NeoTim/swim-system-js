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

import {__extends} from "tslib";
import {AnyColor, Color} from "@swim/color";
import {Transition, Tween} from "@swim/transition";
import {MemberAnimatorConstructor, MemberAnimator} from "./MemberAnimator";
import {AnimatedView} from "../AnimatedView";

/** @hidden */
export interface ColorMemberAnimator<V extends AnimatedView> extends MemberAnimator<V, Color, AnyColor> {
}

/** @hidden */
export const ColorMemberAnimator = (function (_super: typeof MemberAnimator): MemberAnimatorConstructor<Color, AnyColor> {
  const ColorMemberAnimator: MemberAnimatorConstructor<Color, AnyColor> = function <V extends AnimatedView>(
      this: ColorMemberAnimator<V>, view: V, value?: AnyColor | null,
      transition?: Transition<Color> | null, inherit?: string | null): ColorMemberAnimator<V> {
    let _this: ColorMemberAnimator<V> = function (value?: AnyColor | null, tween?: Tween<Color>): Color | null | undefined | V {
      if (value === void 0) {
        return _this.value;
      } else {
        if (value !== null) {
          value = Color.fromAny(value);
        }
        _this.setState(value, tween);
        return _this._view;
      }
    } as ColorMemberAnimator<V>;
    (_this as any).__proto__ = this;
    if (value !== null && value !== void 0) {
      value = Color.fromAny(value);
    }
    _this = _super.call(_this, view, value, transition, inherit) || _this;
    return _this;
  } as unknown as MemberAnimatorConstructor<Color, AnyColor>;
  __extends(ColorMemberAnimator, _super);

  return ColorMemberAnimator;
}(MemberAnimator));
MemberAnimator.Color = ColorMemberAnimator;
