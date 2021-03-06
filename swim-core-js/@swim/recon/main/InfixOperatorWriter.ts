// Copyright 2015-2020 Swim inc.
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

import {Output, WriterException, Writer, Unicode, Utf8} from "@swim/codec";
import {ReconWriter} from "./ReconWriter";

/** @hidden */
export class InfixOperatorWriter<I, V> extends Writer {
  private readonly _recon: ReconWriter<I, V>;
  private readonly _lhs: I;
  private readonly _operator: string;
  private readonly _rhs: I;
  private readonly _precedence: number;
  private readonly _part: Writer | undefined;
  private readonly _step: number | undefined;

  constructor(recon: ReconWriter<I, V>, lhs: I, operator: string, rhs: I,
              precedence: number, part?: Writer, step?: number) {
    super();
    this._recon = recon;
    this._lhs = lhs;
    this._operator = operator;
    this._rhs = rhs;
    this._precedence = precedence;
    this._part = part;
    this._step = step;
  }

  pull(output: Output): Writer {
    return InfixOperatorWriter.write(output, this._recon, this._lhs, this._operator, this._rhs,
                                     this._precedence, this._part, this._step);
  }

  static sizeOf<I, V>(recon: ReconWriter<I, V>, lhs: I, operator: string, rhs: I, precedence: number): number {
    let size = 0;
    if (recon.precedence(lhs) < precedence) {
      size += 1; // '('
      size += recon.sizeOfItem(lhs);
      size += 1; // ')'
    } else {
      size += recon.sizeOfItem(lhs);
    }
    size += 1; // ' '
    size += Utf8.sizeOf(operator);
    size += 1; // ' '
    if (recon.precedence(rhs) < precedence) {
      size += 1; // '('
      size += recon.sizeOfItem(rhs);
      size += 1; // ')'
    } else {
      size += recon.sizeOfItem(rhs);
    }
    return size;
  }

  static write<I, V>(output: Output, recon: ReconWriter<I, V>, lhs: I, operator: string, rhs: I,
                     precedence: number, part?: Writer, step: number = 1): Writer {
    if (step === 1) {
      if (recon.precedence(lhs) < precedence) {
        if (output.isCont()) {
          output = output.write(40/*'('*/);
          step = 2;
        }
      } else {
        step = 2;
      }
    }
    if (step === 2) {
      if (part === void 0) {
        part = recon.writeItem(lhs, output);
      } else {
        part = part.pull(output);
      }
      if (part.isDone()) {
        part = void 0;
        step = 3;
      } else if (part.isError()) {
        return part.asError();
      }
    }
    if (step === 3) {
      if (recon.precedence(lhs) < precedence) {
        if (output.isCont()) {
          output = output.write(41/*')'*/);
          step = 4;
        }
      } else {
        step = 4;
      }
    }
    if (step === 4 && output.isCont()) {
      output = output.write(32/*' '*/);
      step = 5;
    }
    if (step === 5) {
      if (part === void 0) {
        part = Unicode.writeString(operator, output);
      } else {
        part = part.pull(output);
      }
      if (part.isDone()) {
        part = void 0;
        step = 6;
      } else if (part.isError()) {
        return part.asError();
      }
    }
    if (step === 6 && output.isCont()) {
      output = output.write(32/*' '*/);
      step = 7;
    }
    if (step === 7) {
      if (recon.precedence(rhs) < precedence) {
        if (output.isCont()) {
          output = output.write(40/*'('*/);
          step = 8;
        }
      } else {
        step = 8;
      }
    }
    if (step === 8) {
      if (part === void 0) {
        part = recon.writeItem(rhs, output);
      } else {
        part = part.pull(output);
      }
      if (part.isDone()) {
        part = void 0;
        step = 9;
      } else if (part.isError()) {
        return part.asError();
      }
    }
    if (step === 9) {
      if (recon.precedence(rhs) < precedence) {
        if (output.isCont()) {
          output = output.write(41/*')'*/);
          return Writer.done();
        }
      } else {
        return Writer.done();
      }
    }
    if (output.isDone()) {
      return Writer.error(new WriterException("truncated"));
    } else if (output.isError()) {
      return Writer.error(output.trap());
    }
    return new InfixOperatorWriter<I, V>(recon, lhs, operator, rhs, precedence, part, step);
  }
}
