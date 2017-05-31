// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

import token from './token.js';
import { onSuccess } from './error.js';

import type { tokensToResult } from './index.js';

export default (name: string, out: string): tokensToResult => {
  return fp.flow(token(fp.always(true))(name), onSuccess(fp.always(out)));
};
